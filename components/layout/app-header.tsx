'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { User, Search, Menu, X, Mail, Home } from 'lucide-react';
import { HeaderAuthDesktopSkeleton } from './header-auth-desktop';
import { HeaderAuthMobileSkeleton } from './header-auth-mobile';

const HeaderAuthDesktop = dynamic(
  () => import('./header-auth-desktop').then((m) => m.HeaderAuthDesktop),
  { ssr: false, loading: () => <HeaderAuthDesktopSkeleton /> }
);

const HeaderAuthMobile = dynamic(
  () => import('./header-auth-mobile').then((m) => ({ default: m.HeaderAuthMobile })),
  { ssr: false, loading: () => <HeaderAuthMobileSkeleton /> }
);

const navLinks = [
  { href: '/search', label: 'חיפוש', icon: Search },
  { href: '/profile', label: 'אזור אישי', icon: User },
  { href: '/contact', label: 'צור קשר', icon: Mail },
];

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => setMobileMenuOpen(false);

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
        <button onClick={handleLogoClick} className="flex items-center gap-2 shrink-0 cursor-pointer">
          <span className="text-lg md:text-xl font-bold font-hebrew bg-linear-to-l from-brand-teal via-[#06B6D4] to-brand-blue bg-clip-text text-transparent">
            שאלות מהחיים
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 font-hebrew ${
                  isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Link
            href="/search"
            className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="חיפוש"
          >
            <Search className="w-5 h-5 text-foreground/70" />
          </Link>

          <div className="hidden md:block">
            <Suspense fallback={<HeaderAuthDesktopSkeleton />}>
              <HeaderAuthDesktop />
            </Suspense>
          </div>

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

          <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/10">
            <Suspense fallback={<HeaderAuthMobileSkeleton />}>
              <HeaderAuthMobile onClose={handleLinkClick} />
            </Suspense>
          </div>
        </div>
      )}
    </header>
  );
}
