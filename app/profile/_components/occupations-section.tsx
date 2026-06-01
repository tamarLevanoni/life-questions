'use client';

import { GlassCard } from '@/components/ui/glass-card';
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
    <GlassCard variant="light" className="p-6">
      <h2 className="text-base font-semibold font-hebrew text-foreground mb-5 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-teal-500" />
        עיסוקים
      </h2>

      {isEditing ? (
        <>
          <div className="flex flex-wrap gap-2">
            {OCCUPATIONS.map(({ value, label }) => {
              const isSelected = selectedOccupations?.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onToggle(value)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium font-hebrew transition-all',
                    isSelected
                      ? 'bg-gradient-to-l from-[#14B8A6] to-[#00C2FF] text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {error && <p className="text-xs text-destructive font-hebrew mt-2">{error}</p>}
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
    </GlassCard>
  );
}

export { OCCUPATIONS };
