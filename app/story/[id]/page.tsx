import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/common/page-shell';
import { StoreHydrator } from '@/components/common/store-hydrator';
import { getStory } from '@/lib/server/stories';
import { BackendError } from '@/lib/server/errors';
import { StoryView } from './_components/story-view';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const story = await getStory(id);
    const description = story.legalQuestion ?? story.storyBody?.slice(0, 160);
    return {
      title: `${story.title} | שאלות מהחיים`,
      description,
      openGraph: { title: story.title, description, type: 'article' },
    };
  } catch (err) {
    if (err instanceof BackendError && err.status === 404) return { title: 'סיפור לא נמצא' };
    throw err;
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  let story;
  try {
    story = await getStory(id);
  } catch (err) {
    if (err instanceof BackendError && err.status === 404) notFound();
    throw err;
  }

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
      <StoreHydrator story={story}>
        <StoryView />
      </StoreHydrator>
    </PageShell>
  );
}
