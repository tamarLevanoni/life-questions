import { SectionHeader } from '@/components/ui/section-header';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

const AUDIENCES = [
  {
    letter: 'א',
    description:
      'להורים שרוצים להעשיר את שולחן השבת שלהם בשאלות מעניינות לילדיהם ולתת להם לענות לפני שמגלים להם את התשובה (וראו איזה ויכוחים מעניינים יווצרו)',
  },
  {
    letter: 'ב',
    description:
      'למורים ומלמדים ותלמידים שרוצים בשיעור לתת מקום לדיון פורה בין התלמידים.',
  },
  {
    letter: 'ג',
    description:
      'לציבור הרחב, גם לאנשים עובדים שחשקה נפשם להתבונן בעניינים מעשיים אלו',
  },
  {
    letter: 'ד',
    description:
      'לנוער שמעניין אותו לדון בעניינים אלו ולדעת את דבר התורה בעניינים אלו.',
  },
];

export function AboutAudienceSection() {
  return (
    <section className="py-8 md:py-16">
      <SectionHeader title="למי מיועדים הספרים?" />
      <div className="grid sm:grid-cols-2 gap-3 md:gap-6">
        {AUDIENCES.map(({ letter, description }, index) => (
          <MotionFadeIn key={letter} delay={index * 0.1} trigger="view">
            <GlassCard className="p-4 md:p-6 h-full flex items-start gap-4">
              <span className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-teal-500/10 text-teal-500 font-bold font-hebrew flex items-center justify-center">
                {letter}
              </span>
              <p className="text-sm md:text-base text-foreground/80 font-hebrew leading-relaxed">
                {description}
              </p>
            </GlassCard>
          </MotionFadeIn>
        ))}
      </div>
    </section>
  );
}
