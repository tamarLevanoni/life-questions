'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, CategoryType } from '@/lib/types';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import { X, BookOpen, Scale, Lightbulb, ChevronsUpDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface FilterOption {
  value: string;
  label: string;
}

const CATEGORY_TYPES: { value: CategoryType; label: string; icon: React.ReactNode }[] = [
  { value: 'shas', label: 'ש"ס', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'shulchanAruch', label: 'שו"ע', icon: <Scale className="w-4 h-4" /> },
  { value: 'concepts', label: 'מושגים', icon: <Lightbulb className="w-4 h-4" /> },
];

const SUB_FILTER_LABELS: Record<CategoryType, string> = {
  shas: 'בחרו מסכת...',
  shulchanAruch: 'בחרו חלק...',
  concepts: 'בחרו נושא...',
};

const SUB_SUB_FILTER_LABELS: Record<'shas' | 'shulchanAruch', string> = {
  shas: 'בחרו דף...',
  shulchanAruch: 'בחרו סימן...',
};

export function CategoryFilterBar({
  masechtot,
  shuSections,
  topics,
  activeFilters,
  onFiltersChange,
  className,
}: CategoryFilterBarProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [subComboboxOpen, setSubComboboxOpen] = useState(false);

  const handleCategoryTypeChange = (type: CategoryType) => {
    if (type === activeFilters.categoryType) {
      onFiltersChange({});
    } else {
      onFiltersChange({ categoryType: type });
    }
  };

  const handleClearAll = () => onFiltersChange({});

  const hasActiveFilters =
    activeFilters.categoryType ||
    activeFilters.masechetId ||
    activeFilters.shuSectionId ||
    activeFilters.topicId ||
    activeFilters.simanId ||
    activeFilters.daf !== undefined;

  // ── Level 2 (masechet / section / topic) ──────────────────────────────────

  const getSubFilterOptions = (): FilterOption[] => {
    switch (activeFilters.categoryType) {
      case 'shas':
        return masechtot.map((m) => ({ value: m.id, label: m.name }));
      case 'shulchanAruch':
        return shuSections.map((s) => ({ value: s.id, label: s.name }));
      case 'concepts':
        return topics.map((t) => ({ value: t.id, label: t.name }));
      default:
        return [];
    }
  };

  const getActiveSubFilterValue = (): string | undefined => {
    switch (activeFilters.categoryType) {
      case 'shas': return activeFilters.masechetId;
      case 'shulchanAruch': return activeFilters.shuSectionId;
      case 'concepts': return activeFilters.topicId;
      default: return undefined;
    }
  };

  const getActiveSubFilterLabel = (): string | undefined => {
    switch (activeFilters.categoryType) {
      case 'shas': return masechtot.find((m) => m.id === activeFilters.masechetId)?.name;
      case 'shulchanAruch': return shuSections.find((s) => s.id === activeFilters.shuSectionId)?.name;
      case 'concepts': return topics.find((t) => t.id === activeFilters.topicId)?.name;
      default: return undefined;
    }
  };

  const handleSubFilterSelect = (value: string) => {
    const current = getActiveSubFilterValue();
    const next = current === value ? undefined : value;
    switch (activeFilters.categoryType) {
      case 'shas':
        onFiltersChange({ ...activeFilters, masechetId: next, daf: undefined });
        break;
      case 'shulchanAruch':
        onFiltersChange({ ...activeFilters, shuSectionId: next, simanId: undefined });
        break;
      case 'concepts':
        onFiltersChange({ ...activeFilters, topicId: next });
        break;
    }
    setComboboxOpen(false);
  };

  // ── Level 3 (daf / siman) ──────────────────────────────────────────────────

  const getSubSubFilterOptions = (): FilterOption[] => {
    if (activeFilters.categoryType === 'shas' && activeFilters.masechetId) {
      const pages = masechtot.find((m) => m.id === activeFilters.masechetId)?.pages ?? [];
      const seen = new Set<number>();
      return pages.flatMap((p) => {
        if (seen.has(p.daf)) return [];
        seen.add(p.daf);
        return [{ value: String(p.daf), label: `דף ${toHebrewNumeral(p.daf)}` }];
      });
    }
    if (activeFilters.categoryType === 'shulchanAruch' && activeFilters.shuSectionId) {
      const section = shuSections.find((s) => s.id === activeFilters.shuSectionId);
      return (section?.simanim ?? []).map((s) => ({
        value: s.id,
        label: `סימן ${toHebrewNumeral(s.siman)}${s.title ? ` – ${s.title}` : ''}`,
      }));
    }
    return [];
  };

  const getActiveSubSubFilterValue = (): string | undefined => {
    if (activeFilters.categoryType === 'shas' && activeFilters.daf !== undefined) {
      return String(activeFilters.daf);
    }
    if (activeFilters.categoryType === 'shulchanAruch') return activeFilters.simanId;
    return undefined;
  };

  const getActiveSubSubFilterLabel = (): string | undefined => {
    if (activeFilters.categoryType === 'shas' && activeFilters.daf !== undefined) {
      return `דף ${toHebrewNumeral(activeFilters.daf)}`;
    }
    if (activeFilters.categoryType === 'shulchanAruch' && activeFilters.simanId) {
      const section = shuSections.find((s) => s.id === activeFilters.shuSectionId);
      const siman = section?.simanim.find((s) => s.id === activeFilters.simanId);
      return siman ? `סימן ${toHebrewNumeral(siman.siman)}${siman.title ? ` – ${siman.title}` : ''}` : undefined;
    }
    return undefined;
  };

  const handleSubSubFilterSelect = (value: string) => {
    const current = getActiveSubSubFilterValue();
    if (activeFilters.categoryType === 'shas') {
      onFiltersChange({ ...activeFilters, daf: current === value ? undefined : Number(value) });
    } else if (activeFilters.categoryType === 'shulchanAruch') {
      onFiltersChange({ ...activeFilters, simanId: current === value ? undefined : value });
    }
    setSubComboboxOpen(false);
  };

  const showSubSubFilter =
    (activeFilters.categoryType === 'shas' && !!activeFilters.masechetId) ||
    (activeFilters.categoryType === 'shulchanAruch' && !!activeFilters.shuSectionId);

  const subFilterOptions = getSubFilterOptions();
  const activeSubFilterValue = getActiveSubFilterValue();
  const subSubFilterOptions = getSubSubFilterOptions();
  const activeSubSubFilterValue = getActiveSubSubFilterValue();

  return (
    <div className={cn('space-y-3', className)} dir="rtl">
      {/* Level 1 — category type */}
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

      {/* Level 2 — masechet / section / topic */}
      {activeFilters.categoryType && subFilterOptions.length > 0 && (
        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={comboboxOpen}
              className="filter-chip flex items-center gap-2 min-w-[180px] justify-between"
            >
              <span className="truncate">
                {getActiveSubFilterLabel() || SUB_FILTER_LABELS[activeFilters.categoryType]}
              </span>
              <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align="start" side="bottom">
            <Command dir="rtl">
              <CommandInput placeholder="חיפוש..." className="font-hebrew" />
              <CommandList className="max-h-[200px]">
                <CommandEmpty className="font-hebrew py-4 text-center text-sm text-muted-foreground">
                  לא נמצאו תוצאות
                </CommandEmpty>
                <CommandGroup>
                  {subFilterOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSubFilterSelect(option.value)}
                      className="font-hebrew flex items-center gap-2 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'w-4 h-4 shrink-0',
                          activeSubFilterValue === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Level 3 — daf (ש"ס) or siman (שו"ע) */}
      {showSubSubFilter && (
        <Popover open={subComboboxOpen} onOpenChange={setSubComboboxOpen}>
          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={subComboboxOpen}
              className="filter-chip flex items-center gap-2 min-w-[180px] justify-between"
            >
              <span className="truncate">
                {getActiveSubSubFilterLabel() ||
                  SUB_SUB_FILTER_LABELS[activeFilters.categoryType as 'shas' | 'shulchanAruch']}
              </span>
              <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start" side="bottom">
            <Command dir="rtl">
              <CommandInput placeholder="חיפוש..." className="font-hebrew" />
              <CommandList className="max-h-[200px]">
                <CommandEmpty className="font-hebrew py-4 text-center text-sm text-muted-foreground">
                  לא נמצאו תוצאות
                </CommandEmpty>
                <CommandGroup>
                  {subSubFilterOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSubSubFilterSelect(option.value)}
                      className="font-hebrew flex items-center gap-2 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'w-4 h-4 shrink-0',
                          activeSubSubFilterValue === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
