import 'server-only';
import { cache } from 'react';
import { z } from 'zod/v4';
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
} from '@/lib/types';
import { BackendError, SchemaError } from './errors';

async function fetchList<T>(path: string, schema: z.ZodType<T[]>): Promise<T[]> {
  const { data, ok, status, error } = await backendFetch(path);
  if (!ok) throw new BackendError(status, error ?? 'Backend error');
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}

export const getMasechtot = cache((): Promise<MasechetWithPages[]> =>
  fetchList('/api/reference/masechtot', z.array(masechetWithPagesSchema))
);

export const getShuSections = cache((): Promise<ShuSectionWithSimanim[]> =>
  fetchList('/api/reference/shu-sections', z.array(shuSectionWithSimanimSchema))
);

export const getTopics = cache((): Promise<Topic[]> =>
  fetchList('/api/reference/topics', z.array(topicSchema))
);

export const getBooks = cache((): Promise<Book[]> =>
  fetchList('/api/reference/books', z.array(bookSchema))
);

export type ReferenceBundle = {
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  topics: Topic[];
  books: Book[];
};

export const getReference = cache(async (): Promise<ReferenceBundle> => {
  const [masechtot, shuSections, topics, books] = await Promise.all([
    getMasechtot(),
    getShuSections(),
    getTopics(),
    getBooks(),
  ]);
  return { masechtot, shuSections, topics, books };
});
