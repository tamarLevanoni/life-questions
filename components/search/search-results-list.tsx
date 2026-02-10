'use client';

import { cn } from '@/lib/utils';
import type { SearchResultsListProps } from '@/lib/types';
import { ScenarioCard } from '@/components/story/scenario-card';
import { Loader2, SearchX } from 'lucide-react';

export function SearchResultsList({
  stories,
  isLoading,
  hasMore,
  onLoadMore,
  onStoryClick,
  emptyMessage = 'לא נמצאו תוצאות',
}: SearchResultsListProps) {
  // Loading state
  if (isLoading && stories.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-32 w-full" />
        ))}
      </div>
    );
  }

  // Empty state
  if (!isLoading && stories.length === 0) {
    return (
      <div className="empty-state" dir="rtl">
        <SearchX className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium font-hebrew">{emptyMessage}</p>
        <p className="text-sm mt-2 font-hebrew">נסה לחפש במילים אחרות או לשנות את הסינון</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Results list */}
      <div className="grid gap-4">
        {stories.map((story) => (
          <ScenarioCard
            key={story.id}
            story={story}
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
          <button
            onClick={onLoadMore}
            className={cn(
              'px-6 py-3 rounded-xl',
              'bg-primary text-primary-foreground',
              'font-hebrew font-medium',
              'hover:opacity-90 transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
          >
            טען עוד
          </button>
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
