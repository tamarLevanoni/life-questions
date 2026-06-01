'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

interface StoryQuestionCtaProps {
  storyId: string;
  storyTitle: string;
}

export function StoryQuestionCta({ storyId, storyTitle }: StoryQuestionCtaProps) {
  const href = `/contact?category=story_question&storyId=${storyId}&storyTitle=${encodeURIComponent(storyTitle)}`;

  return (
    <MotionFadeIn trigger="mount" delay={0.3} className="mb-8">
      <Link
        href={href}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-teal-200 dark:border-teal-800 text-sm font-medium font-hebrew text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        שאל שאלה/דווח על טעות בהמשך לסיפור זה
      </Link>
    </MotionFadeIn>
  );
}
