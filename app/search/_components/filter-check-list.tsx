'use client';

import { useId, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FilterCheckListProps {
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  listClassName?: string;
  searchable?: boolean;
  label: string;
}

export function FilterCheckList({ options, selected, onToggle, listClassName = 'max-h-80', searchable = false, label }: FilterCheckListProps) {
  const [search, setSearch] = useState('');
  const listId = useId();
  const filtered = search ? options.filter((option) => option.label.includes(search)) : options;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {searchable && (
        <div className="relative m-1.5">
          <Input
            aria-label={`סינון ${label}`} value={search} placeholder="חפש נושא..."
            onChange={(event) => setSearch(event.target.value)}
            className="h-6.5 rounded-[0.375rem] border-border bg-muted/40 px-2 text-[0.6875rem] leading-(--text-xs--line-height) md:h-8 md:rounded-lg md:text-sm md:leading-(--text-sm--line-height)"
          />
        </div>
      )}
      <div role="group" aria-label={label} className={cn('overflow-y-auto overscroll-contain', listClassName)}>
        {!filtered.length && <p className="px-3 py-6 text-center text-xs text-muted-foreground">לא נמצאו {label}</p>}
        {filtered.map((option, index) => {
          const checked = selected.includes(option.value);
          const id = `${listId}-${index}`;
          return (
            <Label key={option.value} htmlFor={id} className={cn(
              'relative flex min-h-7 cursor-pointer items-center gap-1.5 border-b border-border/40 px-1.5 py-1 text-[0.6875rem] font-normal leading-[1.3] transition-colors hover:bg-muted/60 md:min-h-8 md:gap-2 md:px-3 md:py-1.5 md:text-xs md:font-medium md:leading-relaxed',
              checked && 'bg-primary/5 text-primary'
            )}>
              <Checkbox id={id} className="size-3.5 [&_svg]:size-3" checked={checked} onCheckedChange={() => onToggle(option.value)} />
              <span title={option.label} className="line-clamp-2 min-w-0 flex-1 break-words">{option.label}</span>
            </Label>
          );
        })}
      </div>
    </div>
  );
}
