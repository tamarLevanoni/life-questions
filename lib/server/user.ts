import 'server-only';
import { serverClient } from './client';
import {
  userDataSchema,
  updateUserSchema,
  registerUserSchema,
  type UserData,
} from '@/lib/schemas';
import { BackendError, SchemaError } from './errors';
import { requireGoogleSession, requireRegisteredUser } from './session';

export async function updateCurrentUser(partial: unknown): Promise<UserData> {
  const user = await requireRegisteredUser();
  const validated = updateUserSchema.safeParse(partial);
  if (!validated.success) throw new BackendError(400, 'פרטי פרופיל לא תקינים');
  const data = await serverClient.patch(`/api/users/profile/${encodeURIComponent(user.id)}`, validated.data);
  const parsed = userDataSchema.safeParse(data);
  if (!parsed.success || parsed.data.id !== user.id || parsed.data.googleId !== user.googleId ||
    parsed.data.email !== user.email) throw new SchemaError();
  return parsed.data;
}

export async function registerUser(body: unknown): Promise<UserData> {
  const sessionUser = await requireGoogleSession();
  const validated = registerUserSchema.safeParse(body);
  if (!validated.success) throw new BackendError(400, 'פרטי הרשמה לא תקינים');
  if (validated.data.googleId !== sessionUser.googleId || validated.data.email !== sessionUser.email) {
    throw new BackendError(403, 'Forbidden');
  }
  const data = await serverClient.post('/api/users', validated.data);
  const parsed = userDataSchema.safeParse(data);
  if (!parsed.success || parsed.data.googleId !== sessionUser.googleId ||
    parsed.data.email !== sessionUser.email) throw new SchemaError();
  return parsed.data;
}
