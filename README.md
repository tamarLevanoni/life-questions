# שאלות מהחיים · Life Questions

Hebrew Torah-learning stories, questions, short answers and source-based expansions.

## Start locally

```bash
bun install --frozen-lockfile
cp .env.example .env.local
bun dev
```

Fill in local/staging credentials using [.env.example](.env.example). Do not commit secrets. Open [localhost:3000](http://localhost:3000). Google OAuth's local redirect is `http://localhost:3000/api/auth/callback/google`.

## Orientation

Next.js App Router / Cache Components, React, TypeScript, Tailwind, Zustand, NextAuth v4 and Zod. Versions are defined in [package.json](package.json) and the Bun lockfile. Use Bun only.

- `app/`: routes, route-local components and BFF handlers.
- `components/`: shared UI, providers, layout, auth and story components.
- `lib/server/`: server-only Core API access and Server Action entrypoints.
- `lib/stores/`, `lib/schemas/`: state and executable data contracts.
- `proxy.ts`: page access policy.

## Documentation

- [Specs and reading map](docs/specs/README.md): maintained architecture/product contracts.
- [Testing guide](docs/testing.md): checks, browser reports, Husky and CI.
- [Planning index](docs/planning/README.md): active work, proposals and history.
- [Backlog](docs/planning/backlog.md): open decisions and remaining verification.
- [Agent entrypoint](AGENTS.md): short operational instructions.

## Daily checks

```bash
bun dev
bun run build
bun start
bun run check
bun run test:ui
bun run test:e2e
bun run test:release
```

[מדריך בדיקות בעברית](docs/testing.md) explains the visual runner, reports, isolated data and what to verify manually.

## עבודה שוטפת

- אפשר לעבוד ישירות על `main` בשינוי קטן. ענף נפרד ו־PR הם אפשרות מועילה לשינוי גדול או לניסוי; אין חובה לפתוח אותם לכל תיקון.
- לפיצ׳ר, שינוי מבני או עיצוב שחוצה מסכים כתבי תוכנית קצרה. עדכני את המפרט הרלוונטי כאשר החלטה או התנהגות משתנה.
- לפני commit הריצי `bun run check` ואת בדיקת הדפדפן הנוגעת לשינוי. שינוי עיצוב דורש גם עיון חזותי במחשב ובמובייל; לפני שחרור רגיש הריצי `bun run test:release`.
- הודעות commit בעברית ומסבירות מה השתנה ולמה. סוכן יוצר commit, דוחף או מפרסם רק לפי בקשה מתאימה. כשמשתמשים ב־PR, מציינים מה השתנה ואיך נבדק.

## License

[MIT](LICENSE).
