import { GlassCard } from '@/components/ui/glass-card';
import { WEEKLY_QUESTION_FORM_URL } from '@/lib/config/weekly-question';

export function WeeklyQuestionFormEmbed() {
  return (
    <GlassCard variant="light" className="p-2 md:p-4">
      <iframe
        src={WEEKLY_QUESTION_FORM_URL}
        className="w-full rounded-xl"
        height={1761}
        title="השאלה השבועית"
      >
        בטעינה…
      </iframe>
    </GlassCard>
  );
}
