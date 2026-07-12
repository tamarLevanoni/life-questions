export function AppHeaderSkeleton() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <nav
        className="rounded-2xl px-4 md:px-6 h-14 flex items-center justify-between"
        style={{
          background: 'var(--nav-bg, rgba(255, 255, 255, 0.7))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--nav-border, rgba(255, 255, 255, 0.3))',
          boxShadow: 'var(--nav-shadow, 0 8px 32px rgba(0, 0, 0, 0.08))',
        }}
        dir="rtl"
      >
        <span className="text-lg md:text-xl font-bold font-hebrew bg-linear-to-l from-brand-teal via-[#06B6D4] to-brand-blue bg-clip-text text-transparent">
          שאלות מהחיים
        </span>
        <div className="w-9 h-9" />
      </nav>
    </header>
  );
}
