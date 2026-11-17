import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { SearchView } from './_components/search-view';

export const metadata: Metadata = {
  title: 'חיפוש סיפורים | שאלות מהחיים',
  description: 'מצאו סיפורים לפי מסכת ודף, שולחן ערוך וסימן, ספר או נושא — סננו את המאגר במקום לנחש מילות חיפוש.',
};

/** פותח את מסך החיפוש בתוך Suspense כדי שרכיב החיפוש יוכל לקרוא את הפרמטרים שבכתובת. */
export default function SearchPage() {
  return (
    <PageShell fullWidth className="min-h-0">
      <Suspense>
        <SearchView />
      </Suspense>
    </PageShell>
  );
}
