import 'server-only';
import type { JWT } from 'next-auth/jwt';
import { AUTH_IDENTITY_VERSION } from '@/lib/auth-identity';
import { userDataSchema, type UserData } from '@/lib/schemas';
import { serverClient } from './client';
import { BackendError, SchemaError } from './errors';

// No dependency on authOptions/getServerSession: callbacks can use this safely.
export async function lookupSessionUser(googleId: string): Promise<UserData | null> {
  try {
    const data = await serverClient.get(`/api/users/google/${encodeURIComponent(googleId)}`);
    const parsed = userDataSchema.safeParse(data);
    if (!parsed.success || parsed.data.googleId !== googleId) throw new SchemaError();
    return parsed.data;
  } catch (err) {
    if (err instanceof BackendError && err.status === 404) return null;
    throw err;
  }
}

export function applySessionUser(token: JWT, user: UserData | null, googleId: string): JWT {
  const next = { ...token, sub: googleId, googleId, identityVersion: AUTH_IDENTITY_VERSION, isRegistrationComplete: !!user };
  for (const key of ['id', 'firstName', 'lastName', 'institutionName', 'phone', 'occupations', 'marketingConsent'] as const) {
    delete next[key];
  }
  return user ? { ...next, ...user } : next;
}
