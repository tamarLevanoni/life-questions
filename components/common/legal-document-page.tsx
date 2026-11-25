import { PageShell } from '@/components/common/page-shell';
import { Button } from '@/components/ui/button';
import { PdfViewer } from '@/components/common/pdf-viewer';

interface LegalDocumentPageProps {
  title: string;
  documentName: string;
}

export function LegalDocumentPage({ title, documentName }: LegalDocumentPageProps) {
  const documentUrl = `https://res.cloudinary.com/dasrirtzp/image/upload/stories-app/legal-documents/${documentName}.pdf`;

  return (
    <PageShell maxWidth="4xl">
      <header className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <Button asChild variant="outline">
          <a href={documentUrl} target="_blank" rel="noopener noreferrer">
            המסמך המקורי (PDF, לשונית חדשה)
          </a>
        </Button>
      </header>
      <PdfViewer key={documentUrl} url={documentUrl} title={title} />
    </PageShell>
  );
}
