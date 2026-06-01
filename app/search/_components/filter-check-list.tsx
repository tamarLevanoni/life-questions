'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Square, CheckSquare } from 'lucide-react';

export function FilterCheckList({
  options, selected, onToggle, maxHeight = 'max-h-48', searchable = false,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  maxHeight?: string;
  searchable?: boolean;
}) {
  const [search, setSearch] = useState('');
  const filtered = search ? options.filter((o) => o.label.includes(search)) : options;

  return (
    <div className="flex flex-col gap-0.5">
      {searchable && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש..."
          className="w-full px-2 py-1.5 mb-1 text-xs font-hebrew bg-muted/40 border border-border rounded-md outline-none placeholder:text-muted-foreground"
        />
      )}
      <div className={cn('overflow-y-auto', maxHeight)}>
        {filtered.map((opt) => {
          const isChecked = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => onToggle(opt.value)}
              className="flex items-center gap-2 w-full px-1 py-1.5 rounded-md text-sm font-hebrew text-right hover:bg-accent transition-colors"
            >
              {isChecked
                ? <CheckSquare className="w-4 h-4 shrink-0 text-primary" />
                : <Square className="w-4 h-4 shrink-0 text-muted-foreground/40" />
              }
              <span className={cn('truncate', isChecked && 'text-primary font-medium')}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
