import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import { storySchema, storyNeighborsSchema } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [storyResult, neighborsResult] = await Promise.all([
    backendFetch(`/api/stories/${id}`),
    backendFetch(`/api/stories/${id}/neighbors`),
  ]);

  if (!storyResult.ok) {
    return NextResponse.json(
      { error: storyResult.error ?? 'Story not found' },
      { status: storyResult.status }
    );
  }

  const parsedStory = storySchema.safeParse(storyResult.data);
  if (!parsedStory.success) {
    return NextResponse.json({ error: 'Backend returned unexpected data' }, { status: 502 });
  }

  const parsedNeighbors = storyNeighborsSchema.safeParse(neighborsResult.data);
  const neighbors = parsedNeighbors.success ? parsedNeighbors.data : { prev: null, next: null };

  return NextResponse.json({ story: parsedStory.data, neighbors });
}
