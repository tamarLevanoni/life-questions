import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import type { Masechet } from '@/lib/types';

export async function GET() {
  const { data, ok, status, error } = await backendFetch<Masechet[]>('/api/reference/masechtot');

  if (!ok) {
    return NextResponse.json({ error: error ?? 'Backend error' }, { status });
  }

  return NextResponse.json(data);
}
