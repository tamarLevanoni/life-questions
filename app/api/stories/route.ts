import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import { paginatedStoriesSchema } from '@/lib/types';

const LEGACY_PARAM_KEYS = ['q', 'bookId', 'masechetId', 'daf', 'shuSectionId', 'simanId', 'seif', 'topicId', 'page'] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();
  for (const key of LEGACY_PARAM_KEYS) {
    const val = searchParams.get(key);
    if (val !== null) params.set(key, val);
  }

  const pageSize = searchParams.get('pageSize');
  const limit = searchParams.get('limit') ?? pageSize ?? '20';
  params.set('limit', limit);

  const { data, ok, status, error } = await backendFetch(`/api/stories?${params}`);

  if (!ok) {
    return NextResponse.json({ success: false, error: error ?? 'Backend error' }, { status });
  }

  const parsed = paginatedStoriesSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Backend returned unexpected data' }, { status: 502 });
  }

  return NextResponse.json({ success: true, data: parsed.data });
}
