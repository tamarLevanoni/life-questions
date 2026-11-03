import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { makeCard } from '../fixtures/data';

let fetchMock: ReturnType<typeof spyOn<typeof globalThis, 'fetch'>>;
const page = (index: number, total = 2) => Response.json({ success: true, data: { stories: [makeCard(index)], total, page: index, limit: 1 } });

beforeEach(() => {
  useStoriesStore.setState({ stories: {}, searchResults: [], total: 0, page: 1, loading: false, error: null, authRequired: false });
  fetchMock = spyOn(globalThis, 'fetch');
});
afterEach(() => fetchMock.mockRestore());

describe('Search request lifecycle', () => {
  test('replaces results for a new submitted search and sends the server parameters', async () => {
    fetchMock.mockResolvedValueOnce(page(1)).mockResolvedValueOnce(page(2));
    await useStoriesStore.getState().searchStories({ q: 'first' });
    await useStoriesStore.getState().searchStories({ q: 'second', bookIds: ['book-1'] });
    expect(useStoriesStore.getState().searchResults.map(s => s.id)).toEqual(['story-2']);
    const init = fetchMock.mock.calls[1][1]!;
    expect(JSON.parse(String(init.body))).toEqual({ q: 'second', bookIds: ['book-1'], page: 1 });
    expect(useStoriesStore.getState().loading).toBe(false);
  });

  test('appends the next page without replacing existing results', async () => {
    fetchMock.mockResolvedValueOnce(page(1)).mockResolvedValueOnce(page(2));
    await useStoriesStore.getState().searchStories({ q: 'test' });
    await useStoriesStore.getState().loadMoreStories({ q: 'test' });
    expect(useStoriesStore.getState().searchResults.map(s => s.id)).toEqual(['story-1', 'story-2']);
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]!.body)).page).toBe(2);
  });

  test('aborts the old request and ignores a late successful result', async () => {
    let finish!: (value: Response) => void;
    const delayedFetch = Object.assign(
      () => new Promise<Response>(resolve => { finish = resolve; }),
      { preconnect: globalThis.fetch.preconnect },
    );
    fetchMock.mockImplementationOnce(delayedFetch).mockResolvedValueOnce(page(2));
    const first = useStoriesStore.getState().searchStories({ q: 'old' });
    await useStoriesStore.getState().searchStories({ q: 'new' });
    expect(fetchMock.mock.calls[0][1]!.signal!.aborted).toBe(true);
    finish(page(1));
    await first;
    expect(useStoriesStore.getState().searchResults[0].id).toBe('story-2');
  });

  test('ignores an obsolete request failure after a newer search succeeds', async () => {
    let reject!: (reason: Error) => void;
    const delayed = Object.assign(() => new Promise<Response>((_, fail) => { reject = fail; }), { preconnect: globalThis.fetch.preconnect });
    fetchMock.mockImplementationOnce(delayed).mockResolvedValueOnce(page(2));
    const first = useStoriesStore.getState().searchStories({ q: 'old' });
    await useStoriesStore.getState().searchStories({ q: 'new' });
    reject(new Error('obsolete failure')); await first;
    expect(useStoriesStore.getState().error).toBeNull();
    expect(useStoriesStore.getState().searchResults[0].id).toBe('story-2');
  });

  test('reports server failures and exits loading', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ success: false, error: 'Search unavailable' }, { status: 503 }));
    await useStoriesStore.getState().searchStories({ q: 'test' });
    expect(useStoriesStore.getState().error).toBe('Search unavailable');
    expect(useStoriesStore.getState().loading).toBe(false);
  });

  test('handles an expired session separately from general errors', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));
    await useStoriesStore.getState().searchStories({ q: 'test' });
    expect(useStoriesStore.getState().authRequired).toBe(true);
    expect(useStoriesStore.getState().error).toBeNull();
    expect(useStoriesStore.getState().loading).toBe(false);
  });
});
