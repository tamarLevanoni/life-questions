"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toHebrewNumeral } from "@/lib/hebrew-numerals";
import type { ScenarioCardProps } from "@/lib/types";

export function ScenarioCard({
  story,
  bookName,
  topicName,
  onClick,
  className,
}: ScenarioCardProps) {
  const shuSiman = story.centralShuSiman;
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[0.625rem] border border-border bg-card font-hebrew shadow-sm md:rounded-2xl transition-shadow hover:shadow-md",
        className,
      )}
      dir="rtl"
    >
      <Link
        href={`/story/${story.id}`}
        onClick={
          onClick
            ? (event) => {
                event.preventDefault();
                onClick();
              }
            : undefined
        }
        className="group block rounded-2xl p-2 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring md:px-4 md:py-3"
      >
        <div className="mb-2 flex items-start justify-between gap-3 border-b border-border/60 pb-2">
          <p className="flex min-w-0 flex-wrap items-center gap-1 text-[11px] leading-relaxed text-muted-foreground">
            {bookName && (
              <span className="font-medium text-foreground/80">{bookName}</span>
            )}
            {bookName && topicName && <span aria-hidden="true">‹</span>}
            {topicName && <span>{topicName}</span>}
          </p>
          {story.videoUrl && (
            <Badge className="shrink-0 gap-1 rounded-full bg-rose-600 px-2 py-1 text-[11px] text-white dark:bg-rose-700">
              <Video aria-hidden="true" className="size-3" />
              וידאו
            </Badge>
          )}
        </div>
        <h2 className="mb-1.5 text-xs md:text-sm font-semibold leading-relaxed text-foreground transition-colors group-hover:text-primary">
          {story.title}
        </h2>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {story.legalQuestion}
        </p>
        {shuSiman && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs leading-relaxed">
            <Badge
              variant="outline"
              className="rounded border-primary/20 bg-primary/5 px-2 py-0.5 text-primary"
            >
              {shuSiman.section.name}
            </Badge>
            <span className="text-muted-foreground">
              סימן {toHebrewNumeral(shuSiman.siman)}
              {shuSiman.title && <> · {shuSiman.title}</>}
            </span>
          </div>
        )}
      </Link>
    </article>
  );
}
