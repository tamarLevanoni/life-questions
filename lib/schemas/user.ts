import { z } from 'zod';

export const occupationEnum = z.enum([
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
  googleId: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  institutionName: z.string().nullish(),
  phone: z.string(),
  occupations: z.array(occupationEnum),
  marketingConsent: z.boolean(),
});

export type UserData = z.infer<typeof userDataSchema>;

// שדות שמותר לעדכן — id/email הם קריאה בלבד
export type MutableUserData = Omit<UserData, 'id' | 'googleId' | 'email'>;

// כללי הפרופיל משותפים לטפסים ולכניסות השרת.
export const profileEditSchema = userDataSchema
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
    marketingConsent: z.boolean().refine((value) => value === true, {
      message: 'יש לאשר קבלת עדכונים ותוכן שיווקי במייל',
    }),
  });

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;

export const onboardingSchema = profileEditSchema;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const registerUserSchema = userDataSchema.omit({ id: true }).extend({
  ...onboardingSchema.shape,
  institutionName: z.string().optional(),
});
export type RegisterUserBody = z.infer<typeof registerUserSchema>;

export const updateUserSchema = profileEditSchema.partial().required({ marketingConsent: true });
export type UpdateUserBody = z.infer<typeof updateUserSchema>;

export type Occupation = z.infer<typeof occupationEnum>;

// ==================== CONTACT ====================

export const contactCategoryEnum = z.enum(['general', 'bug', 'collaboration', 'story_question']);
export type ContactCategory = z.infer<typeof contactCategoryEnum>;

// סכמה מינימלית לצורך טופס יצירת קשר בלבד
const contactStorySchema = z.object({
  id:            z.string(),
  title:         z.string(),
  storyBody:     z.string(),
  legalQuestion: z.string(),
  shortAnswer:   z.string(),
  expansion:     z.string().optional(),
});

// סכמת טופס — ללא story ו-superRefine (story מוזרק בשכבת ה-onSubmit אחרי validation)
export const contactFormSchema = z.object({
  name:     z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  email:    z.email('אימייל לא תקין'),
  category: contactCategoryEnum,
  subject:  z.string().min(3, 'נושא חייב להכיל לפחות 3 תווים'),
  message:  z.string().min(10, 'ההודעה חייבת להכיל לפחות 10 תווים'),
  pageUrl:  z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// סכמת API — כולל story ו-superRefine לאימות בצד השרת
export const contactSchema = contactFormSchema
  .extend({ story: contactStorySchema.optional() })
  .superRefine((data, ctx) => {
    if (data.category === 'story_question' && !data.story) {
      ctx.addIssue({
        code: 'custom',
        path: ['story'],
        message: 'story הוא שדה חובה עבור קטגוריית story_question',
      });
    }
  });

export type ContactFormData = z.infer<typeof contactSchema>;
