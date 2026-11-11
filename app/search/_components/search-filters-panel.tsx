'use client';

import type { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CategoryFilterBar } from './category-filter-bar';
import { SearchQueryField } from './search-query-field';
import type { UseSearchReturn } from './use-search';
import styles from './search-layout.module.css';

interface SearchFiltersPanelProps {
  search: UseSearchReturn;
  queryRef: RefObject<HTMLInputElement | null>;
}

export function SearchFiltersPanel({ search, queryRef }: SearchFiltersPanelProps) {
  const clearAll = () => {
    search.handleClearAll();
    queryRef.current?.focus({ preventScroll: true });
  };

  return (
    <form data-search-form className={styles.filtersForm} onSubmit={(event) => {
      event.preventDefault();
      search.handleSearch();
    }}>
      <div className="rounded-[0.5rem] border border-primary/35 bg-primary/5 px-1 py-0.5 shadow-sm ring-1 ring-primary/10 md:rounded-2xl md:p-1.5">
        <div className="flex items-center gap-2">
          <SearchQueryField
            ref={queryRef} id="free-search-input" variant="setup"
            value={search.draftFilters.q ?? ''} onChange={search.handleQueryChange}
            describedBy="free-search-hint"
          />
          <Button type="submit" disabled={!search.canSearch} className="hidden h-10 rounded-xl px-4 text-xs md:inline-flex">
            חיפוש
          </Button>
        </div>
        <p id="free-search-hint" className="mt-0.5 text-[0.625rem] leading-3.5 text-muted-foreground md:text-[0.6875rem] md:leading-relaxed">
          חיפוש AI בפיתוח • מומלץ לפרט את השאלה
        </p>
      </div>
      <CategoryFilterBar
        masechtot={search.masechtot} shuSections={search.shuSections}
        topics={search.topics} books={search.books}
        activeFilters={search.draftFilters} onFiltersChange={search.setDraftFilters}
        activeTab={search.activeTab} onTabChange={search.setActiveTab}
      />
      <div data-search-actions className={cn(styles.searchActions, 'flex items-center justify-between gap-1 rounded-[0.5rem] border border-border bg-card px-1 py-0.5 md:justify-end md:rounded-2xl md:p-1 md:shadow-sm')}>
        <Button type="button" variant="ghost" onClick={clearAll} className="h-7 rounded-xl px-3 text-[0.6875rem] leading-(--text-xs--line-height) text-muted-foreground hover:bg-muted hover:text-foreground md:h-9 md:text-xs">
          איפוס בחירה
        </Button>
        <Button type="submit" disabled={!search.canSearch} className="h-7 rounded-xl px-3 text-[0.6875rem] font-semibold leading-(--text-xs--line-height) md:h-9 md:text-xs">
          הצג תוצאות
        </Button>
      </div>
    </form>
  );
}
