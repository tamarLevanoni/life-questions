import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import type { Session } from 'next-auth';

export { backendFetch } from '@/lib/backend-fetch';

/**
 * בודק שקיים session פעיל עם משתמש מחובר.
 * מחזיר את ה-session אם תקין, או NextResponse 401 אם לא.
 */
export async function requireAuth(): Promise<Session | NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}
