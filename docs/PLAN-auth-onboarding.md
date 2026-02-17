# תכנית: מודל התחברות + אונבורדינג לאחר הרשמה

## הקשר
כרגע ההתחברות מתבצעת ישירות דרך `signIn('google')` ללא מודל. אין תהליך אונבורדינג - משתמשים חדשים נכנסים ישר למערכת בלי להשלים פרטים נוספים (טלפון, עיסוקים, הסכמה שיווקית). הטייפים (`UserRegistrationData`, `Occupation`) כבר מוגדרים ב-`lib/types.ts` אבל לא מחוברים לשום UI.

## Flow
1. משתמש לוחץ "התחברות" → נפתח **מודל התחברות** עם כפתור Google
2. Google OAuth מתבצע → חוזר לאפליקציה
3. אם המשתמש **חדש** (אין `isRegistrationComplete`) → נפתח **מודל אונבורדינג** עם טופס
4. המשתמש ממלא את הטופס ושולח → הנתונים נשמרים ב-JWT session
5. משתמש חוזר (כבר השלים הרשמה) → נכנס ישר

## שלבי מימוש

### שלב 0: התקנת קומפוננטות Shadcn
```bash
bunx shadcn@latest add dialog
bunx shadcn@latest add checkbox
```

### שלב 1: הרחבת טייפים של NextAuth
**קובץ חדש:** `types/next-auth.d.ts`
- הרחבת `Session.user` עם: `phone`, `occupations`, `marketingConsent`, `isRegistrationComplete`
- הרחבת `JWT` עם אותם שדות

### שלב 2: עדכון הגדרות NextAuth עם Callbacks
**עריכה:** `app/api/auth/[...nextauth]/route.ts`
- הוספת `jwt` callback: שמירת `isRegistrationComplete` בעת sign-in, ומיזוג נתוני הרשמה בעת `trigger === 'update'`
- הוספת `session` callback: העברת כל השדות המורחבים מה-JWT ל-session
- הגדרת `session.strategy: 'jwt'` מפורש

### שלב 3: יצירת Auth Context
**קובץ חדש:** `lib/auth-context.tsx`
- ניהול state של המודלים (login open, onboarding open)
- פונקציית `openLoginModal()` שמחליפה את כל קריאות `signIn('google')`
- `useEffect` שמזהה משתמש מחובר ללא `isRegistrationComplete` ופותח אוטומטית את מודל האונבורדינג

### שלב 4: מודל התחברות
**קובץ חדש:** `components/auth/login-modal.tsx`
- Shadcn Dialog עם עיצוב glassmorphism
- כפתור "התחברות עם Google" עם אייקון SVG
- RTL, עברית, `glass-panel` class

### שלב 5: מודל אונבורדינג
**קובץ חדש:** `components/auth/onboarding-modal.tsx`
- טופס עם `react-hook-form` + `zod` validation (כבר מותקנים)
- שדות: שם (pre-filled מגוגל), טלפון (אופציונלי), עיסוקים (pill toggles), הסכמה שיווקית (checkbox)
- **לא ניתן לסגור** בלי להשלים (מונע Escape ולחיצה בחוץ)
- Submit קורא ל-`session.update()` עם הנתונים + `isRegistrationComplete: true`

### שלב 6: חיבור ב-Providers
**עריכה:** `app/providers.tsx`
- עטיפה ב-`AuthProvider`
- רנדור `LoginModal` ו-`OnboardingModal` ברמת ה-provider (פעם אחת, גלובלי)

### שלב 7: עדכון ה-Header
**עריכה:** `components/layout/app-header.tsx`
- החלפת `signIn('google')` ב-`openLoginModal()` (desktop + mobile)
- הסרת import של `signIn`, הוספת `useAuth`

## קבצים קריטיים

| פעולה | קובץ |
|-------|-------|
| התקנה | shadcn dialog + checkbox |
| חדש | `types/next-auth.d.ts` |
| עריכה | `app/api/auth/[...nextauth]/route.ts` |
| חדש | `lib/auth-context.tsx` |
| חדש | `components/auth/login-modal.tsx` |
| חדש | `components/auth/onboarding-modal.tsx` |
| עריכה | `app/providers.tsx` |
| עריכה | `components/layout/app-header.tsx` |

## אימות
1. הרצת `bun run dev` ובדיקה שהאפליקציה עולה
2. לחיצה על "התחברות" → מודל נפתח עם כפתור Google
3. התחברות דרך Google → מודל אונבורדינג נפתח אוטומטית
4. מילוי טופס ושליחה → המודל נסגר, ה-session מכיל את הנתונים
5. רענון דף → לא מופיע מודל אונבורדינג שוב (isRegistrationComplete = true)
6. בדיקת RTL ועיצוב glassmorphism בשני המודלים

## הערות
- **גודל JWT**: הנתונים קטנים מספיק (~200 bytes) עבור cookie. בפרודקשן יועברו ל-DB
- **אובדן cookie**: אם ה-JWT נמחק, האונבורדינג יופיע שוב - מקובל ל-MVP
- **אפליקציה עתידית**: כשהנתונים יעברו ל-DB בשרת Node.js, המעבר לאפליקציה מובייל יהיה חלק - אותו API, רק token-based auth במקום cookies

## הפעלה בחלון חדש
פתח שיחה חדשה של Claude Code והקלד:
```
בצע את התוכנית שנמצאת ב docs/PLAN-auth-onboarding.md
```
