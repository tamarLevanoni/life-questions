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

// ==================== CATEGORY TYPES ====================


export type ShulchanAruchChelek =
  | 'אורח חיים'
  | 'יורה דעה'
  | 'אבן העזר'
  | 'חושן משפט';

export type ContactType = 'request' | 'comment' | 'enlightenment';

export type CategoryType = 'shas' | 'shulchanAruch' | 'concepts';

// ==================== CATEGORY INTERFACES ====================

export interface ShasCategory {
  masechet: string;
  perek: string;
  daf: string;
}

export interface ShulchanAruchCategory {
  chelek: ShulchanAruchChelek;
  siman: string;
  seif: string;
}

export interface ConceptCategory {
  subject: string;
  concept: string;
}

// ==================== STORY INTERFACE ====================

export interface Story {
  id: string;
  title: string;
  storyContent: string;
  question: string;
  shortAnswer: string;
  expansion: string;
  hasVideo: boolean;
  videoUrl?: string;
  bookId?: string;
  orderInBook?: number;
  isPremium?: boolean;
  categories: {
    shas?: ShasCategory;
    shulchanAruch?: ShulchanAruchCategory;
    concepts: ConceptCategory[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}


// ==================== SEARCH INTERFACES ====================

export interface SearchFilters {
  query?: string;
  categoryType?: CategoryType;
  masechet?: string;
  chelek?: ShulchanAruchChelek;
  siman?: string;
  subject?: string;
  concept?: string;
  hasVideo?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface StoryWithNavigation {
  story: Story;
  prevId: string | null;
  nextId: string | null;
}

// ==================== CONTACT INTERFACE ====================

export interface ContactFormData {
  name: string;
  email: string;
  type: ContactType;
  message: string;
}

// ==================== CATEGORIES DATA ====================

export interface CategoriesData {
  masechot: string[];
  shulchanAruch: Record<ShulchanAruchChelek, boolean>;
  subjects: string[];
  subjectConcepts: Record<string, string[]>;
}

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

export interface CategoryFilterBarProps {
  activeFilters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
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
