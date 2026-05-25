import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { contactSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'נתונים לא תקינים' }, { status: 400 });
  }

  const { data, ok, status, error } = await backendFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });

  if (!ok) return NextResponse.json({ success: false, error: error ?? 'שגיאה בשרת' }, { status });
  return NextResponse.json({ success: true, data });
}
