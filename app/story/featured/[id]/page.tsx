import { PageShell } from '@/components/common/page-shell';
import { FeaturedStoryView } from './_components/featured-story-view';

interface FeaturedStoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function FeaturedStoryPage({ params }: FeaturedStoryPageProps) {
  const { id } = await params;
  return (
    <PageShell maxWidth="3xl">
      <FeaturedStoryView storyId={id} />
    </PageShell>
  );
}
