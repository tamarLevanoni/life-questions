'use client';

import { SlidersHorizontal } from 'lucide-react';

interface SearchMobileFilterButtonProps {
  activeFiltersCount: number;
  onClick: () => void;
}

export function SearchMobileFilterButton({ activeFiltersCount, onClick }: SearchMobileFilterButtonProps) {
  return (
    <button
      className="md:hidden flex items-center gap-2 text-sm font-hebrew border border-border rounded-lg px-3 py-2 bg-card hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <SlidersHorizontal className="w-4 h-4" />
      סנן תוצאות
      {activeFiltersCount > 0 && (
        <span className="bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 leading-none">
          {activeFiltersCount}
        </span>
      )}
    </button>
  );
}
