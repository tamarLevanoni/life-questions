import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { ProfileView } from './_components/profile-view';

export const metadata: Metadata = {
  title: 'הפרופיל שלי | שאלות מהחיים',
  robots: { index: false },
};

export default function ProfilePage() {
  return (
    <PageShell maxWidth="2xl">
      <ProfileView />
    </PageShell>
  );
}
