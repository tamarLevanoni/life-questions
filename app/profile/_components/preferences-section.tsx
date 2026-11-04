'use client';

import { useId } from 'react';
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
  error?: string;
}

export function PreferencesSection({
  isEditing,
  user,
  marketingConsent,
  onConsentChange,
  error,
}: PreferencesSectionProps) {
  const consentId = useId();
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
              id={consentId}
              checked={marketingConsent}
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? `${consentId}-error` : undefined}
              onCheckedChange={(checked) => onConsentChange(checked === true)}
            />
            <Label htmlFor={consentId} className="text-sm font-hebrew cursor-pointer">
              אני מסכים לקבל עדכונים ותוכן שיווקי במייל (חובה)
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
                ? 'מסכים לקבל עדכונים ותוכן שיווקי במייל'
                : 'טרם ניתנה הסכמה לעדכונים ותוכן שיווקי במייל'}
            </p>
          </div>
        )}
      </div>
      {isEditing && error && (
        <p id={`${consentId}-error`} className="mt-2 text-sm text-destructive font-hebrew">{error}</p>
      )}
    </GlassCard>
  );
}
