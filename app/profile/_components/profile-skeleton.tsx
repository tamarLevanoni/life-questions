import { AppHeader } from '@/components/layout/app-header';
import { SkeletonCardList } from '@/components/common/loading-skeleton';

export function ProfileSkeleton() {
  return (
    <>
      <AppHeader />
      <main dir="rtl" className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <SkeletonCardList count={3} />
        </div>
      </main>
    </>
  );
}
