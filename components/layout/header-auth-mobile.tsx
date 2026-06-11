'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

export function HeaderAuthMobileSkeleton() {
  return <div className="w-full h-12 rounded-xl bg-muted animate-pulse" />;
}

export function HeaderAuthMobile({ onClose }: { onClose: () => void }) {
  const { data: session, status } = useSession();
  const { openLoginModal } = useAuth();
  const router = useRouter();

  if (status === 'loading') return <HeaderAuthMobileSkeleton />;

  const u = session?.user;
  const isAuthenticated = status === 'authenticated' && u?.isRegistrationComplete;

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => {
          openLoginModal();
          onClose();
        }}
        className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity font-hebrew"
      >
        התחברות
      </button>
    );
  }

  const displayName = [u?.firstName, u?.lastName].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 px-4 py-2">
        <Avatar className="w-8 h-8 border-2 border-brand-teal/30">
          <AvatarImage src={u?.image || undefined} alt={displayName || 'User'} />
          <AvatarFallback className="bg-linear-to-br from-brand-teal to-[#0D9488] text-white text-sm font-medium">
            {displayName?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate font-hebrew">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{u?.email}</p>
        </div>
      </div>
      <button
        onClick={() => {
          onClose();
          signOut({ redirect: false }).then(() => router.push('/'));
        }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-hebrew"
      >
        <LogOut className="w-5 h-5" />
        התנתקות
      </button>
    </div>
  );
}
