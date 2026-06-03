import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { StoryWithNeighbors } from '@/lib/types';

interface StoryDetailState {
  story: StoryWithNeighbors | null;
  loading: boolean;
  error: string | null;
  fetchStory: (id: string) => Promise<void>;
  hydrate: (story: StoryWithNeighbors) => void;
  prime: (story: StoryWithNeighbors) => void;
  clear: () => void;
}

export const useStoryDetailStore = create<StoryDetailState>((set, get) => ({
  story: null,
  loading: false,
  error: null,

  fetchStory: async (id) => {
    if (get().story?.id === id && !get().error) return;
    set({ loading: true, error: null });
    try {
      const data = await apiCall<StoryWithNeighbors>(`/api/stories/${id}`);
      set({ story: data, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'הסיפור לא נמצא' });
    }
  },

  hydrate: (story) => set({ story, loading: false, error: null }),

  prime: (story) => set({ story, loading: false, error: null }),

  clear: () => set({ story: null, loading: false, error: null }),
}));
