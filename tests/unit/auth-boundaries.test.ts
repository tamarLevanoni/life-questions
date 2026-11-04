import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import type { Session } from 'next-auth';
import { testUser, makeCard, validContact, makeStory } from '../fixtures/data';

const getSession = mock(async (): Promise<Session | null> => null);
mock.module('next-auth', () => ({ getServerSession: getSession }));
const { updateCurrentUser, registerUser } = await import('@/lib/server/user');
const { submitContact } = await import('@/lib/server/contact');
const { POST } = await import('@/app/api/stories/search/route');
const { searchStories } = await import('@/lib/server/stories');
const { runRoute } = await import('@/lib/server/errors');

let fetchMock: ReturnType<typeof spyOn<typeof globalThis, 'fetch'>>;
const signIn = () => getSession.mockResolvedValue({ user: { ...testUser, isRegistrationComplete: true }, expires: '2099-01-01T00:00:00Z' });
beforeEach(() => { getSession.mockReset(); getSession.mockResolvedValue(null); fetchMock = spyOn(globalThis, 'fetch'); });
afterEach(() => fetchMock.mockRestore());

describe('Protected server entrypoints', () => {
  test('profile mutation requires a registered session before upstream access', async () => {
    await expect(updateCurrentUser({ firstName: 'חדש' })).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).not.toHaveBeenCalled();
    getSession.mockResolvedValue({ user: { googleId: testUser.googleId, isRegistrationComplete: false }, expires: '2099-01-01' });
    await expect(updateCurrentUser({ firstName: 'חדש' })).rejects.toMatchObject({ status: 401 });
  });

  test('profile update targets the authenticated user and strips identity changes', async () => {
    signIn();
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { ...testUser, firstName: 'חדש' } }));
    const input = { firstName: 'חדש', marketingConsent: true, id: 'victim', googleId: 'other', email: 'other@example.test' };
    await updateCurrentUser(input);
    expect(String(fetchMock.mock.calls[0][0])).toEndWith(`/api/users/profile/${testUser.id}`);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]!.body))).toEqual({ firstName: 'חדש', marketingConsent: true });
  });

  test('registration rejects a mismatching Google id or email', async () => {
    signIn();
    await expect(registerUser({ ...testUser, googleId: 'other' })).rejects.toMatchObject({ status: 403 });
    await expect(registerUser({ ...testUser, email: 'other@example.test' })).rejects.toMatchObject({ status: 403 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('direct search requests require login even if the UI is bypassed', async () => {
    const response = await POST(new Request('http://localhost/api/stories/search', { method: 'POST', body: '{}' }));
    expect(response.status).toBe(401);
    expect((await response.json()).success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('authenticated search validates input and delegates a valid body', async () => {
    signIn();
    const invalid = await POST(new Request('http://localhost/api/stories/search', { method: 'POST', body: '{"bookIds":"invalid"}' }));
    expect(invalid.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { stories: [makeCard()], total: 1, page: 1, limit: 10 } }));
    const valid = await POST(new Request('http://localhost/api/stories/search', { method: 'POST', body: '{"q":"בדיקה"}' }));
    expect(valid.status).toBe(200);
    expect((await valid.json()).data.stories[0].id).toBe('story-1');
  });

  test('internal search callers such as sitemap do not require a browser session', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { stories: [], total: 0, page: 1, limit: 50 } }));
    expect((await searchStories({ limit: 50 })).stories).toEqual([]);
    expect(getSession).not.toHaveBeenCalled();
  });

  test('general contact stays public but story questions require login', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: null }));
    await submitContact(validContact);
    await expect(submitContact({ ...validContact, category: 'story_question', story: makeStory() })).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('invalid contact data cannot reach the backend', async () => {
    await expect(submitContact({ ...validContact, email: 'invalid' })).rejects.toMatchObject({ status: 400 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('server registration enforces form consent and field constraints', async () => {
    signIn();
    for (const input of [{ ...testUser, marketingConsent: false }, { ...testUser, firstName: 'א' }, { ...testUser, occupations: [] }]) {
      await expect(registerUser(input)).rejects.toMatchObject({ status: 400 });
    }
    await expect(updateCurrentUser({ firstName: 'א', marketingConsent: true })).rejects.toMatchObject({ status: 400 });
    await expect(updateCurrentUser({})).rejects.toMatchObject({ status: 400 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([false, undefined, null, 'true'])('mutations reject missing or invalid consent: %j', async marketingConsent => {
    signIn();
    await expect(registerUser({ ...testUser, marketingConsent })).rejects.toMatchObject({ status: 400 });
    await expect(updateCurrentUser({ firstName: 'חדש', marketingConsent })).rejects.toMatchObject({ status: 400 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('profile changes can clear an institution with explicit consent', async () => {
    signIn();
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { ...testUser, institutionName: null } }));
    expect(await updateCurrentUser({ institutionName: null, marketingConsent: true }))
      .toMatchObject({ institutionName: null, marketingConsent: true });
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ institutionName: null, marketingConsent: true });
  });

  test('mutation responses cannot replace the current user identity', async () => {
    signIn();
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { ...testUser, id: 'another-user' } }));
    await expect(updateCurrentUser({ firstName: 'חדש', marketingConsent: true })).rejects.toThrow();
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { ...testUser, googleId: 'another-google-user' } }));
    await expect(registerUser(testUser)).rejects.toThrow();
  });

  test.each([{ page: 0 }, { page: 1.5 }, { limit: 51 }, { limit: -1 }])('invalid pagination is rejected before upstream access: %j', async body => {
    signIn();
    const response = await POST(new Request('http://localhost/api/stories/search', { method: 'POST', body: JSON.stringify(body) }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('unexpected route errors do not expose internal messages', async () => {
    const log = spyOn(console, 'error').mockImplementation(() => {});
    try {
      const response = await runRoute(async () => { throw new Error('private database password'); });
      expect(response.status).toBe(500);
      expect(JSON.stringify(await response.json())).not.toContain('password');
      expect(JSON.stringify(log.mock.calls)).not.toContain('password');
    } finally { log.mockRestore(); }
  });
});
