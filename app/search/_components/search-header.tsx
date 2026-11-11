'use client';

import { Noto_Serif_Hebrew } from 'next/font/google';

const headingFont = Noto_Serif_Hebrew({
  subsets: ['hebrew'],
  weight: '700',
  display: 'swap',
});

export function SearchHeader() {
  return (
    <div className="py-3 text-center md:py-4" dir="rtl">
      <h1
        className={`${headingFont.className} text-[1.75rem] leading-[1.3] font-bold tracking-normal text-[#005C53] md:text-[2rem] dark:text-[#8FC9C0]`}
      >
        לכל שאלה יש סיפור.
      </h1>
    </div>
  );
}
