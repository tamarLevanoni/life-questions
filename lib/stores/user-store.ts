import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { UserData, MutableUserData } from '@/lib/schemas';
import type { RegisterBody } from '@/lib/types';

interface UserState {
  user: UserData | null;

  setUser: (user: UserData | null) => void;
  clearUser: () => void;

  registerUser: (body: RegisterBody) => Promise<UserData>;
  updateUser: (partial: Partial<MutableUserData>) => Promise<UserData>;
  fetchUser: () => Promise<UserData>;
}

function jsonInit(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  registerUser: async (body) => {
    const user = await apiCall<UserData>('/api/user/register', jsonInit('POST', body));
    set({ user });
    return user;
  },

  updateUser: async (partial) => {
    const user = await apiCall<UserData>('/api/user/profile', jsonInit('PATCH', partial));
    set({ user });
    return user;
  },

  fetchUser: async () => {
    const user = await apiCall<UserData>('/api/user/profile');
    set({ user });
    return user;
  },
}));
