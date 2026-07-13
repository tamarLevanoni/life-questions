import { MotionFadeIn } from '@/components/common/motion-fade-in';

export function AboutHeroSection() {
  return (
    <section className="text-center py-4 md:py-8">
      <MotionFadeIn trigger="mount">
        <div className="inline-block mb-3 md:mb-4 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-500 text-xs font-hebrew font-medium">
          הרב איתן שנרב
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-noa-shalev mb-2 md:mb-3">
          שאלות מהחיים
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground font-hebrew max-w-2xl mx-auto leading-relaxed">
          דיני ממונות לנוער
        </p>
      </MotionFadeIn>
    </section>
  );
}
