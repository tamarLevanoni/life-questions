import type { Story } from '@/lib/types';

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'תמונה אחת שווה אלף סימנים',
    storyContent:
      'דודי ראה תיק בצבע ירוק עם פסים כסופים מושלך ברחוב. הוא הרים אותו וגילה בתוך התיק מצלמה יקרה עם עדשה מקצועית.',
    question: 'מה מוטל עליו לעשות במציאה?',
    shortAnswer:
      'התמונות שבכרטיס המצלמה נחשבות לסימן, ולכן עליו להכריז על המציאה באמצעים אפקטיביים.',
    expansion:
      'על פי השולחן ערוך (חו"מ רנט, א), הרואה אבידת ישראל חייב לטפל בה ולהשיבה. אף שהתיק עצמו אינו סימן (כי יש רבים כמותו), התמונות הייחודיות הן סימן מובהק המחייב הכרזה. הפוסקים מסבירים שכל דבר שמאפשר לבעלים להוכיח שהחפץ שלו נחשב לסימן.',
    hasVideo: false,
    bookId: 'choshen-mishpat-1',
    orderInBook: 1,
    categories: {
      shulchanAruch: { chelek: 'חושן משפט', siman: 'רנט', seif: 'א' },
      concepts: [{ subject: 'אבידה ומציאה', concept: 'סימנים' }],
    },
  },
  {
    id: '2',
    title: 'כשהרצל מצא כדורגל',
    storyContent:
      'הרצל מצא כדורגל ברחוב. הוא בדק היטב ולא מצא עליו שום סימן. אמו אמרה לו שהוא יכול לקחת אותו לעצמו, אך הוא חש ש"הכדור לא שלו".',
    question: 'האם הרצל צודק בסירובו להשתמש בכדור?',
    shortAnswer: 'לא, הרצל יכול לקחת את הכדור לעצמו על פי ההלכה.',
    expansion:
      'בדבר שאין בו סימן, אם ניכר שהבעלים יודע על האבידה ומתייאש, המוצא זוכה בו. כדורגל הוא חפץ גדול שבדרך כלל מבחינים מיד באובדנו, ולכן מותר למוצא לקחתו (שו"ע סימן רסב). הייאוש של הבעלים מעביר את הבעלות למוצא.',
    hasVideo: false,
    bookId: 'choshen-mishpat-1',
    orderInBook: 2,
    categories: {
      shulchanAruch: { chelek: 'חושן משפט', siman: 'רסב', seif: '' },
      concepts: [{ subject: 'אבידה ומציאה', concept: 'ייאוש' }],
    },
  },
  {
    id: '3',
    title: 'גשם, אבידה ומטריה',
    storyContent:
      'ינון מצא בתחנת אוטובוס מטריה חדשה לגמרי, עדיין בתוך שקית הניילון מהחנות, ללא שום סימנים מזהים.',
    question: 'מה עליו לעשות עם המטריה?',
    shortAnswer:
      'אם המטריה מונחת באופן שרואים שהיא הונחה שם בכוונה, המקום נחשב לסימן וחובה להכריז.',
    expansion:
      'על פי השולחן ערוך (סימן רסב, ג), מקום יכול להיחשב כסימן. אם ניכר שהמטריה לא הוזזה ממקומה המקורי, חובה להכריז עליה. הפוסקים מסבירים שסימן מקום פועל רק כאשר ברור שהחפץ הונח שם בכוונה ולא נפל.',
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    bookId: 'choshen-mishpat-1',
    orderInBook: 3,
    categories: {
      shulchanAruch: { chelek: 'חושן משפט', siman: 'רסב', seif: 'ג' },
      concepts: [{ subject: 'אבידה ומציאה', concept: 'סימן מקום' }],
    },
  },
  {
    id: '4',
    title: 'השומר שהלך לחוף הים',
    storyContent:
      'יהודה ביקש מאביחי שייקח את המצלמה היקרה שלו לביתו בתוך התיק שלו. אביחי זרם עם חברים לחוף הים, השאיר את התיק ללא השגחה, והמצלמה נגנבה.',
    question: 'האם אביחי חייב לשלם עבור המצלמה?',
    shortAnswer: 'כן, אביחי חייב לשלם על המצלמה.',
    expansion:
      'על פי שו"ת הרא"ש (כלל צד, ד), שומר שפשע בשמירתו והשאיר חפץ ללא השגחה במקום לא שמור, חייב לשלם על הגניבה. גם שומר חינם, שבדרך כלל פטור מגניבה ואבידה, חייב כשפשע בשמירה.',
    hasVideo: false,
    bookId: 'choshen-mishpat-1',
    orderInBook: 4,
    categories: {
      shas: { masechet: 'בבא מציעא', perek: 'השואל', daf: 'צד' },
      shulchanAruch: { chelek: 'חושן משפט', siman: 'רצא', seif: '' },
      concepts: [{ subject: 'שומרים', concept: 'פשיעה' }],
    },
  },
  {
    id: '5',
    title: 'הארנק שנשכח בחנות',
    storyContent:
      'רחל שכחה את הארנק שלה על הדלפק בחנות הבגדים. כשחזרה אחרי שעה, הארנק כבר לא היה שם. המוכרת אמרה שלקוח אחר לקח אותו.',
    question: 'האם הלקוח שלקח את הארנק נהג כשורה?',
    shortAnswer:
      'לא, היה עליו להשאיר את הארנק במקום או למסור לבעל החנות, שכן מקום החנות הוא סימן.',
    expansion:
      'כאשר אבידה נמצאת במקום ידוע כמו חנות, על המוצא להניח שהבעלים יחזור לחפש שם. לקיחת הארנק מונעת מהבעלים למצוא אותו. הדין הוא שיש למסור לבעל החנות או להשאיר במקום ולהודיע. רק אם יש חשש שאדם לא ישר ייקח, מותר לקחת ולהכריז.',
    hasVideo: false,
    categories: {
      shulchanAruch: { chelek: 'חושן משפט', siman: 'רס', seif: 'י' },
      concepts: [{ subject: 'אבידה ומציאה', concept: 'השבה' }],
    },
  },
  {
    id: '6',
    title: 'השכן שבנה על הגבול',
    storyContent:
      'משה גילה שהשכן שלו בנה גדר חדשה, וחלק מהגדר נכנס 20 ס"מ לתוך החצר שלו. השכן טוען שזו טעות של הקבלן.',
    question: 'האם משה יכול לדרוש להזיז את הגדר?',
    shortAnswer: 'כן, משה רשאי לדרוש שהגדר תוזז לגבול המדויק.',
    expansion:
      'הגמרא בבבא בתרא (ב, ב) קובעת שאין אדם יכול לבנות בשטח חברו, אפילו לא מעט. גם אם הייתה טעות, האחריות היא על הבונה לתקן. עם זאת, הפוסקים ממליצים לנסות להגיע לפשרה כדי לשמור על יחסי שכנות טובים.',
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    categories: {
      shas: { masechet: 'בבא בתרא', perek: 'השותפים', daf: 'ב' },
      shulchanAruch: { chelek: 'חושן משפט', siman: 'קנז', seif: 'א' },
      concepts: [{ subject: 'הלכות שכנים', concept: 'גדר' }],
    },
  },
  {
    id: '7',
    title: 'ההלוואה ללא עדים',
    storyContent:
      'דני הלווה לחברו אלי 5,000 שקלים ללא עדים וללא שטר. עכשיו אלי טוען שהכסף היה מתנה ולא הלוואה.',
    question: 'מה הדין כשיש מחלוקת על אופי העברת הכסף?',
    shortAnswer:
      'המוציא מחברו עליו הראיה - על דני להוכיח שזו הייתה הלוואה.',
    expansion:
      'הכלל ההלכתי "המוציא מחברו עליו הראיה" (בבא קמא מו, א) קובע שמי שתובע כסף מחברו צריך להביא ראיה. מכיוון שדני רוצה להוציא כסף מאלי, עליו להוכיח. לכן חשוב תמיד להלוות בעדים או בשטר, כמו שאומרת הגמרא בבבא מציעא (עה, ב): "עביד איניש דיהיב זוזי בלא סהדי?"',
    hasVideo: false,
    categories: {
      shas: { masechet: 'בבא קמא', perek: 'שור שנגח', daf: 'מו' },
      shulchanAruch: { chelek: 'חושן משפט', siman: 'ע', seif: 'א' },
      concepts: [{ subject: 'הלכות הלוואות', concept: 'ערבות' }],
    },
  },
  {
    id: '8',
    title: 'הנזק בחתונה',
    storyContent:
      'בחתונה של יעקב, אחד המוזמנים רקד בהתלהבות ובטעות דחף שולחן. כוסות יין נשפכו על שמלת הכלה היקרה.',
    question: 'האם הרוקד חייב לשלם על ניקוי או החלפת השמלה?',
    shortAnswer: 'תלוי - אם הייתה רשלנות חייב, אם היה אונס גמור פטור.',
    expansion:
      'הגמרא בבבא קמא (כז, ב) דנה ב"אדם מועד לעולם" - אדם אחראי על נזקיו. אולם, יש להבחין: אם הריקוד היה בצורה סבירה והנזק היה בלתי צפוי לגמרי, ייתכן שזה נחשב אונס. אם היה ריקוד פרוע באזור צפוף, זו רשלנות וחייב. הפוסקים מציעים לפעמים חלוקת האחריות.',
    hasVideo: false,
    categories: {
      shas: { masechet: 'בבא קמא', perek: 'כיצד הרגל', daf: 'כז' },
      shulchanAruch: { chelek: 'חושן משפט', siman: 'שעח', seif: 'א' },
      concepts: [{ subject: 'הלכות נזיקין', concept: 'נזקי גוף' }],
    },
  },
  {
    id: '9',
    title: 'מציאה בכיס המעיל',
    storyContent:
      'שרה קנתה מעיל יד שנייה בחנות וינטג\'. כשהגיעה הביתה, מצאה בכיס שטר של 200 שקלים.',
    question: 'למי שייך הכסף - לשרה, לחנות, או לבעלים הקודמים?',
    shortAnswer:
      'הכסף שייך לשרה, כי הבעלים הקודמים כבר התייאשו כשמכרו את המעיל.',
    expansion:
      'הדין הוא שכאשר אדם מוכר חפץ, הוא מוותר על כל מה שבתוכו שהוא לא יודע עליו. זה נחשב ייאוש מדעת. הגמרא בבבא מציעא (כא, ב) מסבירה שייאוש שלא מדעת נחשב ייאוש. החנות לא זכתה כי לא ידעה על הכסף, ושרה זוכה כמוצאת אחרי ייאוש.',
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    categories: {
      shas: { masechet: 'בבא מציעא', perek: 'אלו מציאות', daf: 'כא' },
      shulchanAruch: { chelek: 'חושן משפט', siman: 'רסב', seif: 'ה' },
      concepts: [{ subject: 'אבידה ומציאה', concept: 'ייאוש' }],
    },
  },
  {
    id: '10',
    title: 'הספר שלא הוחזר',
    storyContent:
      'נועם השאיל ספר יקר לחברו עמית. עמית שכח להחזיר, וכשנזכר אחרי חודש, גילה שהספר נרטב בגשם שנכנס מהחלון.',
    question: 'האם עמית חייב לשלם על הספר?',
    shortAnswer: 'כן, עמית כשואל חייב באונסים ובוודאי ברשלנות כזו.',
    expansion:
      'שואל הוא דרגת השמירה הגבוהה ביותר - חייב אפילו באונסים (שו"ע חו"מ סימן שמ). במקרה זה, השארת החלון פתוח היא רשלנות. גם אם נאמר שזה היה אונס (גשם פתאומי), שואל חייב באונסים. עמית צריך לשלם את ערך הספר או לקנות ספר חדש זהה.',
    hasVideo: false,
    categories: {
      shas: { masechet: 'בבא מציעא', perek: 'השואל', daf: 'צד' },
      shulchanAruch: { chelek: 'חושן משפט', siman: 'שמ', seif: 'א' },
      concepts: [{ subject: 'שומרים', concept: 'שואל' }],
    },
  },
  {
    id: '11',
    title: 'לשון הרע או אזהרה?',
    storyContent:
      'רינה גילתה שחברתה מירב עומדת להתחתן עם בחור שידוע לה שהוא בעייתי. היא מתלבטת אם לספר למירב.',
    question: 'האם מותר לרינה לספר למירב על הבעיות של החתן?',
    shortAnswer:
      'כן, לא רק מותר אלא חובה - זה נכנס בגדר "לא תעמוד על דם רעך".',
    expansion:
      'החפץ חיים בספרו מפרט תנאים לאמירת לשון הרע לתועלת: (1) לראות בעצמו ולא משמועות (2) לבדוק היטב שזה באמת רע (3) להוכיח קודם את האדם (4) לא להגזים (5) כוונה לתועלת בלבד (6) אין דרך אחרת למנוע הנזק (7) לא לגרום נזק יתר. אם התנאים מתקיימים - חובה להזהיר.',
    hasVideo: true,
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    categories: {
      shulchanAruch: { chelek: 'אורח חיים', siman: 'קנו', seif: 'א' },
      concepts: [{ subject: 'בין אדם לחברו', concept: 'לשון הרע' }],
    },
  },
  {
    id: '12',
    title: 'ברכה על עוגה בבית קפה',
    storyContent:
      'אורי הזמין קפה ועוגת שוקולד בבית קפה. הוא התחיל לאכול את העוגה ופתאום נזכר שלא בירך.',
    question: 'מה עליו לעשות עכשיו?',
    shortAnswer:
      'עליו לבלוע מה שבפיו, לברך "מזונות", ולהמשיך לאכול.',
    expansion:
      'הכלל הוא שכל עוד האוכל לא נבלע לגמרי, אפשר עדיין לברך. אם כבר בלע חלק - מברך על מה שנשאר. אם סיים לאכול לגמרי בלי ברכה - הפסיד את הברכה הראשונה אבל עדיין מברך ברכה אחרונה (על מזונות - "על המחיה"). הפוסקים מדגישים את חשיבות ההתרכזות לפני אכילה.',
    hasVideo: false,
    categories: {
      shulchanAruch: { chelek: 'אורח חיים', siman: 'קסז', seif: 'ו' },
      concepts: [{ subject: 'הלכות ברכות', concept: 'ברכות הנהנין' }],
    },
  },
];

