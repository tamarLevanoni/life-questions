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

export const onboardingSchema = z.object({
  firstName: z.string().min(2, 'שם פרטי חייב להכיל לפחות 2 תווים'),
  lastName: z.string().min(2, 'שם משפחה חייב להכיל לפחות 2 תווים'),
  institutionName: z.string().optional(),
  phone: z.string().min(9, 'מספר טלפון לא תקין'),
  occupations: z.array(occupationEnum).min(1, 'יש לבחור לפחות עיסוק אחד'),
  marketingConsent: z.boolean().refine((val) => val === true, { message: 'יש לאשר קבלת עדכונים' }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// טיפוס Occupation נגזר מה-enum — מקור אמת אחד
export type Occupation = z.infer<typeof occupationEnum>;
