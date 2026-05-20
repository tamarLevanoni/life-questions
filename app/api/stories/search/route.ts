import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import { searchBodySchema, paginatedStoriesSchema } from '@/lib/types';

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = searchBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { data, ok, status, error } = await backendFetch('/api/stories/search', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });

  if (!ok) {
    return NextResponse.json({ success: false, error: error ?? 'Backend error' }, { status });
  }

  const result = paginatedStoriesSchema.safeParse(data);
  if (!result.success) {
    return NextResponse.json({ success: false, error: 'Backend returned unexpected data' }, { status: 502 });
  }

  return NextResponse.json({ success: true, data: result.data });
}
