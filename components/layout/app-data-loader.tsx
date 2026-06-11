import { getAppData } from '@/lib/server/app-data';
import { AppDataHydrator } from '@/components/providers/app-data-hydrator';

export async function AppDataLoader() {
  const data = await getAppData();
  return <AppDataHydrator data={data} />;
}
