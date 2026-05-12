// ==================== API TYPES (Backend) ====================

export interface ApiMasechet {
  id: string;
  name: string;
  orderIndex: number;
}

export interface ApiShasPage {
  id: string;
  daf: number;
  amud: string;
  masechet: ApiMasechet;
}

export interface ApiShasRef {
  shasPageId: string;
  sourceText: string | null;
  shasPage: ApiShasPage;
}

export interface ApiShuSection {
  id: string;
  name: string;
}

export interface ApiShuSiman {
  id: string;
  siman: number;
  title: string | null;
  section: ApiShuSection;
}

export interface ApiShuSectionWithSimanim extends ApiShuSection {
  simanim: ApiShuSiman[];
}

export interface ApiShuRef {
  shuSimanId: string;
  seif: number;
  shuSiman: ApiShuSiman;
}

export interface ApiTopic {
  id: string;
  bookNumber: number;
  name: string;
  orderIndex: number;
}

export interface ApiStory {
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
  topic: ApiTopic;
  shasRefs: ApiShasRef[];
  shuRefs: ApiShuRef[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiStoryNeighbors {
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

export interface ApiPaginatedStories {
  stories: ApiStory[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiSearchParams {
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
  story: ApiStory;
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
  masechtot: ApiMasechet[];
  shuSections: ApiShuSectionWithSimanim[];
  concepts: string[];
  activeFilters: UiSearchFilters;
  onFiltersChange: (filters: UiSearchFilters) => void;
  className?: string;
}

export interface SearchResultsListProps {
  stories: ApiStory[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onStoryClick: (story: ApiStory) => void;
  emptyMessage?: string;
}

export interface AppHeaderProps {
  showSearch?: boolean;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}
