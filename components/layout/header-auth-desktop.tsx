'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';

export function HeaderAuthDesktopSkeleton() {
  return <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />;
}

export function HeaderAuthDesktop() {
  const { data: session, status } = useSession();
  const { openLoginModal } = useAuth();
  const router = useRouter();

  if (status === 'loading') return <HeaderAuthDesktopSkeleton />;

  const u = session?.user;
  const isAuthenticated = status === 'authenticated' && u?.isRegistrationComplete;

  if (!isAuthenticated) {
    return (
      <button
        onClick={openLoginModal}
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium font-hebrew hover:opacity-90 transition-opacity"
      >
        התחברות
      </button>
    );
  }

  const displayName = [u?.firstName, u?.lastName].filter(Boolean).join(' ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full ring-2 ring-transparent hover:ring-brand-teal/50 transition-all duration-200">
          <Avatar className="w-9 h-9 border-2 border-brand-teal/30">
            <AvatarImage src={u?.image || undefined} alt={displayName || 'User'} />
            <AvatarFallback className="bg-linear-to-br from-brand-teal to-[#0D9488] text-white text-sm font-medium">
              {displayName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 glass-panel border-black/10 dark:border-white/10"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground font-hebrew">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{u?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer font-hebrew">
          <Link href="/profile">
            <User className="w-4 h-4 ml-2" />
            אזור אישי
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ redirect: false }).then(() => router.push('/'))}
          className="text-red-500 hover:text-red-600 cursor-pointer font-hebrew"
        >
          <LogOut className="w-4 h-4 ml-2" />
          התנתקות
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
