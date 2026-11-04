'use client';
import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { useOnboardingForm } from './use-onboarding-form';
import type { Occupation } from '@/lib/schemas';

const OCCUPATIONS: { value: Occupation; label: string }[] = [
  { value: 'dayyan', label: 'דיין' }, { value: 'rabbi', label: 'רב' },
  { value: 'teacher', label: 'מורה' }, { value: 'student', label: 'תלמיד' },
  { value: 'parent', label: 'הורה' }, { value: 'learner', label: 'לומד' },
];
export function OnboardingForm({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const form = useOnboardingForm(onComplete);
  const consentId = useId();
  const occupationErrorId = useId();
  return (
    <form onSubmit={form.submit} noValidate className="mt-4 space-y-5 overflow-y-auto overscroll-contain px-1">
      <FormField label="שם פרטי" error={form.errors.firstName?.message}>
        <Input {...form.register('firstName')} autoComplete="given-name" className="font-hebrew" placeholder="שם פרטי" />
      </FormField>
      <FormField label="שם משפחה" error={form.errors.lastName?.message}>
        <Input {...form.register('lastName')} autoComplete="family-name" className="font-hebrew" placeholder="שם משפחה" />
      </FormField>
      <FormField label="שם מוסד (אופציונלי)" error={form.errors.institutionName?.message}>
        <Input {...form.register('institutionName')} autoComplete="organization" className="font-hebrew" placeholder="ישיבה, בית ספר, קהילה..." />
      </FormField>
      <FormField label="טלפון" error={form.errors.phone?.message}>
        <Input {...form.register('phone')} type="tel" autoComplete="tel" className="font-hebrew" placeholder="050-0000000" dir="ltr" />
      </FormField>
      <fieldset className="space-y-2" aria-describedby={form.errors.occupations ? occupationErrorId : undefined}>
        <legend className="font-hebrew">עיסוק</legend>
        <div className="flex flex-wrap gap-2">
          {OCCUPATIONS.map(({ value, label }) => (
            <button key={value} type="button" aria-pressed={form.selectedOccupations?.includes(value) ?? false}
              onClick={() => form.toggleOccupation(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium font-hebrew transition-colors ${form.selectedOccupations?.includes(value) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {label}
            </button>
          ))}
        </div>
        {form.errors.occupations && <p id={occupationErrorId} className="text-sm text-destructive font-hebrew">{form.errors.occupations.message}</p>}
      </fieldset>
      <div className="flex items-center gap-3">
        <Checkbox id={consentId} checked={form.marketingConsent}
          aria-required="true"
          aria-invalid={!!form.errors.marketingConsent} aria-describedby={form.errors.marketingConsent ? `${consentId}-error` : undefined}
          onCheckedChange={checked => form.setValue('marketingConsent', checked === true, { shouldValidate: true })} />
        <Label htmlFor={consentId} className="text-sm font-hebrew cursor-pointer">אני מסכים לקבל עדכונים ותוכן שיווקי במייל (חובה)</Label>
      </div>
      {form.errors.marketingConsent && <p id={`${consentId}-error`} className="text-sm text-destructive font-hebrew">{form.errors.marketingConsent.message}</p>}
      <button type="submit" disabled={form.isSubmitting} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium font-hebrew hover:opacity-90 transition-opacity disabled:opacity-50">
        {form.isSubmitting ? 'שומר...' : 'סיום הרשמה'}
      </button>
      <button type="button" onClick={onSkip} className="w-full py-2 text-sm text-muted-foreground font-hebrew hover:text-foreground transition-colors">דלג לעת עתה</button>
    </form>
  );
}
