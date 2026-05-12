'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { ExpandableAnswerPanel } from '@/components/story/expandable-answer-panel';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Video,
  BookOpen,
  Scale,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { story, neighbors, loading, error, fetchStory, clear } = useStoryDetailStore();

  const storyId = params.id as string;

  useEffect(() => {
    if (storyId) fetchStory(storyId);
    return () => clear();
  }, [storyId, fetchStory, clear]);

  const handleRequestAccess = () => {
    router.push('/api/auth/signin');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background" dir="rtl">
        <AppHeader />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-16 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !story) {
    return (
      <main className="min-h-screen bg-background" dir="rtl">
        <AppHeader />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold font-hebrew mb-4">
              הסיפור לא נמצא
            </h1>
            <p className="text-muted-foreground font-hebrew mb-8">
              {error ?? 'הסיפור שחיפשת לא קיים או הוסר'}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-hebrew font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לחיפוש
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const canViewExpansion = !!session;
  const concepts = [...story.conceptsAi, ...story.conceptsFromIndex];
  const prevId = neighbors?.prev?.id ?? null;
  const nextId = neighbors?.next?.id ?? null;

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <AppHeader />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-hebrew"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לחיפוש
            </Link>
          </motion.div>

          <motion.article
            className="glass-card rounded-2xl p-6 md:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Category badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {story.shasRefs.map((ref) => (
                <span
                  key={ref.shasPageId}
                  className="badge-shas px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  {ref.shasPage.masechet.name} {ref.shasPage.daf}{ref.shasPage.amud}
                </span>
              ))}
              {story.shuRefs.map((ref) => (
                <span
                  key={ref.shuSimanId}
                  className="badge-shulchan-aruch px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1"
                >
                  <Scale className="w-3 h-3" />
                  {ref.shuSiman.section.name} סי׳ {ref.shuSiman.siman}
                </span>
              ))}
              {concepts.map((concept, index) => (
                <span
                  key={index}
                  className="badge-concepts px-3 py-1 text-xs font-medium rounded-full"
                >
                  {concept}
                </span>
              ))}
              {story.videoUrl && (
                <span className="video-indicator">
                  <Video className="w-3 h-3" />
                  וידאו
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold font-hebrew mb-6">
              {story.title}
            </h1>

            {/* Story body */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold font-hebrew mb-3 text-primary">
                הסיפור
              </h2>
              <p className="text-foreground leading-relaxed font-hebrew whitespace-pre-wrap">
                {story.storyBody}
              </p>
            </div>

            {/* Legal question */}
            <div className="mb-8 p-4 rounded-xl bg-muted/50 border-r-4 border-primary">
              <h2 className="text-lg font-semibold font-hebrew mb-2">
                השאלה
              </h2>
              <p className="text-foreground font-hebrew">{story.legalQuestion}</p>
            </div>

            {/* Video embed */}
            {story.videoUrl && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold font-hebrew mb-3">
                  צפייה בוידאו
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <iframe
                    src={story.videoUrl.replace('watch?v=', 'embed/')}
                    title={story.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </motion.article>

          {/* Short Answer Panel */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ExpandableAnswerPanel
              title="תשובה קצרה"
              content={story.shortAnswer}
              variant="shortAnswer"
              defaultExpanded={false}
            />
          </motion.div>

          {/* Expansion Panel */}
          {story.expansion !== null && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ExpandableAnswerPanel
                title="הרחבה"
                content={story.expansion}
                variant="expansion"
                isLocked={!canViewExpansion}
                defaultExpanded={false}
                onRequestAccess={handleRequestAccess}
              />
            </motion.div>
          )}

          {/* Navigation */}
          {(prevId || nextId) && (
            <motion.div
              className="flex items-center justify-between gap-4 pt-6 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {prevId ? (
                <Link
                  href={`/story/${prevId}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-muted transition-colors font-hebrew text-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                  הסיפור הקודם
                </Link>
              ) : (
                <div />
              )}
              {nextId ? (
                <Link
                  href={`/story/${nextId}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-muted transition-colors font-hebrew text-sm"
                >
                  הסיפור הבא
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <div />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
