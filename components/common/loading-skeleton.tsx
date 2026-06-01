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
}

/** GlassCard shimmer list – for profile loading state */
export function SkeletonCardList({ count = 3 }: SkeletonCardListProps) {
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
