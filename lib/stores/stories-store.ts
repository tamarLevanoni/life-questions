import { create } from 'zustand';
import type { StoryCard, SearchBody } from '@/lib/types';

interface StoriesState {
  stories: StoryCard[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  featuredStories: StoryCard[];
  featuredLoaded: boolean;
  loadFeaturedStories: () => Promise<void>;
  searchStories: (params: SearchBody) => Promise<void>;
  loadMoreStories: (params: SearchBody) => Promise<void>;
  reset: () => void;
}

function postSearch(body: SearchBody): Promise<Response> {
  return fetch('/api/stories/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
  featuredStories: [],
  featuredLoaded: false,

  loadFeaturedStories: async () => {
    if (get().featuredLoaded) return;
    try {
      const res = await postSearch({ limit: 3, page: 1 });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error ?? 'שגיאה בטעינת סיפורים');
      set({ featuredStories: body.data.stories, featuredLoaded: true });
    } catch {
      // silent — featured stories are non-critical
    }
  },

  searchStories: async (params) => {
    set({ loading: true, error: null, stories: [], total: 0, page: 1 });
    try {
      const res = await postSearch({ ...params, page: 1 });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error ?? 'שגיאה בטעינת סיפורים');
      set({ stories: body.data.stories, total: body.data.total, page: 1, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  loadMoreStories: async (params) => {
    const nextPage = get().page + 1;
    set({ loading: true, error: null });
    try {
      const res = await postSearch({ ...params, page: nextPage });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error ?? 'שגיאה בטעינת סיפורים');
      set((state) => ({
        stories: [...state.stories, ...body.data.stories],
        total: body.data.total,
        page: nextPage,
        loading: false,
      }));
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  reset: () => set({ stories: [], total: 0, page: 1, loading: false, error: null }),
}));
