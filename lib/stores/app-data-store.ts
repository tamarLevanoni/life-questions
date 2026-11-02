'use client';

import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import type { AppDataBundle } from '@/lib/types';

export function createAppDataStore(data: AppDataBundle) {
  return createStore<AppDataBundle>()(() => data);
}

export const AppDataStoreContext = createContext<ReturnType<typeof createAppDataStore> | null>(null);

export function useAppDataStore<T>(selector: (state: AppDataBundle) => T): T {
  const store = useContext(AppDataStoreContext);
  if (!store) {
    throw new Error('useAppDataStore must be used within AppDataHydrator');
  }
  return useStore(store, selector);
}
