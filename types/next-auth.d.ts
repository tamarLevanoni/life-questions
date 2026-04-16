import type { Occupation } from '@/lib/types';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      firstName?: string;
      lastName?: string;
      institutionName?: string;
      phone?: string;
      occupations?: Occupation[];
      marketingConsent?: boolean;
      isRegistrationComplete?: boolean;
    };
  }

  interface User {
    // Attached server-side in signIn callback after backend lookup
    backendData?: {
      id: string;
      firstName: string;
      lastName: string;
      institutionName?: string;
      phone?: string;
      occupations?: Occupation[];
      marketingConsent?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendUserId?: string;
    firstName?: string;
    lastName?: string;
    institutionName?: string;
    phone?: string;
    occupations?: Occupation[];
    marketingConsent?: boolean;
    isRegistrationComplete?: boolean;
  }
}
