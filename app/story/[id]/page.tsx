import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { SkeletonLines } from '@/components/common/loading-skeleton';
import { getStory } from '@/lib/server/stories';
import { BackendError } from '@/lib/server/errors';
import { StoryContent } from './_components/story-content';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

async function loadStory(id: string) {
  try {
    return await getStory(id);
  } catch (err) {
    if (err instanceof BackendError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = await loadStory(id);
  if (!story) return { title: 'סיפור לא נמצא' };
  const description = story.legalQuestion ?? story.storyBody?.slice(0, 160);
  return {
    title: `${story.title} | שאלות מהחיים`,
    description,
    openGraph: { title: story.title, description, type: 'article' },
  };
}

export default function StoryPage({ params }: StoryPageProps) {
  return (
    <PageShell maxWidth="3xl">
      <Suspense fallback={<SkeletonLines count={6} />}>
        <StoryContent params={params} />
      </Suspense>
    </PageShell>
  );
}
