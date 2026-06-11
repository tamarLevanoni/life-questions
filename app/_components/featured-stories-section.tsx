'use client';

import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { MotionFadeIn } from "@/components/common/motion-fade-in";
import { FeaturedStoryCard } from "./featured-story-card";
import { useAppDataStore } from "@/lib/stores/app-data-store";

export function FeaturedStoriesSection() {
  const stories = useAppDataStore((s) => s.featuredStories);

  return (
    <section id="featured" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <MotionFadeIn>
          <SectionHeader
            title="דוגמאות לסיפורים"
            subtitle="הנה כמה דוגמאות מתוך האוסף שלנו"
            size="sm"
          />
        </MotionFadeIn>

        <div className="grid gap-4">
          {stories.map((story, index) => (
            <MotionFadeIn key={story.id} delay={index * 0.1}>
              <FeaturedStoryCard story={story} delay={index * 0.1} />
            </MotionFadeIn>
          ))}
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
