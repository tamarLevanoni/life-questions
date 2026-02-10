import { NextResponse } from 'next/server';
import { getStoryById, getAdjacentStories } from '@/lib/mock-data';
import type { StoryWithNavigation } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get story by ID from mock data
  // In the future, this will call the Node.js API with API Secret
  const story = getStoryById(id);

  if (!story) {
    return NextResponse.json(
      { error: 'Story not found' },
      { status: 404 }
    );
  }

  // Get adjacent stories for navigation
  const adjacent = getAdjacentStories(id);

  const response: StoryWithNavigation = {
    story,
    prevId: adjacent.prevId,
    nextId: adjacent.nextId,
  };

  return NextResponse.json(response);
}
