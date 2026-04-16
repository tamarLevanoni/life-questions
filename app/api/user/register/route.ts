import { NextResponse } from 'next/server';
import { backendFetch, requireAuth } from '@/lib/backend';

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { data, ok, status } = await backendFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!ok) return NextResponse.json({ error: data?.message ?? 'Backend error' }, { status });
  return NextResponse.json(data, { status: 201 });
}
