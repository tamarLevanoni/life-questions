import { SectionHeader } from '@/components/ui/section-header';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

const steps = [
  { step: '1', title: 'סיפור', desc: 'קריאת סיפור קצר מהחיים' },
  { step: '2', title: 'שאלה', desc: 'התמודדות עם השאלה' },
  { step: '3', title: 'תשובה', desc: 'גילוי התשובה הקצרה' },
  { step: '4', title: 'הרחבה', desc: 'העמקה במקורות' },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <MotionFadeIn>
          <SectionHeader
            title="איך זה עובד?"
            subtitle="מבנה קבוע וברור שמאפשר לימוד מהיר ויעיל"
            size="sm"
          />
        </MotionFadeIn>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((item, index) => (
            <MotionFadeIn key={item.step} delay={index * 0.1} className="relative text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {item.step}
              </div>
              <h4 className="font-semibold font-hebrew mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground font-hebrew">{item.desc}</p>
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
