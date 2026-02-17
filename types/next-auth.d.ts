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
      phone?: string;
      occupations?: Occupation[];
      marketingConsent?: boolean;
      isRegistrationComplete?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    phone?: string;
    occupations?: Occupation[];
    marketingConsent?: boolean;
    isRegistrationComplete?: boolean;
  }
}
