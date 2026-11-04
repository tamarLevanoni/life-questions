'use client';

import { useId } from 'react';
import { signOut } from 'next-auth/react';
import { Bell, LogOut, Pencil, Save, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/lib/stores/user-store';
import { GlassCard } from '@/components/ui/glass-card';
import { ProfileSkeleton } from './profile-skeleton';
import { PersonalInfoSection } from './personal-info-section';
import { OccupationsSection } from './occupations-section';
import { useProfileForm } from './use-profile-form';

export function ProfileView() {
  const user = useUserStore((s) => s.user);
  const image = useUserStore((s) => s.image);

  const form = useProfileForm(user);
  const consentId = useId();
  const consentError = form.errors.marketingConsent?.message;

  if (!user) return <ProfileSkeleton />;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'משתמש';
  const initials = (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '') || 'U';

  return (
    <GlassCard variant="light" className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar className="size-14 shrink-0">
            <AvatarImage src={image ?? ''} alt={fullName} />
            <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-teal-400 to-blue-400 text-white">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h1 className="break-words text-xl font-bold font-hebrew text-foreground">
              {fullName}
            </h1>
          </div>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          {!form.isEditing ? (
            <Button variant="outline" className="min-h-11 flex-1 gap-2 font-hebrew hover:bg-muted hover:text-foreground sm:flex-none" onClick={form.handleEdit}>
              <Pencil className="w-4 h-4" />
              עריכת פרטים
            </Button>
          ) : (
            <>
              <Button
                className="min-h-11 flex-1 gap-2 font-hebrew sm:flex-none"
                onClick={form.onSave}
                disabled={form.isSaving}
              >
                <Save className="w-4 h-4" />
                {form.isSaving ? 'שומר...' : 'שמירה'}
              </Button>
              <Button
                variant="ghost"
                className="min-h-11 flex-1 gap-2 font-hebrew hover:bg-muted hover:text-foreground sm:flex-none"
                onClick={form.handleCancel}
                disabled={form.isSaving}
              >
                <X className="w-4 h-4" />
                ביטול
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 grid items-start gap-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0 space-y-4">
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
        </div>

        <div className="min-w-0 space-y-4 border-t border-border pt-4 md:border-t-0 md:border-s md:pt-0 md:ps-5">
          <section aria-labelledby="preferences-heading">
            <h2 id="preferences-heading" className="text-base font-semibold font-hebrew text-foreground mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-500" />
              העדפות
            </h2>

            <div className="flex items-center gap-3">
              {form.isEditing ? (
                <>
                  <Checkbox
                    id={consentId}
                    checked={form.marketingConsent}
                    aria-required="true"
                    aria-invalid={!!consentError}
                    aria-describedby={consentError ? `${consentId}-error` : undefined}
                    onCheckedChange={(checked) => form.setValue('marketingConsent', checked === true, { shouldValidate: true })}
                  />
                  <Label htmlFor={consentId} className="min-h-11 text-sm leading-relaxed font-hebrew cursor-pointer">
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
            {form.isEditing && consentError && (
              <p id={`${consentId}-error`} className="mt-2 text-sm text-destructive font-hebrew">{consentError}</p>
            )}
          </section>
          <Button
            variant="outline"
            className="min-h-11 w-full gap-2 font-hebrew text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive hover:border-destructive"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="w-4 h-4" />
            יציאה מהחשבון
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
