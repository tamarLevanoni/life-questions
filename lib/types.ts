import type {
  StoryCard,
  Story,
  StoryWithNeighbors,
  Book,
  Topic,
  MasechetWithPages,
  ShuSectionWithSimanim,
} from '@/lib/schemas';

export type AppDataBundle = {
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  topics: Topic[];
  books: Book[];
  featuredStories: Story[];
  weeklyStory: Story | null;
};

// ==================== BFF / UTILITY TYPES ====================

export type StandardResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// RegisterBody נגזר מ-RegisterUserBody — מקור אמת אחד
export type { RegisterUserBody as RegisterBody } from '@/lib/schemas';

// ==================== UI TYPES ====================

export interface UiShasRef {
  id: string;
  masechetId?: string;
  daf?: number;
}

export interface UiShuRef {
  id: string;
  shuSectionId?: string;
  simanId?: string;
  seif?: number;
}

export interface UiSearchFilters {
  q?: string;
  bookIds?: string[];
  topicIds?: string[];
  shasRefs?: UiShasRef[];
  shuRefs?: UiShuRef[];
}

// ==================== COMPONENT PROPS ====================

export interface ScenarioCardProps {
  story: StoryCard | Story | StoryWithNeighbors;
  bookName?: string;
  topicName?: string;
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

export interface CategoryFilterBarProps {
  masechtot: MasechetWithPages[];
  shuSections: ShuSectionWithSimanim[];
  topics: Topic[];
  books: Book[];
  activeFilters: UiSearchFilters;
  onFiltersChange: (filters: UiSearchFilters) => void;
  className?: string;
}

export interface SearchResultsListProps {
  stories: StoryCard[];
  books: Book[];
  topics: Topic[];
  isLoading: boolean;
  hasMore: boolean;
  total: number;
  onLoadMore: () => void;
  onStoryClick: (story: { id: string }) => void;
  emptyMessage?: string;
  emptyHint?: string;
}

export interface AppHeaderProps {
  showSearch?: boolean;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}
