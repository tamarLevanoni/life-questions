# תוכנית: חלוקה נכונה לקומפוננטות + תשתית משותפת

## Context

הפרוייקט מבוסס Next.js 16 App Router עם Tailwind CSS 4, shadcn/ui ו-Zustand. בסקירה עלו שלוש בעיות מרכזיות:

1. **עמודים שמנים** – `app/profile/page.tsx` (452 שורות), `app/story/[id]/page.tsx` (320), `app/page.tsx` (272). כל אחד מכיל מספר רב של "סקציות" inline שלא ניתנות לבדיקה/שימוש חוזר.
2. **דופליקציה גרפית** – אנימציות `motion.div` עם אותם props חוזרות 8+ פעמים; כותרות סקציה חוזרות 5+ פעמים; badges/chips חוזרים 5+ פעמים; PageShell של `<AppHeader/> + main rtl + pt-24` חוזר בכל עמוד; "מסגרת form-field" (Label + Input + error) מוטמעת ב-contact ו-profile.
3. **שכבת נתונים שברירית** – `app/page.tsx` ו-`app/story/[id]/page.tsx` הם client components שמבצעים fetch ב-useEffect במקום RSC; ה-ReferencePreloader רץ במקביל ויוצר רעש פוטנציאלי; כל store משכפל את אותה לוגיקת `fetch → res.json → success/error`; ב-`stories-store.loadFeaturedStories` שגיאות נבלעות בשקט.

המטרה: ארכיטקטורה שבה כל עמוד הוא thin orchestrator שמרכיב סקציות סמנטיות, פרימיטיבים משותפים מטפלים בעיצוב החוזר, ושכבת הנתונים אמינה וצפויה.

לפי הוראת המשתמש: קומפוננטות עם פוטנציאל לשימוש חוזר עתידי – יעברו ל-`components/`; קומפוננטות שייחודיות לעמוד ספציפי – ישבו ב-`app/<route>/_components/` כמו הדפוס הקיים ב-`app/contact/_components/`.

---

## Phase 1 – פרימיטיבים משותפים חדשים תחת `components/ui/` ו-`components/common/`

קבצים חדשים:

### `components/ui/section-header.tsx`
מחליף את הדפוס `<div className="text-center mb-12"><h2>...</h2><p>...</p></div>` שחוזר ב-`app/page.tsx:151-163, 196-208`, `components/sections/about-section.tsx:66-73`, ו-`components/sections/cta-section.tsx`.
```ts
type Props = { title: string; subtitle?: string; align?: 'center' | 'start'; size?: 'sm' | 'md' | 'lg' };
```

### `components/ui/badge.tsx`
פרימיטיב Badge יחיד עם variants (`primary`, `muted`, `outline`, `teal`, `source-shas`, `source-shu`, `concept`) שמחליף:
- badges מקורות ב-`app/story/[id]/page.tsx:169-184`
- chips פילטרים ב-`components/search/search-client.tsx:108-122`
- chips ב-`search-combobox.tsx:69-80`
- chip עיסוקים ב-`app/profile/page.tsx:357-362`
- badge ב-`components/story/scenario-card.tsx:62`

יקבל אופציונלית `onRemove` ויציג `<X/>` (החליף את ה-pattern של "filter tag עם כפתור הסרה").

### `components/common/motion-fade-in.tsx`
עוטף `motion.div` עם `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}` ו-`transition={{ delay }}`. מחליף 8+ הופעות זהות ב-`app/page.tsx`, `components/sections/*`, ו-`app/story/[id]/page.tsx:235-265`.
```ts
type Props = { children: ReactNode; delay?: number; y?: number; as?: 'div' | 'article' | 'section' };
```

### `components/common/page-shell.tsx`
מחליף `<main className="min-h-screen bg-background" dir="rtl"><AppHeader/>...<div className="pt-24 pb-12 px-4">...` שחוזר בכל עמוד.
```ts
type Props = { children: ReactNode; maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '6xl' };
```

### `components/common/empty-state.tsx`
React component סביב המחלקה הקיימת `.empty-state` (`app/globals.css:768`). מחליף את ה-JSX ב-`components/search/search-results-list.tsx:31-38` ובמסך השגיאה ב-`app/story/[id]/page.tsx:61-83`.
```ts
type Props = { icon?: LucideIcon; title: string; description?: string; action?: ReactNode };
```

### `components/common/loading-skeleton.tsx`
שני exports: `<SkeletonLines count rows />` עבור skeleton פשוטים (משותף ל-`search-results-list.tsx:20-28` ו-`app/story/[id]/page.tsx:46-58`), ו-`<SkeletonCardList count />` עבור רשימות עם GlassCard skeleton (משותף ל-`ProfileSkeleton` הפנימי ב-`app/profile/page.tsx:46-70`).

### `components/ui/form-field.tsx`
מאחד את ה-Label + Input + error הקיים inline ב-`app/contact/_components/contact-form.tsx:29-44` (כבר הופשט שם, רק מעלים לרמת הפרויקט) ובכל סקציית פרטים אישיים ב-`app/profile/page.tsx:225-316`.
```ts
type Props = { label: string; error?: string; hint?: string; locked?: boolean; children: ReactNode };
```
משתמשים כך: `<FormField label="טלפון" error={errors.phone?.message}><Input {...register('phone')} /></FormField>`.

