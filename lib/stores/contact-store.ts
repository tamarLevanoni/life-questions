import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { ContactFormData } from '@/lib/schemas';

interface ContactState {
  isSubmitting: boolean;
  submitted: boolean;
  submit: (data: ContactFormData) => Promise<{ success: boolean; error?: string }>;
  reset: () => void;
}

export const useContactStore = create<ContactState>((set) => ({
  isSubmitting: false,
  submitted: false,

  submit: async (data) => {
    set({ isSubmitting: true });
    try {
      await apiCall('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      set({ submitted: true });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'שגיאה בשליחת הפנייה. אנא נסה שוב.',
      };
    } finally {
      set({ isSubmitting: false });
    }
  },

  reset: () => set({ submitted: false }),
}));
