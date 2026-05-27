'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/lib/toast-context';
import { contactFormSchema, type ContactFormValues, type ContactCategory } from '@/lib/schemas';
import { useContactStore } from '@/lib/stores/contact-store';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import {
  Mail,
  Bug,
  Handshake,
  Send,
  CheckCircle,
  Globe,
  MessageSquare,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';

// ─── helpers ───────────────────────────────────────────────────────────────

function FormField({
  label,
  error,
  children,
}: {
  label: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground font-hebrew">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive font-hebrew">{error}</p>}
    </div>
  );
}

// ─── data ──────────────────────────────────────────────────────────────────

const BASE_CATEGORIES: { value: ContactCategory; label: string; icon: LucideIcon }[] = [
  { value: 'general',       label: 'פנייה כללית',  icon: MessageSquare },
  { value: 'bug',           label: 'בעיה טכנית',   icon: Bug },
  { value: 'collaboration', label: 'שיתוף פעולה',  icon: Handshake },
];

const STORY_CATEGORY = { value: 'story_question' as ContactCategory, label: 'שאלת המשך', icon: BookOpen };

// ─── props ─────────────────────────────────────────────────────────────────

interface ContactFormProps {
  storyId:    string | null;
  storyTitle: string | null;
}

// ─── component ─────────────────────────────────────────────────────────────

export function ContactForm({ storyId, storyTitle }: ContactFormProps) {
  const fromStory = !!(storyId && storyTitle);

  const { data: session } = useSession();
  const { showToast } = useToast();
  const { isSubmitting, submitted, submit, reset: resetContact } = useContactStore();
  const { story: fetchedStory, fetchStory } = useStoryDetailStore();

  const [category, setCategory] = useState<ContactCategory>(fromStory ? 'story_question' : 'general');

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      category: fromStory ? 'story_question' : 'general',
      subject:  fromStory ? `שאלה על "${storyTitle}"` : '',
    },
  });

  useEffect(() => {
    if (session?.user) {
      const name = [session.user.firstName, session.user.lastName].filter(Boolean).join(' ') || session.user.name || '';
      if (name)               setValue('name',  name);
      if (session.user.email) setValue('email', session.user.email);
    }
  }, [session, setValue]);

  useEffect(() => {
    if (storyId && fetchedStory?.id !== storyId) fetchStory(storyId);
  }, [storyId, fetchedStory?.id, fetchStory]);

  const categories = fromStory ? [...BASE_CATEGORIES, STORY_CATEGORY] : BASE_CATEGORIES;

  const handleCategoryChange = (cat: ContactCategory) => {
    setCategory(cat);
    setValue('category', cat, { shouldValidate: false });
    if (cat === 'story_question' && storyTitle && !getValues('subject')) {
      setValue('subject', `שאלה על "${storyTitle}"`);
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    const storyPayload = data.category === 'story_question' && fetchedStory
      ? {
          id:            fetchedStory.id,
          title:         fetchedStory.title,
          storyBody:     fetchedStory.storyBody,
          legalQuestion: fetchedStory.legalQuestion,
          shortAnswer:   fetchedStory.shortAnswer,
          expansion:     fetchedStory.expansion ?? undefined,
        }
      : undefined;

    const result = await submit({ ...data, story: storyPayload });
    if (result.success) {
      showToast('הפנייה נשלחה בהצלחה!', 'success');
      reset({ category: 'general' });
      setCategory('general');
    } else {
      showToast(result.error ?? 'שגיאה בשליחת הפנייה. אנא נסה שוב.', 'error');
    }
  };

  if (submitted) {
    return (
      <GlassCard variant="light" className="p-6 md:p-8">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <CheckCircle className="w-16 h-16 text-teal-500" />
          <h2 className="text-xl font-bold font-hebrew">הפנייה נשלחה!</h2>
          <p className="text-muted-foreground font-hebrew text-sm max-w-xs">
            תודה על פנייתך. נחזור אליך בהקדם האפשרי.
          </p>
          <Button variant="outline" className="font-hebrew mt-2" onClick={() => resetContact()}>
            שלח פנייה נוספת
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="light" className="p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

        {/* הקשר סיפור */}
        {fromStory && category === 'story_question' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <p className="text-sm font-hebrew text-teal-700 dark:text-teal-300 truncate">
              שאלת המשך על: <span className="font-semibold">{storyTitle}</span>
            </p>
          </div>
        )}

        {/* קטגוריה */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-hebrew">סוג הפנייה</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ value, label, icon: Icon }) => (
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
          <FormField label="שם מלא *" error={errors.name?.message}>
            <Input {...register('name')} className="font-hebrew" placeholder="ישראל ישראלי" />
          </FormField>
          <FormField label="אימייל *" error={errors.email?.message}>
            <Input {...register('email')} type="email" dir="ltr" className="font-hebrew" placeholder="example@email.com" />
          </FormField>
        </div>

        {/* נושא */}
        <FormField label="נושא *" error={errors.subject?.message}>
          <Input {...register('subject')} className="font-hebrew" placeholder="נושא הפנייה..." />
        </FormField>

        {/* כתובת עמוד — רק לבאג */}
        {category === 'bug' && (
          <FormField
            label={
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                כתובת העמוד הבעייתי
                <span className="text-[10px] text-muted-foreground/60">(אופציונלי)</span>
              </span>
            }
          >
            <Input {...register('pageUrl')} dir="ltr" className="font-hebrew" placeholder="https://..." />
          </FormField>
        )}

        {/* הודעה */}
        <FormField label="הודעה *" error={errors.message?.message}>
          <textarea
            {...register('message')}
            rows={5}
            placeholder="כתוב את הודעתך כאן..."
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-hebrew ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </FormField>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full gap-2 font-hebrew bg-gradient-to-l from-[#14B8A6] to-[#00C2FF] text-white border-0 hover:opacity-90"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'שולח...' : 'שלח פנייה'}
        </Button>
      </form>
    </GlassCard>
  );
}
