import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { ContactPageContent } from './_components/contact-page-content';

export const metadata: Metadata = {
  title: 'צור קשר | שאלות מהחיים',
  description: 'יש לך שאלה, הצעה או בעיה טכנית? נשמח לשמוע ממך.',
};

export default function ContactPage() {
  return (
    <PageShell maxWidth="5xl">
      <Suspense>
        <ContactPageContent />
      </Suspense>
    </PageShell>
  );
}
