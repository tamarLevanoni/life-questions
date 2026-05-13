'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps, CategoryType } from '@/lib/types';
import { useReferenceStore } from '@/lib/stores/reference-store';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import { X, BookOpen, Scale, Lightbulb, ChevronsUpDown, Check, Loader2 } from 'lucide-react';
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
  concepts: 'בחרו מושג...',
};

const SUB_SUB_FILTER_LABELS: Record<'shas' | 'shulchanAruch', string> = {
  shas: 'בחרו דף...',
  shulchanAruch: 'בחרו סימן...',
};

export function CategoryFilterBar({
  masechtot,
  shuSections,
  concepts,
  activeFilters,
  onFiltersChange,
  className,
}: CategoryFilterBarProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [subComboboxOpen, setSubComboboxOpen] = useState(false);

  const { masechetPages, masechetPagesLoading, loadMasechetPages } = useReferenceStore();

  useEffect(() => {
    if (activeFilters.categoryType === 'shas' && activeFilters.masechetId) {
      loadMasechetPages(activeFilters.masechetId);
    }
  }, [activeFilters.categoryType, activeFilters.masechetId, loadMasechetPages]);

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
    activeFilters.concept ||
    activeFilters.simanId ||
    activeFilters.daf !== undefined;

  // ── Level 2 (masechet / section / concept) ─────────────────────────────────

  const getSubFilterOptions = (): FilterOption[] => {
    switch (activeFilters.categoryType) {
      case 'shas':
        return masechtot.map((m) => ({ value: m.id, label: m.name }));
      case 'shulchanAruch':
        return shuSections.map((s) => ({ value: s.id, label: s.name }));
      case 'concepts':
        return concepts.map((c) => ({ value: c, label: c }));
      default:
        return [];
    }
  };

  const getActiveSubFilterValue = (): string | undefined => {
    switch (activeFilters.categoryType) {
      case 'shas': return activeFilters.masechetId;
      case 'shulchanAruch': return activeFilters.shuSectionId;
      case 'concepts': return activeFilters.concept;
      default: return undefined;
    }
  };

  const getActiveSubFilterLabel = (): string | undefined => {
    switch (activeFilters.categoryType) {
      case 'shas': return masechtot.find((m) => m.id === activeFilters.masechetId)?.name;
      case 'shulchanAruch': return shuSections.find((s) => s.id === activeFilters.shuSectionId)?.name;
      case 'concepts': return activeFilters.concept;
      default: return undefined;
    }
  };

  const handleSubFilterSelect = (value: string) => {
    const current = getActiveSubFilterValue();
    const next = current === value ? undefined : value;
    switch (activeFilters.categoryType) {
      case 'shas':
        onFiltersChange({ ...activeFilters, masechetId: next, daf: undefined, amud: undefined });
        break;
      case 'shulchanAruch':
        onFiltersChange({ ...activeFilters, shuSectionId: next, simanId: undefined });
        break;
      case 'concepts':
        onFiltersChange({ ...activeFilters, concept: next });
        break;
    }
    setComboboxOpen(false);
  };

  // ── Level 3 (daf / siman) ──────────────────────────────────────────────────

  const getSubSubFilterOptions = (): FilterOption[] => {
    if (activeFilters.categoryType === 'shas' && activeFilters.masechetId) {
      const pages = masechetPages[activeFilters.masechetId] ?? [];
      return pages.map((p) => ({
        value: `${p.daf}_${p.amud}`,
        label: `דף ${toHebrewNumeral(p.daf)} ${p.amud === 'a' ? 'ע"א' : 'ע"ב'}`,
      }));
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
      return `${activeFilters.daf}_${activeFilters.amud ?? 'a'}`;
    }
    if (activeFilters.categoryType === 'shulchanAruch') return activeFilters.simanId;
    return undefined;
  };

  const getActiveSubSubFilterLabel = (): string | undefined => {
    if (activeFilters.categoryType === 'shas' && activeFilters.daf !== undefined) {
      return `דף ${toHebrewNumeral(activeFilters.daf)} ${activeFilters.amud === 'b' ? 'ע"ב' : 'ע"א'}`;
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
      if (current === value) {
        onFiltersChange({ ...activeFilters, daf: undefined, amud: undefined });
      } else {
        const [dafStr, amudStr] = value.split('_');
        onFiltersChange({ ...activeFilters, daf: Number(dafStr), amud: amudStr as 'a' | 'b' });
      }
    } else if (activeFilters.categoryType === 'shulchanAruch') {
      onFiltersChange({ ...activeFilters, simanId: current === value ? undefined : value });
    }
    setSubComboboxOpen(false);
  };

  const showSubSubFilter =
    (activeFilters.categoryType === 'shas' && !!activeFilters.masechetId) ||
    (activeFilters.categoryType === 'shulchanAruch' && !!activeFilters.shuSectionId);

  const isSubSubLoading =
    activeFilters.categoryType === 'shas' &&
    !!activeFilters.masechetId &&
    !!masechetPagesLoading[activeFilters.masechetId];

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

      {/* Level 2 — masechet / section / concept */}
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
              disabled={isSubSubLoading}
              className="filter-chip flex items-center gap-2 min-w-[180px] justify-between disabled:opacity-60"
            >
              {isSubSubLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span className="truncate font-hebrew">טוען...</span>
                </>
              ) : (
                <>
                  <span className="truncate">
                    {getActiveSubSubFilterLabel() ||
                      SUB_SUB_FILTER_LABELS[activeFilters.categoryType as 'shas' | 'shulchanAruch']}
                  </span>
                  <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
                </>
              )}
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
