import 'server-only';
import { NextResponse } from 'next/server';

export class BackendError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'BackendError';
  }
}

export class SchemaError extends Error {
  constructor(message = 'Backend returned unexpected data') {
    super(message);
    this.name = 'SchemaError';
  }
}

function toJsonResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function errorResponse(err: unknown) {
  if (err instanceof BackendError) {
    return NextResponse.json({ success: false, error: err.status >= 500 ? 'השירות אינו זמין כרגע. נסו שוב מאוחר יותר.' : err.message }, { status: err.status });
  }
  if (err instanceof SchemaError) {
    return NextResponse.json({ success: false, error: 'התקבלה תשובה לא תקינה. נסו שוב מאוחר יותר.' }, { status: 502 });
  }
  console.error('[api] Unexpected failure', { errorType: err instanceof Error ? err.name : 'Unknown' });
  return NextResponse.json({ success: false, error: 'אירעה שגיאה. נסו שוב מאוחר יותר.' }, { status: 500 });
}

export async function runRoute<T>(handler: () => Promise<T>, successStatus = 200) {
  try {
    const data = await handler();
    return toJsonResponse(data, successStatus);
  } catch (err) {
    return errorResponse(err);
  }
}
