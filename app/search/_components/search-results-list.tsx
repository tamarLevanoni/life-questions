'use client';

import { SkeletonCardList } from '@/components/common/loading-skeleton';
import { Button } from '@/components/ui/button';
import type { SearchResultsListProps } from '@/lib/types';
import { ScenarioCard } from '@/components/story/scenario-card';
import { Loader2, SearchX } from 'lucide-react';

export function SearchResultsList({
  stories,
  books,
  topics,
  isLoading,
  hasMore,
  onLoadMore,
  onStoryClick,
  emptyMessage = 'לא נמצאו תוצאות',
  emptyHint,
}: SearchResultsListProps) {
  // Loading state
  if (isLoading && stories.length === 0) {
    return (
      <SkeletonCardList variant="search" count={3} />
    );
  }

  // Empty state
  if (!isLoading && stories.length === 0) {
    return (
      <div className="empty-state" dir="rtl">
        <SearchX className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium font-hebrew">{emptyMessage}</p>
        {emptyHint && <p className="text-sm mt-2 font-hebrew">{emptyHint}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3" dir="rtl">
      {/* Results list */}
      <div data-result-cards className="grid gap-1.5 md:gap-3">
        {stories.map((story) => (
          <ScenarioCard
            key={story.id}
            story={story}
            bookName={books.find((b) => b.id === story.bookId)?.name}
            topicName={topics.find((t) => t.id === story.topicId)?.name}
            onClick={() => onStoryClick(story)}
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {isLoading && stories.length > 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Load more button */}
      {!isLoading && hasMore && (
        <div className="flex justify-center pt-4">
          <Button type="button" onClick={onLoadMore} variant="outline" className="h-10 w-full rounded-xl border-border bg-card text-muted-foreground text-xs shadow-sm hover:bg-muted hover:text-foreground">
            טען עוד
          </Button>
        </div>
      )}

      {/* End of results */}
      {!isLoading && !hasMore && stories.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4 font-hebrew">
          הגעת לסוף התוצאות
        </p>
      )}
    </div>
  );
}
