import 'server-only';
import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { z } from 'zod';
import { serverClient } from './client';
import {
  storyWithNeighborsSchema,
  paginatedStoryCardsSchema,
  searchBodySchema,
  type StoryWithNeighbors,
  type PaginatedStoryCards,
  type SearchBody,
} from '@/lib/schemas';
import { BackendError, SchemaError } from './errors';

export const getStory = cache(async (id: string): Promise<StoryWithNeighbors> => {
  const data = await serverClient.get(`/api/stories/${id}`);
  const parsed = storyWithNeighborsSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
});

export async function searchStories(body: SearchBody): Promise<PaginatedStoryCards> {
  const validated = searchBodySchema.safeParse(body);
  if (!validated.success) throw new BackendError(400, 'Invalid request body');
  const data = await serverClient.post('/api/stories/search', validated.data);
  const parsed = paginatedStoryCardsSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}


