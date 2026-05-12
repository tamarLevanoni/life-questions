import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import type { ApiShuSectionWithSimanim } from '@/lib/types';

export async function GET() {
  const { data, ok, status, error } = await backendFetch<ApiShuSectionWithSimanim[]>(
    '/api/reference/shu-sections'
  );

  if (!ok) {
    return NextResponse.json({ error: error ?? 'Backend error' }, { status });
  }

  return NextResponse.json(data);
}
