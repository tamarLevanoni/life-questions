import { registerUser } from '@/lib/server/user';
import { runRoute } from '@/lib/server/errors';

export async function POST(request: Request) {
  const body = await request.json();
  return runRoute(() => registerUser(body), 201);
}
