import 'server-only';
import { cache } from 'react';
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
import { requireRegisteredUser } from './session';

export const getStory = cache(async (id: string, readerId?: string): Promise<StoryWithNeighbors> => {
  const data = await serverClient.get(`/api/stories/${encodeURIComponent(id)}`, {
    cache: 'no-store',
    headers: readerId ? { 'x-story-reader-id': readerId } : undefined,
  });
  const parsed = storyWithNeighborsSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return {
    ...parsed.data,
    hasExpansion: parsed.data.hasExpansion ?? Boolean(parsed.data.expansion?.trim()),
    expansion: readerId ? parsed.data.expansion : null,
  };
});

export async function getStoryForViewer(id: string): Promise<StoryWithNeighbors> {
  const reader = await requireRegisteredUser().catch((error: unknown) => {
    if (error instanceof BackendError && error.status === 401) return null;
    throw error;
  });
  return reader ? getStory(id, reader.id) : getStory(id);
}

export async function searchStories(body: SearchBody): Promise<PaginatedStoryCards> {
  const validated = searchBodySchema.safeParse(body);
  if (!validated.success) throw new BackendError(400, 'Invalid request body');
  const data = await serverClient.post('/api/stories/search', validated.data);
  const parsed = paginatedStoryCardsSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}


