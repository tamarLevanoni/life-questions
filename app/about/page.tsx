import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { AboutHeroSection } from './_components/about-hero-section';
import { AboutBookSection } from './_components/about-book-section';
import { AboutAudienceSection } from './_components/about-audience-section';
import { AboutRecommendationsSection } from './_components/about-recommendations-section';
import { WhatsAppSection } from '@/app/_components/whatsapp-section';
import { AboutContactSection } from './_components/about-contact-section';
import { AboutJsonLd } from './_components/about-json-ld';

const ABOUT_TITLE = 'אודות | שאלות מהחיים — דיני ממונות לנוער מאת הרב איתן שנרב';
const ABOUT_DESCRIPTION =
  'שאלות מהחיים מאת הרב איתן שנרב — ספרים ופרויקט ללימוד דיני ממונות דרך שאלות אמיתיות מהחיים ומבית המדרש, לנוער, הורים, מורים ולציבור הרחב, עם הסכמות גדולי הדור.';

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  keywords: [
    'שאלות מהחיים',
    'דיני ממונות',
    'הרב איתן שנרב',
    'דיני ממונות לנוער',
    'הלכה למעשה',
    'לימוד תורה',
    'שאלות ותשובות בהלכה',
    'ספר הלכה',
    'בית מדרש',
  ],
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
  },
};

export default function AboutPage() {
  return (
    <PageShell maxWidth="4xl">
      <AboutJsonLd />
      <AboutHeroSection />
      <AboutBookSection />
      <AboutAudienceSection />
      <Suspense>
        <AboutRecommendationsSection />
      </Suspense>
      <WhatsAppSection />
      <AboutContactSection />
    </PageShell>
  );
}
