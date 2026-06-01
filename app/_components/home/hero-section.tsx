'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="glow-teal"
          style={{ top: '10%', right: '-10%' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="glow-blue"
          style={{ bottom: '20%', left: '-5%' }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-hebrew mb-6">
            <span className="bg-gradient-to-l from-[#14B8A6] via-[#06B6D4] to-[#00C2FF] bg-clip-text text-transparent">
              שאלות מהחיים
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-hebrew max-w-2xl mx-auto mb-8 leading-relaxed">
            לימוד קצר, משמעותי ומחובר למציאות.
            <br />
            סיפורים אמיתיים עם תשובות ברורות — וחיפוש חכם מבוסס AI שמוצא בדיוק את מה שאתה צריך.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-hebrew font-medium text-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-5 h-5" />
              התחל לחפש
            </Link>
            <Link
              href="#featured"
              className="inline-flex items-center gap-2 px-8 py-4 glass-card text-foreground rounded-xl font-hebrew font-medium text-lg hover:bg-white/80 dark:hover:bg-white/10 transition-all"
            >
              צפה בדוגמאות
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
