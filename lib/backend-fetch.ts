import 'server-only';
import type { StandardResponse } from '@/lib/types';

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;

export async function backendFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<{ data: T | null; ok: boolean; status: number; error?: string }> {
  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
      'x-api-secret': INTERNAL_API_SECRET,
    },
  });

  const body: StandardResponse<T> = await res.json();

  if (body.success) {
    return { data: body.data, ok: true, status: res.status };
  } else {
    return { data: null, ok: false, status: res.status, error: body.error };
  }
}
