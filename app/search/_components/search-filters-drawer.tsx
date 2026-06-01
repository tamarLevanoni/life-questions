'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CategoryFilterBar } from './category-filter-bar';
import type { UseSearchReturn } from './use-search';

interface SearchFiltersDrawerProps {
  search: UseSearchReturn;
}

export function SearchFiltersDrawer({ search }: SearchFiltersDrawerProps) {
  return (
    <Sheet open={search.filterDrawerOpen} onOpenChange={search.setFilterDrawerOpen}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl overflow-y-auto" dir="rtl">
        <SheetHeader>
          <SheetTitle className="font-hebrew text-right">סנן תוצאות</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          <CategoryFilterBar
            masechtot={search.masechtot}
            shuSections={search.shuSections}
            topics={search.topics}
            books={search.books}
            activeFilters={search.filters}
            onFiltersChange={search.setFilters}
            onSearch={search.closeDrawerAndSearch}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
