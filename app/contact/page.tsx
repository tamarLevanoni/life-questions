'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/layout/app-header';
import { ContactForm } from './_components/contact-form';
import { ContactSidebar } from './_components/contact-sidebar';

function ContactPageContent() {
  const searchParams = useSearchParams();
  const storyId    = searchParams.get('storyId');
  const storyTitle = searchParams.get('storyTitle');

  return (
    <>
      <AppHeader />
      <main dir="rtl" className="min-h-screen pt-24 pb-16 px-4">

        {/* Hero */}
        <div className="max-w-5xl mx-auto mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-hebrew bg-linear-to-l from-brand-teal to-brand-blue bg-clip-text text-transparent mb-3">
            צור קשר
          </h1>
          <p className="text-muted-foreground font-hebrew text-base max-w-xl mx-auto">
            יש לך שאלה, הצעה או בעיה טכנית? נשמח לשמוע ממך
          </p>
        </div>

        {/* Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <ContactForm storyId={storyId} storyTitle={storyTitle} />
          <ContactSidebar />
        </div>

      </main>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactPageContent />
    </Suspense>
  );
}
