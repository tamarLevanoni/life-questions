import { create } from 'zustand';
import type { Masechet, ShuSectionWithSimanim } from '@/lib/types';

interface ReferenceState {
  masechtot: Masechet[];
  shuSections: ShuSectionWithSimanim[];
  concepts: string[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  loadAll: () => Promise<void>;
}

export const useReferenceStore = create<ReferenceState>((set, get) => ({
  masechtot: [],
  shuSections: [],
  concepts: [],
  loaded: false,
  loading: false,
  error: null,

  loadAll: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true, error: null });

    try {
      const [masechtotRes, shuSectionsRes, conceptsRes] = await Promise.all([
        fetch('/api/reference/masechtot'),
        fetch('/api/reference/shu-sections'),
        fetch('/api/reference/concepts'),
      ]);

      if (!masechtotRes.ok || !shuSectionsRes.ok || !conceptsRes.ok) {
        throw new Error('שגיאה בטעינת נתוני עזר');
      }

      const [masechtot, shuSections, concepts] = await Promise.all([
        masechtotRes.json() as Promise<Masechet[]>,
        shuSectionsRes.json() as Promise<ShuSectionWithSimanim[]>,
        conceptsRes.json() as Promise<string[]>,
      ]);

      set({ masechtot, shuSections, concepts, loaded: true, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },
}));
