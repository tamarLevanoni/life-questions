'use client';

export function SearchHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold font-hebrew mb-1">חיפוש סיפורים</h1>
      <p className="text-muted-foreground font-hebrew text-sm">
        חיפוש מבוסס AI — לפי שם סיפור, מקור, נושא, ועוד
      </p>
    </div>
  );
}
