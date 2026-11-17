import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';
import { z } from 'zod';
import { serverClient } from './client';
import {
  masechetWithPagesSchema,
  shuSectionWithSimanimSchema,
  topicSchema,
  bookSchema,
  type MasechetWithPages,
  type ShuSectionWithSimanim,
  type Topic,
  type Book,
  type Story,
  storySchema,
} from '@/lib/schemas';
import { SchemaError } from './errors';
import type { AppDataBundle } from '@/lib/types';

async function fetchList<T>(path: string, schema: z.ZodType<T[]>): Promise<T[]> {
  const data = await serverClient.get(path);
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}

export async function getMasechtot(): Promise<MasechetWithPages[]> {
  'use cache';
  cacheTag('reference');
  cacheLife('hours');
  return fetchList('/api/reference/masechtot', z.array(masechetWithPagesSchema));
}

export async function getShuSections(): Promise<ShuSectionWithSimanim[]> {
  'use cache';
  cacheTag('reference');
  cacheLife('hours');
  return fetchList('/api/reference/shu-sections', z.array(shuSectionWithSimanimSchema));
}

export async function getTopics(): Promise<Topic[]> {
  'use cache';
  cacheTag('reference');
  cacheLife('hours');
  return fetchList('/api/reference/topics', z.array(topicSchema));
}

export async function getBooks(): Promise<Book[]> {
  'use cache';
  cacheTag('reference');
  cacheLife('hours');
  return fetchList('/api/reference/books', z.array(bookSchema));
}

/** משאיר בנתוני דף הבית את סימון קיום ההרחבה ומסיר את הטקסט שלה. */
function storyPreview(story: Story): Story {
  return {
    ...story,
    hasExpansion: story.hasExpansion ?? Boolean(story.expansion?.trim()),
    expansion: null,
  };
}

/** טוען ושומר במטמון את הדוגמאות הציבוריות להצגה בדף הבית. */
export async function getFeaturedStories(): Promise<Story[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('featured');

  const stories = await fetchList('/api/stories/featured', z.array(storySchema));
  return stories.map(storyPreview);
}

/** טוען ושומר במטמון את התצוגה הציבורית של סיפור השבוע, אם יש סיפור נבחר. */
export async function getWeeklyStory(): Promise<Story | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag('weekly');

  const data = await serverClient.get('/api/stories/weekly');
  const parsed = storySchema.nullable().safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data && storyPreview(parsed.data);
}

export async function getAppData(): Promise<AppDataBundle> {
  const [masechtot, shuSections, topics, books, featuredStories, weeklyStory] = await Promise.all([
    getMasechtot(),
    getShuSections(),
    getTopics(),
    getBooks(),
    getFeaturedStories(),
    getWeeklyStory(),
  ]);
  return { masechtot, shuSections, topics, books, featuredStories, weeklyStory };
}
