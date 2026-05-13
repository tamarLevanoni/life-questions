import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import { storyWithNeighborsSchema } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await backendFetch(`/api/stories/${id}`);

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: result.error ?? 'Story not found' },
      { status: result.status }
    );
  }

  const parsed = storyWithNeighborsSchema.safeParse(result.data);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Backend returned unexpected data' }, { status: 502 });
  }

  return NextResponse.json({ success: true, data: parsed.data });
}
