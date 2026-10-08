import Link from 'next/link';
import { Gift } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

export function WeeklyQuestionSection() {
  return (
    <section className="py-8 md:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <MotionFadeIn>
          <GlassCard className="p-6 md:p-10 text-center" variant="light">
            <Gift className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-3xl font-bold font-hebrew mb-2">השאלה השבועית</h2>
            <p className="text-sm md:text-base text-muted-foreground font-hebrew mb-6">
              עונים נכון על השאלה ההלכתית של השבוע ונכנסים להגרלה
            </p>
            <Link
              href="/weekly-question"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-hebrew font-medium text-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              לשאלה השבועית
            </Link>
          </GlassCard>
        </MotionFadeIn>
      </div>
    </section>
  );
}
