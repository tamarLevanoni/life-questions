import type { ReactNode } from 'react';
import { getAppData } from '@/lib/server/app-data';
import { AppDataHydrator } from '@/components/providers/app-data-hydrator';

export async function AppDataLoader({ children }: { children: ReactNode }) {
  const data = await getAppData();
  return <AppDataHydrator data={data}>{children}</AppDataHydrator>;
}
