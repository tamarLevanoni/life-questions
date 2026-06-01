'use client';

import { useSearch } from './use-search';
import { SearchHeader } from './search-header';
import { SearchFiltersSidebar } from './search-filters-sidebar';
import { SearchFiltersDrawer } from './search-filters-drawer';
import { SearchResultsPanel } from './search-results-panel';

export function SearchView() {
  const search = useSearch();

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <SearchHeader />
        <div className="flex gap-6 items-start" dir="rtl">
          <SearchFiltersSidebar search={search} />
          <SearchFiltersDrawer search={search} />
          <SearchResultsPanel search={search} />
        </div>
      </div>
    </div>
  );
}
