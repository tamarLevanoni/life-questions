import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { Book, MasechetWithPages, ShuSectionWithSimanim, Topic } from '@/lib/types';

export type ReferenceBundle = {
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  topics: Topic[];
  books: Book[];
};

interface ReferenceState extends ReferenceBundle {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  loadAll: () => Promise<void>;
  hydrate: (bundle: ReferenceBundle) => void;
}

export const useReferenceStore = create<ReferenceState>((set, get) => ({
  masechtot: [],
  shuSections: [],
  topics: [],
  books: [],
  loaded: false,
  loading: false,
  error: null,

  loadAll: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true, error: null });
    try {
      const [masechtot, shuSections, topics, books] = await Promise.all([
        apiCall<MasechetWithPages[]>('/api/reference/masechtot'),
        apiCall<ShuSectionWithSimanim[]>('/api/reference/shu-sections'),
        apiCall<Topic[]>('/api/reference/topics'),
        apiCall<Book[]>('/api/reference/books'),
      ]);
      set({ masechtot, shuSections, topics, books, loaded: true, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  hydrate: (bundle) =>
    set({ ...bundle, loaded: true, loading: false, error: null }),
}));
