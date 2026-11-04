'use client';

import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Occupation } from '@/lib/schemas';
import type { UserData } from '@/lib/schemas';

const OCCUPATIONS: { value: Occupation; label: string }[] = [
  { value: 'dayyan', label: 'דיין' },
  { value: 'rabbi', label: 'רב' },
  { value: 'teacher', label: 'מורה' },
  { value: 'student', label: 'תלמיד' },
  { value: 'parent', label: 'הורה' },
  { value: 'learner', label: 'לומד' },
];

interface OccupationsSectionProps {
  isEditing: boolean;
  user: UserData | null;
  selectedOccupations: Occupation[] | undefined;
  error?: string;
  onToggle: (occ: Occupation) => void;
}

export function OccupationsSection({
  isEditing,
  user,
  selectedOccupations,
  error,
  onToggle,
}: OccupationsSectionProps) {
  return (
    <section aria-labelledby="occupations-heading">
      <h2 id="occupations-heading" className="text-base font-semibold font-hebrew text-foreground mb-2 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-teal-500" />
        עיסוקים
      </h2>

      {isEditing ? (
        <>
          <div role="group" aria-labelledby="occupations-heading" aria-describedby={error ? 'occupations-error' : undefined} className="flex flex-wrap gap-2">
            {OCCUPATIONS.map(({ value, label }) => {
              const isSelected = selectedOccupations?.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={!!isSelected}
                  onClick={() => onToggle(value)}
                  className={cn(
                    'min-h-11 px-4 py-2 rounded-full text-sm font-medium font-hebrew transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                    isSelected
                      ? 'bg-linear-to-l from-brand-teal to-brand-blue text-brand-dark shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {error && <p id="occupations-error" className="text-xs text-destructive font-hebrew mt-2">{error}</p>}
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          {user?.occupations && user.occupations.length > 0 ? (
            user.occupations.map((occ) => {
              const label = OCCUPATIONS.find((o) => o.value === occ)?.label ?? occ;
              return (
                <Badge key={occ} variant="teal">
                  {label}
                </Badge>
              );
            })
          ) : (
            <p className="text-muted-foreground text-sm font-hebrew">לא צוינו עיסוקים</p>
          )}
        </div>
      )}
    </section>
  );
}

export { OCCUPATIONS };
