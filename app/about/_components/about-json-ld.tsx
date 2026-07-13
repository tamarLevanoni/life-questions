const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://life-questions.example';

export function AboutJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'אודות | שאלות מהחיים',
    url: `${SITE_URL}/about`,
    inLanguage: 'he',
    about: {
      '@type': 'Book',
      name: 'שאלות מהחיים',
      description:
        'ספרים ופרויקט ללימוד דיני ממונות דרך שאלות אמיתיות מהחיים ומבית המדרש, המיועדים להורים, מורים ותלמידים, לציבור הרחב ולנוער.',
      author: {
        '@type': 'Person',
        name: 'הרב איתן שנרב',
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'הורים, מורים ותלמידים, הציבור הרחב, נוער',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
