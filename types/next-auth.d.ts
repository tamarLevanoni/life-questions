import type { UserData } from '@/lib/schemas';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    // כל שדות UserData אופציונליים + שדות NextAuth הרגילים
    user: Partial<UserData> & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isRegistrationComplete?: boolean; // flag זמני של OAuth — לא מגיע מהשרת
    };
  }

  interface User {
    // נתוני backend שמצורפים ב-signIn callback
    backendData?: UserData;
  }
}

declare module 'next-auth/jwt' {
  // JWT מכיל את שדות UserData (ללא email שנמצאים ב-token.email)
  interface JWT extends Partial<Omit<UserData, 'email'>> {
    backendUserId?: string;
    isRegistrationComplete?: boolean; // flag זמני של OAuth — לא מגיע מהשרת
  }
}
