# Book covers

`Book` now carries `orderIndex` and `coverUrl` directly from the core API
(Chosen Mishpat 1–7, then Orach Chaim: Brachot 8, Tfila 9, Shabbat 10). Both
are backfilled in the backend, so the frontend reads them straight off the
entity — no static frontend mapping.

Changed:
- `lib/schemas/reference.ts` — `bookSchema` gained `orderIndex: z.number()`
  and `coverUrl: z.string().nullable()`.
- `app/home-new/_components/books-gallery-section.tsx` — renders
  `book.coverUrl` in a uniform `aspect-[3/4]` frame (`object-cover`), sorted
  by `orderIndex`; falls back to the existing category icon when `coverUrl`
  is `null`.

Removed: `lib/config/book-covers.ts` (the static Cloudinary URL map) —
superseded by `coverUrl` on the entity itself.
