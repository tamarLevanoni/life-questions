import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { AppHeader } from '@/components/layout/app-header';
import { AppHeaderSkeleton } from '@/components/layout/app-header-skeleton';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

interface PageShellProps {
  children: React.ReactNode;
  maxWidth?: MaxWidth;
  fullWidth?: boolean;
  className?: string;
}

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
};

export function PageShell({ children, maxWidth = '4xl', fullWidth = false, className }: PageShellProps) {
  return (
    <>
      <Suspense fallback={<AppHeaderSkeleton />}>
        <AppHeader />
      </Suspense>
      <main className="min-h-screen bg-background" dir="rtl">
        {fullWidth ? children : (
          <div className="pt-24 pb-12 px-4">
            <div className={cn(maxWidthClasses[maxWidth], 'mx-auto', className)}>
              {children}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
