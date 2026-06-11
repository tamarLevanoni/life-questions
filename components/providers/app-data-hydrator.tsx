'use client';

import { useRef } from 'react';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import type { AppDataBundle } from '@/lib/types';

export function AppDataHydrator({ data }: { data: AppDataBundle }) {
  const hydrated = useRef(false);
  if (!hydrated.current) {
    useAppDataStore.getState().hydrate(data);
    hydrated.current = true;
  }
  return null;
}
