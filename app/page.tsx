import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { HeroSection } from './_components/hero-section';
import { FeaturesSection } from './_components/features-section';
import { HowItWorksSection } from './_components/how-it-works-section';
import { FeaturedStoriesSection, FeaturedStoriesSkeleton } from './_components/featured-stories-section';
import { HomeCTASection } from './_components/home-cta-section';

export const metadata: Metadata = {
  title: 'שאלות מהחיים — מאגר סיפורים הלכתיים',
  description:
    'מאגר סיפורים הלכתיים מסודרים לפי סדר הש״ס, שולחן ערוך ונושאים. חיפוש מבוסס AI.',
};

export default function Home() {
  return (
    <PageShell fullWidth>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Suspense fallback={<FeaturedStoriesSkeleton />}>
        <FeaturedStoriesSection />
      </Suspense>
      <HomeCTASection />
    </PageShell>
  );
}
