'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { useUserStore } from '@/lib/stores/user-store';
import { onboardingSchema, type OnboardingFormData, type Occupation } from '@/lib/schemas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const OCCUPATIONS: { value: Occupation; label: string }[] = [
  { value: 'dayyan', label: 'דיין' },
  { value: 'rabbi', label: 'רב' },
  { value: 'teacher', label: 'מורה' },
  { value: 'student', label: 'תלמיד' },
  { value: 'parent', label: 'הורה' },
  { value: 'learner', label: 'לומד' },
];

export function OnboardingModal() {
  const { isOnboardingModalOpen, closeOnboardingModal } = useAuth();
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const registerUser = useUserStore((s) => s.registerUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmLeaveOpen, setIsConfirmLeaveOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      institutionName: '',
      phone: '',
      occupations: [],
      marketingConsent: true,
    },
  });

  const handleSkip = () => {
    setIsConfirmLeaveOpen(true);
  };

  const selectedOccupations = watch('occupations');
  const marketingConsent = watch('marketingConsent');

  const toggleOccupation = (occupation: Occupation) => {
    const current = selectedOccupations || [];
    const updated = current.includes(occupation)
      ? current.filter((o) => o !== occupation)
      : [...current, occupation];
    setValue('occupations', updated, { shouldValidate: true });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      const created = await registerUser({
        googleId: session?.user?.id ?? '',
        email: session?.user?.email ?? '',
        ...data,
        institutionName: data.institutionName || undefined,
      });

      await update({
        backendUserId: created.id,
        firstName: created.firstName,
        lastName: created.lastName,
        institutionName: created.institutionName,
        phone: created.phone,
        occupations: created.occupations,
        marketingConsent: created.marketingConsent,
        isRegistrationComplete: true,
      });

      showToast('ההרשמה הושלמה בהצלחה!', 'success');
      closeOnboardingModal();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'שגיאה בשמירת הנתונים. אנא נסה שוב.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <AlertDialog open={isConfirmLeaveOpen} onOpenChange={setIsConfirmLeaveOpen}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-hebrew">לא ניתן להתחבר ללא השלמת הפרטים</AlertDialogTitle>
          <AlertDialogDescription className="font-hebrew">
            כדי להשתמש באתר יש להשלים את תהליך ההרשמה. אם תעזוב כעת תנותק מהמערכת.
            <br />
            האם אתה בטוח שברצונך לעזוב?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogCancel className="font-hebrew">חזור להרשמה</AlertDialogCancel>
          <AlertDialogAction
            className="font-hebrew bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            עזוב והתנתק
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Dialog open={isOnboardingModalOpen} onOpenChange={(open) => { if (!open) handleSkip(); }}>
      <DialogContent
        className="sm:max-w-lg border-black/10 dark:border-white/10 flex flex-col max-h-[90dvh]"
        dir="rtl"
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold font-hebrew">
            השלמת הרשמה
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-hebrew">
            ספר לנו קצת על עצמך כדי שנוכל להתאים את התוכן עבורך
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 overflow-y-auto overscroll-contain px-1">
          {/* שם פרטי */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="font-hebrew">שם פרטי</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              className="font-hebrew"
              placeholder="שם פרטי"
            />
            {errors.firstName && (
              <p className="text-sm text-destructive font-hebrew">{errors.firstName.message}</p>
            )}
          </div>

          {/* שם משפחה */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="font-hebrew">שם משפחה</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              className="font-hebrew"
              placeholder="שם משפחה"
            />
            {errors.lastName && (
              <p className="text-sm text-destructive font-hebrew">{errors.lastName.message}</p>
            )}
          </div>

          {/* שם מוסד */}
          <div className="space-y-2">
            <Label htmlFor="institutionName" className="font-hebrew">
              שם מוסד <span className="text-muted-foreground text-xs">(אופציונלי)</span>
            </Label>
            <Input
              id="institutionName"
              {...register('institutionName')}
              className="font-hebrew"
              placeholder="ישיבה, בית ספר, קהילה..."
            />
          </div>

          {/* טלפון */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-hebrew">טלפון</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className="font-hebrew"
              placeholder="050-0000000"
              dir="ltr"
            />
            {errors.phone && (
              <p className="text-sm text-destructive font-hebrew">{errors.phone.message}</p>
            )}
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
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Checkbox
                id="marketingConsent"
                checked={marketingConsent}
                onCheckedChange={(checked) =>
                  setValue('marketingConsent', checked === true, { shouldValidate: true })
                }
              />
              <Label htmlFor="marketingConsent" className="text-sm font-hebrew cursor-pointer">
                אני מעוניין לקבל עדכונים ותוכן חדש במייל
              </Label>
            </div>
            {errors.marketingConsent && (
              <p className="text-sm text-destructive font-hebrew">{errors.marketingConsent.message}</p>
            )}
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
    </>
  );
}
