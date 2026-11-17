export class UnauthenticatedError extends Error {
  constructor() {
    super('יש להתחבר כדי לגשת לתוכן זה');
    this.name = 'UnauthenticatedError';
  }
}

export class ApiRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/** מחלץ את הנתונים מתגובת ה־BFF ומאפשר להבחין בין צורך בהתחברות לבין שגיאות כמו תפוגת סמן. */
export async function apiCall<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (res.status === 401) throw new UnauthenticatedError();
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    throw new ApiRequestError(res.status, body.error ?? 'שגיאה לא ידועה');
  }
  return body.data as T;
}
