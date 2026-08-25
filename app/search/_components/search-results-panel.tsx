'use client';

import { ActiveFilterTags } from './active-filter-tags';
import { SearchResultsList } from './search-results-list';
import type { UseSearchReturn } from './use-search';

interface SearchResultsPanelProps {
  search: UseSearchReturn;
}

export function SearchResultsPanel({ search }: SearchResultsPanelProps) {
  const {
    applied,
    hasSearched,
    loading,
    stories,
    total,
    hasMore,
    masechtot,
    shuSections,
    topics,
    books,
    handleLoadMore,
    handleStoryClick,
  } = search;

  return (
    <div className="space-y-4">
      <ActiveFilterTags
        filters={applied}
        books={books}
        topics={topics}
        masechtot={masechtot}
        shuSections={shuSections}
      />

      <div className="max-h-[60vh] overflow-y-auto pl-1">
        <SearchResultsList
          stories={stories}
          books={books}
          topics={topics}
          isLoading={loading}
          hasMore={hasMore}
          total={total}
          onLoadMore={handleLoadMore}
          onStoryClick={handleStoryClick}
          emptyMessage={
            hasSearched ? 'לא נמצאו תוצאות לחיפוש זה' : 'בחרו מסכת, ספר, נושא או פרק בשולחן ערוך כדי להתחיל'
          }
          emptyHint={
            hasSearched ? 'נסו לצמצם או לשנות את הסינון, או להוסיף מילת מפתח' : undefined
          }
        />
      </div>
    </div>
  );
}
