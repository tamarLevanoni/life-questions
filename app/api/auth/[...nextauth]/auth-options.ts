import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;

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
        const res = await fetch(`${BACKEND_API_URL}/api/users/google/${googleId}`, {
          headers: { 'x-api-secret': INTERNAL_API_SECRET },
        });

        if (res.ok) {
          user.backendData = await res.json();
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
          token.backendUserId = user.backendData.id;
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
        if (session.backendUserId !== undefined) token.backendUserId = session.backendUserId;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
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