### `components/ui/branded-button.tsx` (אם לא קיים תחת `button-primary`)
לאחר בדיקה: `components/ui/button-primary.tsx` קיים ב-44 שורות. נוודא שהוא מכסה את כל ה-CTAs (Link עם class `inline-flex items-center gap-2 px-8 py-4 bg-primary...`) שחוזר 6+ פעמים. אם לא – נרחיב variants במקום ליצור חדש. **אין ליצור duplicate.**

---

## Phase 2 – פיצול עמודים גדולים

### `app/page.tsx` (272 → ~50 שורות)
חמש סקציות נפרדות תחת `app/_components/home/` (פוטנציאל לשימוש חוזר נמוך – ייחודי ל-landing):
- `hero-section.tsx` – glow orbs + טייטל + CTAs (כיום שורות 40-109)
- `features-section.tsx` – ה-3 features (112-146)
- `how-it-works-section.tsx` – 4 צעדים (149-191)
- `featured-stories-section.tsx` – טוען מהstore, מציג כרטיסים (194-244)
- `cta-section.tsx` – אם ה-CTA הקיים ב-`components/sections/` לא משמש כאן, נמחק את הלא-משומש; אם משומש – נקרא לו ישירות.

`app/page.tsx` יהפוך לרכיב orchestrator שמייבא ומסדר את חמשת הסקציות. רוב הסקציות יהיו יכולות להיות RSC (חוץ מ-Featured שתלוי בstore – ראה Phase 3).

### `app/profile/page.tsx` (452 → ~80 שורות)
פיצול תחת `app/profile/_components/` (ייחודי לעמוד):
- `profile-skeleton.tsx` – מעבר מתוך `ProfileSkeleton` הקיים (46-70)
- `profile-hero-card.tsx` – Avatar + שם + כפתורי edit/save/cancel (163-214)
- `personal-info-section.tsx` – שדות שם/אימייל/טלפון/מוסד עם react-hook-form (217-317) – משתמש ב-`FormField` החדש
- `occupations-section.tsx` – grid עיסוקים (320-370) – משתמש ב-`Badge` החדש למצב view
- `preferences-section.tsx` – checkbox marketingConsent (373-416)
- `account-section.tsx` – Google + logout (419-446)

ה-`useForm` ועיבוד ה-submit נשארים בעמוד עצמו ומועברים לילדים דרך props (לא prop-drilling עמוק – מבנה ישר).

### `app/story/[id]/page.tsx` (320 → ~70 שורות)
פיצול תחת `app/story/[id]/_components/`:
- `story-breadcrumb.tsx` – הbreadcrumb (121-138)
- `story-article.tsx` – הסיפור + שאלה + מקורות + מושגים + וידאו (114-232)
- `story-sources-list.tsx` – קומפוננטה פנימית של `story-article` שמרנדרת shasRefs+shuRefs+sourceReferencesText במקום אחד עם `Badge` החדש
- `story-navigation.tsx` – prev/next (285-315)
- `story-not-found.tsx` – מסך השגיאה (61-83) – משתמש ב-`EmptyState`

`app/story/[id]/page.tsx` יוריד את שלוש ה-`motion.div` החיצוניות לטובת `MotionFadeIn delay={...}`.

### `components/search/search-client.tsx` (307 → ~150 שורות)
- `ActiveFilterTags` הפנימית (26-125) → תועבר לקובץ נפרד `components/search/active-filter-tags.tsx` ותשתמש ב-`Badge` עם `onRemove`.
- בלוק ה-"חסימת לא מחוברים" (289-301) → `components/search/auth-required-overlay.tsx`.

---

## Phase 3 – שכבת הנתונים

### 3a. `lib/api-client.ts` (חדש)
פונקציה אחת שמרכזת את הדפוס שמשוכפל בכל store:
```ts
export async function apiCall<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json();
  if (!res.ok || !body.success) throw new Error(body.error ?? 'שגיאה לא ידועה');
  return body.data as T;
}
```
כל stores (`stories-store`, `reference-store`, `user-store`, `story-detail-store`, `contact-store`) יוחלפו לקרוא דרכה. זה מצמצם ~5×8 שורות והופך טיפול שגיאות לעקבי.

### 3b. תיקון `stories-store.loadFeaturedStories`
החלפת `} catch {}` ב-set של `featuredError` והוספת state להצגת fallback ב-`featured-stories-section.tsx`. זאת הבעיה היחידה שמסתירה תקלות מהמשתמש.

### 3c. הסרת `useEffect(loadAll)` כפול
`ReferencePreloader` כבר רץ ב-providers; ההפעלה הכפולה ב-`app/story/[id]/page.tsx:37-39` מיותרת (יש כבר flag `loaded`). יוסר.

