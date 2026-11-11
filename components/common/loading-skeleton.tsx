import { GlassCard } from '@/components/ui/glass-card';

interface SkeletonLinesProps {
  count?: number;
}

/** Simple shimmer lines – for story/search loading states */
export function SkeletonLines({ count = 4 }: SkeletonLinesProps) {
  const heights = ['h-8', 'h-32', 'h-24', 'h-16', 'h-12', 'h-20'];
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton w-full ${heights[i % heights.length]}`} />
      ))}
    </div>
  );
}

interface SkeletonCardListProps {
  count?: number;
  variant?: 'profile' | 'search';
}

/** GlassCard shimmer list – for profile loading state */
export function SkeletonCardList({ count = 3, variant = 'profile' }: SkeletonCardListProps) {
  if (variant === 'search') {
    return (
      <div data-search-skeleton aria-hidden="true" className="grid gap-1.5 md:gap-3" dir="rtl">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="rounded-[0.625rem] border border-border bg-card p-2 shadow-sm md:rounded-2xl md:px-4 md:py-3 motion-safe:animate-pulse">
            <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-2">
              <div className="h-3 w-40 max-w-2/3 rounded bg-muted" />
              <div className="h-3 w-10 rounded-full bg-muted" />
            </div>
            <div className="mb-2 h-4 w-2/3 rounded bg-muted" />
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-4/5 rounded bg-muted" />
            </div>
            <div className="mt-2 flex gap-2">
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <GlassCard variant="light" className="p-8 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-40 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-52 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </GlassCard>
      {Array.from({ length: count }).map((_, i) => (
        <GlassCard key={i} variant="light" className="p-6 animate-pulse space-y-4">
          <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
        </GlassCard>
      ))}
    </div>
  );
}
