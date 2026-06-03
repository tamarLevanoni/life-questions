import { Suspense } from 'react';
import Link from 'next/link';
import { ScenarioCard } from '@/components/story/scenario-card';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { getFeaturedStories } from '@/lib/server/stories';
import { getReference } from '@/lib/server/reference';

export function FeaturedStoriesSection() {
  return (
    <section id="featured" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <MotionFadeIn>
          <SectionHeader
            title="דוגמאות לסיפורים"
            subtitle="הנה כמה דוגמאות מתוך האוסף שלנו"
            size="sm"
          />
        </MotionFadeIn>

        <Suspense fallback={<FeaturedStoriesSkeleton />}>
          <FeaturedStoriesContent />
        </Suspense>

        <MotionFadeIn className="text-center mt-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 text-primary font-hebrew font-medium hover:underline"
          >
            לכל הסיפורים
            <span className="rtl-flip">←</span>
          </Link>
        </MotionFadeIn>
      </div>
    </section>
  );
}

async function FeaturedStoriesContent() {
  const [stories, reference] = await Promise.all([
    getFeaturedStories(),
    getReference(),
  ]);

  return (
    <div className="grid gap-4">
      {stories.map((story, index) => (
        <MotionFadeIn key={story.id} delay={index * 0.1}>
          <Link href={`/story/${story.id}`} className="block">
            <ScenarioCard
              story={story}
              bookName={reference.books.find((b) => b.id === story.bookId)?.name}
              topicName={story.topic.name}
            />
          </Link>
        </MotionFadeIn>
      ))}
    </div>
  );
}

function FeaturedStoriesSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="story-card overflow-hidden animate-pulse" dir="rtl">
          <div className="flex">
            <div className="w-[4px] shrink-0 rounded-r-full bg-primary/30" />
            <div className="flex flex-col gap-3 px-4 py-4 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
