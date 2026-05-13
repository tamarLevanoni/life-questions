import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import { SEARCH_PARAM_KEYS, paginatedStoriesSchema } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();
  for (const key of SEARCH_PARAM_KEYS) {
    const val = searchParams.get(key);
    if (val !== null) params.set(key, val);
  }

  const pageSize = searchParams.get('pageSize');
  const limit = searchParams.get('limit') ?? pageSize ?? '20';
  params.set('limit', limit);

  const { data, ok, status, error } = await backendFetch(`/api/stories?${params}`);

  if (!ok) {
    return NextResponse.json({ error: error ?? 'Backend error' }, { status });
  }

  const parsed = paginatedStoriesSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Backend returned unexpected data' }, { status: 502 });
  }

  return NextResponse.json(parsed.data);
}
