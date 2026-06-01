'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/lib/toast-context';
import {
  contactFormSchema,
  type ContactFormValues,
  type ContactCategory,
} from '@/lib/schemas';
import { useContactStore } from '@/lib/stores/contact-store';
import { useStoryDetailStore } from '@/lib/stores/story-detail-store';
import { BASE_CATEGORIES, STORY_CATEGORY } from './contact-categories';

interface UseContactFormArgs {
  storyId: string | null;
  storyTitle: string | null;
}

export function useContactForm({ storyId, storyTitle }: UseContactFormArgs) {
  const fromStory = !!(storyId && storyTitle);

  const { data: session } = useSession();
  const { showToast } = useToast();
  const { isSubmitting, submitted, submit, reset: resetContact } = useContactStore();
  const { story: fetchedStory, fetchStory } = useStoryDetailStore();

  const [category, setCategory] = useState<ContactCategory>(
    fromStory ? 'story_question' : 'general'
  );

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
      subject: fromStory ? `שאלה על "${storyTitle}"` : '',
    },
  });

  useEffect(() => {
    if (session?.user) {
      const name =
        [session.user.firstName, session.user.lastName].filter(Boolean).join(' ') ||
        session.user.name ||
        '';
      if (name) setValue('name', name);
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
    const isAuthenticated = !!session;
    const canViewExpansion = isAuthenticated;

    const storyPayload =
      data.category === 'story_question' && fetchedStory
        ? {
            id: fetchedStory.id,
            title: fetchedStory.title,
            storyBody: fetchedStory.storyBody,
            legalQuestion: fetchedStory.legalQuestion,
            shortAnswer: fetchedStory.shortAnswer,
            ...(isAuthenticated && canViewExpansion && fetchedStory.expansion
              ? { expansion: fetchedStory.expansion }
              : {}),
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

  return {
    fromStory,
    category,
    categories,
    register,
    errors,
    isSubmitting,
    submitted,
    resetContact,
    handleCategoryChange,
    onSubmit: handleSubmit(onSubmit),
    storyTitle,
  };
}

export type UseContactFormReturn = ReturnType<typeof useContactForm>;
