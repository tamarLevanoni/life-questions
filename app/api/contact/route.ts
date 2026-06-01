import { submitContact } from '@/lib/server/contact';
import { runRoute } from '@/lib/server/errors';

export async function POST(request: Request) {
  const body = await request.json();
  return runRoute(() => submitContact(body));
}
