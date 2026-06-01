import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { backendFetch } from '@/lib/backend-fetch';
import type { UserData } from '@/lib/schemas';
import type { RegisterBody } from '@/lib/types';
import { BackendError } from './errors';

export async function requireSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new BackendError(401, 'Unauthorized');
  return session.user;
}

export async function requireGoogleSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.googleId) throw new BackendError(401, 'Unauthorized');
  return session.user;
}

export async function getCurrentUser(): Promise<UserData | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.googleId) return null;
  const { data, ok } = await backendFetch<UserData>(
    `/api/users/google/${session.user.googleId}`
  );
  return ok ? data : null;
}

export async function updateCurrentUser(partial: unknown): Promise<UserData> {
  const user = await requireSessionUser();
  const { data, ok, status, error } = await backendFetch<UserData>(
    `/api/users/profile/${user.id}`,
    { method: 'PATCH', body: JSON.stringify(partial) }
  );
  if (!ok || !data) throw new BackendError(status, error ?? 'Backend error');
  return data;
}

export async function registerUser(body: RegisterBody): Promise<UserData> {
  await requireGoogleSession();
  const { data, ok, status, error } = await backendFetch<UserData>('/api/users', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!ok || !data) throw new BackendError(status, error ?? 'Backend error');
  return data;
}
