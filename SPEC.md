# שאלות מהחיים - MVP Specification

## Overview

**App Name:** שאלות מהחיים (Life Questions)
**Purpose:** Bridge educational content and daily life through short, meaningful stories accompanied by clear answers and in-depth expansions.
**Target Users:** Students, parents, teachers, and learners seeking quick daily insights on halachic topics.

---

## Architecture

### BFF (Backend-for-Frontend) Pattern

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client        │────▶│   Next.js       │────▶│   Node.js API   │
│   (Browser)     │     │   Server (BFF)  │     │   (Future)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (Neon)        │
                        └─────────────────┘
```

**Key Points:**
- Client communicates only with Next.js server
- Next.js adds API Secret header for Node.js backend calls
- Currently using mock data in `lib/mock-data.ts`
- Authentication managed via NextAuth.js (Google OAuth)
- Cookie-based sessions (HttpOnly) - no localStorage tokens

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19 |
| Runtime | Bun |
| Styling | Tailwind CSS 4, Shadcn/ui |
| Auth | NextAuth.js (Google OAuth) |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Deployment | Vercel (Web), Render (API - future) |

---

## Content Hierarchy

Each content piece follows this structure:

```
┌─────────────────────────────────────────┐
│              STORY (סיפור)              │
│  Real-life scenario from daily life    │
├─────────────────────────────────────────┤
│            QUESTION (שאלה)              │
│  Halachic question arising from story  │
├─────────────────────────────────────────┤
│      SHORT ANSWER (תשובה קצרה)          │
│  [Initially Hidden - Click to Reveal]  │
│  Concise answer to the question        │
├─────────────────────────────────────────┤
│          EXPANSION (הרחבה)              │
│  [Hidden - Permission-based Access]    │
│  In-depth explanation with sources     │
└─────────────────────────────────────────┘
```

---

## Categorization Systems

### 1. Seder HaShas (סדר הש״ס)

Talmud-based indexing system.

| Field | Hebrew | Type | Example |
|-------|--------|------|---------|
| Masechet | מסכת | Enum | בבא מציעא |
| Perek | פרק | String | השואל |
| Daf | דף | String | צד |

**Masechot List:**
- סדר זרעים: ברכות
- סדר מועד: שבת, עירובין, פסחים, שקלים, יומא, סוכה, ביצה, ראש השנה, תענית, מגילה, מועד קטן, חגיגה
- סדר נשים: יבמות, כתובות, נדרים, נזיר, סוטה, גיטין, קידושין
- סדר נזיקין: בבא קמא, בבא מציעא, בבא בתרא, סנהדרין, מכות, שבועות, עבודה זרה, הוריות
- סדר קדשים: זבחים, מנחות, חולין, בכורות, ערכין, תמורה, כריתות, מעילה, תמיד, מדות, קינים
- סדר טהרות: נדה

### 2. Shulchan Aruch (שולחן ערוך)

Jewish law code indexing.

| Field | Hebrew | Type | Example |
|-------|--------|------|---------|
| Chelek | חלק | Enum | חושן משפט |
| Siman | סימן | String | רנט |
| Se'if | סעיף | String | א |

**Chalakim (Sections):**
| Chelek | Hebrew | Topics |
|--------|--------|--------|
| Orach Chaim | אורח חיים | Daily life, Shabbat, holidays |
| Yoreh De'ah | יורה דעה | Kashrut, mourning, charity |
| Even HaEzer | אבן העזר | Marriage, divorce |
| Choshen Mishpat | חושן משפט | Civil law, business |

### 3. Concepts Index (מפתח מושגים)

Subject-based categorization for intuitive browsing.

| Field | Hebrew | Type | Example |
|-------|--------|------|---------|
| Subject | נושא | Enum | אבידה ומציאה |
| Concept | מושג | String | סימנים |

**Subjects List:**
- אבידה ומציאה (Lost & Found)
- שומרים (Guardians)
- הלכות שבת (Shabbat Laws)
- הלכות תפילה (Prayer Laws)
- כשרות (Kashrut)
- בין אדם לחברו (Interpersonal)
- הלכות צדקה (Charity Laws)
- הלכות ברכות (Blessings)
- הלכות חגים (Holiday Laws)

---

## Screen Specifications

### 1. Landing Page (מסך ראשי)

**Purpose:** Welcome users, explain the app, drive to search.

**Components:**
- Logo + Title "שאלות מהחיים"
- Authentication link (for non-logged users)
- Brief app explanation
- CTA button → Search page
- Optional: Featured stories carousel

**Design:**
- Clean white background
- Glassmorphism hero card
- RTL layout

### 2. Search Page (מסך חיפוש)

**Purpose:** Find stories by text or categories.

**Components:**
- Login prompt for unauthenticated users
- Search bar (debounced, 300ms)
- Category filter bar:
  - Category type selector (Shas/Shulchan Aruch/Concepts)
  - Dynamic sub-filters based on selection
- Results list:
  - Story cards with: title, subject badge, video indicator
- Loading spinner during search
- "No results found" state

**Technical:**
- Debounced input (300ms delay)
- Virtualized list for large result sets
- Pagination (20 items per page)

### 3. Story Page (מסך סיפור)

**Purpose:** Display full story content with progressive reveal.

**Components:**
- Title (כותרת)
- Story content (סיפור)
- Question (שאלה)
- Short Answer panel (תשובה קצרה) - collapsible, hidden initially
- Expansion panel (הרחבה) - collapsible, permission-gated
- Video embed (if hasVideo)
- Prev/Next navigation (within same book)

**Behavior:**
- Click to reveal short answer
- Expansion may require authentication/subscription
- No auto-navigation between books

### 4. Auth Pages (התחברות/הרשמה)

**Components:**
- Google Sign-in button (only provider)
- Registration extra fields:
  - Full name (שם מלא)
  - Phone number (מספר טלפון)
  - Occupation multi-select (עיסוק): דיין, רב, מורה, תלמיד, הורה, לומד
  - Marketing consent checkbox (default: checked)

### 5. Profile Page (אזור אישי)

**Components:**
- Editable: name, phone, occupations, marketing consent
- Read-only: email
- Future: Subscription details

### 6. Contact Page (צור קשר)

**Components:**
- Contact information display
- Feedback form:
  - Name, Email
  - Type selector: בקשה / הערה / הארה
  - Message textarea
  - Submit button

### 7. Header (שורת header)

**Components (RTL order):**
- Menu icon (hamburger)
- Title "שאלות מהחיים" → Home link
- Search icon → Search page
- User icon → Profile/Login

**Mobile:** Slide-out menu with navigation links

---

## API Contracts

### GET /api/stories

Search and list stories with filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| q | string | Search query (title match) |
| categoryType | string | 'shas' \| 'shulchanAruch' \| 'concepts' |
| masechet | string | Filter by masechet (if categoryType=shas) |
| chelek | string | Filter by chelek (if categoryType=shulchanAruch) |
| subject | string | Filter by subject (if categoryType=concepts) |
| hasVideo | boolean | Filter stories with video |
| page | number | Page number (default: 1) |
| pageSize | number | Items per page (default: 20) |

**Response:**
```json
{
  "data": [Story],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "hasMore": true
}
```

### GET /api/stories/:id

Get single story by ID.

**Response:**
```json
{
  "story": Story,
  "prevId": "123" | null,
  "nextId": "125" | null
}
```

### GET /api/categories

Get all category options for filters.

**Response:**
```json
{
  "masechot": ["ברכות", "שבת", ...],
  "shulchanAruch": {
    "אורח חיים": true,
    "יורה דעה": true,
    "אבן העזר": true,
    "חושן משפט": true
  },
  "subjects": ["אבידה ומציאה", "שומרים", ...]
}
```

### POST /api/contact

Submit contact form.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "type": "request" | "comment" | "enlightenment",
  "message": "string"
}
```

