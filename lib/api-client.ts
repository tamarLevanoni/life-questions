export class UnauthenticatedError extends Error {
  constructor() {
    super('יש להתחבר כדי לגשת לתוכן זה');
    this.name = 'UnauthenticatedError';
  }
}

export async function apiCall<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (res.status === 401) throw new UnauthenticatedError();
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    throw new Error(body.error ?? 'שגיאה לא ידועה');
  }
  return body.data as T;
}
