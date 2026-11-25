'use client';

import dynamic from 'next/dynamic';

const PdfDocument = dynamic(() => import('./pdf-document'), {
  ssr: false,
  loading: () => <p role="status" className="py-8 text-muted-foreground">טוען את המסמך…</p>,
});

export function PdfViewer({ url, title }: { url: string; title: string }) {
  return <PdfDocument url={url} title={title} />;
}
