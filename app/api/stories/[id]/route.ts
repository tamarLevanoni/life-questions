import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend-fetch';
import type { ApiStory, ApiStoryNeighbors } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [storyResult, neighborsResult] = await Promise.all([
    backendFetch<ApiStory>(`/api/stories/${id}`),
    backendFetch<ApiStoryNeighbors>(`/api/stories/${id}/neighbors`),
  ]);

  if (!storyResult.ok) {
    return NextResponse.json(
      { error: storyResult.error ?? 'Story not found' },
      { status: storyResult.status }
    );
  }

  return NextResponse.json({
    story: storyResult.data,
    neighbors: neighborsResult.data ?? { prev: null, next: null },
  });
}
