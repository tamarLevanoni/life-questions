'use client';

import { cn } from '@/lib/utils';
import { X, ChevronsUpDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from '@/components/ui/command';

export interface FilterOption { value: string; label: string }

export function SearchCombobox({
  open, onOpenChange, label, icon, minWidth = 180,
  activeValue, onClear, options, onSelect, placeholder, popoverWidth,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  label: string; icon?: React.ReactNode; minWidth?: number;
  activeValue?: string; onClear: () => void;
  options: FilterOption[]; onSelect: (value: string) => void;
  placeholder: string; popoverWidth: string;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button role="combobox" aria-expanded={open}
          className="filter-chip flex items-center gap-2 justify-between"
          style={{ minWidth }}
        >
          <span className="flex items-center gap-2 truncate">
            {icon}
            <span className="truncate">{label}</span>
          </span>
          {activeValue ? (
            <X className="w-3.5 h-3.5 shrink-0 opacity-50 hover:opacity-100"
              onClick={(e) => { e.stopPropagation(); onClear(); }} />
          ) : (
            <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', popoverWidth)} align="start" side="bottom">
        <Command dir="rtl">
          <CommandInput placeholder={placeholder} className="font-hebrew" />
          <CommandList className="max-h-[220px]">
            <CommandEmpty className="font-hebrew py-4 text-center text-sm text-muted-foreground">
              לא נמצאו תוצאות
            </CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.value} value={opt.label} onSelect={() => onSelect(opt.value)}
                  className="font-hebrew flex items-center gap-2 cursor-pointer"
                >
                  <Check className={cn('w-4 h-4 shrink-0', activeValue === opt.value ? 'opacity-100' : 'opacity-0')} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
