import { z } from 'zod';

export const masechetSchema = z.object({
  id: z.string(),
  name: z.string(),
  orderIndex: z.number(),
});
export type Masechet = z.infer<typeof masechetSchema>;

export const masechetPageSchema = z.object({
  id: z.string(),
  daf: z.number(),
  amud: z.string(),
});
export type MasechetPage = z.infer<typeof masechetPageSchema>;

export const masechetWithPagesSchema = masechetSchema.extend({
  pages: z.array(masechetPageSchema),
});
export type MasechetWithPages = z.infer<typeof masechetWithPagesSchema>;

export const bookSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Book = z.infer<typeof bookSchema>;

export const topicSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  name: z.string(),
  orderIndex: z.number(),
});
export type Topic = z.infer<typeof topicSchema>;

export const shuSectionSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type ShuSection = z.infer<typeof shuSectionSchema>;

export const shuSimanSchema = z.object({
  id: z.string(),
  siman: z.number(),
  title: z.string().nullable(),
  section: shuSectionSchema,
});
export type ShuSiman = z.infer<typeof shuSimanSchema>;

export const shuSectionWithSimanimSchema = shuSectionSchema.extend({
  simanim: z.array(shuSimanSchema.omit({ section: true })),
});
export type ShuSectionWithSimanim = z.infer<typeof shuSectionWithSimanimSchema>;
