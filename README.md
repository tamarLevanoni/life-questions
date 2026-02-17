# שאלות מהחיים | Life Questions

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Bun](https://img.shields.io/badge/Bun-Runtime-orange?style=for-the-badge&logo=bun)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

### לומדים מהחיים, מבינים את התורה

אפליקציה לתוכן תורני עם סיפורים, שאלות ותשובות מעמיקות.

</div>

---

## אודות הפרויקט

**שאלות מהחיים** היא פלטפורמה ייחודית המציגה תוכן תורני בצורה מרתקת ונגישה.
דרך סיפורים ושאלות מעוררות מחשבה, אנו מקשרים בין החיים היומיומיים לבין חכמת התורה.

### מודל התוכן

כל תוכן עוקב אחרי ההיררכיה הבאה:
- **סיפור** - סיפור קצר ומעניין מהחיים
- **שאלה** - שאלה מעוררת מחשבה הנובעת מהסיפור
- **תשובה קצרה** - הבנה ראשונית (מוסתרת בהתחלה)
- **הרחבה** - מקורות מעמיקים מהש"ס והשולחן ערוך

### קטגוריות

התוכן ניתן לתיוג לפי:
- **סדר הש"ס** - מסכת, פרק, דף
- **שולחן ערוך** - חלק, סימן, סעיף
- **מושגים** - נושא, מושג

---

## טכנולוגיות

| טכנולוגיה | תיאור |
|-----------|--------|
| **Next.js 16** | App Router, React Server Components |
| **React 19** | הגרסה האחרונה עם ביצועים משופרים |
| **Bun** | מנהל חבילות מהיר פי 30 |
| **TypeScript 5** | בטיחות טיפוסים מלאה |
| **Tailwind CSS 4** | עיצוב מודרני עם OKLch |
| **Shadcn/ui** | קומפוננטות נגישות ויפות |
| **NextAuth.js** | אימות עם Google OAuth |

---

## התקנה

```bash
# שכפול הפרויקט
git clone <repository-url>
cd life-questions

# התקנת תלויות
bun install

# הגדרת משתני סביבה
cp .env.example .env.local

# הפעלת שרת פיתוח
bun run dev
```

---

## הגדרת Google OAuth

1. היכנסו ל-[Google Cloud Console](https://console.cloud.google.com/)
2. צרו פרויקט חדש או בחרו קיים
3. נווטו ל-**APIs & Services > Credentials**
4. לחצו **Create Credentials > OAuth client ID**
5. בחרו **Web application**
6. הוסיפו redirect URI: `http://localhost:3000/api/auth/callback/google`
7. העתיקו את הפרטים ל-`.env.local`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

---

## סקריפטים

```bash
bun run dev      # שרת פיתוח
bun run build    # בנייה לפרודקשן
bun run start    # הפעלת פרודקשן
bun run lint     # בדיקת קוד
```

---

## מבנה הפרויקט

```
life-questions/
├── app/                    # דפי האפליקציה
│   ├── api/auth/          # נתיבי אימות
│   ├── globals.css        # סגנונות גלובליים
│   ├── layout.tsx         # Layout ראשי
│   └── page.tsx           # דף הבית
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # סקשנים של הדף
│   └── ui/                # קומפוננטות Shadcn
├── lib/
│   ├── blog.ts            # נתוני בלוג
│   └── utils.ts           # פונקציות עזר
└── public/                # קבצים סטטיים
```

---

## רישיון

MIT License - ראו [LICENSE](LICENSE) לפרטים.
