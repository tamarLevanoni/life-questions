import type {
  StoryCard,
  Story,
  Book,
  Topic,
  MasechetWithPages,
  ShuSectionWithSimanim,
} from '@/lib/schemas';

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
  bookIds?: string[];
  topicIds?: string[];
  shasRefs?: UiShasRef[];
  shuRefs?: UiShuRef[];
}

// ==================== COMPONENT PROPS ====================

export interface ScenarioCardProps {
  story: StoryCard | Story;
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

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
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
  onStoryClick: (story: StoryCard) => void;
  emptyMessage?: string;
}

export interface AppHeaderProps {
  showSearch?: boolean;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}
