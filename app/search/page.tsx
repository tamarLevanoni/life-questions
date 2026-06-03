import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { SearchView } from './_components/search-view';

export const metadata: Metadata = {
  title: 'חיפוש סיפורים | שאלות מהחיים',
  description: 'חיפוש מבוסס AI במאגר הסיפורים — לפי מסכת, שולחן ערוך, נושא ומקור.',
};

export default function SearchPage() {
  return (
    <PageShell fullWidth>
      <SearchView />
    </PageShell>
  );
}
