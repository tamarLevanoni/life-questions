import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_API_URL}/api/users/google/${session.user.id}`, {
    headers: { 'x-api-secret': INTERNAL_API_SECRET },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message ?? 'Backend error' },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // backendUserId is stored in the JWT but not exposed on session.user by default;
  // we read it from the token via getServerSession which hydrates the full session.
  // The JWT callback maps token.backendUserId → only into the JWT, so we need
  // to expose it on session. For now we use googleId as the lookup key.
  const body = await request.json();

  const res = await fetch(`${BACKEND_API_URL}/api/users/google/${session.user.id}`, {
    method: 'PATCH',
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

  return NextResponse.json(data);
}
