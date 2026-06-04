import { create } from 'zustand';
import { apiCall } from '@/lib/api-client';
import type { UserData, MutableUserData } from '@/lib/schemas';
import type { RegisterBody } from '@/lib/types';

export type AuthStatus = 'idle' | 'authenticated' | 'registration-required' | 'unauthenticated';

interface UserState {
  user: UserData | null;
  authStatus: AuthStatus;
  image: string | null;

  setUser: (user: UserData | null) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setImage: (image: string | null) => void;
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
  authStatus: 'idle',
  image: null,

  setUser: (user) => set({ user }),
  setAuthStatus: (authStatus) => set({ authStatus }),
  setImage: (image) => set({ image }),
  clearUser: () => set({ user: null, image: null }),

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
