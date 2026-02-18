'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { Occupation } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const OCCUPATIONS: { value: Occupation; label: string }[] = [
  { value: 'דיין', label: 'דיין' },
  { value: 'רב', label: 'רב' },
  { value: 'מורה', label: 'מורה' },
  { value: 'תלמיד', label: 'תלמיד' },
  { value: 'הורה', label: 'הורה' },
  { value: 'לומד', label: 'לומד' },
];

const onboardingSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  phone: z.string().optional(),
  occupations: z.array(z.string()).min(1, 'יש לבחור לפחות עיסוק אחד'),
  marketingConsent: z.boolean(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function OnboardingModal() {
  const { isOnboardingModalOpen, closeOnboardingModal } = useAuth();
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: session?.user?.name || '',
      phone: '',
      occupations: [],
      marketingConsent: false,
    },
  });

  const handleSkip = async () => {
    // זמני: דילוג על אונבורדינג עד שיהיה שרת
    await update({ isRegistrationComplete: true });
    closeOnboardingModal();
  };

  const selectedOccupations = watch('occupations');
  const marketingConsent = watch('marketingConsent');

  const toggleOccupation = (occupation: string) => {
    const current = selectedOccupations || [];
    const updated = current.includes(occupation)
      ? current.filter((o) => o !== occupation)
      : [...current, occupation];
    setValue('occupations', updated, { shouldValidate: true });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      await update({
        name: data.name,
        phone: data.phone || undefined,
        occupations: data.occupations,
        marketingConsent: data.marketingConsent,
        isRegistrationComplete: true,
      });
      showToast('ההרשמה הושלמה בהצלחה!', 'success');
      closeOnboardingModal();
    } catch {
      showToast('שגיאה בשמירת הנתונים. אנא נסה שוב.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOnboardingModalOpen} onOpenChange={(open) => { if (!open) handleSkip(); }}>
      <DialogContent
        className="sm:max-w-lg glass-panel border-black/10 dark:border-white/10"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-hebrew">
            השלמת הרשמה
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-hebrew">
            ספר לנו קצת על עצמך כדי שנוכל להתאים את התוכן עבורך
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
          {/* שם */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-hebrew">שם מלא</Label>
            <Input
              id="name"
              {...register('name')}
              className="font-hebrew"
              placeholder="השם שלך"
            />
            {errors.name && (
              <p className="text-sm text-destructive font-hebrew">{errors.name.message}</p>
            )}
          </div>

          {/* טלפון */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-hebrew">
              טלפון <span className="text-muted-foreground text-xs">(אופציונלי)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className="font-hebrew"
              placeholder="050-0000000"
              dir="ltr"
            />
          </div>

          {/* עיסוקים */}
          <div className="space-y-2">
            <Label className="font-hebrew">עיסוק</Label>
            <div className="flex flex-wrap gap-2">
              {OCCUPATIONS.map(({ value, label }) => {
                const isSelected = selectedOccupations?.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleOccupation(value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium font-hebrew transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {errors.occupations && (
              <p className="text-sm text-destructive font-hebrew">{errors.occupations.message}</p>
            )}
          </div>

          {/* הסכמה שיווקית */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="marketingConsent"
              checked={marketingConsent}
              onCheckedChange={(checked) =>
                setValue('marketingConsent', checked === true)
              }
            />
            <Label htmlFor="marketingConsent" className="text-sm font-hebrew cursor-pointer">
              אני מעוניין לקבל עדכונים ותוכן חדש במייל
            </Label>
          </div>

          {/* כפתורי שליחה ודילוג */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium font-hebrew hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'שומר...' : 'סיום הרשמה'}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2 text-sm text-muted-foreground font-hebrew hover:text-foreground transition-colors"
          >
            דלג לעת עתה
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
