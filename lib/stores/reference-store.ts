import { create } from 'zustand';
import type { Book, MasechetWithPages, ShuSectionWithSimanim, Topic } from '@/lib/types';

export type ReferenceBundle = {
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  topics: Topic[];
  books: Book[];
};

interface ReferenceState extends ReferenceBundle {
  loaded: boolean;
  hydrate: (bundle: ReferenceBundle) => void;
}

export const useReferenceStore = create<ReferenceState>((set) => ({
  masechtot: [],
  shuSections: [],
  topics: [],
  books: [],
  loaded: false,

  hydrate: (bundle) => set({ ...bundle, loaded: true }),
}));
