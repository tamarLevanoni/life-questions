/**
 * קריאה ל-backend עם הוספת ה-secret header אוטומטית.
 * מחזיר { data, ok, status } — הקורא מחליט מה להחזיר ל-client.
 *
 * קובץ זה אינו מייבא מ-auth-options כדי למנוע circular dependency.
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;

export async function backendFetch(
  path: string,
  init?: RequestInit
): Promise<{ data: Record<string, unknown>; ok: boolean; status: number }> {
  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
      'x-api-secret': INTERNAL_API_SECRET,
    },
  });

  const data = await res.json();
  return { data, ok: res.ok, status: res.status };
}
