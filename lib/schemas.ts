import { z } from 'zod/v4';

export const occupationEnum = z.enum([
  // הסדר הזה הוא מקור האמת — הטיפוס Occupation נגזר ממנו
  'dayyan',
  'rabbi',
  'teacher',
  'student',
  'parent',
  'learner',
]);

// ==================== USER DATA — SINGLE SOURCE OF TRUTH ====================
// כל שדות המשתמש מוגדרים כאן פעם אחת.
// next-auth.d.ts, UserProfile ו-onboardingSchema נגזרים מכאן.

export const userDataSchema = z.object({
  id: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  institutionName: z.string().optional(),
  phone: z.string(),
  occupations: z.array(occupationEnum),
  marketingConsent: z.boolean(),
});

export type UserData = z.infer<typeof userDataSchema>;

// שדות שמותר לעדכן — id/email הם קריאה בלבד
export type MutableUserData = Omit<UserData, 'id' | 'email'>;

// onboardingSchema נגזר מ-userDataSchema — שינוי שדה מתפשט אוטומטית
export const onboardingSchema = userDataSchema
  .pick({
    firstName: true,
    lastName: true,
    institutionName: true,
    phone: true,
    occupations: true,
    marketingConsent: true,
  })
  .extend({
    firstName: z.string().min(2, 'שם פרטי חייב להכיל לפחות 2 תווים'),
    lastName: z.string().min(2, 'שם משפחה חייב להכיל לפחות 2 תווים'),
    phone: z.string().min(9, 'מספר טלפון לא תקין'),
    occupations: z.array(occupationEnum).min(1, 'יש לבחור לפחות עיסוק אחד'),
    marketingConsent: z
      .boolean()
      .refine((val) => val === true, { message: 'יש לאשר קבלת עדכונים' }),
  });

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// טיפוס Occupation נגזר מה-enum — מקור אמת אחד
export type Occupation = z.infer<typeof occupationEnum>;
