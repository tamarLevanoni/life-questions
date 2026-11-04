import { afterEach, beforeEach, expect, spyOn, test } from 'bun:test';
import { serverClient } from '@/lib/server/client';
import { BackendError, SchemaError, runRoute } from '@/lib/server/errors';
import { apiSecret } from '../support/environment';

let fetchMock: ReturnType<typeof spyOn<typeof globalThis, 'fetch'>>;
beforeEach(() => { fetchMock = spyOn(globalThis, 'fetch'); });
afterEach(() => fetchMock.mockRestore());

test('server requests attach the private credential and unwrap successful JSON', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { saved: true } }));
  expect(await serverClient.post<{ saved: boolean }>('/api/contact', { message: 'fictional' })).toEqual({ saved: true });
  const [url, init] = fetchMock.mock.calls[0];
  expect(String(url)).toBe('http://127.0.0.1:4100/api/contact');
  expect(init?.headers).toMatchObject({ 'x-api-secret': apiSecret });
  expect(JSON.parse(String(init?.body))).toEqual({ message: 'fictional' });
});

test('connection failures become a generic upstream failure', async () => {
  fetchMock.mockRejectedValueOnce(new Error('private infrastructure details'));
  const response = await runRoute(() => serverClient.get('/api/reference/books'));
  expect(response.status).toBe(502);
  expect(JSON.stringify(await response.json())).not.toContain('private');
});

test('an HTML gateway failure retains its upstream status without exposing its body', async () => {
  fetchMock.mockResolvedValueOnce(new Response('<html>private gateway details</html>', { status: 503 }));
  const response = await runRoute(() => serverClient.get('/api/reference/books'));
  expect(response.status).toBe(503);
  expect(JSON.stringify(await response.json())).not.toContain('private');
});

test('only a structured upstream 404 can mean an unregistered user', async () => {
  fetchMock.mockResolvedValueOnce(new Response('<html>Not found</html>', { status: 404 }));
  await expect(serverClient.get('/api/users/google/fictional')).rejects.toBeInstanceOf(SchemaError);
  fetchMock.mockResolvedValueOnce(Response.json({ success: false, error: 'Not found' }, { status: 404 }));
  await expect(serverClient.get('/api/users/google/fictional')).rejects.toBeInstanceOf(BackendError);
});

test.each([null, [], { success: 'true', data: [] }, { success: true }, { success: false, error: 'failed' }].map(body => ({ body })))(
  'invalid successful HTTP envelopes return 502: %j', async ({ body }) => {
    fetchMock.mockResolvedValueOnce(Response.json(body));
    const response = await runRoute(() => serverClient.get('/api/reference/books'));
    expect(response.status).toBe(502);
    expect((await response.json()).success).toBe(false);
  },
);

test('a successful non-JSON response is rejected before domain validation', async () => {
  fetchMock.mockResolvedValueOnce(new Response('not JSON'));
  await expect(serverClient.get('/api/reference/books')).rejects.toBeInstanceOf(SchemaError);
});
