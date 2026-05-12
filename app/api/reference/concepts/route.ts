import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';

export async function GET() {
  const { data, ok, status, error } = await backendFetch<string[]>('/api/reference/concepts');

  if (!ok) {
    return NextResponse.json({ error: error ?? 'Backend error' }, { status });
  }

  return NextResponse.json(data);
}
