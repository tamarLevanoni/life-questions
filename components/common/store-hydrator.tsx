'use client';

import { createContext, useContext, useEffect } from 'react';
import { useStoriesStore } from '@/lib/stores/stories-store';
import {
  useReferenceStore,
  type ReferenceBundle,
} from '@/lib/stores/reference-store';
import { useUserStore } from '@/lib/stores/user-store';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import type { StoryCard, StoryWithNeighbors, PaginatedStoryCards } from '@/lib/types';
import type { UserData } from '@/lib/schemas';

export type InitialData = {
  featured?: StoryCard[];
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
  useEffect(() => {
    if (initial.featured) useStoriesStore.getState().hydrateFeatured(initial.featured);
    if (initial.reference) useReferenceStore.getState().hydrate(initial.reference);
    if (initial.user !== undefined) useUserStore.getState().setUser(initial.user);
    if (initial.story) useStoryDetailStore.getState().hydrate(initial.story);
    if (initial.search) useStoriesStore.getState().hydrateSearch(initial.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <InitialDataContext.Provider value={initial}>{children}</InitialDataContext.Provider>;
}
