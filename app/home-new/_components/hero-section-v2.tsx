'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWhatsAppInvite } from '@/lib/whatsapp-context';
import { HERO_IMAGE } from '@/lib/config/hero-image';


function HeroBackground() {
  if (HERO_IMAGE.url) {
    return (
      <div className="[grid-area:1/1] w-full aspect-2560/1280 bg-[#eef7fb] overflow-hidden relative">
        <img src={HERO_IMAGE.url} alt="" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-b from-transparent to-background pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="[grid-area:1/1] relative overflow-hidden pointer-events-none">
      <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-b from-transparent to-background pointer-events-none z-10" />
      <motion.div
        className="glow-teal"
        style={{ top: '5%', right: '-5%', width: '500px', height: '500px' }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="glow-blue"
        style={{ bottom: '10%', left: '-10%', width: '450px', height: '450px' }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full opacity-20 blur-3xl bg-amber-400"
        style={{ top: '50%', left: '40%', width: '300px', height: '300px' }}
        animate={{ x: [0, 20, 0], y: [0, -20, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function HeroSectionV2() {
  const { openWhatsAppModal } = useWhatsAppInvite();

  return (
    <section className="grid">
      <HeroBackground />

      <div className="[grid-area:1/1] relative flex items-center pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-center md:text-right mx-auto md:mx-0"
          >
            <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-500 text-sm font-hebrew font-medium"
          >
            מבוסס על סדרת הספרים שאלות מהחיים
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold font-noa-shalev mb-6 leading-tight">
            מצאו את הסיפור
            <br />
              המתאים{' '}
            <span className="bg-linear-to-l from-brand-teal via-[#06B6D4] to-brand-blue bg-clip-text text-transparent">
            בתוך שניות
            </span>
          </h1>

          <p className="text-lg text-muted-foreground font-hebrew max-w-xl md:mx-0 mx-auto mb-8 leading-relaxed">
            חפשו סיפורים לפי נושא, שאלה, מקור הלכתי או תיאור חופשי.
            <br />
            מושלם לשיעורים, לימוד עצמי, פעילויות ודיונים.
          </p>

          <div className="flex flex-col sm:flex-row items-center md:justify-start justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-hebrew font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-5 h-5" />
              התחל לחפש
            </Link>
            <a
              href="#featured"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 glass-card text-foreground rounded-xl font-hebrew font-medium hover:bg-white/80 dark:hover:bg-white/10 transition-all"
            >
              צפה בדוגמאות
            </a>
            <button
              onClick={openWhatsAppModal}
              className="inline-flex items-center gap-2 px-7 py-3.5 glass-card text-foreground rounded-xl font-hebrew font-medium hover:bg-white/80 dark:hover:bg-white/10 transition-all"
            >
              <WhatsAppIcon className="w-5 h-5" />
              הצטרפו לוואטסאפ
            </button>
          </div>


        </motion.div>
        </div>
      </div>
    </section>
  );
}
