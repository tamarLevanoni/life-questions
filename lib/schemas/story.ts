import { z } from 'zod';
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
export const storyNeighborsSchema = z.object({
  prev: storyRefSchema,
  next: storyRefSchema,
});
export type StoryNeighbors = z.infer<typeof storyNeighborsSchema>;

export const storyWithNeighborsSchema = storySchema.extend({
  neighbors: storyNeighborsSchema,
});
export type StoryWithNeighbors = z.infer<typeof storyWithNeighborsSchema>;

export const paginatedStoriesSchema = z.object({
  stories: z.array(storySchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type PaginatedStories = z.infer<typeof paginatedStoriesSchema>;

export const paginatedStoryCardsSchema = z.object({
  stories: z.array(storyCardSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type PaginatedStoryCards = z.infer<typeof paginatedStoryCardsSchema>;
