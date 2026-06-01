'use client';

import { cn } from '@/lib/utils';
import { Square, CheckSquare } from 'lucide-react';
import type { FilterOption } from './search-combobox';

export function SearchComboboxList({
  options, isMulti, activeValue, activeValues, onSelect, searchable, search, onSearchChange, placeholder,
}: {
  options: FilterOption[];
  isMulti: boolean;
  activeValue?: string;
  activeValues?: string[];
  onSelect: (value: string) => void;
  searchable: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  placeholder: string;
}) {
  const filtered = search ? options.filter((o) => o.label.includes(search)) : options;

  return (
    <div dir="rtl" className="flex flex-col gap-0.5">
      {searchable && (
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm font-hebrew bg-transparent border-b border-border outline-none placeholder:text-muted-foreground mb-1"
        />
      )}
      <div className="max-h-[220px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground font-hebrew">לא נמצאו תוצאות</p>
        ) : (
          filtered.map((opt) => {
            const isChecked = isMulti ? activeValues?.includes(opt.value) : activeValue === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm rounded-md w-full transition-colors hover:bg-accent font-hebrew',
                  !isMulti && isChecked && 'bg-primary/10 text-primary font-medium'
                )}
              >
                {isMulti && (
                  isChecked
                    ? <CheckSquare className="w-4 h-4 shrink-0 text-primary" />
                    : <Square className="w-4 h-4 shrink-0 text-muted-foreground/50" />
                )}
                {opt.label}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
