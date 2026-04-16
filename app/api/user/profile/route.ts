import { NextResponse } from 'next/server';
import { backendFetch, requireAuth } from '@/lib/backend';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { data, ok, status } = await backendFetch(`/api/users/google/${auth.user.id}`);
  if (!ok) return NextResponse.json({ error: data?.message ?? 'Backend error' }, { status });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { data, ok, status } = await backendFetch(`/api/users/google/${auth.user.id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  if (!ok) return NextResponse.json({ error: data?.message ?? 'Backend error' }, { status });
  return NextResponse.json(data);
}
