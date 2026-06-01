import { getStory } from '@/lib/server/stories';
import { runRoute } from '@/lib/server/errors';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return runRoute(() => getStory(id));
}
