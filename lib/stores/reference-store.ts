import { create } from 'zustand';
import type { Book, MasechetWithPages, ShuSectionWithSimanim, Topic } from '@/lib/schemas';

export type ReferenceBundle = {
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  topics: Topic[];
  books: Book[];
};

interface ReferenceState extends ReferenceBundle {
  hydrate: (bundle: ReferenceBundle) => void;
}

export const useReferenceStore = create<ReferenceState>((set) => ({
  masechtot: [],
  shuSections: [],
  topics: [],
  books: [],

  hydrate: (bundle) => set(bundle),
}));
