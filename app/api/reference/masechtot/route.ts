import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { backendFetch } from '@/lib/backend-fetch';
import { masechetSchema } from '@/lib/types';

const schema = z.array(masechetSchema);

export async function GET() {
  const { data, ok, status, error } = await backendFetch('/api/reference/masechtot');

  if (!ok) {
    return NextResponse.json({ error: error ?? 'Backend error' }, { status });
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Backend returned unexpected data' }, { status: 502 });
  }

  return NextResponse.json(parsed.data);
}
