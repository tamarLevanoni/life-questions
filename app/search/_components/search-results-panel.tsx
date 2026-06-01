'use client';

import { SearchBar } from './search-bar';
import { ActiveFilterTags } from './active-filter-tags';
import { SearchResultsList } from './search-results-list';
import { AuthRequiredOverlay } from './auth-required-overlay';
import { SearchMobileFilterButton } from './search-mobile-filter-button';
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
    activeFiltersCount,
    isUnauthenticated,
    handleSearch,
    handleLoadMore,
    handleStoryClick,
    setFilterDrawerOpen,
    openLoginModal,
  } = search;

  return (
    <div className="flex-1 min-w-0 space-y-4 relative">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        isLoading={loading && stories.length === 0}
        placeholder="מה אתה מחפש?"
      />

      <SearchMobileFilterButton
        activeFiltersCount={activeFiltersCount}
        onClick={() => setFilterDrawerOpen(true)}
      />

      <ActiveFilterTags
        filters={filters}
        onFiltersChange={setFilters}
        books={books}
        topics={topics}
        masechtot={masechtot}
        shuSections={shuSections}
      />

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
          hasSearched ? 'לא נמצאו תוצאות לחיפוש זה' : 'התחל לחפש כדי לראות תוצאות'
        }
      />

      {isUnauthenticated && <AuthRequiredOverlay onClick={openLoginModal} />}
    </div>
  );
}
