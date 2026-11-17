'use client';

import { useState } from 'react';
import { useStoriesStore } from '@/lib/stores/stories-store';
import type { StoryWithNeighbors } from '@/lib/schemas';

/** מכניס את הסיפור שהגיע מהשרת לחנות המצב לפני שרכיב התצוגה קורא אותו. */
export function StoryHydrator({ story }: { story: StoryWithNeighbors }) {
  // המפתח משלב את מזהה הסיפור ואת מצב ההרחבה כדי לטעון לחנות גם את הגרסה שמגיעה אחרי התחברות.
  useState(() => {
    useStoriesStore.getState().setStory(story);
    return null;
  });
  return null;
}
