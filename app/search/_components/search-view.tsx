'use client';

import { useSearch } from './use-search';
import { SearchHeader } from './search-header';
import { SearchFiltersPanel } from './search-filters-panel';
import { SearchResultsPanel } from './search-results-panel';
import { AuthRequiredOverlay } from './auth-required-overlay';

export function SearchView() {
  const search = useSearch();

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <SearchHeader />
        <div className="relative flex flex-col gap-4" dir="rtl">
          <SearchFiltersPanel
            search={search}
            isOpen={search.filtersOpen}
            onToggle={search.toggleFilters}
            onSearch={search.handleSearch}
          />
          <SearchResultsPanel search={search} />
          {search.isUnauthenticated && <AuthRequiredOverlay onClick={search.openLoginModal} />}
        </div>
      </div>
    </div>
  );
}
