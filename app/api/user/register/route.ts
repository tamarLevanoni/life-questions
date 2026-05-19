import { NextResponse } from 'next/server';
import { backendFetch, requireSession } from '@/lib/backend';

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { data, ok, status, error } = await backendFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!ok) return NextResponse.json({ success: false, error: error ?? 'Backend error' }, { status });
  return NextResponse.json({ success: true, data }, { status: 201 });
}
