import Link from 'next/link';
import { Search } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

export function HomeCTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <MotionFadeIn>
          <GlassCard className="p-8 md:p-12 text-center">
            <h2 className="text-xl md:text-3xl font-bold font-hebrew mb-4">מוכנים להתחיל?</h2>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-hebrew font-medium text-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-5 h-5" />
              התחל לחפש
            </Link>
          </GlassCard>
        </MotionFadeIn>
      </div>
    </section>
  );
}
