import { getStoriesByQuery } from '@/lib/server/stories';
import { runRoute } from '@/lib/server/errors';

const LEGACY_PARAM_KEYS = [
  'q', 'bookId', 'masechetId', 'daf', 'shuSectionId', 'simanId', 'seif', 'topicId', 'page',
] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();
  for (const key of LEGACY_PARAM_KEYS) {
    const val = searchParams.get(key);
    if (val !== null) params.set(key, val);
  }
  const limit = searchParams.get('limit') ?? searchParams.get('pageSize') ?? '20';
  params.set('limit', limit);
  return runRoute(() => getStoriesByQuery(params));
}
