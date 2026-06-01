'use client';

import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { FormField } from '@/components/ui/form-field';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Building2, Lock } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ProfileEditFormData } from '@/lib/schemas';
import type { UserData } from '@/lib/schemas';

interface PersonalInfoSectionProps {
  isEditing: boolean;
  user: UserData | null;
  register: UseFormRegister<ProfileEditFormData>;
  errors: FieldErrors<ProfileEditFormData>;
}

export function PersonalInfoSection({ isEditing, user, register, errors }: PersonalInfoSectionProps) {
  return (
    <GlassCard variant="light" className="p-6">
      <h2 className="text-base font-semibold font-hebrew text-foreground mb-5 flex items-center gap-2">
        <User className="w-4 h-4 text-teal-500" />
        פרטים אישיים
      </h2>

      <div className="space-y-5">
        {/* שם פרטי + שם משפחה */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="שם פרטי" error={errors.firstName?.message}>
            {isEditing ? (
              <Input {...register('firstName')} className="font-hebrew" placeholder="שם פרטי" />
            ) : (
              <p className="font-medium font-hebrew">{user?.firstName}</p>
            )}
          </FormField>
          <FormField label="שם משפחה" error={errors.lastName?.message}>
            {isEditing ? (
              <Input {...register('lastName')} className="font-hebrew" placeholder="שם משפחה" />
            ) : (
              <p className="font-medium font-hebrew">{user?.lastName}</p>
            )}
          </FormField>
        </div>

        <Separator />

        {/* אימייל — נעול */}
        <FormField
          label={
            <>
              <Mail className="w-3.5 h-3.5" />
              אימייל
              <span className="inline-flex items-center gap-0.5 text-muted-foreground/60">
                <Lock className="w-3 h-3" />
                <span className="text-[10px]">מ-Google</span>
              </span>
            </>
          }
        >
          <p className="font-medium text-muted-foreground text-sm" dir="ltr">{user?.email}</p>
        </FormField>

        <Separator />

        {/* טלפון */}
        <FormField label={<><Phone className="w-3.5 h-3.5" />טלפון</>} error={errors.phone?.message}>
          {isEditing ? (
            <Input
              {...register('phone')}
              type="tel"
              dir="ltr"
              className="font-hebrew"
              placeholder="050-0000000"
            />
          ) : (
            <p className="font-medium font-hebrew" dir="ltr">{user?.phone || '—'}</p>
          )}
        </FormField>

        <Separator />

        {/* מוסד */}
        <FormField
          label={
            <>
              <Building2 className="w-3.5 h-3.5" />
              מוסד
              {isEditing && <span className="text-muted-foreground/60 text-[10px]">(אופציונלי)</span>}
            </>
          }
        >
          {isEditing ? (
            <Input
              {...register('institutionName')}
              className="font-hebrew"
              placeholder="ישיבה, בית ספר, קהילה..."
            />
          ) : (
            <p className="font-medium font-hebrew">{user?.institutionName || '—'}</p>
          )}
        </FormField>
      </div>
    </GlassCard>
  );
}
