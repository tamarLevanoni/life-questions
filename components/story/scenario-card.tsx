'use client';

import { cn } from '@/lib/utils';
import type { ScenarioCardProps } from '@/lib/types';
import { Video } from 'lucide-react';

export function ScenarioCard({ story, onClick, className }: ScenarioCardProps) {
  const concepts = [...story.conceptsAi, ...story.conceptsFromIndex];
  const primaryConcept = concepts[0];
  const shasRef = story.shasRefs[0];
  const shuRef = story.shuRefs[0];

  return (
    <article
      onClick={onClick}
      className={cn(
        'story-card p-5 cursor-pointer',
        'font-hebrew',
        className
      )}
      dir="rtl"
    >
      <div className="flex flex-col gap-3">
        {/* Header with badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {primaryConcept && (
            <span className="badge-concepts px-3 py-1 text-xs font-medium rounded-full">
              {primaryConcept}
            </span>
          )}

          {story.videoUrl && (
            <span className="video-indicator">
              <Video className="w-3 h-3" />
              <span>וידאו</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground leading-tight">
          {story.title}
        </h3>

        {/* Question preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {story.legalQuestion}
        </p>

        {/* Category references */}
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {shasRef && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {shasRef.shasPage.masechet.name}
            </span>
          )}
          {shuRef && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {shuRef.shuSiman.section.name}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
