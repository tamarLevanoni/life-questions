import { afterEach, beforeEach, expect, spyOn, test } from 'bun:test';
import sitemap from '@/app/sitemap';

let fetchMock: ReturnType<typeof spyOn<typeof globalThis, 'fetch'>>;
beforeEach(() => { fetchMock = spyOn(globalThis, 'fetch'); });
afterEach(() => fetchMock.mockRestore());

test('sitemap reads all pages using the Core API limit of 50', async () => {
  for (let page = 1; page <= 3; page++) {
    const count = page === 3 ? 1 : 50;
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: {
      stories: Array.from({ length: count }, (_, index) => ({ id: `story-${(page - 1) * 50 + index + 1}` })),
      hasMore: page < 3,
    } }));
  }
  const result = await sitemap();
  expect(result).toHaveLength(105);
  expect(result.at(-1)?.url).toEndWith('/story/story-101');
  expect(fetchMock.mock.calls.map(([url]) => {
    const { pathname, search } = new URL(String(url));
    return pathname + search;
  })).toEqual([1, 2, 3].map(page => `/api/stories/sitemap?page=${page}`));
});

test('sitemap stops on an empty page and deduplicates story URLs', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: {
    stories: [{ id: 'story-1' }, { id: 'story-1' }], hasMore: true,
  } }));
  fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { stories: [], hasMore: false } }));
  expect(await sitemap()).toHaveLength(5);
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test('sitemap retains static URLs when the upstream listing fails', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ success: false, error: 'Unavailable' }, { status: 503 }));
  const result = await sitemap();
  expect(result).toHaveLength(4);
  expect(result.some(entry => entry.url.includes('/story/'))).toBe(false);
});
