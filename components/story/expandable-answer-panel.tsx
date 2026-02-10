'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ExpandableAnswerPanelProps } from '@/lib/types';
import { ChevronDown, Lock, Eye, EyeOff } from 'lucide-react';

export function ExpandableAnswerPanel({
  title,
  content,
  variant,
  isLocked = false,
  defaultExpanded = false,
  onRequestAccess,
}: ExpandableAnswerPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (isLocked) {
      onRequestAccess?.();
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const panelClass = variant === 'shortAnswer'
    ? 'answer-panel-short'
    : 'answer-panel-expansion';

  const variantLabel = variant === 'shortAnswer'
    ? 'תשובה קצרה'
    : 'הרחבה';

  const Icon = isExpanded ? EyeOff : Eye;

  return (
    <div
      className={cn(
        'answer-panel overflow-hidden',
        panelClass,
        'font-hebrew'
      )}
      dir="rtl"
    >
      {/* Header - clickable to expand/collapse */}
      <button
        onClick={handleToggle}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'text-right transition-colors',
          'hover:bg-white/30 dark:hover:bg-white/5',
          isLocked && 'cursor-pointer'
        )}
        aria-expanded={isExpanded}
        aria-controls={`panel-content-${variant}`}
      >
        <div className="flex items-center gap-3">
          {isLocked ? (
            <Lock className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Icon className="w-5 h-5 text-muted-foreground" />
          )}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">
              {title || variantLabel}
            </span>
            {isLocked && (
              <span className="text-xs text-muted-foreground">
                יש להתחבר כדי לצפות
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={cn(
            'w-5 h-5 text-muted-foreground transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Content - expandable */}
      <div
        id={`panel-content-${variant}`}
        className={cn(
          'collapsible-content',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
        data-state={isExpanded ? 'open' : 'closed'}
      >
        {!isLocked && (
          <div className="px-4 pb-4 pt-0">
            <div className="h-px bg-border mb-4" />
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        )}
      </div>

      {/* Lock overlay for premium content */}
      {isLocked && isExpanded && (
        <div className="px-4 pb-4">
          <div className="relative p-6 rounded-lg bg-muted/50 text-center">
            <Lock className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              תוכן זה זמין למשתמשים רשומים
            </p>
            <button
              onClick={onRequestAccess}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              התחברות
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
