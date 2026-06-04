'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/stores/user-store';
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
  const authStatus = useUserStore((s) => s.authStatus);
  const user = useUserStore((s) => s.user);
  const image = useUserStore((s) => s.image);
  const { openLoginModal } = useAuth();
  const router = useRouter();

  if (authStatus === 'idle') return <HeaderAuthDesktopSkeleton />;

  if (!user) {
    return (
      <button
        onClick={openLoginModal}
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium font-hebrew hover:opacity-90 transition-opacity"
      >
        התחברות
      </button>
    );
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full ring-2 ring-transparent hover:ring-brand-teal/50 transition-all duration-200">
          <Avatar className="w-9 h-9 border-2 border-brand-teal/30">
            <AvatarImage src={image || undefined} alt={displayName || 'User'} />
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
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
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
