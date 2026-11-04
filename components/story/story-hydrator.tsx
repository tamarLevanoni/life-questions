'use client';

import { useState } from 'react';
import { useStoriesStore } from '@/lib/stores/stories-store';
import type { StoryWithNeighbors } from '@/lib/schemas';

export function StoryHydrator({ story }: { story: StoryWithNeighbors }) {
  // The server gives this bridge a story-id key, so each story initializes once.
  useState(() => {
    useStoriesStore.getState().setStory(story);
    return null;
  });
  return null;
}
