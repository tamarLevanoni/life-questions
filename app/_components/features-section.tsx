import { BookOpen, Sparkles, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

const features = [
  {
    icon: BookOpen,
    title: 'סיפורים מהחיים',
    description: 'סיפורים אמיתיים וקצרים — מושלמים לשיעור, לדיון בכיתה, לשיחת שבת',
    gradient: 'from-teal-500 to-cyan-400',
    bg: 'bg-teal-500/10',
    text: 'text-teal-500',
  },
  {
    icon: Sparkles,
    title: 'חיפוש חכם מבוסס AI',
    description: 'חפש לפי נושא, מקרה, או ביטוי — ה-AI ימצא את הסיפור הנכון תוך שניות',
    gradient: 'from-amber-500 to-yellow-400',
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
  },
  {
    icon: Users,
    title: 'לכל הקהלים',
    description: 'מתאים למורים, רבנים, הורים, תלמידים — ולכל מי שרוצה ללמוד בקלות',
    gradient: 'from-green-500 to-emerald-400',
    bg: 'bg-green-500/10',
    text: 'text-green-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-8 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-3 md:gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <MotionFadeIn key={feature.title} delay={index * 0.1} trigger="view">
                <GlassCard className="p-4 md:p-6 text-center h-full group hover:border-white/30 transition-all">
                  <div className={`w-10 h-10 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 rounded-2xl ${feature.bg} flex items-center justify-center transition-all group-hover:scale-110`}>
                    <Icon className={`w-5 h-5 md:w-7 md:h-7 ${feature.text}`} />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold font-hebrew mb-2">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-hebrew leading-relaxed">{feature.description}</p>
                </GlassCard>
              </MotionFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
