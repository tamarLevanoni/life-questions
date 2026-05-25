'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { GlassCard } from '@/components/ui/glass-card';
import { AppHeader } from '@/components/layout/app-header';
import { useUserStore } from '@/lib/stores/user-store';
import { useToast } from '@/lib/toast-context';
import {
  profileEditSchema,
  type ProfileEditFormData,
  type Occupation,
} from '@/lib/schemas';
import {
  User,
  Mail,
  Phone,
  Building2,
  Bell,
  Briefcase,
  Pencil,
  X,
  Save,
  LogOut,
  Lock,
} from 'lucide-react';

const OCCUPATIONS: { value: Occupation; label: string }[] = [
  { value: 'dayyan', label: 'דיין' },
  { value: 'rabbi', label: 'רב' },
  { value: 'teacher', label: 'מורה' },
  { value: 'student', label: 'תלמיד' },
  { value: 'parent', label: 'הורה' },
  { value: 'learner', label: 'לומד' },
];

function ProfileSkeleton() {
  return (
    <>
      <AppHeader />
      <main dir="rtl" className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-5">
          <GlassCard variant="light" className="p-8 animate-pulse">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-7 w-40 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-52 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </GlassCard>
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} variant="light" className="p-6 animate-pulse space-y-4">
              <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
            </GlassCard>
          ))}
        </div>
      </main>
    </>
  );
}

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

  const toggleOccupation = (occ: Occupation) => {
    const current = selectedOccupations ?? [];
    const updated = current.includes(occ)
      ? current.filter((o) => o !== occ)
      : [...current, occ];
    setValue('occupations', updated, { shouldValidate: true });
  };

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
      showToast(err instanceof Error ? err.message : 'שגיאה בשמירת הפרטים. אנא נסה שוב.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main dir="rtl" className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* ─── Hero Card ─── */}
          <GlassCard variant="light" className="relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-[#14B8A6] via-[#00C2FF] to-[#FF9100]" />
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <Avatar className="w-24 h-24 ring-4 ring-white/40 shadow-lg">
                <AvatarImage src={session?.user?.image ?? ''} alt={fullName} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-teal-400 to-blue-400 text-white">
                  {initials.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl font-bold font-hebrew bg-gradient-to-l from-[#14B8A6] to-[#00C2FF] bg-clip-text text-transparent">
                  {fullName}
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-hebrew">{user?.email}</p>
              </div>

              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 font-hebrew"
                  onClick={handleEdit}
                >
                  <Pencil className="w-4 h-4" />
                  עריכת פרטים
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-2 font-hebrew bg-gradient-to-l from-[#14B8A6] to-[#00C2FF] text-white border-0 hover:opacity-90"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'שומר...' : 'שמירה'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 font-hebrew"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4" />
                    ביטול
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* ─── פרטים אישיים ─── */}
          <GlassCard variant="light" className="p-6">
            <h2 className="text-base font-semibold font-hebrew text-foreground mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-500" />
              פרטים אישיים
            </h2>
            <div className="space-y-5">

              {/* שם פרטי + שם משפחה */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-hebrew">שם פרטי</Label>
                  {isEditing ? (
                    <>
                      <Input {...register('firstName')} className="font-hebrew" placeholder="שם פרטי" />
                      {errors.firstName && (
                        <p className="text-xs text-destructive font-hebrew">{errors.firstName.message}</p>
                      )}
                    </>
                  ) : (
                    <p className="font-medium font-hebrew">{user?.firstName}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-hebrew">שם משפחה</Label>
                  {isEditing ? (
                    <>
                      <Input {...register('lastName')} className="font-hebrew" placeholder="שם משפחה" />
                      {errors.lastName && (
                        <p className="text-xs text-destructive font-hebrew">{errors.lastName.message}</p>
                      )}
                    </>
                  ) : (
                    <p className="font-medium font-hebrew">{user?.lastName}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* אימייל — נעול */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground font-hebrew flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  אימייל
                  <span className="inline-flex items-center gap-0.5 text-muted-foreground/60">
                    <Lock className="w-3 h-3" />
                    <span className="text-[10px]">מ-Google</span>
                  </span>
                </Label>
                <p className="font-medium text-muted-foreground text-sm" dir="ltr">{user?.email}</p>
              </div>

              <Separator />

              {/* טלפון */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground font-hebrew flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  טלפון
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      {...register('phone')}
                      type="tel"
                      dir="ltr"
                      className="font-hebrew"
                      placeholder="050-0000000"
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive font-hebrew">{errors.phone.message}</p>
                    )}
                  </>
                ) : (
                  <p className="font-medium font-hebrew" dir="ltr">{user?.phone || '—'}</p>
                )}
              </div>

              <Separator />

              {/* מוסד */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground font-hebrew flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  מוסד
                  {isEditing && (
                    <span className="text-muted-foreground/60 text-[10px]">(אופציונלי)</span>
                  )}
                </Label>
                {isEditing ? (
                  <Input
                    {...register('institutionName')}
                    className="font-hebrew"
                    placeholder="ישיבה, בית ספר, קהילה..."
                  />
                ) : (
                  <p className="font-medium font-hebrew">{user?.institutionName || '—'}</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* ─── עיסוקים ─── */}
          <GlassCard variant="light" className="p-6">
            <h2 className="text-base font-semibold font-hebrew text-foreground mb-5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-500" />
              עיסוקים
            </h2>

            {isEditing ? (
              <>
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
                            ? 'bg-gradient-to-l from-[#14B8A6] to-[#00C2FF] text-white shadow-sm'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {errors.occupations && (
                  <p className="text-xs text-destructive font-hebrew mt-2">{errors.occupations.message}</p>
                )}
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.occupations && user.occupations.length > 0 ? (
                  user.occupations.map((occ) => {
                    const label = OCCUPATIONS.find((o) => o.value === occ)?.label ?? occ;
                    return (
                      <span
                        key={occ}
                        className="px-3 py-1 rounded-full text-sm font-medium font-hebrew bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                      >
                        {label}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm font-hebrew">לא צוינו עיסוקים</p>
                )}
              </div>
            )}
          </GlassCard>

          {/* ─── העדפות ─── */}
          <GlassCard variant="light" className="p-6">
            <h2 className="text-base font-semibold font-hebrew text-foreground mb-5 flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-500" />
              העדפות
            </h2>

            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
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
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      user?.marketingConsent
                        ? 'bg-teal-500 border-teal-500'
                        : 'border-muted-foreground/40'
                    }`}
                  >
                    {user?.marketingConsent && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm font-hebrew">
                    {user?.marketingConsent
                      ? 'מסכים לקבל עדכונים ותוכן חדש במייל'
                      : 'לא מסכים לקבל עדכונים במייל'}
                  </p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* ─── חשבון ─── */}
          <GlassCard variant="light" className="p-6">
            <h2 className="text-base font-semibold font-hebrew text-foreground mb-5">חשבון</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                {/* Google Icon */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <div>
                  <p className="text-sm font-medium font-hebrew">כניסה דרך Google</p>
                  <p className="text-xs text-muted-foreground font-hebrew">החשבון מחובר לחשבון Google שלך</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 font-hebrew text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-4 h-4" />
                יציאה מהחשבון
              </Button>
            </div>
          </GlassCard>

        </div>
      </main>
    </>
  );
}
