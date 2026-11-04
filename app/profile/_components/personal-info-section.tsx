'use client';

import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { User, Mail, Phone, Building2 } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ProfileEditFormData } from '@/lib/schemas';
import type { UserData } from '@/lib/schemas';

interface PersonalInfoSectionProps {
  isEditing: boolean;
  user: UserData | null;
  register: UseFormRegister<ProfileEditFormData>;
  errors: FieldErrors<ProfileEditFormData>;
}

const valueClassName = 'min-h-11 rounded-md border border-input bg-background/50 px-3 py-2 text-sm font-medium font-hebrew break-words';

export function PersonalInfoSection({ isEditing, user, register, errors }: PersonalInfoSectionProps) {
  return (
    <section aria-labelledby="personal-info-heading" className="min-w-0">
      <h2 id="personal-info-heading" className="text-base font-semibold font-hebrew text-foreground mb-3 flex items-center gap-2">
        <User className="w-4 h-4 text-teal-500" />
        פרטים אישיים
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {/* שם פרטי + שם משפחה */}
        <FormField className="min-w-0" label="שם פרטי" error={errors.firstName?.message}>
          {isEditing ? (
            <Input {...register('firstName')} autoComplete="given-name" className="h-11 font-hebrew" placeholder="שם פרטי" />
          ) : (
            <p className={valueClassName}>{user?.firstName}</p>
          )}
        </FormField>
        <FormField className="min-w-0" label="שם משפחה" error={errors.lastName?.message}>
          {isEditing ? (
            <Input {...register('lastName')} autoComplete="family-name" className="h-11 font-hebrew" placeholder="שם משפחה" />
          ) : (
            <p className={valueClassName}>{user?.lastName}</p>
          )}
        </FormField>

        {/* אימייל — נעול */}
        <FormField
          className="col-span-2 min-w-0"
          label={
            <>
              <Mail className="w-3.5 h-3.5" />
              אימייל
            </>
          }
        >
          <p className={`${valueClassName} break-all text-end text-muted-foreground`} dir="ltr">{user?.email}</p>
        </FormField>

        {/* טלפון */}
        <FormField className="col-span-2 sm:col-span-1 min-w-0" label={<><Phone className="w-3.5 h-3.5" />טלפון</>} error={errors.phone?.message}>
          {isEditing ? (
            <Input
              {...register('phone')}
              type="tel"
              dir="ltr"
              autoComplete="tel"
              className="h-11 font-hebrew"
              placeholder="050-0000000"
            />
          ) : (
            <p className={`${valueClassName} text-end`} dir="ltr">{user?.phone || '—'}</p>
          )}
        </FormField>

        {/* מוסד */}
        <FormField
          className="col-span-2 sm:col-span-1 min-w-0"
          label={
            <>
              <Building2 className="w-3.5 h-3.5" />
              מוסד
              {isEditing && <span className="text-muted-foreground text-[10px]">(אופציונלי)</span>}
            </>
          }
        >
          {isEditing ? (
            <Input
              {...register('institutionName')}
              autoComplete="organization"
              className="h-11 font-hebrew"
              placeholder="ישיבה, בית ספר, קהילה..."
            />
          ) : (
            <p className={valueClassName}>{user?.institutionName || '—'}</p>
          )}
        </FormField>
      </div>
    </section>
  );
}
