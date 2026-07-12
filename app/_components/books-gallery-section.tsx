'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionFadeIn } from '@/components/common/motion-fade-in';
import { getBookIcon } from '@/lib/config/category-colors';

export function BooksGallerySection() {
  const books = useAppDataStore((s) => s.books);

  if (!books.length) return null;

  const sortedBooks = [...books].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section className="py-8 md:py-16 px-4 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <MotionFadeIn>
          <SectionHeader title="חפשו לפי ספר" subtitle="בחרו ספר כדי לדפדף בסיפורים שלו" size="sm" />
        </MotionFadeIn>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-w-3xl mx-auto">
          {sortedBooks.map((book, index) => {
            const Icon = getBookIcon(book.name);
            return (
              <MotionFadeIn key={book.id} delay={index * 0.06} trigger="view">
                <Link
                  href={`/search?bookId=${book.id}`}
                  className="group block rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                  dir="rtl"
                >
                  <div className="relative h-32 sm:h-36 w-full bg-muted">
                    <div className="absolute inset-2.5">
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={book.name}
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 15vw"
                          className="object-cover"
                        />
                      ) : (
                        <Icon className="w-8 h-8 m-auto absolute inset-0 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="px-2 py-1.5">
                    <p title={book.name} className="font-hebrew font-bold leading-snug mb-0.5 text-[11px] line-clamp-3 h-[42px]">{book.name}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-hebrew text-muted-foreground group-hover:text-foreground">
                      חיפוש בספר
                      <ArrowLeft className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </MotionFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
