'use client';

import { useRef, type RefObject } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { SearchQueryField } from './search-query-field';
import { ActiveFilterTags } from './active-filter-tags';
import { SearchResultsList } from './search-results-list';
import type { UseSearchReturn } from './use-search';

interface SearchResultsPanelProps {
  search: UseSearchReturn;
  headingRef: RefObject<HTMLHeadingElement | null>;
}

export function SearchResultsPanel({ search, headingRef }: SearchResultsPanelProps) {
  const backButton = useRef<HTMLButtonElement>(null);
  const statusMessage = search.loading
    ? 'טוען תוצאות חיפוש…'
    : !search.error ? 'מציג ' + search.stories.length + ' מתוך ' + search.total + ' תוצאות' : '';

  return (
    <section aria-labelledby="search-results-heading" className="flex flex-col gap-1.5 md:gap-3">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button
            ref={backButton} type="button" variant="ghost" onClick={() => search.setView('setup')}
            className="h-9 rounded-xl bg-primary/5 px-3 text-xs text-primary hover:bg-primary/10 hover:text-primary"
          >
            <ArrowRight aria-hidden="true" />חזרה לחיפוש ולסינון המלא
          </Button>
          <form
            aria-label="חיפוש מתוך התוצאות"
            className="hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border border-primary/35 bg-primary/5 p-1.5 ring-1 ring-primary/10 md:flex"
            onSubmit={(event) => {
              event.preventDefault();
              search.handleSearch();
            }}
          >
            <SearchQueryField
              id="results-search-input" value={search.draftFilters.q ?? ''}
              onChange={search.handleQueryChange}
            />
            <Button type="submit" disabled={!search.canSearch} className="h-10 rounded-xl px-4 text-xs">חיפוש</Button>
          </form>
        </div>
        <ActiveFilterTags
          filters={search.submittedFilters} books={search.books} topics={search.topics}
          masechtot={search.masechtot} shuSections={search.shuSections}
          onRemove={search.handleRemoveFilter} onClear={search.handleClearAll}
          onEmpty={() => backButton.current?.focus({ preventScroll: true })}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <h1 ref={headingRef} id="search-results-heading" tabIndex={-1} className="rounded text-base font-semibold focus-visible:outline-offset-4">
          תוצאות החיפוש
        </h1>
        <p role="status" className="text-xs text-muted-foreground">{statusMessage}</p>
      </div>
      {search.error ? (
        <div role="alert"><EmptyState title="אירעה שגיאה בחיפוש" description={search.error} /></div>
      ) : (
        <SearchResultsList
          stories={search.stories} books={search.books} topics={search.topics} isLoading={search.loading}
          hasMore={search.hasMore} total={search.total}
          onLoadMore={search.handleLoadMore} onStoryClick={search.handleStoryClick}
          emptyMessage="לא נמצאו תוצאות לחיפוש זה"
          emptyHint="נסו לצמצם או לשנות את הסינון, או להוסיף מילת מפתח"
        />
      )}
    </section>
  );
}
