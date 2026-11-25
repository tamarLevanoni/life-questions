import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/common/legal-document-page';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | שאלות מהחיים',
  description: 'מסמך הצהרת הנגישות של אתר שאלות מהחיים.',
};

export default function AccessibilityPage() {
  return <LegalDocumentPage title="הצהרת נגישות" documentName="accessibility-statement" />;
}
