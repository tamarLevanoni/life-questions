import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { WeeklyQuestionHeroSection } from './_components/weekly-question-hero-section';
import { WeeklyQuestionFormEmbed } from './_components/weekly-question-form-embed';

const TITLE = 'השאלה השבועית | שאלות מהחיים';
const DESCRIPTION = 'ענו על השאלה ההלכתית השבועית והיכנסו להגרלה בין העונים נכונה.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
  },
};

export default function WeeklyQuestionPage() {
  return (
    <PageShell maxWidth="2xl">
      <WeeklyQuestionHeroSection />
      <WeeklyQuestionFormEmbed />
    </PageShell>
  );
}
