'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { ExpandableAnswerPanel } from '@/components/story/expandable-answer-panel';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { SkeletonLines } from '@/components/common/loading-skeleton';
import { StoryArticle } from './_components/story-article';
import { StoryNavigation } from './_components/story-navigation';
import { StoryNotFound } from './_components/story-not-found';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import { useReferenceStore } from '@/lib/stores/reference-store';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { story, loading, error, fetchStory, clear } = useStoryDetailStore();
  const { books, loaded: refsLoaded, loadAll } = useReferenceStore();

  const storyId = params.id as string;

  useEffect(() => {
    if (storyId) fetchStory(storyId);
    return () => clear();
  }, [storyId, fetchStory, clear]);

  // ReferencePreloader handles this globally; only load if missed
  useEffect(() => {
    if (!refsLoaded) loadAll();
  }, [refsLoaded, loadAll]);

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className="min-h-screen bg-background" dir="rtl">
          <div className="pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
              <SkeletonLines count={4} />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !story) {
    return (
      <>
        <AppHeader />
        <main className="min-h-screen bg-background" dir="rtl">
          <div className="pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
              <StoryNotFound error={error} />
            </div>
          </div>
        </main>
      </>
    );
  }

  const canViewExpansion = !!session;
  const prevId = story.neighbors?.prev?.id ?? null;
  const nextId = story.neighbors?.next?.id ?? null;
  const book = books.find((b) => b.id === story.bookId);

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-background" dir="rtl">
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            <MotionFadeIn trigger="mount" y={10} className="mb-6">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-hebrew"
              >
                <ArrowRight className="w-4 h-4" />
                חזרה לחיפוש
              </Link>
            </MotionFadeIn>

            <MotionFadeIn trigger="mount" as="article">
              <StoryArticle story={story} book={book} />
            </MotionFadeIn>

            <MotionFadeIn trigger="mount" delay={0.1} className="mb-4">
              <ExpandableAnswerPanel
                title="תשובה קצרה"
                content={story.shortAnswer}
                variant="shortAnswer"
                defaultExpanded={false}
              />
            </MotionFadeIn>

            {story.expansion !== null && (
              <MotionFadeIn trigger="mount" delay={0.2} className="mb-8">
                <ExpandableAnswerPanel
                  title="הרחבה"
                  content={story.expansion}
                  variant="expansion"
                  isLocked={!canViewExpansion}
                  defaultExpanded={false}
                  onRequestAccess={() => router.push('/api/auth/signin')}
                />
              </MotionFadeIn>
            )}

            <MotionFadeIn trigger="mount" delay={0.3} className="mb-8">
              <Link
                href={`/contact?category=story_question&storyId=${storyId}&storyTitle=${encodeURIComponent(story.title)}`}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-teal-200 dark:border-teal-800 text-sm font-medium font-hebrew text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                שאל שאלה/דווח על טעות בהמשך לסיפור זה
              </Link>
            </MotionFadeIn>

            <MotionFadeIn trigger="mount" delay={0.3}>
              <StoryNavigation prevId={prevId} nextId={nextId} />
            </MotionFadeIn>
          </div>
        </div>
      </main>
    </>
  );
}
