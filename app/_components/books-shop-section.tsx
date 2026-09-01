'use client';

import Image from 'next/image';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { SHOP_URL, BOOKS_SET_IMAGE_URL } from '@/lib/config/shop';

export function BooksShopSection() {
  return (
    <section className="py-10 md:py-20 px-4">
      {/* Wrap the frame+image cluster in a content-sized flex group so the pair centers as a unit — a grid track would leave the vacated space empty and skew the visual balance */}
      <div className="max-w-5xl mx-auto flex justify-center" dir="rtl">
        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-0">
          {/* Text sits inside its own frame */}
          <div className="w-full md:w-140 rounded-2xl border-4 border-amber-500/40 dark:border-amber-400/30 text-center md:text-right relative z-0 p-6 md:p-10">
            <MotionFadeIn trigger="view" delay={0}>
              <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-hebrew font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1">
                <BookOpen className="w-3.5 h-3.5" />
                המארז המלא, מודפס
              </span>
            </MotionFadeIn>

            <MotionFadeIn trigger="view" delay={0.1}>
              <h2 className="mt-4 font-noa-shalev text-4xl md:text-6xl leading-[1.05] text-brand-dark dark:text-white">
                שאלות מהחיים
              </h2>
            </MotionFadeIn>

            <MotionFadeIn trigger="view" delay={0.2}>
              <p className="mt-2 text-base md:text-2xl font-hebrew font-bold text-amber-700 dark:text-amber-300">
                עכשיו גם על המדף שלכם
              </p>
            </MotionFadeIn>

            <MotionFadeIn trigger="view" delay={0.3}>
              <p className="mt-3 md:mt-4 text-sm md:text-base font-hebrew text-brand-dark/70 dark:text-white/70 max-w-md mx-auto md:mx-0 leading-relaxed">
                כל הסיפורים בצורה מסודרת ומעוצבת - מתנה מושלמת ללימוד, לשיעור ולבית.
              </p>
            </MotionFadeIn>

            <MotionFadeIn trigger="view" delay={0.4}>
              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 md:mt-8 inline-flex items-center gap-2 px-7 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-hebrew font-bold text-base md:text-lg -rotate-1 transition-all hover:rotate-0 hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-amber-500/30"
              >
                למעבר לחנות
                <ArrowLeft className="w-5 h-5" />
              </a>
            </MotionFadeIn>
          </div>

          {/* Image sits beside the frame and rises above it */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 md:-mr-16"
          >
            <Image
              src={BOOKS_SET_IMAGE_URL}
              alt="מארז הספרים שאלות מהחיים"
              width={800}
              height={800}
              className="w-full max-w-85 md:max-w-110 h-auto object-contain drop-shadow-2xl mt-2 md:mt-4"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
