import Image from 'next/image';
import { SectionHeader } from '@/components/ui/section-header';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { getRecommendations } from '@/lib/server/recommendations';

export async function AboutRecommendationsSection() {
  const recommendations = await getRecommendations();

  if (!recommendations.length) return null;

  return (
    <section className="py-8 md:py-16">
      <SectionHeader title="הסכמות" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {recommendations.map(({ name, url }, index) => (
          <MotionFadeIn key={url} delay={index * 0.08} trigger="view">
            <GlassCard variant="light" className="p-2 overflow-hidden">
              <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-white">
                <Image
                  src={url}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-contain"
                />
              </div>
              <p className="text-xs font-hebrew text-center text-muted-foreground mt-2">{name}</p>
            </GlassCard>
          </MotionFadeIn>
        ))}
      </div>
    </section>
  );
}
