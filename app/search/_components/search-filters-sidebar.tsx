'use client';

import { CategoryFilterBar } from './category-filter-bar';
import type { UseSearchReturn } from './use-search';

interface SearchFiltersSidebarProps {
  search: UseSearchReturn;
}

export function SearchFiltersSidebar({ search }: SearchFiltersSidebarProps) {
  return (
    <aside className="hidden md:block w-72 shrink-0 sticky top-24">
      <div className="rounded-xl border border-border bg-card p-4">
        <CategoryFilterBar
          masechtot={search.masechtot}
          shuSections={search.shuSections}
          topics={search.topics}
          books={search.books}
          activeFilters={search.filters}
          onFiltersChange={search.setFilters}
          onSearch={search.handleSearch}
        />
      </div>
    </aside>
  );
}
