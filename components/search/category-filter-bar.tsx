'use client';

import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, CategoryType, ShulchanAruchChelek } from '@/lib/types';
import {
  MASECHOT,
  SHULCHAN_ARUCH_SECTIONS,
  SUBJECTS,
} from '@/lib/constants/categories';
import { X, BookOpen, Scale, Lightbulb, Video } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

const CATEGORY_TYPES: { value: CategoryType; label: string; icon: React.ReactNode }[] = [
  { value: 'shas', label: 'ש"ס', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'shulchanAruch', label: 'שו"ע', icon: <Scale className="w-4 h-4" /> },
  { value: 'concepts', label: 'מושגים', icon: <Lightbulb className="w-4 h-4" /> },
];

export function CategoryFilterBar({
  activeFilters,
  onFiltersChange,
  className,
}: CategoryFilterBarProps) {
  const handleCategoryTypeChange = (type: CategoryType | undefined) => {
    if (type === activeFilters.categoryType) {
      // Deselect if clicking the same type
      onFiltersChange({
        ...activeFilters,
        categoryType: undefined,
        masechet: undefined,
        chelek: undefined,
        subject: undefined,
      });
    } else {
      // Select new type and clear sub-filters
      onFiltersChange({
        ...activeFilters,
        categoryType: type,
        masechet: undefined,
        chelek: undefined,
        subject: undefined,
      });
    }
  };

  const handleSubFilterChange = (key: string, value: string | undefined) => {
    onFiltersChange({
      ...activeFilters,
      [key]: activeFilters[key as keyof typeof activeFilters] === value ? undefined : value,
    });
  };

  const handleVideoFilterToggle = () => {
    onFiltersChange({
      ...activeFilters,
      hasVideo: activeFilters.hasVideo === true ? undefined : true,
    });
  };

  const handleClearAll = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = activeFilters.categoryType || activeFilters.hasVideo;

  // Get sub-filter options based on selected category type
  const getSubFilterOptions = (): FilterOption[] => {
    switch (activeFilters.categoryType) {
      case 'shas':
        return MASECHOT.map((m) => ({ value: m, label: m }));
      case 'shulchanAruch':
        return SHULCHAN_ARUCH_SECTIONS.map((s) => ({ value: s, label: s }));
      case 'concepts':
        return SUBJECTS.map((s) => ({ value: s, label: s }));
      default:
        return [];
    }
  };

  const getActiveSubFilter = (): string | undefined => {
    switch (activeFilters.categoryType) {
      case 'shas':
        return activeFilters.masechet;
      case 'shulchanAruch':
        return activeFilters.chelek;
      case 'concepts':
        return activeFilters.subject;
      default:
        return undefined;
    }
  };

  const getSubFilterKey = (): string => {
    switch (activeFilters.categoryType) {
      case 'shas':
        return 'masechet';
      case 'shulchanAruch':
        return 'chelek';
      case 'concepts':
        return 'subject';
      default:
        return '';
    }
  };

  const subFilterOptions = getSubFilterOptions();
  const activeSubFilter = getActiveSubFilter();
  const subFilterKey = getSubFilterKey();

  return (
    <div className={cn('space-y-3', className)} dir="rtl">
      {/* Main category type filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORY_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => handleCategoryTypeChange(type.value)}
            className={cn(
              'filter-chip flex items-center gap-2',
              activeFilters.categoryType === type.value && 'active'
            )}
          >
            {type.icon}
            <span>{type.label}</span>
          </button>
        ))}

        {/* Video filter */}
        <button
          onClick={handleVideoFilterToggle}
          className={cn(
            'filter-chip flex items-center gap-2',
            activeFilters.hasVideo === true && 'active'
          )}
        >
          <Video className="w-4 h-4" />
          <span>וידאו</span>
        </button>

        {/* Clear all button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            <span>נקה הכל</span>
          </button>
        )}
      </div>

      {/* Sub-filters (shown when a category type is selected) */}
      {activeFilters.categoryType && subFilterOptions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-snap-x">
          {subFilterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSubFilterChange(subFilterKey, option.value)}
              className={cn(
                'filter-chip whitespace-nowrap scroll-snap-item',
                'text-sm py-1.5 px-3',
                activeSubFilter === option.value && 'active'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
