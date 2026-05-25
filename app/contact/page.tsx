'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlassCard } from '@/components/ui/glass-card';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/lib/toast-context';
import { contactSchema, type ContactFormData, type ContactCategory } from '@/lib/schemas';
import {
  Mail,
  Bug,
  Handshake,
  Send,
  ExternalLink,
  Phone,
  Clock,
  MessageSquare,
  CheckCircle,
  Globe,
} from 'lucide-react';

const CATEGORIES: { value: ContactCategory; label: string; icon: typeof Mail }[] = [
  { value: 'general',       label: 'פנייה כללית',    icon: MessageSquare },
  { value: 'bug',           label: 'בעיה טכנית',     icon: Bug },
  { value: 'collaboration', label: 'שיתוף פעולה',    icon: Handshake },
];

const CONTACT_INFO = [
  { icon: Mail,  label: 'אימייל',      value: 'contact@example.com' },
  { icon: Phone, label: 'טלפון',       value: '000-0000000' },
  { icon: Clock, label: 'שעות מענה',   value: 'א׳–ה׳, 09:00–18:00' },
];

const OTHER_PROJECTS = [
  { name: 'שם פרויקט א׳', description: 'תיאור קצר של הפרויקט', url: '#' },
  { name: 'שם פרויקט ב׳', description: 'תיאור קצר של הפרויקט', url: '#' },
];

const MAIN_SITE_URL = '#';

export default function ContactPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<ContactCategory>('general');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { category: 'general' },
  });

  useEffect(() => {
    if (session?.user) {
      const name = [session.user.firstName, session.user.lastName].filter(Boolean).join(' ') || session.user.name || '';
      if (name)               setValue('name',  name);
      if (session.user.email) setValue('email', session.user.email);
    }
  }, [session, setValue]);

  const handleCategoryChange = (cat: ContactCategory) => {
    setCategory(cat);
    setValue('category', cat, { shouldValidate: false });
    if (cat !== 'bug') setValue('pageUrl', '');
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'שגיאה בשליחה');
      showToast('הפנייה נשלחה בהצלחה!', 'success');
      reset({ category: 'general' });
      setCategory('general');
      setSubmitted(true);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'שגיאה בשליחת הפנייה. אנא נסה שוב.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main dir="rtl" className="min-h-screen pt-24 pb-16 px-4">

        {/* Hero */}
        <div className="max-w-5xl mx-auto mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-hebrew bg-gradient-to-l from-[#14B8A6] to-[#00C2FF] bg-clip-text text-transparent mb-3">
            צור קשר
          </h1>
          <p className="text-muted-foreground font-hebrew text-base max-w-xl mx-auto">
            יש לך שאלה, הצעה או בעיה טכנית? נשמח לשמוע ממך
          </p>
        </div>

        {/* Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* ─── טופס פנייה ─── */}
          <GlassCard variant="light" className="p-6 md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle className="w-16 h-16 text-teal-500" />
                <h2 className="text-xl font-bold font-hebrew">הפנייה נשלחה!</h2>
                <p className="text-muted-foreground font-hebrew text-sm max-w-xs">
                  תודה על פנייתך. נחזור אליך בהקדם האפשרי.
                </p>
                <Button
                  variant="outline"
                  className="font-hebrew mt-2"
                  onClick={() => setSubmitted(false)}
                >
                  שלח פנייה נוספת
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                {/* קטגוריה */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-hebrew">סוג הפנייה</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleCategoryChange(value)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium font-hebrew transition-all ${
                          category === value
                            ? 'bg-gradient-to-l from-[#14B8A6] to-[#00C2FF] text-white shadow-sm'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...register('category')} />
                </div>

                {/* שם + אימייל */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-hebrew">שם מלא *</Label>
                    <Input
                      {...register('name')}
                      className="font-hebrew"
                      placeholder="ישראל ישראלי"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive font-hebrew">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-hebrew">אימייל *</Label>
                    <Input
                      {...register('email')}
                      type="email"
                      dir="ltr"
                      className="font-hebrew"
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive font-hebrew">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* נושא */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-hebrew">נושא *</Label>
                  <Input
                    {...register('subject')}
                    className="font-hebrew"
                    placeholder="נושא הפנייה..."
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive font-hebrew">{errors.subject.message}</p>
                  )}
                </div>

                {/* כתובת עמוד — רק לבאג */}
                {category === 'bug' && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-hebrew flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      כתובת העמוד הבעייתי
                      <span className="text-[10px] text-muted-foreground/60">(אופציונלי)</span>
                    </Label>
                    <Input
                      {...register('pageUrl')}
                      dir="ltr"
                      className="font-hebrew"
                      placeholder="https://..."
                    />
                  </div>
                )}

                {/* הודעה */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-hebrew">הודעה *</Label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    placeholder="כתוב את הודעתך כאן..."
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-hebrew ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive font-hebrew">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 font-hebrew bg-gradient-to-l from-[#14B8A6] to-[#00C2FF] text-white border-0 hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'שולח...' : 'שלח פנייה'}
                </Button>
              </form>
            )}
          </GlassCard>

          {/* ─── עמודה ימנית ─── */}
          <div className="space-y-5">

            {/* פרטי יצירת קשר */}
            <GlassCard variant="light" className="p-6">
              <h2 className="text-base font-semibold font-hebrew text-foreground mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-500" />
                פרטי יצירת קשר
              </h2>
              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-hebrew">{label}</p>
                      <p className="text-sm font-medium font-hebrew">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* אודות הפרויקטים */}
            <GlassCard variant="light" className="p-6">
              <h2 className="text-base font-semibold font-hebrew text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-500" />
                הפרויקטים שלנו
              </h2>
              <div className="space-y-3">
                {OTHER_PROJECTS.map((project) => (
                  <a
                    key={project.name}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-hebrew group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-hebrew mt-0.5">
                        {project.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-teal-500 transition-colors flex-shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 text-sm font-medium font-hebrew text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
              >
                <Globe className="w-4 h-4" />
                לאתר המרכזי
              </a>
            </GlassCard>

          </div>
        </div>
      </main>
    </>
  );
}
