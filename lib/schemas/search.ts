import { z } from 'zod';

export const shasRefBodySchema = z.object({
  masechetId: z.string(),
  daf: z.number().int().positive().optional(),
});

export const shuRefBodySchema = z.object({
  shuSectionId: z.string(),
  simanId: z.string().optional(),
  seif: z.number().int().positive().optional(),
}).refine((data) => data.seif === undefined || data.simanId !== undefined, {
  message: 'סעיף דורש בחירת סימן', path: ['seif'],
});

export const MAX_SEARCH_QUERY_LENGTH = 500;
const segmenter = new Intl.Segmenter('he', { granularity: 'grapheme' });
/** אוכף עד 500 יחידות קידוד לפני ניקוי רווחים ולפחות שלושה תווים נראים אחריו. */
export const searchQuerySchema = z.string().max(MAX_SEARCH_QUERY_LENGTH, 'אפשר להזין עד 500 תווים').trim()
  .refine((query) => {
    return Array.from(segmenter.segment(query)).length >= 3;
  }, 'יש להזין לפחות שלושה תווים');

const searchStartFields = z.strictObject({
  q: searchQuerySchema.optional(),
  bookIds: z.array(z.string()).optional(),
  topicIds: z.array(z.string()).optional(),
  shasRefs: z.array(shasRefBodySchema).optional(),
  shuRefs: z.array(shuRefBodySchema).optional(),
  concepts: z.array(z.string().trim().min(1)).optional(),
});
export type SearchStart = z.infer<typeof searchStartFields>;

/** בודק אם יש טקסט או לפחות מסנן אחד בבקשת החיפוש. */
export function hasSearchCriteria({ q, bookIds, topicIds, shasRefs, shuRefs, concepts }: SearchStart): boolean {
  return Boolean(q?.trim() || bookIds?.length || topicIds?.length || shasRefs?.length || shuRefs?.length || concepts?.length);
}

/** מגדיר בקשת חיפוש ומחייב טקסט או מסנן פעיל. */
export const searchStartSchema = searchStartFields.refine(hasSearchCriteria, {
  message: 'יש להקליד שאלה או לבחור מסנן',
});

/** מגדיר את הסמן שהשרת מספק כדי לקרוא את תחילת העמוד הבא. */
export const searchCursorSchema = z.strictObject({
  resultSetId: z.uuid(),
  offset: z.number().int().positive(),
});
/** מפריד בין פתיחה עם שאילתה או מסננים להמשך שמקבל רק סמן. */
export const cursorSearchBodySchema = z.union([
  searchStartSchema,
  z.strictObject({ cursor: searchCursorSchema }),
]);
export type SearchCursor = z.infer<typeof searchCursorSchema>;
