'use client';

import { ExpandableAnswerPanel } from '@/components/story/expandable-answer-panel';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { SkeletonLines } from '@/components/common/loading-skeleton';
import { StoryArticle } from './story-article';
import { StoryNavigation } from './story-navigation';
import { StoryNotFound } from './story-not-found';
import { StoryBackLink } from './story-back-link';
import { StoryQuestionCta } from './story-question-cta';
import { useStoryDetail } from './use-story-detail';

export function StoryView() {
  const {
    storyId,
    story,
    book,
    loading,
    error,
    canViewExpansion,
    prevId,
    nextId,
    requestExpansionAccess,
  } = useStoryDetail();

  if (loading) return <SkeletonLines count={4} />;
  if (error || !story) return <StoryNotFound error={error} />;

  return (
    <>
      <StoryBackLink />

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

      <StoryQuestionCta storyId={storyId} storyTitle={story.title} />

      <MotionFadeIn trigger="mount" delay={0.3}>
        <StoryNavigation prevId={prevId} nextId={nextId} />
      </MotionFadeIn>
    </>
  );
}
