'use client';

import { SearchBar } from './search-bar';
import { ActiveFilterTags } from './active-filter-tags';
import { SearchResultsList } from './search-results-list';
import type { UseSearchReturn } from './use-search';

interface SearchResultsPanelProps {
  search: UseSearchReturn;
}

export function SearchResultsPanel({ search }: SearchResultsPanelProps) {
  const {
    query,
    setQuery,
    filters,
    setFilters,
    hasSearched,
    loading,
    stories,
    total,
    hasMore,
    masechtot,
    shuSections,
    topics,
    books,
    handleSearch,
    handleLoadMore,
    handleStoryClick,
  } = search;

  return (
    <div className="space-y-4">
      <ActiveFilterTags
        filters={filters}
        onFiltersChange={setFilters}
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

      <div className="pt-4 mt-2 border-t border-border/60 space-y-2" dir="rtl">
        <p className="text-sm font-hebrew text-muted-foreground text-center">
          לא מצאת את מה שחיפשת?
        </p>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          isLoading={loading && stories.length === 0}
          placeholder="כתבו את השאלה שלכם"
        />
        <p className="text-xs font-hebrew text-muted-foreground text-right">
          חפשו באמצעות AI, מומלץ לכתוב שאלה מפורטת. עדיין בשלבי פיתוח כדי לדייק לכם כמה שיותר
        </p>
      </div>
    </div>
  );
}
