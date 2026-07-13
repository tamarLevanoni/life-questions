import { ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { BOOK_SHOP_URL } from '@/lib/config/book-shop';

export function AboutBookSection() {
  return (
    <section className="py-8 md:py-16">
      <MotionFadeIn trigger="view">
        <GlassCard variant="light" className="p-5 md:p-8">
          <div className="space-y-4 text-sm md:text-base text-foreground/80 font-hebrew leading-relaxed">
            <p>
              דיני ממונות הינם דינים שנתקלים בהם כל הזמן בחיי היום יום. בין אם
              זה במציאה ברחוב, בשמירה על תיק של חבר, בשאילה או שכירות של בית,
              רכב או אפילו עט, בחתימת חוזה בעבודה, בהיזק הנגרם בתאונה לא
              עלינו, בנתינת טיפ למלצר, ועוד ועוד.
            </p>
            <p>
              מי שלומד דיני ממונות מרגיש ממש איך התורה נכנסת לתוך חיי המעשה
              שלנו, וגם דברים הנראים רחוקים מהקדושה ומהשכינה הופכים להיות
              חלק מעולם התורה והמידות.
            </p>
            <p>
              נטיית הלב שלי היא להפוך את הלימוד התאורטי למעשי וממשי, וכך
              במהלך לימוד הסימנים כתבתי שאלות ותשובות העלולים להתרחש בימינו
              וכן שאלות בדינים אלו שנשאלתי בבית המדרש ע&quot;י תלמידי הישיבה
              התיכונית הסמוכים לה.
            </p>
          </div>
          <a
            href={BOOK_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-base md:text-lg font-bold font-hebrew text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            כנסו לחנות הספרים
            <ArrowLeft className="w-5 h-5" />
          </a>
        </GlassCard>
      </MotionFadeIn>
    </section>
  );
}
