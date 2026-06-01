import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { StoryCard, SearchBody, PaginatedStoryCards } from '@/lib/types';

interface StoriesState {
  stories: StoryCard[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  featuredStories: StoryCard[];
  featuredLoaded: boolean;
  featuredError: string | null;
  loadFeaturedStories: () => Promise<void>;
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

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
  featuredStories: [],
  featuredLoaded: false,
  featuredError: null,

  loadFeaturedStories: async () => {
    if (get().featuredLoaded) return;
    try {
      const data = await apiCall<PaginatedStoryCards>(
        '/api/stories/search',
        buildInit({ limit: 3, page: 1 })
      );
      set({ featuredStories: data.stories, featuredLoaded: true, featuredError: null });
    } catch (err) {
      set({ featuredError: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

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

  reset: () => set({ stories: [], total: 0, page: 1, loading: false, error: null }),
}));
