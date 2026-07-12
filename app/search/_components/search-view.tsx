'use client';

import { useState } from 'react';
import { useSearch } from './use-search';
import { SearchHeader } from './search-header';
import { SearchFiltersPanel } from './search-filters-panel';
import { SearchResultsPanel } from './search-results-panel';
import { AuthRequiredOverlay } from './auth-required-overlay';

export function SearchView() {
  const search = useSearch();
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <SearchHeader />
        <div className="relative flex flex-col md:flex-row gap-4 items-start" dir="rtl">
          <SearchFiltersPanel
            search={search}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen((prev) => !prev)}
          />
          <div className="flex-1 min-w-0">
            <SearchResultsPanel search={search} />
          </div>
          {search.isUnauthenticated && <AuthRequiredOverlay onClick={search.openLoginModal} />}
        </div>
      </div>
    </div>
  );
}
