import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { HeroSection } from './_components/hero-section';
import { IntroTextSection } from './_components/intro-text-section';
import { VideoSection } from './_components/video-section';
import { BooksGallerySection } from './_components/books-gallery-section';
import { BooksShopSection } from './_components/books-shop-section';
import { FeaturesSection } from './_components/features-section';
import { HowItWorksSection } from './_components/how-it-works-section';
import { StoryExamplesList } from './_components/story-examples-list';
import { WhatsAppSection } from './_components/whatsapp-section';
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
      <IntroTextSection />
      <VideoSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BooksGallerySection />
      <BooksShopSection />
      <StoryExamplesList />
      <WhatsAppSection />
      <HomeCTASection />
    </PageShell>
  );
}
