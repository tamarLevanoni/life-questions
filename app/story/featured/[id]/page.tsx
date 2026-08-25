import { Suspense } from 'react';
import { PageShell } from '@/components/common/page-shell';
import { SkeletonLines } from '@/components/common/loading-skeleton';
import { FeaturedStoryView } from './_components/featured-story-view';

// No I/O in this route depends on the `id` param — the story is looked up
// client-side from the already-hydrated app-data store. Cache Components
// therefore has nothing to force per-request rendering on, and Next can
// prerender a single static shell for the whole [id] pattern. So `id` is
// read client-side (useParams) inside FeaturedStoryView instead of being
// threaded through the server component — the browser always has the real URL.
export default function FeaturedStoryPage() {
  return (
    <PageShell maxWidth="3xl">
      <Suspense fallback={<SkeletonLines count={5} />}>
        <FeaturedStoryView />
      </Suspense>
    </PageShell>
  );
}
