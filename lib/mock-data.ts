export interface Story {
    id: string;
    title: string;
    storyContent: string;
    question: string;
    shortAnswer: string;
    expansion: string;
    hasVideo: boolean;
    videoUrl?: string;
    categories: {
      shas?: { masechet: string; perek: string; daf: string };
      shulchanAruch?: { chelek: string; siman: string; seif: string };
      concepts: { subject: string; concept: string }[];
    };
  }
  
  export const mockStories: Story[] = [
    {
      id: "1",
      title: "תמונה אחת שווה אלף סימנים",
      storyContent: "דודי ראה תיק בצבע ירוק עם פסים כסופים מושלך ברחוב. הוא הרים אותו וגילה בתוך התיק מצלמה יקרה עם עדשה מקצועית [1].",
      question: "מה מוטל עליו לעשות במציאה? [1]",
      shortAnswer: "התמונות שבכרטיס המצלמה נחשבות לסימן, ולכן עליו להכריז על המציאה באמצעים אפקטיביים [1].",
      expansion: "על פי השולחן ערוך (חו\"מ רנט, א), הרואה אבידת ישראל חייב לטפל בה ולהשיבה [1]. אף שהתיק עצמו אינו סימן (כי יש רבים כמותו), התמונות הייחודיות הן סימן מובהק המחייב הכרזה [1, 2].",
      hasVideo: false,
      categories: {
        shulchanAruch: { chelek: "חושן משפט", siman: "רנט", seif: "א" },
        concepts: [{ subject: "אבידה ומציאה", concept: "סימנים" }]
      }
    },
    {
      id: "2",
      title: "כשהרצל מצא כדורגל",
      storyContent: "הרצל מצא כדורגל ברחוב. הוא בדק היטב ולא מצא עליו שום סימן. אמו אמרה לו שהוא יכול לקחת אותו לעצמו, אך הוא חש ש'הכדור לא שלו' [3].",
      question: "האם הרצל צודק בסירובו להשתמש בכדור? [3]",
      shortAnswer: "לא, הרצל יכול לקחת את הכדור לעצמו על פי ההלכה [3].",
      expansion: "בדבר שאין בו סימן, אם ניכר שהבעלים יודע על האבידה ומתייאש, המוצא זוכה בו [3, 4]. כדורגל הוא חפץ גדול שבדרך כלל מבחינים מיד באובדנו, ולכן מותר למוצא לקחתו (שו\"ע סימן רסב) [4].",
      hasVideo: false,
      categories: {
        shulchanAruch: { chelek: "חושן משפט", siman: "רסב", seif: "" },
        concepts: [{ subject: "אבידה ומציאה", concept: "ייאוש" }]
      }
    },
    {
      id: "3",
      title: "גשם, אבידה ומטריה",
      storyContent: "ינון מצא בתחנת אוטובוס מטריה חדשה לגמרי, עדיין בתוך שקית הניילון מהחנות, ללא שום סימנים מזהים [4].",
      question: "מה עליו לעשות עם המטריה? [4]",
      shortAnswer: "אם המטריה מונחת באופן שרואים שהיא הונחה שם בכוונה, המקום נחשב לסימן וחובה להכריז [4, 5].",
      expansion: "על פי השולחן ערוך (סימן רסב, ג), מקום יכול להיחשב כסימן [5]. אם ניכר שהמטריה לא הוזזה ממקומה המקורי, חובה להכריז עליה [5].",
      hasVideo: true,
      videoUrl: "https://www.youtube.com/watch?v=example",
      categories: {
        shulchanAruch: { chelek: "חושן משפט", siman: "רסב", seif: "ג" },
        concepts: [{ subject: "אבידה ומציאה", concept: "סימן מקום" }]
      }
    },
    {
      id: "4",
      title: "השומר שהלך לחוף הים",
      storyContent: "יהודה ביקש מאביחי שייקח את המצלמה היקרה שלו לביתו בתוך התיק שלו. אביחי זרם עם חברים לחוף הים, השאיר את התיק ללא השגחה, והמצלמה נגנבה [6].",
      question: "האם אביחי חייב לשלם עבור המצלמה? [6]",
      shortAnswer: "כן, אביחי חייב לשלם על המצלמה [6].",
      expansion: "על פי שו\"ת הרא\"ש (כלל צד, ד), שומר שפשע בשמירתו והשאיר חפץ ללא השגחה במקום לא שמור, חייב לשלם על הגניבה.",
      hasVideo: false,
      categories: {
        shas: { masechet: "בבא מציעא", perek: "השואל", daf: "צד" },
        shulchanAruch: { chelek: "חושן משפט", siman: "רצא", seif: "" },
        concepts: [{ subject: "שומרים", concept: "פשיעה" }]
      }
    }
  ];
  