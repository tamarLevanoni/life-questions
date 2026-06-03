import { notFound } from 'next/navigation';
import { StoreHydrator } from '@/components/common/store-hydrator';
import { getStory } from '@/lib/server/stories';
import { getReference } from '@/lib/server/reference';
import { BackendError } from '@/lib/server/errors';
import { StoryView } from './story-view';

async function loadStory(id: string) {
  try {
    return await getStory(id);
  } catch (err) {
    if (err instanceof BackendError && err.status === 404) return null;
    throw err;
  }
}

export async function StoryContent({ params }: { params: Promise<{ id: string }> }) {
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoreHydrator story={story} reference={reference}>
        <StoryView />
      </StoreHydrator>
    </>
  );
}
