import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { StoreHydrator } from '@/components/common/store-hydrator';
import { getReference } from '@/lib/server/reference';
import { SearchView } from './_components/search-view';

export const metadata: Metadata = {
  title: 'חיפוש סיפורים | שאלות מהחיים',
  description: 'חיפוש מבוסס AI במאגר הסיפורים — לפי מסכת, שולחן ערוך, נושא ומקור.',
};

export default async function SearchPage() {
  const reference = await getReference();
  return (
    <PageShell fullWidth>
      <StoreHydrator reference={reference}>
        <SearchView />
      </StoreHydrator>
    </PageShell>
  );
}
