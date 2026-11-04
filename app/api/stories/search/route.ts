import { searchStories } from '@/lib/server/stories';
import { runRoute } from '@/lib/server/errors';
import { requireGoogleSession } from '@/lib/server/session';

export async function POST(request: Request) {
  return runRoute(async () => {
    await requireGoogleSession();
    const body = await request.json().catch(() => null);
    return searchStories(body);
  });
}
