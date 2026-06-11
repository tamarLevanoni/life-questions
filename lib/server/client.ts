import 'server-only';
import { BackendError } from './errors';

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
      'x-api-secret': INTERNAL_API_SECRET,
    },
  });

  const body = await res.json();

  if (!res.ok || !body.success) {
    throw new BackendError(res.status, body.error ?? 'Backend error');
  }

  return body.data as T;
}

export const serverClient = {
  get:   <T>(path: string): Promise<T> =>
    request<T>(path),
  post:  <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
};
