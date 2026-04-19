/**
 * קריאה ל-backend עם הוספת ה-secret header אוטומטית.
 * מחזיר { data, ok, status, error } אחרי פריקת ה-StandardResponse מהשרת.
 * השרת תמיד עוטף את התשובה ב-{ success, data } או { success, error }.
 *
 * קובץ זה אינו מייבא מ-auth-options כדי למנוע circular dependency.
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;

type StandardResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

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
