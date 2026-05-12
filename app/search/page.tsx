import { AppHeader } from '@/components/layout/app-header';
import { SearchClient } from '@/components/search/search-client';

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <AppHeader />
      <SearchClient />
    </main>
  );
}
