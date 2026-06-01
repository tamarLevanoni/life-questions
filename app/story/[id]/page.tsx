import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/common/page-shell';
import { StoreHydrator } from '@/components/common/store-hydrator';
import { getStory } from '@/lib/server/stories';
import { getReference } from '@/lib/server/reference';
import { BackendError } from '@/lib/server/errors';
import { StoryView } from './_components/story-view';

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

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const [story, reference] = await Promise.all([loadStory(id), getReference()]);
  if (!story) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    articleBody: story.storyBody,
    inLanguage: 'he',
  };

  return (
    <PageShell maxWidth="3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoreHydrator story={story} reference={reference}>
        <StoryView />
      </StoreHydrator>
    </PageShell>
  );
}
