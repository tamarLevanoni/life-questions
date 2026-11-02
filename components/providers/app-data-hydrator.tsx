'use client';

import { useState, type ReactNode } from 'react';
import { AppDataStoreContext, createAppDataStore } from '@/lib/stores/app-data-store';
import type { AppDataBundle } from '@/lib/types';

export function AppDataHydrator({ data, children }: { data: AppDataBundle; children: ReactNode }) {
  // Initialize before consumers render, without notifying an existing store's subscribers.
  const [store] = useState(() => createAppDataStore(data));
  return <AppDataStoreContext.Provider value={store}>{children}</AppDataStoreContext.Provider>;
}
