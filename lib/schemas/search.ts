import { z } from 'zod';

export const shasRefBodySchema = z.object({
  masechetId: z.string(),
  daf: z.number().optional(),
});

export const shuRefBodySchema = z.object({
  shuSectionId: z.string(),
  simanId: z.string().optional(),
  seif: z.number().optional(),
});

export const searchBodySchema = z.object({
  q: z.string().optional(),
  bookIds: z.array(z.string()).optional(),
  topicIds: z.array(z.string()).optional(),
  shasRefs: z.array(shasRefBodySchema).optional(),
  shuRefs: z.array(shuRefBodySchema).optional(),
  concepts: z.array(z.string()).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type SearchBody = z.infer<typeof searchBodySchema>;
