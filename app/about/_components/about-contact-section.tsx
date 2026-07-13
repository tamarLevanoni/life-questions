import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { CONTACT_INFO } from '@/app/contact/_components/contact-sidebar';

export function AboutContactSection() {
  return (
    <section className="py-8 md:py-16">
      <SectionHeader title="יצירת קשר" />
      <MotionFadeIn trigger="view">
        <GlassCard variant="light" className="p-5 md:p-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-hebrew">{label}</p>
                  <p className="text-sm font-medium font-hebrew">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium font-hebrew text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            לצור קשר המלא
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </GlassCard>
      </MotionFadeIn>
    </section>
  );
}
