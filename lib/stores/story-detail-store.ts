import { create } from 'zustand';
import type { Story, StoryNeighbors } from '@/lib/types';

interface StoryDetailState {
  story: Story | null;
  neighbors: StoryNeighbors | null;
  loading: boolean;
  error: string | null;
  fetchStory: (id: string) => Promise<void>;
  clear: () => void;
}

export const useStoryDetailStore = create<StoryDetailState>((set) => ({
  story: null,
  neighbors: null,
  loading: false,
  error: null,

  fetchStory: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/stories/${id}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'הסיפור לא נמצא');
      }
      const data: { story: Story; neighbors: StoryNeighbors } = await res.json();
      set({ story: data.story, neighbors: data.neighbors, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  clear: () => set({ story: null, neighbors: null, loading: false, error: null }),
}));
