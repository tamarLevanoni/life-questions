import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';
import { z } from 'zod';
import { backendFetch } from '@/lib/backend-fetch';
import {
  masechetWithPagesSchema,
  shuSectionWithSimanimSchema,
  topicSchema,
  bookSchema,
  type MasechetWithPages,
  type ShuSectionWithSimanim,
  type Topic,
  type Book,
} from '@/lib/schemas';
import { BackendError, SchemaError } from './errors';

async function fetchList<T>(path: string, schema: z.ZodType<T[]>): Promise<T[]> {
  const { data, ok, status, error } = await backendFetch(path);
  if (!ok) throw new BackendError(status, error ?? 'Backend error');
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

export type ReferenceBundle = {
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  topics: Topic[];
  books: Book[];
};

export async function getReference(): Promise<ReferenceBundle> {
  const [masechtot, shuSections, topics, books] = await Promise.all([
    getMasechtot(),
    getShuSections(),
    getTopics(),
    getBooks(),
  ]);
  return { masechtot, shuSections, topics, books };
}
