import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { backendFetch } from '@/lib/backend-fetch';
import {
  userDataSchema,
  updateUserSchema,
  registerUserSchema,
  type UserData,
  type UpdateUserBody,
  type RegisterUserBody,
} from '@/lib/schemas';
import { BackendError, SchemaError } from './errors';

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
  const { data, ok } = await backendFetch(
    `/api/users/google/${session.user.googleId}`
  );
  if (!ok) return null;
  const parsed = userDataSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}

export async function updateCurrentUser(partial: UpdateUserBody): Promise<UserData> {
  const validated = updateUserSchema.parse(partial);
  const user = await requireSessionUser();
  const { data, ok, status, error } = await backendFetch(
    `/api/users/profile/${user.id}`,
    { method: 'PATCH', body: JSON.stringify(validated) }
  );
  if (!ok) throw new BackendError(status, error ?? 'Backend error');
  const parsed = userDataSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}

export async function registerUser(body: RegisterUserBody): Promise<UserData> {
  const validated = registerUserSchema.parse(body);
  const sessionUser = await requireGoogleSession();
  if (validated.googleId !== sessionUser.googleId) throw new BackendError(403, 'Forbidden');
  const { data, ok, status, error } = await backendFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
  if (!ok) throw new BackendError(status, error ?? 'Backend error');
  const parsed = userDataSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}
