import { getBooks } from '@/lib/server/reference';
import { runRoute } from '@/lib/server/errors';

export async function GET() {
  return runRoute(() => getBooks());
}
