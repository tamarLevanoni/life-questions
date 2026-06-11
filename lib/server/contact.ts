import 'server-only';
import { serverClient } from './client';
import { contactSchema } from '@/lib/schemas';
import { BackendError } from './errors';

export async function submitContact(body: unknown) {
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) throw new BackendError(400, 'נתונים לא תקינים');
  return serverClient.post('/api/contact', parsed.data);
}
