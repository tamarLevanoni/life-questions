'use client';

import { createContext, useContext, useRef } from 'react';
import { useSearchResultsStore } from '@/lib/stores/search-results-store';
import {
  useReferenceStore,
  type ReferenceBundle,
} from '@/lib/stores/reference-store';
import { useUserStore } from '@/lib/stores/user-store';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import type { StoryWithNeighbors, PaginatedStoryCards } from '@/lib/schemas';
import type { UserData } from '@/lib/schemas';

export type InitialData = {
  reference?: ReferenceBundle;
  user?: UserData | null;
  story?: StoryWithNeighbors;
  search?: PaginatedStoryCards;
};

const InitialDataContext = createContext<InitialData>({});

export function useInitialData(): InitialData {
  return useContext(InitialDataContext);
}

interface StoreHydratorProps extends InitialData {
  children: React.ReactNode;
}

export function StoreHydrator({ children, ...initial }: StoreHydratorProps) {
  const hydrated = useRef(false);
  if (!hydrated.current) {
    if (initial.reference) useReferenceStore.getState().hydrate(initial.reference);
    if (initial.user !== undefined) useUserStore.getState().setUser(initial.user);
    if (initial.story) useStoryDetailStore.getState().hydrate(initial.story);
    if (initial.search) useSearchResultsStore.getState().hydrateSearch(initial.search);
    hydrated.current = true;
  }

  return <InitialDataContext.Provider value={initial}>{children}</InitialDataContext.Provider>;
}
