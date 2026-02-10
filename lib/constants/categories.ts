import type { ShulchanAruchChelek, Occupation, CategoriesData } from '@/lib/types';

// ==================== SEDER HASHAS (TALMUD) ====================

export const MASECHOT = [
  // סדר זרעים
  'ברכות',
  // סדר מועד
  'שבת',
  'עירובין',
  'פסחים',
  'שקלים',
  'יומא',
  'סוכה',
  'ביצה',
  'ראש השנה',
  'תענית',
  'מגילה',
  'מועד קטן',
  'חגיגה',
  // סדר נשים
  'יבמות',
  'כתובות',
  'נדרים',
  'נזיר',
  'סוטה',
  'גיטין',
  'קידושין',
  // סדר נזיקין
  'בבא קמא',
  'בבא מציעא',
  'בבא בתרא',
  'סנהדרין',
  'מכות',
  'שבועות',
  'עבודה זרה',
  'הוריות',
  // סדר קדשים
  'זבחים',
  'מנחות',
  'חולין',
  'בכורות',
  'ערכין',
  'תמורה',
  'כריתות',
  'מעילה',
  'תמיד',
  'מדות',
  'קינים',
  // סדר טהרות
  'נדה',
] as const;

export type Masechet = (typeof MASECHOT)[number];

// ==================== SHULCHAN ARUCH ====================

export const SHULCHAN_ARUCH_SECTIONS: ShulchanAruchChelek[] = [
  'אורח חיים',
  'יורה דעה',
  'אבן העזר',
  'חושן משפט',
];

export const SHULCHAN_ARUCH_DESCRIPTIONS: Record<ShulchanAruchChelek, string> = {
  'אורח חיים': 'הלכות חיי יום-יום, תפילה, שבת וחגים',
  'יורה דעה': 'הלכות כשרות, אבלות, צדקה ונדרים',
  'אבן העזר': 'הלכות נישואין וגירושין',
  'חושן משפט': 'הלכות ממונות, דיני עסקים ומשפט',
};

// ==================== SUBJECTS & CONCEPTS ====================

export const SUBJECTS = [
  'אבידה ומציאה',
  'שומרים',
  'הלכות שבת',
  'הלכות תפילה',
  'כשרות',
  'בין אדם לחברו',
  'הלכות צדקה',
  'הלכות ברכות',
  'הלכות חגים',
  'הלכות נזיקין',
  'הלכות הלוואות',
  'הלכות שכנים',
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const SUBJECT_CONCEPTS: Record<Subject, string[]> = {
  'אבידה ומציאה': [
    'סימנים',
    'ייאוש',
    'סימן מקום',
    'הכרזה',
    'שמירה',
    'השבה',
  ],
  'שומרים': [
    'שומר חינם',
    'שומר שכר',
    'שואל',
    'שוכר',
    'פשיעה',
    'אונס',
  ],
  'הלכות שבת': [
    'מלאכות',
    'הוצאה',
    'בישול',
    'כתיבה',
    'מוקצה',
    'עירוב',
  ],
  'הלכות תפילה': [
    'זמני תפילה',
    'כוונה',
    'מניין',
    'חזרת הש"ץ',
    'קריאת התורה',
    'ברכות',
  ],
  'כשרות': [
    'בשר וחלב',
    'תערובות',
    'כלים',
    'בישול עכו"ם',
    'חלב ישראל',
    'הכשרה',
  ],
  'בין אדם לחברו': [
    'לשון הרע',
    'אונאת דברים',
    'כבוד הבריות',
    'הלבנת פנים',
    'נקמה ונטירה',
    'ואהבת לרעך',
  ],
  'הלכות צדקה': [
    'מעשר כספים',
    'עניי עירך',
    'מתן בסתר',
    'גבאי צדקה',
    'קופה ותמחוי',
    'פדיון שבויים',
  ],
  'הלכות ברכות': [
    'ברכות הנהנין',
    'ברכה ראשונה',
    'ברכה אחרונה',
    'סדר עדיפויות',
    'ברכות השחר',
    'הגומל',
  ],
  'הלכות חגים': [
    'ראש השנה',
    'יום כיפור',
    'סוכות',
    'פסח',
    'שבועות',
    'פורים',
  ],
  'הלכות נזיקין': [
    'נזקי ממון',
    'נזקי גוף',
    'גרמא',
    'היזק ראייה',
    'אש',
    'בור',
  ],
  'הלכות הלוואות': [
    'ריבית',
    'היתר עסקא',
    'משכון',
    'ערבות',
    'פריעת בע"ח',
    'שמיטת כספים',
  ],
  'הלכות שכנים': [
    'היזק ראייה',
    'שותפות',
    'חלוקה',
    'גדר',
    'רחקות',
    'חזקת תשמישים',
  ],
};

// ==================== OCCUPATIONS ====================

export const OCCUPATIONS: Occupation[] = [
  'דיין',
  'רב',
  'מורה',
  'תלמיד',
  'הורה',
  'לומד',
];

export const OCCUPATION_LABELS: Record<Occupation, string> = {
  'דיין': 'דיין',
  'רב': 'רב',
  'מורה': 'מורה/ה',
  'תלמיד': 'תלמיד/ה',
  'הורה': 'הורה',
  'לומד': 'לומד/ת עצמאי/ת',
};

// ==================== CONTACT TYPES ====================

export const CONTACT_TYPES = [
  { value: 'request', label: 'בקשה' },
  { value: 'comment', label: 'הערה' },
  { value: 'enlightenment', label: 'הארה' },
] as const;

// ==================== HELPER FUNCTIONS ====================

export function getCategoriesData(): CategoriesData {
  return {
    masechot: [...MASECHOT],
    shulchanAruch: {
      'אורח חיים': true,
      'יורה דעה': true,
      'אבן העזר': true,
      'חושן משפט': true,
    },
    subjects: [...SUBJECTS],
    subjectConcepts: { ...SUBJECT_CONCEPTS },
  };
}

export function getConceptsForSubject(subject: string): string[] {
  return SUBJECT_CONCEPTS[subject as Subject] || [];
}

export function isValidMasechet(masechet: string): masechet is Masechet {
  return MASECHOT.includes(masechet as Masechet);
}

export function isValidSubject(subject: string): subject is Subject {
  return SUBJECTS.includes(subject as Subject);
}

export function isValidChelek(chelek: string): chelek is ShulchanAruchChelek {
  return SHULCHAN_ARUCH_SECTIONS.includes(chelek as ShulchanAruchChelek);
}
