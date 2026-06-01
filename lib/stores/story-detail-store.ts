import { create } from 'zustand';
import type { StoryWithNeighbors } from '@/lib/types';

interface StoryDetailState {
  story: StoryWithNeighbors | null;
  storyCache: Map<string, StoryWithNeighbors>;
  loading: boolean;
  error: string | null;
  fetchStory: (id: string) => Promise<void>;
  clear: () => void;
}

export const useStoryDetailStore = create<StoryDetailState>((set, get) => ({
  story: null,
  storyCache: new Map(),
  loading: false,
  error: null,

  fetchStory: async (id) => {
    const cached = get().storyCache.get(id);
    if (cached) {
      set({ story: cached, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/stories/${id}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success) {
        throw new Error(body.error ?? 'הסיפור לא נמצא');
      }
      const data = body.data as StoryWithNeighbors;
      set((s) => ({
        story: data,
        loading: false,
        storyCache: new Map(s.storyCache).set(id, data),
      }));
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  clear: () => set({ story: null, loading: false, error: null }),
}));
