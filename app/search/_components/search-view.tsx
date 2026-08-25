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

  const handleSearch = () => {
    search.handleSearch();
    setFiltersOpen(false);
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <SearchHeader />
        <div className="relative flex flex-col gap-4" dir="rtl">
          <SearchFiltersPanel
            search={search}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen((prev) => !prev)}
            onSearch={handleSearch}
          />
          <SearchResultsPanel search={search} />
          {search.isUnauthenticated && <AuthRequiredOverlay onClick={search.openLoginModal} />}
        </div>
      </div>
    </div>
  );
}
