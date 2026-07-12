import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { HeroSectionV2 } from './_components/hero-section-v2';
import { VideoSection } from './_components/video-section';
import { BooksGallerySection } from './_components/books-gallery-section';
import { FeaturesSectionV2 } from './_components/features-section-v2';
import { HowItWorksV2 } from './_components/how-it-works-v2';
import { StoryExamplesList } from './_components/story-examples-list';
import { WhatsAppSection } from './_components/whatsapp-section';
import { HomeCTASection } from '../_components/home-cta-section';

export const metadata: Metadata = {
  title: 'שאלות מהחיים — מאגר סיפורים הלכתיים',
  description:
    'מאגר סיפורים הלכתיים מסודרים לפי סדר הש״ס, שולחן ערוך ונושאים. חיפוש מבוסס AI.',
};

export default function HomeNew() {
  return (
    <PageShell fullWidth>
      <HeroSectionV2 />
      <VideoSection />
      <BooksGallerySection />
      <FeaturesSectionV2 />
      <HowItWorksV2 />
      <StoryExamplesList />
      <WhatsAppSection />
      <HomeCTASection />
    </PageShell>
  );
}
