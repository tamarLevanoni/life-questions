import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { StoryCard, SearchBody, PaginatedStoryCards } from '@/lib/types';

interface SearchResultsState {
  stories: StoryCard[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  hydrateSearch: (result: PaginatedStoryCards) => void;
  searchStories: (params: SearchBody) => Promise<void>;
  loadMoreStories: (params: SearchBody) => Promise<void>;
  reset: () => void;
}

function buildInit(body: SearchBody, signal: AbortSignal): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  };
}

function isAbort(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

let activeController: AbortController | null = null;

function nextSignal(): AbortSignal {
  activeController?.abort();
  activeController = new AbortController();
  return activeController.signal;
}

export const useSearchResultsStore = create<SearchResultsState>((set, get) => ({
  stories: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,

  searchStories: async (params) => {
    const signal = nextSignal();
    set({ loading: true, error: null, stories: [], total: 0, page: 1 });
    try {
      const data = await apiCall<PaginatedStoryCards>(
        '/api/stories/search',
        buildInit({ ...params, page: 1 }, signal)
      );
      if (signal.aborted) return;
      set({ stories: data.stories, total: data.total, page: 1, loading: false });
    } catch (err) {
      if (isAbort(err)) return;
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  loadMoreStories: async (params) => {
    const signal = nextSignal();
    const nextPage = get().page + 1;
    set({ loading: true, error: null });
    try {
      const data = await apiCall<PaginatedStoryCards>(
        '/api/stories/search',
        buildInit({ ...params, page: nextPage }, signal)
      );
      if (signal.aborted) return;
      set((state) => ({
        stories: [...state.stories, ...data.stories],
        total: data.total,
        page: nextPage,
        loading: false,
      }));
    } catch (err) {
      if (isAbort(err)) return;
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  hydrateSearch: (result) =>
    set({ stories: result.stories, total: result.total, page: 1, loading: false, error: null }),

  reset: () => {
    activeController?.abort();
    activeController = null;
    set({ stories: [], total: 0, page: 1, loading: false, error: null });
  },
}));
