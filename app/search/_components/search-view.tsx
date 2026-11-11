'use client';

import { useEffect, useRef } from 'react';
import { useSearch } from './use-search';
import { SearchHeader } from './search-header';
import { SearchFiltersPanel } from './search-filters-panel';
import { SearchResultsPanel } from './search-results-panel';
import { AuthRequiredOverlay } from './auth-required-overlay';
import styles from './search-layout.module.css';

export function SearchView() {
  const search = useSearch();
  const previousView = useRef(search.view);
  const queryRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (previousView.current === search.view) return;
    previousView.current = search.view;
    const target = search.view === 'setup' ? queryRef.current : headingRef.current;
    target?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [search.view]);

  return (
    <div className={styles.page}>
      <div className="relative mx-auto max-w-5xl" dir="rtl">
        <div inert={search.isUnauthenticated}>
          <div className={styles.setup} hidden={search.view !== 'setup'}>
            <SearchHeader />
            <SearchFiltersPanel search={search} queryRef={queryRef} />
          </div>
          {search.view === 'results' && <SearchResultsPanel search={search} headingRef={headingRef} />}
        </div>
        {search.isUnauthenticated && <AuthRequiredOverlay onClick={search.openLoginModal} />}
      </div>
    </div>
  );
}
