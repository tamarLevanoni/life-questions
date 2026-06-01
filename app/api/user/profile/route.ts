import { getCurrentUser, updateCurrentUser } from '@/lib/server/user';
import { runRoute, BackendError } from '@/lib/server/errors';

export async function GET() {
  return runRoute(async () => {
    const user = await getCurrentUser();
    if (!user) throw new BackendError(401, 'Unauthorized');
    return user;
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  return runRoute(() => updateCurrentUser(body));
}
