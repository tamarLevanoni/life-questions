'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type BadgeVariant =
  | 'primary'
  | 'muted'
  | 'outline'
  | 'teal'
  | 'source-shas'
  | 'source-shu'
  | 'concept';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: LucideIcon;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary:
    'bg-primary/10 text-primary border border-primary/20',
  muted:
    'bg-muted text-muted-foreground border border-border',
  outline:
    'border border-border text-muted-foreground',
  teal:
    'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-700/40',
  'source-shas':
    'bg-muted text-muted-foreground',
  'source-shu':
    'bg-muted text-muted-foreground',
  concept:
    'border border-border text-muted-foreground',
};

export function Badge({ children, variant = 'muted', icon: Icon, onRemove, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-hebrew',
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon className="w-2.5 h-2.5 shrink-0" />}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:opacity-60 transition-opacity"
          aria-label="הסר"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
