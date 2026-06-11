import { create } from 'zustand';
import { apiCall, UnauthenticatedError } from '@/lib/api-client';
import type { StoryCard, StoryWithNeighbors, SearchBody, PaginatedStoryCards } from '@/lib/schemas';

interface StoriesState {
  // Entity cache — full stories by ID
  stories: Record<string, StoryWithNeighbors>;
  setStory: (story: StoryWithNeighbors) => void;

  // Search results — ordered list + UI state
  searchResults: StoryCard[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  authRequired: boolean;
  searchStories: (params: SearchBody) => Promise<void>;
  loadMoreStories: (params: SearchBody) => Promise<void>;
  clearAuthRequired: () => void;
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

// מבטל את הבקשה הקודמת כדי שרק החיפוש האחרון ישפיע על ה-state
let activeController: AbortController | null = null;

function nextSignal(): AbortSignal {
  activeController?.abort();
  activeController = new AbortController();
  return activeController.signal;
}

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: {},
  setStory: (story) =>
    set((s) => ({ stories: { ...s.stories, [story.id]: story } })),

  searchResults: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
  authRequired: false,

  clearAuthRequired: () => set({ authRequired: false }),

  searchStories: async (params) => {
    const signal = nextSignal();
    set({ loading: true, error: null, searchResults: [], total: 0, page: 1 });
    try {
      const data = await apiCall<PaginatedStoryCards>(
        '/api/stories/search',
        buildInit({ ...params, page: 1 }, signal)
      );
      if (signal.aborted) return; // בקשה חדשה כבר יצאה — תוצאות אלו לא רלוונטיות
      set({ searchResults: data.stories, total: data.total, page: 1, loading: false });
    } catch (err) {
      if (isAbort(err)) return;
      if (err instanceof UnauthenticatedError) {
        set({ loading: false, authRequired: true });
        return;
      }
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
      if (signal.aborted) return; // בקשה חדשה כבר יצאה — תוצאות אלו לא רלוונטיות
      set((state) => ({
        searchResults: [...state.searchResults, ...data.stories],
        total: data.total,
        page: nextPage,
        loading: false,
      }));
    } catch (err) {
      if (isAbort(err)) return;
      if (err instanceof UnauthenticatedError) {
        set({ loading: false, authRequired: true });
        return;
      }
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },
}));
