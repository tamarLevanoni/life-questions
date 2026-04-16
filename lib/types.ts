// ==================== CATEGORY TYPES ====================

export type ShulchanAruchChelek =
  | 'אורח חיים'
  | 'יורה דעה'
  | 'אבן העזר'
  | 'חושן משפט';

export type Occupation =
  | 'dayyan'
  | 'rabbi'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'learner';

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

// ==================== USER INTERFACES ====================

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  institutionName?: string;
  phone?: string;
  image?: string;
  occupations: Occupation[];
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  institutionName?: string;
  phone?: string;
  occupations: Occupation[];
  marketingConsent: boolean;
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
