import { z } from 'zod';
import { searchCursorSchema } from './search';
import { masechetSchema, shuSimanSchema, topicSchema } from './reference';

export const shasPageSchema = z.object({
  id: z.string(),
  daf: z.number(),
  amud: z.string(),
  masechet: masechetSchema,
});
export type ShasPage = z.infer<typeof shasPageSchema>;

export const shasRefSchema = z.object({
  shasPageId: z.string(),
  sourceText: z.string().nullable(),
  shasPage: shasPageSchema,
});
export type ShasRef = z.infer<typeof shasRefSchema>;

export const shuRefSchema = z.object({
  shuSimanId: z.string(),
  seif: z.number(),
  shuSiman: shuSimanSchema,
});
export type ShuRef = z.infer<typeof shuRefSchema>;

/** מגדיר את השדות שמסך התוצאות צריך להצגת כרטיס. */
export const storyCardSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  storyOrder: z.number(),
  topicId: z.string(),
  title: z.string(),
  legalQuestion: z.string(),
  videoUrl: z.string().nullable(),
  shuRefs: z.array(shuRefSchema),
  centralShuSiman: shuSimanSchema.nullable(),
});
export type StoryCard = z.infer<typeof storyCardSchema>;

/** מגדיר את תוכן הסיפור והמקורות המשותפים לעמוד הפרטים ולתצוגות בדף הבית. */
export const storySchema = z.object({
  id: z.string(),
  bookId: z.string(),
  storyOrder: z.number(),
  title: z.string(),
  storyBody: z.string(),
  legalQuestion: z.string(),
  legalQuestionSource: z.string(),
  shortAnswer: z.string(),
  expansion: z.string().nullable(),
  hasExpansion: z.boolean().optional(),
  conceptsAi: z.array(z.string()),
  conceptsFromIndex: z.array(z.string()),
  videoUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  topic: topicSchema,
  shasRefs: z.array(shasRefSchema),
  shuRefs: z.array(shuRefSchema),
  centralShuSiman: shuSimanSchema.nullable(),
  sourceReferencesText: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Story = z.infer<typeof storySchema>;

const storyRefSchema = z.object({ id: z.string(), title: z.string() }).nullable();
/** מגדיר את הקישורים לקודם ולבא בסדר הספר. כל כיוון יכול להיות חסר. */
export const storyNeighborsSchema = z.object({
  prev: storyRefSchema,
  next: storyRefSchema,
});
export type StoryNeighbors = z.infer<typeof storyNeighborsSchema>;

/** מרחיב את פרטי הסיפור בנתוני הניווט שהעמוד מקבל מהשרת. */
export const storyWithNeighborsSchema = storySchema.extend({
  neighbors: storyNeighborsSchema,
});
export type StoryWithNeighbors = z.infer<typeof storyWithNeighborsSchema>;

/** מאמת את מזהי הסיפורים ודגל ההמשך שנדרשים לבניית מפת האתר. */
export const sitemapPageSchema = z.object({
  stories: z.array(z.object({ id: z.string() })),
  hasMore: z.boolean(),
});

export const searchMatchSchema = z.object({
  matchType: z.enum(['direct', 'close']),
  reasonCode: z.enum(['source_match', 'nearby_source']),
});
/** מתאר את מצב החיפוש ואת סימוני ההתאמה עבור הכרטיסים שחזרו בעמוד. */
export const searchPageMetaSchema = z.object({
  status: z.enum(['complete', 'no_useful_match', 'partial']),
  sourceMatch: z.enum(['exact', 'same_location', 'nearby']).optional(),
  matches: z.record(z.string(), searchMatchSchema),
});
/** בודק את רשימת הכרטיסים ואת הסמן להמשך בכל תגובת חיפוש. */
export const cursorStoryCardsSchema = z.object({
  stories: z.array(storyCardSchema),
  total: z.number().int().nonnegative(),
  pageSize: z.literal(10),
  nextCursor: searchCursorSchema.nullable(),
  searchMeta: searchPageMetaSchema,
});
export type CursorStoryCards = z.infer<typeof cursorStoryCardsSchema>;
export type SearchPageMeta = z.infer<typeof searchPageMetaSchema>;
