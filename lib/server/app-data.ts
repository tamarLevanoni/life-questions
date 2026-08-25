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

export async function getFeaturedStories(): Promise<Story[]> {
  'use cache';
  cacheLife('seconds');
  cacheTag('featured');

  return fetchList('/api/stories/featured', z.array(storySchema));
}

export async function getWeeklyStory(): Promise<Story | null> {
  'use cache';
  cacheLife('seconds');
  cacheTag('weekly');

  const data = await serverClient.get('/api/stories/weekly');
  const parsed = storySchema.nullable().safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
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
