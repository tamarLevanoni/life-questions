'use client';

import { cn } from '@/lib/utils';
import type { ScenarioCardProps } from '@/lib/types';
import { Video } from 'lucide-react';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';

export function ScenarioCard({ story, bookName, topicName, onClick, className }: ScenarioCardProps) {
  const shuSiman = story.centralShuSiman;

  return (
    <article
      onClick={onClick}
      className={cn(
        'story-card cursor-pointer overflow-hidden',
        'font-hebrew',
        'transition-all duration-150 hover:scale-[1.01] hover:shadow-md',
        className
      )}
      dir="rtl"
    >
      <div className="flex">
        {/* Accent line — מתרחב ב-hover */}
        <div className="w-[4px] hover:w-[6px] shrink-0 rounded-r-full bg-linear-to-b from-primary via-primary/60 to-primary/20 transition-all duration-150" />

        <div className="flex flex-col gap-3 px-4 py-4 flex-1">
          {/* Breadcrumb: book › topic */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50">
            <span className="text-xs flex items-center gap-1">
              <span className="font-semibold text-foreground/70">{bookName}</span>
              {bookName && topicName && (
                <span className="text-muted-foreground/30 mx-0.5">›</span>
              )}
              <span className="text-muted-foreground/60">{topicName}</span>
            </span>

            {story.videoUrl && (
              <span className="video-indicator">
                <Video className="w-3 h-3" />
                <span>וידאו</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-foreground leading-snug">
            {story.title}
          </h3>

          {/* Question preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {story.legalQuestion}
          </p>

          {/* Source references */}
          {shuSiman && (
            <div className="flex items-center gap-2 pt-1 text-xs flex-wrap">
              <span className={cn(
                'px-3 py-1 rounded-full font-medium',
                'bg-teal-50 text-teal-700 border border-teal-200',
                'dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-700/40'
              )}>
                {shuSiman.section.name}
              </span>
              <span className="text-muted-foreground/60">
                סימן {toHebrewNumeral(shuSiman.siman)}
                {shuSiman.title && (
                  <>
                    <span className="mx-1.5 opacity-40">·</span>
                    {shuSiman.title}
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
