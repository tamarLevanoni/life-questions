'use client';

import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';

export function FilterSectionHeader({
  label, count, isOpen, onToggle,
}: {
  label: string; count: number; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-2 text-sm font-medium font-hebrew"
    >
      <span className="flex items-center gap-2">
        {label}
        {count > 0 && (
          <span className="text-[10px] bg-primary text-primary-foreground rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            {count}
          </span>
        )}
      </span>
      <ChevronUp className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', !isOpen && 'rotate-180')} />
    </button>
  );
}
