import type { Occupation } from '@/lib/schemas';

// ==================== OCCUPATIONS ====================

export const OCCUPATIONS: Occupation[] = [
  'dayyan',
  'rabbi',
  'teacher',
  'student',
  'parent',
  'learner',
];

export const OCCUPATION_LABELS: Record<Occupation, string> = {
  dayyan: 'דיין',
  rabbi: 'רב',
  teacher: 'מורה',
  student: 'תלמיד',
  parent: 'הורה',
  learner: 'לומד',
};

// ==================== CONTACT TYPES ====================

export const CONTACT_TYPES = [
  { value: 'request', label: 'בקשה' },
  { value: 'comment', label: 'הערה' },
  { value: 'enlightenment', label: 'הארה' },
] as const;
