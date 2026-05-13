import { create } from 'zustand';
import type { StoryWithNeighbors } from '@/lib/types';

interface StoryDetailState {
  story: StoryWithNeighbors | null;
  loading: boolean;
  error: string | null;
  fetchStory: (id: string) => Promise<void>;
  clear: () => void;
}

export const useStoryDetailStore = create<StoryDetailState>((set) => ({
  story: null,
  loading: false,
  error: null,

  fetchStory: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/stories/${id}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success) {
        throw new Error(body.error ?? 'הסיפור לא נמצא');
      }
      const data = body.data as StoryWithNeighbors;
      set({ story: data, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  clear: () => set({ story: null, loading: false, error: null }),
}));
