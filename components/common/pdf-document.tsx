'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PdfDocument({ url, title }: { url: string; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container}>
      <Document
        file={url}
        suspense={false}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<p role="status" className="py-8 text-muted-foreground">טוען את המסמך…</p>}
        error={
          <p role="alert" className="py-8 text-destructive">
            לא ניתן להציג את המסמך כרגע. אפשר לפתוח את המסמך המקורי בקישור למעלה.
          </p>
        }
        className="space-y-6"
        externalLinkTarget="_blank"
        externalLinkRel="noopener noreferrer"
      >
        {width > 0 && Array.from({ length: numPages }, (_, index) => (
          <section key={index + 1} aria-label={`${title}, עמוד ${index + 1} מתוך ${numPages}`}>
            <Page
              pageNumber={index + 1}
              width={width}
              loading={<p role="status" className="py-8 text-muted-foreground">טוען עמוד {index + 1}…</p>}
              error={<p role="alert" className="py-8 text-destructive">לא ניתן להציג את עמוד {index + 1}.</p>}
            />
          </section>
        ))}
      </Document>
    </div>
  );
}
