import 'server-only';
import { BackendError, SchemaError } from './errors';

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!BACKEND_API_URL || !INTERNAL_API_SECRET) {
    throw new BackendError(503, 'Backend service is not configured');
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_API_URL.replace(/\/+$/, '')}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
        'x-api-secret': INTERNAL_API_SECRET,
      },
    });
  } catch {
    throw new BackendError(502, 'Backend connection failed');
  }

  const body: unknown = await res.json().catch(() => null);
  const envelope = body && typeof body === 'object' && !Array.isArray(body) ? body : null;

  if (!res.ok) {
    if (envelope && 'success' in envelope && envelope.success === false &&
      'error' in envelope && typeof envelope.error === 'string') {
      throw new BackendError(res.status, envelope.error);
    }
    if (res.status >= 500) throw new BackendError(res.status, 'Backend request failed');
    throw new SchemaError();
  }

  if (!envelope || !('success' in envelope) || envelope.success !== true || !('data' in envelope)) {
    throw new SchemaError();
  }
  return envelope.data as T;
}

export const serverClient = {
  get:   <T>(path: string, init?: Pick<RequestInit, 'headers' | 'cache'>): Promise<T> =>
    request<T>(path, init),
  post:  <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
};
