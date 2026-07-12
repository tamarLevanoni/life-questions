import { create } from 'zustand';
import type { AppDataBundle } from '@/lib/types';

interface AppDataState extends AppDataBundle {
  hydrate: (bundle: AppDataBundle) => void;
}

export const useAppDataStore = create<AppDataState>((set) => ({
  masechtot: [],
  shuSections: [],
  topics: [],
  books: [],
  featuredStories: [],
  weeklyStory: null,

  hydrate: (bundle) => set(bundle),
}));
