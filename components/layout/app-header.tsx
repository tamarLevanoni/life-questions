'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Search, Menu, X, Mail, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/search', label: 'חיפוש', icon: Search },
  { href: '/profile', label: 'אזור אישי', icon: User },
  { href: '/contact', label: 'צור קשר', icon: Mail },
];

export function AppHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      router.push('/');
    }
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Show loading state while mounting
  if (!mounted) {
    return (
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
        <nav
          className="rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between"
          style={{
            background: 'var(--nav-bg, rgba(255, 255, 255, 0.7))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--nav-border, rgba(255, 255, 255, 0.3))',
            boxShadow: 'var(--nav-shadow, 0 8px 32px rgba(0, 0, 0, 0.08))',
          }}
          dir="rtl"
        >
          <span className="text-lg md:text-xl font-bold text-foreground font-hebrew">
            שאלות מהחיים
          </span>
          <div className="w-9 h-9" />
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <nav
        className="rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between"
        style={{
          background: 'var(--nav-bg, rgba(255, 255, 255, 0.7))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--nav-border, rgba(255, 255, 255, 0.3))',
          boxShadow: 'var(--nav-shadow, 0 8px 32px rgba(0, 0, 0, 0.08))',
        }}
        dir="rtl"
      >
        {/* Logo/Title - RTL aligned */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span className="text-lg md:text-xl font-bold font-hebrew bg-gradient-to-l from-[#14B8A6] via-[#06B6D4] to-[#00C2FF] bg-clip-text text-transparent">
            שאלות מהחיים
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 font-hebrew ${
                  isActive
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side (Left in RTL) */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Quick Search Button - Mobile */}
          <Link
            href="/search"
            className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="חיפוש"
          >
            <Search className="w-5 h-5 text-foreground/70" />
          </Link>

          {/* User Avatar - Desktop */}
          <div className="hidden md:block">
            {status === 'loading' ? (
              <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative rounded-full ring-2 ring-transparent hover:ring-[#14B8A6]/50 transition-all duration-200">
                    <Avatar className="w-9 h-9 border-2 border-[#14B8A6]/30">
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] text-white text-sm font-medium">
                        {session.user.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 glass-panel border-black/10 dark:border-white/10"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground font-hebrew">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer font-hebrew"
                  >
                    <Link href="/profile">
                      <User className="w-4 h-4 ml-2" />
                      אזור אישי
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-500 hover:text-red-600 cursor-pointer font-hebrew"
                  >
                    <LogOut className="w-4 h-4 ml-2" />
                    התנתקות
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium font-hebrew hover:opacity-90 transition-opacity"
              >
                התחברות
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="תפריט"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground/70" />
            ) : (
              <Menu className="w-5 h-5 text-foreground/70" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden mt-2 rounded-2xl p-4 space-y-1"
          style={{
            background: 'var(--nav-bg, rgba(255, 255, 255, 0.95))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--nav-border, rgba(255, 255, 255, 0.3))',
            boxShadow: 'var(--nav-shadow, 0 8px 32px rgba(0, 0, 0, 0.12))',
          }}
          dir="rtl"
        >
          {/* Home link */}
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-medium font-hebrew"
          >
            <Home className="w-5 h-5" />
            דף הבית
          </Link>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium font-hebrew ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}

          {/* Mobile User Section */}
          <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/10">
            {session?.user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar className="w-8 h-8 border-2 border-[#14B8A6]/30">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || 'User'}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] text-white text-xs font-medium">
                      {session.user.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate font-hebrew">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-hebrew"
                >
                  <LogOut className="w-5 h-5" />
                  התנתקות
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signIn('google');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity font-hebrew"
              >
                התחברות עם Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
