'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import type { UserData } from '@/lib/schemas';

interface PreferencesSectionProps {
  isEditing: boolean;
  user: UserData | null;
  marketingConsent: boolean;
  onConsentChange: (checked: boolean) => void;
}

export function PreferencesSection({
  isEditing,
  user,
  marketingConsent,
  onConsentChange,
}: PreferencesSectionProps) {
  return (
    <GlassCard variant="light" className="p-6">
      <h2 className="text-base font-semibold font-hebrew text-foreground mb-5 flex items-center gap-2">
        <Bell className="w-4 h-4 text-teal-500" />
        העדפות
      </h2>

      <div className="flex items-center gap-3">
        {isEditing ? (
          <>
            <Checkbox
              id="marketingConsent"
              checked={marketingConsent}
              onCheckedChange={(checked) => onConsentChange(checked === true)}
            />
            <Label htmlFor="marketingConsent" className="text-sm font-hebrew cursor-pointer">
              אני מעוניין לקבל עדכונים ותוכן חדש במייל
            </Label>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                user?.marketingConsent ? 'bg-teal-500 border-teal-500' : 'border-muted-foreground/40'
              }`}
            >
              {user?.marketingConsent && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1.5 5L4 7.5L8.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm font-hebrew">
              {user?.marketingConsent
                ? 'מסכים לקבל עדכונים ותוכן חדש במייל'
                : 'לא מסכים לקבל עדכונים במייל'}
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
