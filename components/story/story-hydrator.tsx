'use client';

import { useRef } from 'react';
import { useStoriesStore } from '@/lib/stores/stories-store';
import type { StoryWithNeighbors } from '@/lib/schemas';

export function StoryHydrator({ story }: { story: StoryWithNeighbors }) {
  const hydratedId = useRef<string | null>(null);
  if (hydratedId.current !== story.id) {
    useStoriesStore.getState().setStory(story);
    hydratedId.current = story.id;
  }
  return null;
}
