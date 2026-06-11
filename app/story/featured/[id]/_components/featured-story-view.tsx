'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { ExpandableAnswerPanel } from '@/components/story/expandable-answer-panel';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { SkeletonLines } from '@/components/common/loading-skeleton';
import { StorySourcesList } from '@/app/story/[id]/_components/story-sources-list';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import { useFeaturedStory } from './use-featured-story';

interface FeaturedStoryViewProps {
  storyId: string;
}

export function FeaturedStoryView({ storyId }: FeaturedStoryViewProps) {
  const { story, book } = useFeaturedStory(storyId);

  if (!story) return <SkeletonLines count={4} />;

  return (
    <>
      <MotionFadeIn trigger="mount" as="article">
        <GlassCard className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-hebrew mb-3 flex-wrap">
            <span>{book?.name ?? '...'}</span>
            <span>›</span>
            <span>{story.topic.name}</span>
            {story.centralShuSiman && (
              <>
                <span>›</span>
                <span>
                  סימן {toHebrewNumeral(story.centralShuSiman.siman)}
                  {story.centralShuSiman.title ? ` - ${story.centralShuSiman.title}` : ''}
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-hebrew mb-6">{story.title}</h1>

          <div className="mb-8">
            <h2 className="text-lg font-semibold font-hebrew mb-3 text-primary">הסיפור</h2>
            <p className="text-foreground leading-relaxed font-hebrew whitespace-pre-wrap">
              {story.storyBody}
            </p>
          </div>

          <div className="mb-8 p-4 rounded-xl bg-muted/50 border-r-4 border-primary">
            <h2 className="text-lg font-semibold font-hebrew mb-2">השאלה</h2>
            <p className="text-foreground font-hebrew">{story.legalQuestion}</p>
          </div>

          <StorySourcesList
            shasRefs={story.shasRefs}
            shuRefs={story.shuRefs}
            sourceReferencesText={story.sourceReferencesText}
          />

          {story.conceptsFromIndex.length > 0 && (
            <div className="mt-3 mb-6">
              <span className="text-xs text-muted-foreground font-hebrew font-medium">מושגים:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {story.conceptsFromIndex.map((concept, i) => (
                  <Badge key={`concept-${i}`} variant="concept">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </MotionFadeIn>

      <MotionFadeIn trigger="mount" delay={0.1} className="mb-4">
        <ExpandableAnswerPanel
          title="תשובה קצרה"
          content={story.shortAnswer}
          variant="shortAnswer"
          defaultExpanded={false}
        />
      </MotionFadeIn>

      <MotionFadeIn trigger="mount" delay={0.3} className="mb-8">
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-primary/30 text-sm font-medium font-hebrew text-primary hover:bg-primary/5 transition-colors"
        >
          <Search className="w-4 h-4" />
          לכל הסיפורים
        </Link>
      </MotionFadeIn>
    </>
  );
}
