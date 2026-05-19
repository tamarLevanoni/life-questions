import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { backendFetch } from '@/lib/backend-fetch';
import { bookSchema } from '@/lib/types';

const schema = z.array(bookSchema);

export async function GET() {
  const { data, ok, status, error } = await backendFetch('/api/reference/books');

  if (!ok) {
    return NextResponse.json({ success: false, error: error ?? 'Backend error' }, { status });
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Backend returned unexpected data' }, { status: 502 });
  }

  return NextResponse.json({ success: true, data: parsed.data });
}
