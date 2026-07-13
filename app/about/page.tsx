import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { AboutHeroSection } from './_components/about-hero-section';
import { AboutBookSection } from './_components/about-book-section';
import { AboutAudienceSection } from './_components/about-audience-section';
import { AboutRecommendationsSection } from './_components/about-recommendations-section';
import { WhatsAppSection } from '@/app/_components/whatsapp-section';
import { AboutContactSection } from './_components/about-contact-section';

export const metadata: Metadata = {
  title: 'אודות | שאלות מהחיים',
  description:
    'שאלות מהחיים מאת הרב איתן שנרב — ספר ופרויקט לימוד דיני ממונות דרך שאלות מהחיים האמיתיים.',
};

export default function AboutPage() {
  return (
    <PageShell maxWidth="4xl">
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
