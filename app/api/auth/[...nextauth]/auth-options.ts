import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { backendFetch } from '@/lib/backend-fetch';
import type { UserData } from '@/lib/schemas';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;

      try {
        const googleId = account.providerAccountId;
        const { data, ok } = await backendFetch<UserData>(`/api/users/google/${googleId}`);
        if (ok) {
          user.backendData = data as typeof user.backendData;
        }
        // 404 = new user — don't block sign-in, backendData stays undefined
      } catch {
        // Backend unreachable — allow sign-in, treat as new user
      }

      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign-in: persist backend data into the JWT
      if (account && user) {
        if (user.backendData) {
          token.id = user.backendData.id;
          token.googleId = user.backendData.googleId;
          token.email = user.backendData.email;
          token.firstName = user.backendData.firstName;
          token.lastName = user.backendData.lastName;
          token.institutionName = user.backendData.institutionName;
          token.phone = user.backendData.phone;
          token.occupations = user.backendData.occupations;
          token.marketingConsent = user.backendData.marketingConsent;
          token.isRegistrationComplete = true;
        } else {
          token.isRegistrationComplete = false;
        }
      }

      // Session update (from onboarding modal or profile edits)
      if (trigger === 'update' && session) {
        if (session.firstName !== undefined) token.firstName = session.firstName;
        if (session.lastName !== undefined) token.lastName = session.lastName;
        if (session.institutionName !== undefined) token.institutionName = session.institutionName;
        if (session.phone !== undefined) token.phone = session.phone;
        if (session.occupations !== undefined) token.occupations = session.occupations;
        if (session.marketingConsent !== undefined) token.marketingConsent = session.marketingConsent;
        if (session.isRegistrationComplete !== undefined)
          token.isRegistrationComplete = session.isRegistrationComplete;
        if (session.id !== undefined) token.id = session.id;
        if (session.googleId !== undefined) token.googleId = session.googleId;
        if (session.email !== undefined) token.email = session.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.googleId = token.googleId ?? token.sub; // fallback ל-sub עבור משתמשים חדשים שעוד לא נרשמו
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.institutionName = token.institutionName;
      session.user.phone = token.phone;
      session.user.occupations = token.occupations;
      session.user.marketingConsent = token.marketingConsent;
      session.user.isRegistrationComplete = token.isRegistrationComplete;
      return session;
    },
  },
};