### 3d. עמוד הבית – הזזה ל-RSC חלקי
`app/page.tsx` הוא כיום `'use client'` רק כי הוא ניגש ל-`useStoriesStore` עבור `featuredStories`. הפיתרון: 
- `app/page.tsx` ← RSC שמרכיב את הסקציות הסטטיות (Hero/Features/HowItWorks/CTA).
- רק `featured-stories-section.tsx` מסומן `'use client'` עם הstore.
- האנימציות `motion.div` ב-`MotionFadeIn` ידרשו `'use client'` בקומפוננטת ה-wrapper, אבל הקומפוננטה עצמה תוכל להיות מיובאת מעמוד RSC (Next.js מתיר זאת כל עוד ה-`'use client'` נמצא בקובץ ה-wrapper).

ל-`app/story/[id]/page.tsx`: אפשר להפוך ל-RSC עם server-side `backendFetch` במקום store. **דורש בדיקה** של ההשלכות על cache התצוגה החוזרת ב-`story-detail-store` – שמירה על הstore כ-fallback ל-prefetch ייתכן ויהיה מורכב יותר משווה. **מסקנת התוכנית: נשאיר את story page כ-client component בשלב זה**, רק נחלץ סקציות. הזזת RSC תידחה לפיצ'ר נפרד.

---

## Phase 4 – ניקוי ובדיקה

- מחיקת `components/sections/insights-section.tsx` אם הוא לא משומש בשום מקום (לפי דו"ח החקירה – לא מיובא). וידוא ב-grep לפני המחיקה.
- וידוא שעוטפי class הישנים (`glass-card p-X rounded-2xl`) שמשתמשים ב-`<GlassCard>` הקיים מועברים לשימוש בקומפוננטה במקום מחרוזות class גולמיות, במיוחד ב-`app/page.tsx:126, 250` ו-`app/story/[id]/page.tsx:115`.

### ווידוא ידני (לפי הוראת המשתמש – אין בדיקות אוטומטיות)
לאחר הריפקטור, להריץ `bun dev` ולבדוק ידנית את הזרימות:
1. עמוד הבית – Hero, Features, HowItWorks, Featured stories (טעינה מהserver), CTA. וידוא שאנימציות `whileInView` עדיין נטריגרות.
2. חיפוש – הקלדה, סינון לפי ספר/נושא/שס/שו"ע, הסרת filter tag, pagination, מצב לא מחובר.
3. עמוד סיפור – טעינה, breadcrumb, מקורות (shas+shu), מושגים, וידאו, פאנלים מתרחבים, prev/next.
4. פרופיל – טעינה, מצב view, מעבר ל-edit, שמירת שינויים, ביטול, בחירת עיסוקים, checkbox preferences, יציאה.
5. Contact – שליחת טופס.
6. Modal'ים – login, onboarding.

**אם רגרסיה ויזואלית מתגלה** – מתעדים את המיקום והדפוס המקורי, ומשחזרים את ה-class הספציפי במקום להסתמך על וריאנט.

---

## קבצים שעוברים שינוי משמעותי (סיכום)

**עיקריים:**
- `app/page.tsx` (פיצול גדול)
- `app/profile/page.tsx` (פיצול גדול)
- `app/story/[id]/page.tsx` (פיצול בינוני)
- `components/search/search-client.tsx` (פיצול קל)

**stores:**
- `lib/stores/stories-store.ts`, `lib/stores/reference-store.ts`, `lib/stores/user-store.ts`, `lib/stores/story-detail-store.ts`, `lib/stores/contact-store.ts` (החלפת fetch ל-`apiCall`)

**חדשים (פרימיטיבים):**
- `components/ui/section-header.tsx`
- `components/ui/badge.tsx`
- `components/ui/form-field.tsx`
- `components/common/motion-fade-in.tsx`
- `components/common/page-shell.tsx`
- `components/common/empty-state.tsx`
- `components/common/loading-skeleton.tsx`
- `lib/api-client.ts`

**חדשים (page-specific):**
- `app/_components/home/{hero,features,how-it-works,featured-stories}-section.tsx`
- `app/profile/_components/{profile-skeleton,profile-hero-card,personal-info-section,occupations-section,preferences-section,account-section}.tsx`
- `app/story/[id]/_components/{story-breadcrumb,story-article,story-navigation,story-not-found}.tsx`
- `components/search/active-filter-tags.tsx`
- `components/search/auth-required-overlay.tsx`

## סדר ביצוע מומלץ
1. פרימיטיבים (Phase 1) – ללא שינוי שימוש; קל לבדוק שכל פרימיטיב עומד בפני עצמו.
2. `apiCall` ושינוי stores (Phase 3a-c) – שינוי מבודד שלא נוגע ב-UI.
3. פיצול search-client (Phase 2 חלק) – הקטן ביותר.
4. פיצול story/[id] – בינוני.
5. פיצול profile – גדול.
6. פיצול home + מעבר RSC (Phase 2 + 3d) – הכי משמעותי, אחרון.

בכל שלב: `bun dev` + בדיקת המסך הרלוונטי לפני המעבר לשלב הבא, ו-commit נפרד בעברית לפי כללי הפרויקט.
