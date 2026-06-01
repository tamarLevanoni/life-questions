'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form-field';
import { Globe, Send } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { useContactForm } from './use-contact-form';
import { ContactSuccessDialog } from './contact-success-dialog';

interface ContactFormProps {
  storyId: string | null;
  storyTitle: string | null;
}

export function ContactForm({ storyId, storyTitle }: ContactFormProps) {
  const form = useContactForm({ storyId, storyTitle });

  return (
    <>
      <ContactSuccessDialog open={form.submitted} onClose={form.resetContact} />

      {!form.submitted && (
        <GlassCard variant="light" className="p-6 md:p-8">
          <form onSubmit={form.onSubmit} className="space-y-5" noValidate>
            {form.fromStory && form.category === 'story_question' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <p className="text-sm font-hebrew text-teal-700 dark:text-teal-300 truncate">
                  שאלת המשך על: <span className="font-semibold">{form.storyTitle}</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-hebrew">סוג הפנייה</Label>
              <div className="flex flex-wrap gap-2">
                {form.categories.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => form.handleCategoryChange(value)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium font-hebrew transition-all ${
                      form.category === value
                        ? 'bg-linear-to-l from-brand-teal to-brand-blue text-white shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
              <input type="hidden" {...form.register('category')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="שם מלא *" error={form.errors.name?.message}>
                <Input {...form.register('name')} className="font-hebrew" placeholder="ישראל ישראלי" />
              </FormField>
              <FormField label="אימייל *" error={form.errors.email?.message}>
                <Input
                  {...form.register('email')}
                  type="email"
                  dir="ltr"
                  className="font-hebrew"
                  placeholder="example@email.com"
                />
              </FormField>
            </div>

            <FormField label="נושא *" error={form.errors.subject?.message}>
              <Input {...form.register('subject')} className="font-hebrew" placeholder="נושא הפנייה..." />
            </FormField>

            {form.category === 'bug' && (
              <FormField
                label={
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    כתובת העמוד הבעייתי
                    <span className="text-[10px] text-muted-foreground/60">(אופציונלי)</span>
                  </span>
                }
              >
                <Input {...form.register('pageUrl')} dir="ltr" className="font-hebrew" placeholder="https://..." />
              </FormField>
            )}

            <FormField label="הודעה *" error={form.errors.message?.message}>
              <textarea
                {...form.register('message')}
                rows={5}
                placeholder="כתוב את הודעתך כאן..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-hebrew ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </FormField>

            <Button
              type="submit"
              disabled={form.isSubmitting}
              className="w-full gap-2 font-hebrew bg-linear-to-l from-brand-teal to-brand-blue text-white border-0 hover:opacity-90"
            >
              <Send className="w-4 h-4" />
              {form.isSubmitting ? 'שולח...' : 'שלח פנייה'}
            </Button>
          </form>
        </GlassCard>
      )}
    </>
  );
}
