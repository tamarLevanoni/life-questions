'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { ExpandableAnswerPanel } from '@/components/story/expandable-answer-panel';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { SkeletonLines } from '@/components/common/loading-skeleton';
import { StoryArticle } from './story-article';
import { StoryNavigation } from './story-navigation';
import { useStoryDetail } from './use-story-detail';

export function StoryView() {
  const {
    story,
    book,
    storyId,
    canViewExpansion,
    prevId,
    nextId,
    requestExpansionAccess,
  } = useStoryDetail();

  if (!story) return <SkeletonLines count={5} />;

  return (
    <>
      <MotionFadeIn trigger="mount" y={10} className="mb-6">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-hebrew"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לחיפוש
        </Link>
      </MotionFadeIn>

      <MotionFadeIn trigger="mount" as="article">
        <StoryArticle story={story} book={book} />
      </MotionFadeIn>

      <MotionFadeIn trigger="mount" delay={0.1} className="mb-4">
        <ExpandableAnswerPanel
          title="תשובה קצרה"
          content={story.shortAnswer}
          variant="shortAnswer"
          defaultExpanded={false}
        />
      </MotionFadeIn>

      {story.expansion !== null && (
        <MotionFadeIn trigger="mount" delay={0.2} className="mb-8">
          <ExpandableAnswerPanel
            title="הרחבה"
            content={story.expansion}
            variant="expansion"
            isLocked={!canViewExpansion}
            defaultExpanded={false}
            onRequestAccess={requestExpansionAccess}
          />
        </MotionFadeIn>
      )}

      <MotionFadeIn trigger="mount" delay={0.3} className="mb-8">
        <Link
          href={`/contact?category=story_question&storyId=${storyId}&storyTitle=${encodeURIComponent(story.title)}`}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-teal-200 dark:border-teal-800 text-sm font-medium font-hebrew text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          שאל שאלה/דווח על טעות בהמשך לסיפור זה
        </Link>
      </MotionFadeIn>

      <MotionFadeIn trigger="mount" delay={0.3}>
        <StoryNavigation prevId={prevId} nextId={nextId} />
      </MotionFadeIn>
    </>
  );
}
