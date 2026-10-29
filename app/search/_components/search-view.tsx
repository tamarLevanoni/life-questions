'use client';

import { useSearch } from './use-search';
import { SearchHeader } from './search-header';
import { SearchFiltersPanel } from './search-filters-panel';
import { SearchResultsPanel } from './search-results-panel';
import { AuthRequiredOverlay } from './auth-required-overlay';
import styles from './search-layout.module.css';

export function SearchView() {
  const search = useSearch();

  return (
    <div className={styles.page}>
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="relative flex flex-col gap-4" dir="rtl">
          <div className={styles.controls}>
            <SearchHeader />
            <SearchFiltersPanel
              search={search}
              isOpen={search.filtersOpen}
              onToggle={search.toggleFilters}
              onSearch={search.handleSearch}
            />
          </div>
          <SearchResultsPanel search={search} />
          {search.isUnauthenticated && <AuthRequiredOverlay onClick={search.openLoginModal} />}
        </div>
      </div>
    </div>
  );
}
