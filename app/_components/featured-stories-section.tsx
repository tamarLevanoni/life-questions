'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ScenarioCard } from '@/components/story/scenario-card';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import { useReferenceStore } from '@/lib/stores/reference-store';
import type { StoryWithNeighbors } from '@/lib/types';

interface FeaturedStoriesSectionProps {
  stories: StoryWithNeighbors[];
}

export function FeaturedStoriesSection({ stories }: FeaturedStoriesSectionProps) {
  const router = useRouter();
  const books = useReferenceStore((s) => s.books);

  function handleCardClick(story: StoryWithNeighbors) {
    useStoryDetailStore.getState().prime(story);
    router.push(`/story/${story.id}`);
  }

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

        <div className="grid gap-4">
          {stories.map((story, index) => (
            <MotionFadeIn key={story.id} delay={index * 0.1}>
              <ScenarioCard
                story={story}
                bookName={books.find((b) => b.id === story.bookId)?.name}
                topicName={story.topic.name}
                onClick={() => handleCardClick(story)}
              />
            </MotionFadeIn>
          ))}
        </div>

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
