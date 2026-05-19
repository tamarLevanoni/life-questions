import { create } from 'zustand';
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
      const [masechtotRes, shuSectionsRes, topicsRes, booksRes] = await Promise.all([
        fetch('/api/reference/masechtot'),
        fetch('/api/reference/shu-sections'),
        fetch('/api/reference/topics'),
        fetch('/api/reference/books'),
      ]);

      const [masechtotBody, shuSectionsBody, topicsBody, booksBody] = await Promise.all([
        masechtotRes.json(),
        shuSectionsRes.json(),
        topicsRes.json(),
        booksRes.json(),
      ]);

      if (!masechtotRes.ok || !masechtotBody.success ||
          !shuSectionsRes.ok || !shuSectionsBody.success ||
          !topicsRes.ok || !topicsBody.success ||
          !booksRes.ok || !booksBody.success) {
        throw new Error('שגיאה בטעינת נתוני עזר');
      }

      set({
        masechtot: masechtotBody.data as MasechetWithPages[],
        shuSections: shuSectionsBody.data as ShuSectionWithSimanim[],
        topics: topicsBody.data as Topic[],
        books: booksBody.data as Book[],
        loaded: true,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },
}));
