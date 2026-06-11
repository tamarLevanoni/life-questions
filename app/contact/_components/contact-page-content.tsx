'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStoriesStore } from '@/lib/stores/stories-store';
import { ContactForm } from './contact-form';
import { ContactSidebar } from './contact-sidebar';

export function ContactPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storyId    = searchParams.get('storyId');
  const storyTitle = searchParams.get('storyTitle');
  const storyInStore = useStoriesStore((s) => storyId ? s.stories[storyId] : undefined);
  const storyMissing = !!storyId && !storyInStore;

  useEffect(() => {
    if (storyMissing) router.replace('/contact');
  }, [storyMissing, router]);

  if (storyMissing) return null;

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-hebrew bg-linear-to-l from-brand-teal to-brand-blue bg-clip-text text-transparent mb-3">
          צור קשר
        </h1>
        <p className="text-muted-foreground font-hebrew text-base max-w-xl mx-auto">
          יש לך שאלה, הצעה או בעיה טכנית? נשמח לשמוע ממך
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6" dir="rtl">
        <ContactForm storyId={storyId} storyTitle={storyTitle} />
        <ContactSidebar />
      </div>
    </>
  );
}
