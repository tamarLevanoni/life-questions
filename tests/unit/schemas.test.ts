import { describe, expect, test } from 'bun:test';
import {
  storyWithNeighborsSchema, storyCardSchema, paginatedStoryCardsSchema, bookSchema,
  userDataSchema, onboardingSchema, profileEditSchema, contactSchema, contactFormSchema, searchBodySchema,
} from '@/lib/schemas';
import { makeStory, makeCard, makeBundle, testUser, validContact } from '../fixtures/data';

describe('Core API and form schemas', () => {
  test('accepts complete stories, cards, reference data and users', () => {
    expect(storyWithNeighborsSchema.safeParse(makeStory()).success).toBe(true);
    expect(storyCardSchema.safeParse(makeCard()).success).toBe(true);
    expect(bookSchema.safeParse(makeBundle().books[0]).success).toBe(true);
    expect(userDataSchema.safeParse(testUser).success).toBe(true);
    expect(paginatedStoryCardsSchema.safeParse({ stories: [makeCard()], total: 1, page: 1, limit: 10 }).success).toBe(true);
  });

  test('rejects incomplete upstream stories, invalid users and malformed pagination', () => {
    expect(storyWithNeighborsSchema.safeParse({ id: 'story-1' }).success).toBe(false);
    expect(userDataSchema.safeParse({ ...testUser, email: 'invalid' }).success).toBe(false);
    expect(paginatedStoryCardsSchema.safeParse({ stories: [], total: 'many' }).success).toBe(false);
    expect(bookSchema.safeParse({ ...makeBundle().books[0], orderIndex: 'first' }).success).toBe(false);
  });

  test('registration requires consent while profile editing permits withdrawal', () => {
    expect(onboardingSchema.safeParse(testUser).success).toBe(true);
    expect(onboardingSchema.safeParse({ ...testUser, marketingConsent: false }).success).toBe(false);
    expect(profileEditSchema.safeParse({ ...testUser, marketingConsent: false }).success).toBe(true);
    expect(onboardingSchema.safeParse({ ...testUser, occupations: [] }).success).toBe(false);
  });

  test('contact validates email and text lengths on the client and server', () => {
    expect(contactFormSchema.safeParse(validContact).success).toBe(true);
    expect(contactSchema.safeParse(validContact).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...validContact, message: 'short' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...validContact, email: 'invalid' }).success).toBe(false);
  });

  test('story-question contact requires valid story context', () => {
    expect(contactSchema.safeParse({ ...validContact, category: 'story_question' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...validContact, category: 'story_question', story: makeStory() }).success).toBe(true);
  });

  test('search accepts server parameters but rejects wrong data types', () => {
    expect(searchBodySchema.safeParse({ q: 'בדיקה', bookIds: ['book-1'], page: 1, limit: 10 }).success).toBe(true);
    expect(searchBodySchema.safeParse({ bookIds: 'book-1' }).success).toBe(false);
    expect(searchBodySchema.safeParse({ page: 'one' }).success).toBe(false);
  });
});
