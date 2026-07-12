'use client';

import Link from 'next/link';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { getCategoryColor, getBookIcon } from '@/lib/config/category-colors';

export function StoryExamplesList() {
  const stories = useAppDataStore((s) => s.featuredStories);
  const books = useAppDataStore((s) => s.books);

  if (!stories.length) return null;

  return (
    <section id="featured"  className="py-16 px-4 scroll-mt-28">
      <div className="max-w-3xl mx-auto">
        <MotionFadeIn>
          <SectionHeader
            title="דוגמאות לסיפורים"
            subtitle="הנה כמה דוגמאות מתוך האוסף שלנו"
            size="sm"
            align="start"
          />
        </MotionFadeIn>

        <div className="flex flex-col gap-3" dir="rtl">
          {stories.map((story, index) => {
            const bookName = books.find((b) => b.id === story.bookId)?.name ?? '';
            const Icon = getBookIcon(bookName);
            const color = getCategoryColor(index);

            return (
              <MotionFadeIn key={story.id} delay={index * 0.1}>
                <Link
                  href={`/story/featured/${story.id}`}
                  className="story-card flex items-stretch overflow-hidden hover-lift"
                >
                  <div className={`w-1 shrink-0 ${color.bg}`} />

                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 m-3 rounded-xl overflow-hidden">
                    {story.imageUrl ? (
                      <>
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
                        />
                        <div className={`absolute inset-0 ${color.bg} mix-blend-color opacity-70`} />
                      </>
                    ) : (
                      <div className={`absolute inset-0 ${color.bg} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white/70" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center gap-1.5 py-3 pe-4 flex-1 min-w-0">
                    <span
                      className={`self-start px-2.5 py-0.5 rounded-full text-[11px] font-hebrew font-semibold ${color.bg} text-white`}
                    >
                      {story.topic.name}
                    </span>
                    <p className="font-hebrew font-bold text-base md:text-lg leading-snug line-clamp-2">
                      {story.title}
                    </p>
                  </div>
                </Link>
              </MotionFadeIn>
            );
          })}
        </div>

        <MotionFadeIn className="text-center mt-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 text-primary font-hebrew font-medium hover:underline"
          >
            לכל הסיפורים
            <span className="rtl-flip">←</span>
          </Link>
        </MotionFadeIn>
      </div>
    </section>
  );
}
