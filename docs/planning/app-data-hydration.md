# תיקון הידרציית נתוני האפליקציה

## הבעיה

`AppDataHydrator` כותב ל־Zustand גלובלי בזמן render. כאשר `SearchView` כבר מנוי לנתונים, הכתיבה מפעילה עדכון ברכיב אחר ו־React מציג אזהרה. בנוסף, ה־loader נמצא כ־sibling תחת Suspense ולכן אינו מבטיח שהנתונים יהיו מוכנים לפני הצרכנים.

## השינוי

- ליצור store מקומי ל־provider מתוך נתוני השרת באתחול סינכרוני, ללא `setState` או `useEffect` להידרציה.
- לשמר את ממשק הסלקטורים `useAppDataStore`, באמצעות Context ו־Zustand.
- לעטוף את הצרכנים ב־AppDataLoader וב־AppDataHydrator כדי שכל render שלהם יקבל store מאותחל.
- לעדכן את הנחיות ההידרציה ב־AGENTS.md, ב־CLAUDE.md ובמפרט הרלוונטי. יתר ה־stores מחוץ להיקף התיקון.

## אימות

- TypeScript ו־ESLint.
- בדיקת render עם נתונים קיימים והפרדה בין מופעי provider, ככל שסביבת הבדיקה המקומית מאפשרת.
- build ובדיקת מסך החיפוש אם סביבת הריצה זמינה.

## תוצאות

- `bun test components/providers/app-data-hydrator.test.tsx`: שלוש בדיקות עברו — render ראשון, providers מקוננים ובקשות SSR חופפות עם Suspense.
- `bunx tsc --noEmit`, `bun run build` ו־`git diff --check`: עברו.
- `bun lint` וגם lint ממוקד לקבצים שהשתנו נעצרו ב־`react/display-name`: התוסף קורא ל־`contextOrFilename.getFilename`, שאינו זמין בסביבת ESLint 10 המותקנת. לא בוצע שינוי תלויות במסגרת התיקון.
- לא זמין דפדפן מחובר לאימות client-side; בדיקות הרגרסיה מכסות SSR ו־streaming, אך אינן בדיקת console בדפדפן.

הדפוס תואם את [הנחיות Zustand ל־Next.js](https://zustand.docs.pmnd.rs/learn/guides/nextjs): store לכל provider ואתחול באמצעות `useState` ו־Context.
