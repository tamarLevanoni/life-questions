import {
  Bug,
  Handshake,
  MessageSquare,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import type { ContactCategory } from '@/lib/schemas';

export interface ContactCategoryItem {
  value: ContactCategory;
  label: string;
  icon: LucideIcon;
}

export const BASE_CATEGORIES: ContactCategoryItem[] = [
  { value: 'general', label: 'פנייה כללית', icon: MessageSquare },
  { value: 'bug', label: 'בעיה טכנית', icon: Bug },
  { value: 'collaboration', label: 'שיתוף פעולה', icon: Handshake },
];

export const STORY_CATEGORY: ContactCategoryItem = {
  value: 'story_question',
  label: 'שאלת המשך',
  icon: BookOpen,
};
