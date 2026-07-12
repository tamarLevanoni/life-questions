import type { LucideIcon } from 'lucide-react';
import { Scale, Coins, PackageSearch, BookOpen, HandHeart, Library } from 'lucide-react';

/**
 * Shared color palette for category-style tiles (books gallery, story carousel
 * fallbacks) so colors stay consistent across sections instead of being picked
 * ad hoc per file.
 */
export const CATEGORY_PALETTE = [
  { bg: 'bg-violet-600', glow: 'bg-violet-500/20' },
  { bg: 'bg-blue-600', glow: 'bg-blue-500/20' },
  { bg: 'bg-amber-600', glow: 'bg-amber-500/20' },
  { bg: 'bg-teal-600', glow: 'bg-teal-500/20' },
  { bg: 'bg-rose-600', glow: 'bg-rose-500/20' },
  { bg: 'bg-sky-600', glow: 'bg-sky-500/20' },
] as const;

export function getCategoryColor(index: number) {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}

// Book has no category/icon field from the API — this is a soft name-based
// mapping. Unmatched book names silently fall back to the generic Library icon.
const BOOK_ICON_RULES: { match: string; icon: LucideIcon }[] = [
  { match: 'נזיקין', icon: Scale },
  { match: 'הלוואה', icon: Coins },
  { match: 'ריבית', icon: Coins },
  { match: 'אבידה', icon: PackageSearch },
  { match: 'מציאה', icon: PackageSearch },
  { match: 'תפילה', icon: BookOpen },
  { match: 'ברכות', icon: HandHeart },
];

export function getBookIcon(name: string): LucideIcon {
  const rule = BOOK_ICON_RULES.find((r) => name.includes(r.match));
  return rule?.icon ?? Library;
}
