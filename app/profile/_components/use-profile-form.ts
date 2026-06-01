'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/lib/stores/user-store';
import { useToast } from '@/lib/toast-context';
import { profileEditSchema, type ProfileEditFormData, type Occupation } from '@/lib/schemas';
import type { UserData } from '@/lib/schemas';

export function useProfileForm(user: UserData | null) {
  const updateUser = useUserStore((s) => s.updateUser);
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
      institutionName: user?.institutionName ?? '',
      occupations: user?.occupations ?? [],
      marketingConsent: user?.marketingConsent ?? false,
    },
  });

  const selectedOccupations = watch('occupations');
  const marketingConsent = watch('marketingConsent');

  const handleEdit = () => {
    reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
      institutionName: user?.institutionName ?? '',
      occupations: user?.occupations ?? [],
      marketingConsent: user?.marketingConsent ?? false,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = async (data: ProfileEditFormData) => {
    setIsSaving(true);
    try {
      await updateUser({
        googleId: user?.googleId ?? '',
        ...data,
        institutionName: data.institutionName || undefined,
      });
      showToast('הפרטים עודכנו בהצלחה', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'שגיאה בשמירת הפרטים. אנא נסה שוב.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleOccupation = (occ: Occupation) => {
    const current = selectedOccupations ?? [];
    const updated = current.includes(occ)
      ? current.filter((o) => o !== occ)
      : [...current, occ];
    setValue('occupations', updated, { shouldValidate: true });
  };

  return {
    isEditing,
    isSaving,
    register,
    handleSubmit,
    setValue,
    errors,
    selectedOccupations,
    marketingConsent,
    handleEdit,
    handleCancel,
    onSubmit,
    toggleOccupation,
  };
}
