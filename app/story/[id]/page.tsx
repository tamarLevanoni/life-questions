import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/common/page-shell';
import { getStory, getStoryForViewer } from '@/lib/server/stories';
import { BackendError } from '@/lib/server/errors';
import { SkeletonLines } from '@/components/common/loading-skeleton';
import { StoryHydrator } from '@/components/story/story-hydrator';
import { StoryView } from './_components/story-view';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

/** מפיק כותרת ותיאור מפרטי הסיפור הציבוריים עבור תוצאות חיפוש ותצוגות מקדימות של קישור. */
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

/** מציג את מעטפת העמוד ומראה מצב טעינה עד שהשרת מסיים לאחזר את הסיפור. */
export default function StoryPage({ params }: StoryPageProps) {
  return (
    <PageShell maxWidth="3xl">
      <Suspense fallback={<SkeletonLines count={5} />}>
        <StoryContent params={params} />
      </Suspense>
    </PageShell>
  );
}

/** טוען את גרסת הסיפור שמתאימה לקורא ומעביר אותה לתצוגה ולחנות המצב. */
async function StoryContent({ params }: StoryPageProps) {
  const { id } = await params;

  let story;
  try {
    story = await getStoryForViewer(id);
  } catch (err) {
    if (err instanceof BackendError && err.status === 404) notFound();
    throw err;
  }

  // מפרסם במידע המובנה למנועי חיפוש את הכותרת וגוף הסיפור הציבורי.
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
      <StoryHydrator key={`${story.id}:${story.expansion !== null}`} story={story} />
      <StoryView storyId={id} />
    </>
  );
}
