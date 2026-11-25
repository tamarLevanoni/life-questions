import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/common/legal-document-page';

export const metadata: Metadata = {
  title: 'תנאי שימוש | שאלות מהחיים',
  description: 'מסמך תנאי השימוש באתר שאלות מהחיים.',
};

export default function TermsPage() {
  return <LegalDocumentPage title="תנאי שימוש" documentName="terms-of-use" />;
}
