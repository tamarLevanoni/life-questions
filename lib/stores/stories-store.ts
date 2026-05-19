import { create } from 'zustand';
import type { Story, SearchParams } from '@/lib/types';

interface StoriesState {
  stories: Story[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  searchStories: (params: SearchParams) => Promise<void>;
  loadMoreStories: (params: SearchParams) => Promise<void>;
  reset: () => void;
}

function buildQuery(params: SearchParams): string {
  const q = new URLSearchParams();
  if (params.q) q.set('q', params.q);
  if (params.masechetId) q.set('masechetId', params.masechetId);
  if (params.daf !== undefined) q.set('daf', String(params.daf));
  if (params.shuSectionId) q.set('shuSectionId', params.shuSectionId);
  if (params.simanId) q.set('simanId', params.simanId);
  if (params.seif !== undefined) q.set('seif', String(params.seif));
  if (params.topicId) q.set('topicId', params.topicId);
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  return q.toString();
}

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,

  searchStories: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/stories?${buildQuery({ ...params, page: 1 })}`);
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
      const res = await fetch(`/api/stories?${buildQuery({ ...params, page: nextPage })}`);
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
