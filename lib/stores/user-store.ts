import { create } from 'zustand';
import type { UserData, MutableUserData } from '@/lib/schemas';
import type { RegisterBody } from '@/lib/types';

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
    const resBody = await res.json();
    if (!res.ok || !resBody.success) throw new Error(resBody.error ?? 'שגיאה בהרשמה');
    const user: UserData = resBody.data;
    set({ user });
    return user;
  },

  updateUser: async (partial) => {
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    });
    const resBody = await res.json();
    if (!res.ok || !resBody.success) throw new Error(resBody.error ?? 'שגיאה בעדכון הפרופיל');
    const user: UserData = resBody.data;
    set({ user });
    return user;
  },

  fetchUser: async () => {
    const res = await fetch('/api/user/profile');
    const resBody = await res.json();
    if (!res.ok || !resBody.success) throw new Error(resBody.error ?? 'שגיאה בטעינת הפרופיל');
    const user: UserData = resBody.data;
    set({ user });
    return user;
  },
}));
