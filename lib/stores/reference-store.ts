import { create } from 'zustand';
import type { Masechet, ShuSectionWithSimanim, MasechetPage } from '@/lib/types';

interface ReferenceState {
  masechtot: Masechet[];
  shuSections: ShuSectionWithSimanim[];
  concepts: string[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  masechetPages: Record<string, MasechetPage[]>;
  masechetPagesLoading: Record<string, boolean>;
  loadAll: () => Promise<void>;
  loadMasechetPages: (masechetId: string) => Promise<void>;
}

export const useReferenceStore = create<ReferenceState>((set, get) => ({
  masechtot: [],
  shuSections: [],
  concepts: [],
  loaded: false,
  loading: false,
  error: null,
  masechetPages: {},
  masechetPagesLoading: {},

  loadAll: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true, error: null });

    try {
      const [masechtotRes, shuSectionsRes, conceptsRes] = await Promise.all([
        fetch('/api/reference/masechtot'),
        fetch('/api/reference/shu-sections'),
        fetch('/api/reference/concepts'),
      ]);

      const [masechtotBody, shuSectionsBody, conceptsBody] = await Promise.all([
        masechtotRes.json(),
        shuSectionsRes.json(),
        conceptsRes.json(),
      ]);

      if (!masechtotRes.ok || !masechtotBody.success ||
          !shuSectionsRes.ok || !shuSectionsBody.success ||
          !conceptsRes.ok || !conceptsBody.success) {
        throw new Error('שגיאה בטעינת נתוני עזר');
      }

      set({
        masechtot: masechtotBody.data as Masechet[],
        shuSections: shuSectionsBody.data as ShuSectionWithSimanim[],
        concepts: conceptsBody.data as string[],
        loaded: true,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'שגיאה לא ידועה' });
    }
  },

  loadMasechetPages: async (masechetId: string) => {
    const state = get();
    if (state.masechetPages[masechetId] || state.masechetPagesLoading[masechetId]) return;

    set((s) => ({ masechetPagesLoading: { ...s.masechetPagesLoading, [masechetId]: true } }));
    try {
      const res = await fetch(`/api/reference/masechtot/${masechetId}/pages`);
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error('שגיאה בטעינת דפי מסכת');
      set((s) => ({
        masechetPages: { ...s.masechetPages, [masechetId]: body.data as MasechetPage[] },
        masechetPagesLoading: { ...s.masechetPagesLoading, [masechetId]: false },
      }));
    } catch {
      set((s) => ({ masechetPagesLoading: { ...s.masechetPagesLoading, [masechetId]: false } }));
    }
  },
}));
