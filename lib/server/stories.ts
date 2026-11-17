import 'server-only';
import { createHmac } from 'node:crypto';
import { cache } from 'react';
import { serverClient } from './client';
import {
  cursorSearchBodySchema,
  cursorStoryCardsSchema,
  storyWithNeighborsSchema,
  sitemapPageSchema,
  type StoryWithNeighbors,
} from '@/lib/schemas';
import { BackendError, SchemaError } from './errors';
import { requireRegisteredUser } from './session';

/** טוען ומאמת פרטי סיפור, ומצרף מזהה קורא רק אם קיבל אותו מהמסלול המאומת. */
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

/** קובע בשרת אם הקורא השלים הרשמה ובוחר אם לבקש עבורו גם את ההרחבה. */
export async function getStoryForViewer(id: string): Promise<StoryWithNeighbors> {
  const reader = await requireRegisteredUser().catch((error: unknown) => {
    if (error instanceof BackendError && error.status === 401) return null;
    throw error;
  });
  return reader ? getStory(id, reader.id) : getStory(id);
}

/** מבקש עמוד מזהים דרך השרת כדי שמפת האתר תוכל לבנות את כתובות הסיפורים. */
export async function listSitemapStories(page: number) {
  const data = await serverClient.get(`/api/stories/sitemap?page=${page}`);
  const parsed = sitemapPageSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}

/** בודק את בקשת העימוד ואת התשובה וקושר את התוצאות לחשבון המאומת. */
export async function searchStoryCardsForAccount(body: unknown, googleId: string, signal: AbortSignal) {
  const parsed = cursorSearchBodySchema.safeParse(body);
  if (!parsed.success) throw new BackendError(400, 'בקשת חיפוש לא תקינה');
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) throw new BackendError(503, 'Backend service is not configured');
  // מפיק מזהה חיפוש עקבי לחשבון מבלי להעביר את מזהה Google הגולמי.
  const account = createHmac('sha256', secret).update('story-search:').update(googleId).digest('hex');
  const data = await serverClient.post('/api/stories/search', parsed.data, {
    headers: { 'x-search-account': account }, signal, cache: 'no-store',
  });
  const page = cursorStoryCardsSchema.safeParse(data);
  if (!page.success) throw new SchemaError();
  return page.data;
}
