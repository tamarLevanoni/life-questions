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

export const searchBodySchema = z.object({
  q: z.string().min(1).optional(),
  bookIds: z.array(z.string()).optional(),
  topicIds: z.array(z.string()).optional(),
  shasRefs: z.array(shasRefBodySchema).optional(),
  shuRefs: z.array(shuRefBodySchema).optional(),
  concepts: z.array(z.string().min(1)).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(50).optional(),
});
export type SearchBody = z.infer<typeof searchBodySchema>;
