import { BookOpen, Sparkles, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

const features = [
  {
    icon: BookOpen,
    title: 'סיפורים מהחיים',
    description: 'סיפורים אמיתיים וקצרים שקל להזדהות איתם',
  },
  {
    icon: Sparkles,
    title: 'חיפוש חכם מבוסס AI',
    description: 'חפש לפי שם סיפור, מקור תלמודי, נושא — ה-AI ימצא בשבילך',
  },
  {
    icon: Users,
    title: 'לכל הקהלים',
    description: 'מתאים ללומדים, מורים, הורים ותלמידים',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <MotionFadeIn key={feature.title} delay={index * 0.1}>
                <GlassCard className="p-6 text-center h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold font-hebrew mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground font-hebrew">{feature.description}</p>
                </GlassCard>
              </MotionFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
