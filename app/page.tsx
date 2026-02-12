'use client';

import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { Footer } from '@/components/layout/footer';
import { ScenarioCard } from '@/components/story/scenario-card';
import { mockStories } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: BookOpen,
    title: 'סיפורים מהחיים',
    description: 'סיפורים אמיתיים וקצרים שקל להזדהות איתם',
  },
  {
    icon: Sparkles,
    title: 'תשובות ברורות',
    description: 'מבנה קבוע: סיפור, שאלה, תשובה והרחבה',
  },
  {
    icon: Users,
    title: 'לכל הקהלים',
    description: 'מתאים ללומדים, מורים, הורים ותלמידים',
  },
];

export default function Home() {
  const router = useRouter();
  const featuredStories = mockStories.slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground" dir="rtl">
      <AppHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="glow-teal"
            style={{ top: '10%', right: '-10%' }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="glow-blue"
            style={{ bottom: '20%', left: '-5%' }}
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main title */}
            <h1 className="text-4xl md:text-6xl font-bold font-hebrew mb-6">
              <span className="bg-gradient-to-l from-[#14B8A6] via-[#06B6D4] to-[#00C2FF] bg-clip-text text-transparent">
                שאלות מהחיים
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground font-hebrew max-w-2xl mx-auto mb-8 leading-relaxed">
              לימוד קצר, משמעותי ומחובר למציאות.
              <br />
              סיפורים אמיתיים מחיי היום-יום עם תשובות ברורות ונגישות.
            </p>

            {/* CTA Buttons */}
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

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="glass-card p-6 rounded-2xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold font-hebrew mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-hebrew">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-hebrew mb-4">
              איך זה עובד?
            </h2>
            <p className="text-muted-foreground font-hebrew">
              מבנה קבוע וברור שמאפשר לימוד מהיר ויעיל
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'סיפור', desc: 'קריאת סיפור קצר מהחיים' },
              { step: '2', title: 'שאלה', desc: 'התמודדות עם השאלה' },
              { step: '3', title: 'תשובה', desc: 'גילוי התשובה הקצרה' },
              { step: '4', title: 'הרחבה', desc: 'העמקה במקורות' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold font-hebrew mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground font-hebrew">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section id="featured" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-hebrew mb-4">
              דוגמאות לסיפורים
            </h2>
            <p className="text-muted-foreground font-hebrew">
              הנה כמה דוגמאות מתוך האוסף שלנו
            </p>
          </motion.div>

          <div className="grid gap-4">
            {featuredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ScenarioCard
                  story={story}
                  onClick={() => router.push(`/story/${story.id}`)}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 text-primary font-hebrew font-medium hover:underline"
            >
              לכל הסיפורים
              <span className="rtl-flip">←</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-12 rounded-3xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-hebrew mb-4">
              מוכנים להתחיל?
            </h2>
            <p className="text-muted-foreground font-hebrew mb-8 max-w-md mx-auto">
              התחברו כדי לגשת לכל התכנים ולשמור את ההתקדמות שלכם
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-hebrew font-medium text-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-5 h-5" />
              התחל לחפש
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
