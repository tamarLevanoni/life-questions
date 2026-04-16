import { create } from 'zustand';
import type { UserData, MutableUserData } from '@/lib/schemas';

interface RegisterBody {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  institutionName?: string;
  phone: string;
  occupations: string[];
  marketingConsent: boolean;
}

interface UserState {
  user: UserData | null;

  // סנכרון מ-session (ב-session-user-sync)
  setUser: (user: UserData | null) => void;
  clearUser: () => void;

  // קריאות לשרת
  registerUser: (body: RegisterBody) => Promise<UserData>;
  updateUser: (partial: Partial<MutableUserData>) => Promise<UserData>;
  fetchUser: () => Promise<UserData>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  registerUser: async (body) => {
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'שגיאה בהרשמה');
    }
    const user: UserData = await res.json();
    set({ user });
    return user;
  },

  updateUser: async (partial) => {
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'שגיאה בעדכון הפרופיל');
    }
    const user: UserData = await res.json();
    set({ user });
    return user;
  },

  fetchUser: async () => {
    const res = await fetch('/api/user/profile');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'שגיאה בטעינת הפרופיל');
    }
    const user: UserData = await res.json();
    set({ user });
    return user;
  },
}));
