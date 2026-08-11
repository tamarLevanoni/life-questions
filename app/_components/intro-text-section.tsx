import { MotionFadeIn } from '@/components/common/motion-fade-in';

export function IntroTextSection() {
  return (
    <section className="py-10 md:py-16 px-4">
      <MotionFadeIn trigger="view" className="max-w-4xl mx-auto text-center">
        <p className="text-lg md:text-2xl font-hebrew leading-relaxed md:leading-relaxed text-foreground">
          מאגר של <span className="font-bold text-primary">יותר מ־1,000 שאלות וסיפורים מהחיים</span>, המחברים את השולחן ערוך והגמרא למצבים אמיתיים מהעולם של ימינו.
          <br className="hidden md:block" />
          <span className="block mt-2 md:mt-3 text-base md:text-xl text-muted-foreground">
            חפשו לפי נושא או מקרה, קראו את הסיפור, גלו מהי השאלה ההלכתית – ולמדו את התשובה והמקורות בצורה פשוטה, מעניינת ומעשית.
          </span>
        </p>
      </MotionFadeIn>
    </section>
  );
}
