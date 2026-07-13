import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';
import { z } from 'zod';
import { serverClient } from './client';
import { SchemaError } from './errors';

const recommendationSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export type Recommendation = z.infer<typeof recommendationSchema>;

export async function getRecommendations(): Promise<Recommendation[]> {
  'use cache';
  cacheTag('recommendations');
  cacheLife('hours');

  const data = await serverClient.get('/api/recommendations');
  const parsed = z.array(recommendationSchema).safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}
