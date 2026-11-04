import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { BackendError } from './errors';

export async function requireGoogleSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.googleId) throw new BackendError(401, 'יש להתחבר כדי לבצע פעולה זו');
  return session.user;
}

export async function requireRegisteredUser() {
  const user = await requireGoogleSession();
  if (!user.id || !user.isRegistrationComplete) throw new BackendError(401, 'יש להשלים הרשמה');
  return { ...user, id: user.id };
}
