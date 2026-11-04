import { GlassCard } from '@/components/ui/glass-card';

export function ProfileSkeleton() {
  return (
    <div role="status" aria-label="טוען פרופיל" className="motion-reduce:[&_.skeleton]:animate-none">
      <GlassCard variant="light" className="p-4 sm:p-5">
        <div aria-hidden="true">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="skeleton size-14 shrink-0 rounded-full" />
              <div className="skeleton h-7 w-32" />
            </div>
            <div className="skeleton h-11 w-full sm:w-32" />
          </div>

          <div className="mt-4 grid items-start gap-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="min-w-0 space-y-4">
              <div>
                <div className="skeleton mb-3 h-6 w-28" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className={index === 2 ? 'col-span-2' : index > 2 ? 'col-span-2 sm:col-span-1' : ''}>
                      <div className="skeleton mb-1.5 h-4 w-16" />
                      <div className="skeleton h-11 w-full border border-input" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="skeleton mb-2 h-6 w-20" />
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
            </div>

            <div className="min-w-0 space-y-4 border-t border-border pt-4 md:border-t-0 md:border-s md:pt-0 md:ps-5">
              <div>
                <div className="skeleton mb-2 h-6 w-20" />
                <div className="skeleton h-10 w-full" />
              </div>
              <div className="skeleton h-11 w-full" />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
