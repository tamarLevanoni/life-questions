import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${BACKEND_API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-secret': INTERNAL_API_SECRET,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message ?? 'Backend error' },
      { status: res.status }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
