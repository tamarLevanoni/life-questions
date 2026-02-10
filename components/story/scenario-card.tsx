'use client';

import { cn } from '@/lib/utils';
import type { ScenarioCardProps } from '@/lib/types';
import { Video } from 'lucide-react';

export function ScenarioCard({ story, onClick, className }: ScenarioCardProps) {
  // Get the primary subject from concepts
  const primarySubject = story.categories.concepts[0]?.subject;

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
          {/* Subject badge */}
          {primarySubject && (
            <span className="badge-concepts px-3 py-1 text-xs font-medium rounded-full">
              {primarySubject}
            </span>
          )}

          {/* Video indicator */}
          {story.hasVideo && (
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
          {story.question}
        </p>

        {/* Category references */}
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {story.categories.shas && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {story.categories.shas.masechet}
            </span>
          )}
          {story.categories.shulchanAruch && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {story.categories.shulchanAruch.chelek}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
