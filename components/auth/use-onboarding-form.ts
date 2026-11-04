'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWhatsAppInvite } from '@/lib/whatsapp-context';
import { useToast } from '@/lib/toast-context';
import { useUserStore } from '@/lib/stores/user-store';
import { onboardingSchema, type OnboardingFormData, type Occupation } from '@/lib/schemas';

export function useOnboardingForm(closeOnboardingModal: () => void) {
  const { openWhatsAppModal } = useWhatsAppInvite();
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const registerUser = useUserStore((s) => s.registerUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      institutionName: '',
      phone: '',
      occupations: [],
      marketingConsent: false,
    },
  });

  const selectedOccupations = useWatch({ control, name: 'occupations' });
  const marketingConsent = useWatch({ control, name: 'marketingConsent' });

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
      await registerUser({
        googleId: session?.user?.googleId ?? '',
        email: session?.user?.email ?? '',
        ...data,
        institutionName: data.institutionName || undefined,
      });

      await update();

      showToast('ההרשמה הושלמה בהצלחה!', 'success');
      closeOnboardingModal();
      setTimeout(() => openWhatsAppModal(), 400);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'שגיאה בשמירת הנתונים. אנא נסה שוב.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { register, submit: handleSubmit(onSubmit), setValue, errors, isSubmitting, selectedOccupations, marketingConsent, toggleOccupation };
}
