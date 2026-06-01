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

export function toJsonResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(err: unknown) {
  if (err instanceof BackendError) {
    return NextResponse.json({ success: false, error: err.message }, { status: err.status });
  }
  if (err instanceof SchemaError) {
    return NextResponse.json({ success: false, error: err.message }, { status: 502 });
  }
  const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
  return NextResponse.json({ success: false, error: msg }, { status: 500 });
}

export async function runRoute<T>(handler: () => Promise<T>, successStatus = 200) {
  try {
    const data = await handler();
    return toJsonResponse(data, successStatus);
  } catch (err) {
    return errorResponse(err);
  }
}
