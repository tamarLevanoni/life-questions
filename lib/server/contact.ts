import 'server-only';
import { serverClient } from './client';
import { contactSchema } from '@/lib/schemas';
import { BackendError } from './errors';
import { requireGoogleSession } from './session';

export async function submitContact(body: unknown) {
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) throw new BackendError(400, 'נתונים לא תקינים');
  if (parsed.data.category === 'story_question') await requireGoogleSession();
  return serverClient.post('/api/contact', parsed.data);
}