// Helper function to get story by ID
export function getStoryById(id: string): Story | undefined {
  return mockStories.find((story) => story.id === id);
}

// Helper function to get adjacent stories (prev/next)
export function getAdjacentStories(
  id: string
): { prevId: string | null; nextId: string | null } {
  const story = getStoryById(id);
  if (!story || !story.bookId) {
    return { prevId: null, nextId: null };
  }

  const bookStories = mockStories
    .filter((s) => s.bookId === story.bookId)
    .sort((a, b) => (a.orderInBook || 0) - (b.orderInBook || 0));

  const currentIndex = bookStories.findIndex((s) => s.id === id);

  return {
    prevId: currentIndex > 0 ? bookStories[currentIndex - 1].id : null,
    nextId:
      currentIndex < bookStories.length - 1
        ? bookStories[currentIndex + 1].id
        : null,
  };
}

// Helper function to filter stories
export function filterStories(
  query?: string,
  categoryType?: string,
  masechet?: string,
  chelek?: string,
  subject?: string,
  hasVideo?: boolean
): Story[] {
  let filtered = [...mockStories];

  // Filter by search query
  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(
      (story) =>
        story.title.toLowerCase().includes(lowerQuery) ||
        story.storyContent.toLowerCase().includes(lowerQuery) ||
        story.question.toLowerCase().includes(lowerQuery)
    );
  }

  // Filter by category type and sub-filters
  if (categoryType === 'shas' && masechet) {
    filtered = filtered.filter(
      (story) => story.categories.shas?.masechet === masechet
    );
  } else if (categoryType === 'shulchanAruch' && chelek) {
    filtered = filtered.filter(
      (story) => story.categories.shulchanAruch?.chelek === chelek
    );
  } else if (categoryType === 'concepts' && subject) {
    filtered = filtered.filter((story) =>
      story.categories.concepts.some((c) => c.subject === subject)
    );
  }

  // Filter by video
  if (hasVideo !== undefined) {
    filtered = filtered.filter((story) => story.hasVideo === hasVideo);
  }

  return filtered;
}
