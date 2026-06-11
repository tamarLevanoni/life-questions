import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { serverClient } from './client';
import {
  userDataSchema,
  updateUserSchema,
  registerUserSchema,
  type UserData,
  type UpdateUserBody,
  type RegisterUserBody,
} from '@/lib/schemas';
import { BackendError, SchemaError } from './errors';

async function requireSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new BackendError(401, 'Unauthorized');
  return session.user;
}

async function requireGoogleSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.googleId) throw new BackendError(401, 'Unauthorized');
  return session.user;
}

export async function getCurrentUser(): Promise<UserData | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.googleId) return null;
  try {
    const data = await serverClient.get(`/api/users/google/${session.user.googleId}`);
    const parsed = userDataSchema.safeParse(data);
    if (!parsed.success) throw new SchemaError();
    return parsed.data;
  } catch {
    return null;
  }
}

export async function updateCurrentUser(partial: UpdateUserBody): Promise<UserData> {
  const validated = updateUserSchema.parse(partial);
  const user = await requireSessionUser();
  const data = await serverClient.patch(`/api/users/profile/${user.id}`, validated);
  const parsed = userDataSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}

export async function registerUser(body: RegisterUserBody): Promise<UserData> {
  const validated = registerUserSchema.parse(body);
  const sessionUser = await requireGoogleSession();
  if (validated.googleId !== sessionUser.googleId) throw new BackendError(403, 'Forbidden');
  const data = await serverClient.post('/api/users', validated);
  const parsed = userDataSchema.safeParse(data);
  if (!parsed.success) throw new SchemaError();
  return parsed.data;
}
