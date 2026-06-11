'use client';

import { useUserStore } from '@/lib/stores/user-store';
import { ProfileSkeleton } from './profile-skeleton';
import { ProfileHeroCard } from './profile-hero-card';
import { PersonalInfoSection } from './personal-info-section';
import { OccupationsSection } from './occupations-section';
import { PreferencesSection } from './preferences-section';
import { AccountSection } from './account-section';
import { useProfileForm } from './use-profile-form';

export function ProfileView() {
  const user = useUserStore((s) => s.user);
  const image = useUserStore((s) => s.image);

  const form = useProfileForm(user);

  if (!user) return <ProfileSkeleton />;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'משתמש';
  const initials = (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '') || 'U';

  return (
    <div className="space-y-5">
      <ProfileHeroCard
        fullName={fullName}
        initials={initials}
        email={user.email}
        avatarUrl={image ?? undefined}
        isEditing={form.isEditing}
        isSaving={form.isSaving}
        onEdit={form.handleEdit}
        onSave={form.onSave}
        onCancel={form.handleCancel}
      />

      <PersonalInfoSection
        isEditing={form.isEditing}
        user={user}
        register={form.register}
        errors={form.errors}
      />

      <OccupationsSection
        isEditing={form.isEditing}
        user={user}
        selectedOccupations={form.selectedOccupations}
        error={form.errors.occupations?.message as string | undefined}
        onToggle={form.toggleOccupation}
      />

      <PreferencesSection
        isEditing={form.isEditing}
        user={user}
        marketingConsent={form.marketingConsent}
        onConsentChange={(checked) =>
          form.setValue('marketingConsent', checked, { shouldValidate: true })
        }
      />

      <AccountSection />
    </div>
  );
}
