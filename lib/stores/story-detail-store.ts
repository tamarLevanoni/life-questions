import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { StoryWithNeighbors } from '@/lib/types';

interface StoryDetailState {
  story: StoryWithNeighbors | null;
  storyCache: Map<string, StoryWithNeighbors>;
  loading: boolean;
  error: string | null;
  fetchStory: (id: string) => Promise<void>;
  hydrate: (story: StoryWithNeighbors) => void;
  prime: (story: StoryWithNeighbors) => void;
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
      const data = await apiCall<StoryWithNeighbors>(`/api/stories/${id}`);
      set((s) => ({
        story: data,
        loading: false,
        storyCache: new Map(s.storyCache).set(id, data),
      }));
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'הסיפור לא נמצא' });
    }
  },

  hydrate: (story) =>
    set((s) => ({
      story,
      loading: false,
      error: null,
      storyCache: new Map(s.storyCache).set(story.id, story),
    })),

  prime: (story) =>
    set((s) => ({
      story,
      loading: false,
      error: null,
      storyCache: new Map(s.storyCache).set(story.id, story),
    })),

  clear: () => set({ story: null, loading: false, error: null }),
}));
