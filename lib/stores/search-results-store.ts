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

function buildInit(body: SearchBody): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const useSearchResultsStore = create<SearchResultsState>((set, get) => ({
  stories: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,

  searchStories: async (params) => {
    set({ loading: true, error: null, stories: [], total: 0, page: 1 });
    try {
      const data = await apiCall<PaginatedStoryCards>(
        '/api/stories/search',
        buildInit({ ...params, page: 1 })
      );
      set({ stories: data.stories, total: data.total, page: 1, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  loadMoreStories: async (params) => {
    const nextPage = get().page + 1;
    set({ loading: true, error: null });
    try {
      const data = await apiCall<PaginatedStoryCards>(
        '/api/stories/search',
        buildInit({ ...params, page: nextPage })
      );
      set((state) => ({
        stories: [...state.stories, ...data.stories],
        total: data.total,
        page: nextPage,
        loading: false,
      }));
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  hydrateSearch: (result) =>
    set({ stories: result.stories, total: result.total, page: 1, loading: false, error: null }),

  reset: () => set({ stories: [], total: 0, page: 1, loading: false, error: null }),
}));
