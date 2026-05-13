import { z } from 'zod/v4';
import type { UserData } from '@/lib/schemas';

// ==================== BFF / UTILITY TYPES ====================

export type StandardResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// RegisterBody נגזר מ-UserData — מקור אמת אחד, בלי כפילות שדות
export type RegisterBody = Omit<UserData, 'id'>;

// ==================== API SCHEMAS & TYPES ====================
// כל טיפוס API נגזר מהסכמה — מקור אמת אחד לצורה ולvalidation

export const masechetSchema = z.object({
  id: z.string(),
  name: z.string(),
  orderIndex: z.number(),
});
export type Masechet = z.infer<typeof masechetSchema>;

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
  simanim: z.array(shuSimanSchema),
});
export type ShuSectionWithSimanim = z.infer<typeof shuSectionWithSimanimSchema>;

export const shuRefSchema = z.object({
  shuSimanId: z.string(),
  seif: z.number(),
  shuSiman: shuSimanSchema,
});
export type ShuRef = z.infer<typeof shuRefSchema>;

export const topicSchema = z.object({
  id: z.string(),
  bookNumber: z.number(),
  name: z.string(),
  orderIndex: z.number(),
});
export type Topic = z.infer<typeof topicSchema>;

export const storySchema = z.object({
  id: z.string(),
  bookNumber: z.number(),
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

export const paginatedStoriesSchema = z.object({
  stories: z.array(storySchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type PaginatedStories = z.infer<typeof paginatedStoriesSchema>;

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  masechetId: z.string().optional(),
  daf: z.coerce.number().optional(),
  amud: z.enum(['a', 'b']).optional(),
  shuSectionId: z.string().optional(),
  simanId: z.string().optional(),
  seif: z.coerce.number().optional(),
  concept: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
export type SearchParams = z.infer<typeof searchParamsSchema>;
export const SEARCH_PARAM_KEYS = Object.keys(searchParamsSchema.shape) as (keyof SearchParams)[];

// ==================== UI TYPES ====================

export type CategoryType = 'shas' | 'shulchanAruch' | 'concepts';

// ==================== COMPONENT PROPS ====================

export interface ScenarioCardProps {
  story: Story;
  onClick?: () => void;
  className?: string;
}

export interface ExpandableAnswerPanelProps {
  title: string;
  content: string;
  variant: 'shortAnswer' | 'expansion';
  isLocked?: boolean;
  defaultExpanded?: boolean;
  onRequestAccess?: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export interface UiSearchFilters {
  categoryType?: CategoryType;
  masechetId?: string;
  shuSectionId?: string;
  concept?: string;
}

export interface CategoryFilterBarProps {
  masechtot: Masechet[];
  shuSections: ShuSectionWithSimanim[];
  concepts: string[];
  activeFilters: UiSearchFilters;
  onFiltersChange: (filters: UiSearchFilters) => void;
  className?: string;
}

export interface SearchResultsListProps {
  stories: Story[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onStoryClick: (story: Story) => void;
  emptyMessage?: string;
}

export interface AppHeaderProps {
  showSearch?: boolean;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}
