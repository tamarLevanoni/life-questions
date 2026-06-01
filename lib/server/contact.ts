import 'server-only';
import { backendFetch } from '@/lib/backend-fetch';
import { contactSchema } from '@/lib/schemas';
import { BackendError } from './errors';

export async function submitContact(body: unknown) {
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) throw new BackendError(400, 'נתונים לא תקינים');

  const { data, ok, status, error } = await backendFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });
  if (!ok) throw new BackendError(status, error ?? 'שגיאה בשרת');
  return data;
}
