'use client';

import { Check } from 'lucide-react';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { useWhatsAppInvite } from '@/lib/whatsapp-context';
import { motion } from 'framer-motion';

const BULLETS = ['סיפור חדש כל שבוע', 'רעיונות לשיעורים', 'תכנים בלעדיים'];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ChatMockup() {
  return (
    <div className="relative max-w-xs mx-auto rounded-2xl bg-white/95 dark:bg-slate-50 p-4 shadow-2xl" dir="rtl">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
        <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <WhatsAppIcon className="w-4 h-4 text-white" />
        </span>
        <p className="text-xs font-hebrew font-semibold text-slate-700">קהילת שאלות מהחיים</p>
      </div>
      <div className="space-y-2">
        <div className="bg-slate-100 rounded-xl rounded-tr-sm px-3 py-2 self-start max-w-[80%]">
          <p className="text-[11px] font-hebrew text-slate-600">הסיפור החדש של השבוע עלה 🎉</p>
        </div>
        <div className="bg-green-100 rounded-xl rounded-tl-sm px-3 py-2 max-w-[80%] mr-auto">
          <p className="text-[11px] font-hebrew text-slate-700">איזה כיף, מתאים בדיוק לשיעור שלי</p>
        </div>
      </div>
    </div>
  );
}

export function WhatsAppSection() {
  const { openWhatsAppModal } = useWhatsAppInvite();

  return (
    <section className="py-8 md:py-16 px-4">
      <div className="max-w-5xl mx-auto rounded-3xl bg-brand-dark overflow-hidden relative">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-4 md:gap-8 p-5 md:p-12 items-center">
          <MotionFadeIn trigger="view" className="text-center md:text-right order-2 md:order-1">
            <h2 className="text-xl md:text-3xl font-bold font-hebrew text-white mb-3">
              מצטרפים לקהילה. מקבלים תוכן. כל שבוע.
            </h2>

            <ul className="space-y-2 mb-4 md:mb-6 inline-block text-right">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-white/80 font-hebrew text-xs md:text-sm">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <div>
              <button
                onClick={openWhatsAppModal}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-hebrew font-bold transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-green-500/25"
              >
                <WhatsAppIcon className="w-5 h-5" />
                הצטרפו לקבוצת ווצאפ
              </button>
            </div>
          </MotionFadeIn>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 md:order-2"
          >
            <ChatMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
