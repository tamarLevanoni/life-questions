'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/stores/user-store';
import { useToast } from '@/lib/toast-context';
import { profileEditSchema, type ProfileEditFormData, type Occupation } from '@/lib/schemas';
import type { UserData } from '@/lib/schemas';

export function useProfileForm(user: UserData | null) {
  const { showToast } = useToast();
  const { update: updateSession } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  const selectedOccupations = useWatch({ control, name: 'occupations' });
  const marketingConsent = useWatch({ control, name: 'marketingConsent' });

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

  const onSubmit = useCallback(async (data: ProfileEditFormData) => {
    setIsSaving(true);
    try {
      await useUserStore.getState().updateUser({
        ...data,
        institutionName: data.institutionName || null,
      });
      await updateSession();
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
  }, [updateSession, showToast]);

  const onSave = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);

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
    onSave,
    setValue,
    errors,
    selectedOccupations,
    marketingConsent,
    handleEdit,
    handleCancel,
    toggleOccupation,
  };
}
