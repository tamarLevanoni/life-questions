import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/common/page-shell';
import { ProfileView } from './_components/profile-view';
import { ProfileSkeleton } from './_components/profile-skeleton';

export const metadata: Metadata = {
  title: 'הפרופיל שלי | שאלות מהחיים',
  robots: { index: false },
};

export default function ProfilePage() {
  return (
    <PageShell maxWidth="2xl">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileView />
      </Suspense>
    </PageShell>
  );
}
