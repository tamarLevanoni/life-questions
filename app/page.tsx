import { AppHeader } from '@/components/layout/app-header';
import { HeroSection } from './_components/home/hero-section';
import { FeaturesSection } from './_components/home/features-section';
import { HowItWorksSection } from './_components/home/how-it-works-section';
import { FeaturedStoriesSection } from './_components/home/featured-stories-section';
import { HomeCTASection } from './_components/home/home-cta-section';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground" dir="rtl">
      <AppHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedStoriesSection />
      <HomeCTASection />
    </main>
  );
}
