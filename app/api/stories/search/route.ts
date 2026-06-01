import { searchStories } from '@/lib/server/stories';
import { runRoute } from '@/lib/server/errors';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return runRoute(() => searchStories(body));
}
