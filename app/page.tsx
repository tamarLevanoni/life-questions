import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { StoreHydrator } from '@/components/common/store-hydrator';
import { getFeaturedFullStories } from '@/lib/server/stories';
import { getReference } from '@/lib/server/reference';
import { HeroSection } from './_components/hero-section';
import { FeaturesSection } from './_components/features-section';
import { HowItWorksSection } from './_components/how-it-works-section';
import { FeaturedStoriesSection } from './_components/featured-stories-section';
import { HomeCTASection } from './_components/home-cta-section';

export const metadata: Metadata = {
  title: 'שאלות מהחיים — מאגר סיפורים הלכתיים',
  description:
    'מאגר סיפורים הלכתיים מסודרים לפי סדר הש״ס, שולחן ערוך ונושאים. חיפוש מבוסס AI.',
};

export default async function Home() {
  const [featured, reference] = await Promise.all([
    getFeaturedFullStories(),
    getReference(),
  ]);

  return (
    <PageShell fullWidth>
      <StoreHydrator reference={reference}>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FeaturedStoriesSection stories={featured} />
        <HomeCTASection />
      </StoreHydrator>
    </PageShell>
  );
}
