import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { Book, MasechetWithPages, ShuSectionWithSimanim, Topic } from '@/lib/types';

interface ReferenceState {
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  topics: Topic[];
  books: Book[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  loadAll: () => Promise<void>;
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
}));
