import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        <p className="text-6xl font-bold bg-gradient-to-l from-[#14B8A6] via-[#06B6D4] to-[#00C2FF] bg-clip-text text-transparent">
          404
        </p>
        <h2 className="text-xl font-bold font-hebrew">הדף לא נמצא</h2>
        <p className="text-muted-foreground font-hebrew text-sm">
          הדף שחיפשת לא קיים או שהוסר.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium font-hebrew hover:opacity-90 transition-opacity text-sm"
          >
            <Home className="w-4 h-4" />
            דף הבית
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 font-medium font-hebrew hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm"
          >
            <Search className="w-4 h-4" />
            חיפוש
          </Link>
        </div>
      </div>
    </div>
  );
}
