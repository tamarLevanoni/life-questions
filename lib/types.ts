import type { UserData } from '@/lib/schemas';

// ==================== BFF / UTILITY TYPES ====================

// StandardResponse — עטיפה אחידה של תגובות מ-backend (מיוצאת לשימוש ב-BFF routes)
export type StandardResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// RegisterBody נגזר מ-UserData — מקור אמת אחד, בלי כפילות שדות
export type RegisterBody = Omit<UserData, 'id'>;

// ==================== API TYPES (Backend) ====================

export interface Masechet {
  id: string;
  name: string;
  orderIndex: number;
}

export interface ShasPage {
  id: string;
  daf: number;
  amud: string;
  masechet: Masechet;
}

export interface ShasRef {
  shasPageId: string;
  sourceText: string | null;
  shasPage: ShasPage;
}

export interface ShuSection {
  id: string;
  name: string;
}

export interface ShuSiman {
  id: string;
  siman: number;
  title: string | null;
  section: ShuSection;
}

export interface ShuSectionWithSimanim extends ShuSection {
  simanim: ShuSiman[];
}

export interface ShuRef {
  shuSimanId: string;
  seif: number;
  shuSiman: ShuSiman;
}

export interface Topic {
  id: string;
  bookNumber: number;
  name: string;
  orderIndex: number;
}

export interface Story {
  id: string;
  bookNumber: number;
  storyOrder: number;
  title: string;
  storyBody: string;
  legalQuestion: string;
  legalQuestionSource: string;
  shortAnswer: string;
  expansion: string | null;
  conceptsAi: string[];
  conceptsFromIndex: string[];
  videoUrl: string | null;
  imageUrl: string | null;
  topic: Topic;
  shasRefs: ShasRef[];
  shuRefs: ShuRef[];
  createdAt: string;
  updatedAt: string;
}

export interface StoryNeighbors {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

export interface PaginatedStories {
  stories: Story[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchParams {
  q?: string;
  masechetId?: string;
  daf?: number;
  amud?: 'a' | 'b';
  shuSectionId?: string;
  simanId?: string;
  seif?: number;
  concept?: string;
  page?: number;
  limit?: number;
}

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
