import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/common/legal-document-page';

export const metadata: Metadata = {
  title: 'מדיניות פרטיות | שאלות מהחיים',
  description: 'מסמך מדיניות הפרטיות של אתר שאלות מהחיים.',
};

export default function PrivacyPage() {
  return <LegalDocumentPage title="מדיניות פרטיות" documentName="privacy-policy" />;
}
