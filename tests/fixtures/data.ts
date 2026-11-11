import type { StoryCard, StoryWithNeighbors, UserData } from '@/lib/schemas';
import type { AppDataBundle } from '@/lib/types';

export const testUser: UserData = {
  id: 'user-test', googleId: 'google-test', email: 'tester@example.test',
  firstName: 'ישראל', lastName: 'ישראלי', institutionName: 'בית מדרש לבדיקה',
  phone: '0501234567', occupations: ['learner'], marketingConsent: true,
};

export function makeStory(index = 1): StoryWithNeighbors {
  return {
    id: `story-${index}`, bookId: 'book-1', topic: { id: 'topic-1', bookId: 'book-1', name: 'נושא בדיקה', orderIndex: 1 },
    storyOrder: index, title: `סיפור בדיקה ${index}`, storyBody: 'זהו סיפור בדיוני המשמש לבדיקת האתר בלבד.',
    legalQuestion: 'מה עושים במקרה הבדיקה?', legalQuestionSource: 'מקור בדיקה',
    shortAnswer: 'זו תשובה קצרה לבדיקה.', expansion: 'זו הרחבה למשתמשים מחוברים בלבד.',
    conceptsAi: [], conceptsFromIndex: [],
    videoUrl: index === 4 ? 'https://www.youtube.com/watch?v=test-video1' : null, imageUrl: null,
    shasRefs: [], shuRefs: [], centralShuSiman: null, sourceReferencesText: 'מקור בדיקה',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    neighbors: {
      prev: index > 1 ? { id: `story-${index - 1}`, title: `סיפור בדיקה ${index - 1}` } : null,
      next: index < 12 ? { id: `story-${index + 1}`, title: `סיפור בדיקה ${index + 1}` } : null,
    },
  };
}

export function makeCard(index = 1): StoryCard {
  const story = makeStory(index);
  return {
    id: story.id, bookId: story.bookId, storyOrder: story.storyOrder, topicId: story.topic.id,
    title: story.title, legalQuestion: story.legalQuestion, videoUrl: null,
    shuRefs: [], centralShuSiman: null,
  };
}

export function makeBundle(): AppDataBundle {
  return {
    books: [
      { id: 'book-1', name: 'ספר בדיקה', orderIndex: 1, coverUrl: null },
      { id: 'book-2', name: 'שאלות מהחיים 1 - הלכות אבידה ומציאה, פקדון ושכירות', orderIndex: 2, coverUrl: null },
      { id: 'book-3', name: 'שאלות מהחיים 2 - דיני שאלה ודיני שכירות פועלים', orderIndex: 3, coverUrl: null },
      { id: 'book-4', name: 'שאלות מהחיים 3 - דיני מום במקח, גזילה וגניבה', orderIndex: 4, coverUrl: null },
      { id: 'book-5', name: 'ספר בדיקה נוסף 5', orderIndex: 5, coverUrl: null },
      { id: 'book-6', name: 'ספר בדיקה נוסף 6', orderIndex: 6, coverUrl: null },
    ],
    topics: [
      { id: 'topic-1', bookId: 'book-1', name: 'נושא בדיקה', orderIndex: 1 },
      { id: 'topic-2', bookId: 'book-2', name: 'נושא מספר אחר', orderIndex: 1 },
      { id: 'topic-3', bookId: 'book-1', name: 'נושא ארוך במיוחד לבדיקת תצוגת מסננים במכשיר צר', orderIndex: 2 },
      ...Array.from({ length: 60 }, (_, index) => ({
        id: `long-topic-${index + 1}`, bookId: 'book-1', name: `נושא נוסף לבדיקת רשימה ארוכה ${index + 1}`, orderIndex: index + 3,
      })),
    ],
    masechtot: [{ id: 'masechet-1', name: 'ברכות', orderIndex: 1, pages: [{ id: 'page-1', daf: 2, amud: 'a' }, { id: 'page-2', daf: 3, amud: 'a' }] }],
    shuSections: [{ id: 'section-1', name: 'אורח חיים', simanim: [{ id: 'siman-1', siman: 1, title: 'סימן בדיקה' }] }],
    featuredStories: [makeStory(1), makeStory(2), makeStory(3)], weeklyStory: makeStory(4),
  };
}

export const validContact = {
  name: 'ישראל ישראלי', email: 'tester@example.test', category: 'general' as const,
  subject: 'נושא פנייה לבדיקה', message: 'הודעה בדיונית לבדיקת טופס יצירת קשר.',
};
