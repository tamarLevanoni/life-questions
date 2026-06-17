import { Suspense } from 'react';
import { PageShell } from '@/components/common/page-shell';
import { SkeletonLines } from '@/components/common/loading-skeleton';
import { FeaturedStoryView } from './_components/featured-story-view';

interface FeaturedStoryPageProps {
  params: Promise<{ id: string }>;
}

async function FeaturedStoryContent({ params }: FeaturedStoryPageProps) {
  const { id } = await params;
  return <FeaturedStoryView storyId={id} />;
}

export default function FeaturedStoryPage({ params }: FeaturedStoryPageProps) {
  return (
    <PageShell maxWidth="3xl">
      <Suspense fallback={<SkeletonLines count={5} />}>
        <FeaturedStoryContent params={params} />
      </Suspense>
    </PageShell>
  );
}
