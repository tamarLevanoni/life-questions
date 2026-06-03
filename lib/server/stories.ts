import 'server-only';
import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { z } from 'zod';
import { backendFetch } from '@/lib/backend-fetch';
import {
  storySchema,
  storyWithNeighborsSchema,
  paginatedStoriesSchema,
  paginatedStoryCardsSchema,
  searchBodySchema,
  type Story,
  type StoryWithNeighbors,
  type PaginatedStories,
  type PaginatedStoryCards,
  type SearchBody,
} from '@/lib/types';
import { BackendError, SchemaError } from './errors';

export const getStory = cache(async (id: string): Promise<StoryWithNeighbors> => {
  const { data, ok, status, error } = await backendFetch(`/api/stories/${id}`);
  if (!ok) throw new BackendError(status, error ?? 'Story not found');
  const parsed = storyWithNeighborsSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
});

export async function searchStories(body: SearchBody): Promise<PaginatedStoryCards> {
  const validated = searchBodySchema.safeParse(body);
  if (!validated.success) throw new BackendError(400, 'Invalid request body');

  const { data, ok, status, error } = await backendFetch('/api/stories/search', {
    method: 'POST',
    body: JSON.stringify(validated.data),
  });
  if (!ok) throw new BackendError(status, error ?? 'Backend error');
  const parsed = paginatedStoryCardsSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}

export const getFeaturedStories = cache(async (): Promise<Story[]> => {
  return getCachedFeaturedStories();
});

async function getCachedFeaturedStories(): Promise<Story[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('featured');

  const { data, ok, status, error } = await backendFetch('/api/stories/featured');
  if (!ok) throw new BackendError(status, error ?? 'Backend error');
  const parsed = z.array(storySchema).safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}

export async function getStoriesByQuery(
  searchParams: URLSearchParams
): Promise<PaginatedStories> {
  const { data, ok, status, error } = await backendFetch(`/api/stories?${searchParams}`);
  if (!ok) throw new BackendError(status, error ?? 'Backend error');
  const parsed = paginatedStoriesSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}
