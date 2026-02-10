import { NextResponse } from 'next/server';
import { filterStories, mockStories } from '@/lib/mock-data';
import type { PaginatedResponse, Story } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const query = searchParams.get('q') || undefined;
  const categoryType = searchParams.get('categoryType') || undefined;
  const masechet = searchParams.get('masechet') || undefined;
  const chelek = searchParams.get('chelek') || undefined;
  const subject = searchParams.get('subject') || undefined;
  const hasVideoParam = searchParams.get('hasVideo');
  const hasVideo = hasVideoParam === 'true' ? true : hasVideoParam === 'false' ? false : undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

  // Filter stories using mock data
  // In the future, this will call the Node.js API with API Secret
  const allResults = filterStories(
    query,
    categoryType,
    masechet,
    chelek,
    subject,
    hasVideo
  );

  // Paginate results
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = allResults.slice(start, end);

  const response: PaginatedResponse<Story> = {
    data: paginatedData,
    total: allResults.length,
    page,
    pageSize,
    hasMore: end < allResults.length,
  };

  return NextResponse.json(response);
}
