
export interface Story {
    id: string;
    title: string;          // שם הסיפור
    storyContent: string;   // חלק ה"סיפור"
    question: string;       // חלק ה"שאלה"
    shortAnswer: string;    // חלק ה"תשובה הקצרה" (מוסתר בתחילה)
    expansion: string;      // חלק ה"הרחבה" (מוסתר בתחילה)
    hasVideo: boolean;      // סימון האם יש וידאו [6]
    videoUrl?: string;
    
    // קטגוריות על פי האפיון [5]
    categories: {
      shas?: { masechet: string; perek: string; daf: string };
      shulchanAruch?: { chelek: string; siman: string; seif: string };
      concepts: { subject: string; concept: string }[];
    };
  }
  