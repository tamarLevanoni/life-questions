import { NextResponse } from 'next/server';
import { getCategoriesData } from '@/lib/constants/categories';
import type { CategoriesData } from '@/lib/types';

export async function GET() {
  // Get categories data from constants
  // In the future, this could be fetched from the database
  const categories: CategoriesData = getCategoriesData();

  return NextResponse.json(categories);
}
