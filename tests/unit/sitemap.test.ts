import { afterEach, beforeEach, expect, spyOn, test } from 'bun:test';
import sitemap from '@/app/sitemap';
import { makeCard } from '../fixtures/data';

let fetchMock: ReturnType<typeof spyOn<typeof globalThis, 'fetch'>>;
beforeEach(() => { fetchMock = spyOn(globalThis, 'fetch'); });
afterEach(() => fetchMock.mockRestore());

test('sitemap reads all pages using the Core API limit of 50', async () => {
  for (let page = 1; page <= 3; page++) {
    const count = page === 3 ? 1 : 50;
    fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: {
      stories: Array.from({ length: count }, (_, index) => makeCard((page - 1) * 50 + index + 1)),
      total: 101, page, limit: 50,
    } }));
  }
  const result = await sitemap();
  expect(result).toHaveLength(105);
  expect(result.at(-1)?.url).toEndWith('/story/story-101');
  expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body))))
    .toEqual([1, 2, 3].map(page => ({ page, limit: 50 })));
});

test('sitemap stops on an empty page and deduplicates story URLs', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: {
    stories: Array.from({ length: 50 }, () => makeCard(1)), total: 100, page: 1, limit: 50,
  } }));
  fetchMock.mockResolvedValueOnce(Response.json({ success: true, data: { stories: [], total: 100, page: 2, limit: 50 } }));
  expect(await sitemap()).toHaveLength(5);
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test('sitemap retains static URLs when the upstream search fails', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ success: false, error: 'Unavailable' }, { status: 503 }));
  const result = await sitemap();
  expect(result).toHaveLength(4);
  expect(result.some(entry => entry.url.includes('/story/'))).toBe(false);
});
