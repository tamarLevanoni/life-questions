import { searchStoryCardsForAccount } from '@/lib/server/stories';
import { runRoute } from '@/lib/server/errors';
import { requireGoogleSession } from '@/lib/server/session';

/** מאמת את ההתחברות ומעביר בקשת פתיחה או המשך לחיפוש המשויך לחשבון. */
export async function POST(request: Request) {
  return runRoute(async () => {
    const user = await requireGoogleSession();
    const body = await request.json().catch(() => null);
    return searchStoryCardsForAccount(body, user.googleId!, request.signal);
  });
}
