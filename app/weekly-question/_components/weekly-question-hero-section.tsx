import { Gift } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

export function WeeklyQuestionHeroSection() {
  return (
    <MotionFadeIn trigger="mount">
      <SectionHeader
        title="השאלה השבועית"
        subtitle="כל שבוע שאלה הלכתית חדשה — עונים נכון ונכנסים להגרלה"
      />
      <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 mb-8">
        <Gift className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm font-hebrew text-foreground/80 leading-relaxed">
          בין כל העונים נכון על השאלה השבועית תתקיים הגרלה. התשובה הנכונה
          מתפרסמת בשבוע העוקב.
        </p>
      </div>
    </MotionFadeIn>
  );
}
