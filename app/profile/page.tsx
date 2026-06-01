'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppHeader } from '@/components/layout/app-header';
import { useUserStore } from '@/lib/stores/user-store';
import { useToast } from '@/lib/toast-context';
import { profileEditSchema, type ProfileEditFormData, type Occupation } from '@/lib/schemas';
import { ProfileSkeleton } from './_components/profile-skeleton';
import { ProfileHeroCard } from './_components/profile-hero-card';
import { PersonalInfoSection } from './_components/personal-info-section';
import { OccupationsSection } from './_components/occupations-section';
import { PreferencesSection } from './_components/preferences-section';
import { AccountSection } from './_components/account-section';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = useUserStore((s) => s.user);
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

  if (status === 'loading' || (status === 'authenticated' && !user)) {
    return <ProfileSkeleton />;
  }

  if (status === 'unauthenticated') {
    redirect('/');
  }

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'משתמש';
  const initials = (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '') || 'U';
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

  return (
    <>
      <AppHeader />
      <main dir="rtl" className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-5">
          <ProfileHeroCard
            fullName={fullName}
            initials={initials}
            email={user?.email}
            avatarUrl={session?.user?.image ?? undefined}
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={handleEdit}
            onSave={handleSubmit(onSubmit)}
            onCancel={handleCancel}
          />

          <PersonalInfoSection
            isEditing={isEditing}
            user={user}
            register={register}
            errors={errors}
          />

          <OccupationsSection
            isEditing={isEditing}
            user={user}
            selectedOccupations={selectedOccupations}
            error={errors.occupations?.message as string | undefined}
            onToggle={toggleOccupation}
          />

          <PreferencesSection
            isEditing={isEditing}
            user={user}
            marketingConsent={marketingConsent}
            onConsentChange={(checked) =>
              setValue('marketingConsent', checked, { shouldValidate: true })
            }
          />

          <AccountSection />
        </div>
      </main>
    </>
  );
}
