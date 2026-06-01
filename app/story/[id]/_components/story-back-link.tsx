'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

export function StoryBackLink() {
  return (
    <MotionFadeIn trigger="mount" y={10} className="mb-6">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-hebrew"
      >
        <ArrowRight className="w-4 h-4" />
        חזרה לחיפוש
      </Link>
    </MotionFadeIn>
  );
}