---

## Data Model (TypeScript)

```typescript
interface Story {
  id: string;
  title: string;
  storyContent: string;
  question: string;
  shortAnswer: string;
  expansion: string;
  hasVideo: boolean;
  videoUrl?: string;
  bookId?: string;
  orderInBook?: number;
  isPremium: boolean;
  categories: {
    shas?: { masechet: string; perek: string; daf: string };
    shulchanAruch?: { chelek: ShulchanAruchChelek; siman: string; seif: string };
    concepts: { subject: string; concept: string }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

type ShulchanAruchChelek = 'אורח חיים' | 'יורה דעה' | 'אבן העזר' | 'חושן משפט';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  occupations: Occupation[];
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type Occupation = 'דיין' | 'רב' | 'מורה' | 'תלמיד' | 'הורה' | 'לומד';

interface SearchFilters {
  query?: string;
  categoryType?: 'shas' | 'shulchanAruch' | 'concepts';
  masechet?: string;
  chelek?: ShulchanAruchChelek;
  subject?: string;
  hasVideo?: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  type: 'request' | 'comment' | 'enlightenment';
  message: string;
}
```

---

## Design Guidelines

### Visual Style
- **Background:** Clean white (#FAFAFA)
- **Style:** Modern Glassmorphism with frosted glass effects
- **Layout:** RTL (Right-to-Left) for Hebrew content

### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary (Pink) | #FF4D8E | CTAs, links, focus |
| Secondary (Blue) | #00C2FF | Accents, badges |
| Accent (Orange) | #FF9100 | Highlights, video indicators |
| Dark | #1C1C1E | Text, dark mode |

### Glass Effects
```css
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}
```

### Typography
- Primary: System Hebrew fonts (Heebo fallback)
- Secondary: Geist (Latin text)

---

## Performance Considerations

1. **Debounced Search:** 300ms delay on input
2. **Virtualized Lists:** react-window for large result sets
3. **Pagination:** API pagination (20 items/page)
4. **Category Preloading:** Load category constants on app init
5. **Image Optimization:** Next.js Image component

---

## Security

1. **Authentication:** Google OAuth only via NextAuth.js
2. **Sessions:** HttpOnly cookie-based (no localStorage tokens)
3. **BFF Layer:** API Secret header for backend communication
4. **Protected Routes:** Profile, Expansion content
5. **Input Validation:** Zod schemas for form data

---

## Future Roadmap

### Phase 2 (Premium)
- Subscription management
- Payment integration
- Premium content gating

### Phase 3 (Expansion)
- Mobile app (React Native)
- Push notifications
- Teacher dashboard
- Content management system
