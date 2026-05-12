import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import type { ApiPaginatedStories } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();
  const forward = ['q', 'masechetId', 'daf', 'amud', 'shuSectionId', 'simanId', 'seif', 'concept', 'page'];
  for (const key of forward) {
    const val = searchParams.get(key);
    if (val !== null) params.set(key, val);
  }

  const pageSize = searchParams.get('pageSize');
  const limit = searchParams.get('limit') ?? pageSize ?? '20';
  params.set('limit', limit);

  const { data, ok, status, error } = await backendFetch<ApiPaginatedStories>(
    `/api/stories?${params}`
  );

  if (!ok) {
    return NextResponse.json({ error: error ?? 'Backend error' }, { status });
  }

  return NextResponse.json(data);
}
