import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { AUTH_IDENTITY_VERSION } from '@/lib/auth-identity';
import { applySessionUser, lookupSessionUser } from '@/lib/server/session-user';

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
      if (account?.provider !== 'google') return false;

      try {
        user.backendData = await lookupSessionUser(account.providerAccountId) ?? undefined;
      } catch (err) {
        console.error('[auth] User lookup failed', { errorType: err instanceof Error ? err.name : 'Unknown' });
        return false;
      }

      return true;
    },

    async jwt({ token, user, account, trigger }) {
      if (account?.provider === 'google' && user) {
        return applySessionUser(token, user.backendData ?? null, account.providerAccountId);
      }
      if (token.identityVersion !== AUTH_IDENTITY_VERSION || !token.sub) {
        throw new Error('Session expired; sign in again');
      }
      // session.update input is attacker-controlled; read the profile from the server.
      if (trigger === 'update') {
        return applySessionUser(token, await lookupSessionUser(token.sub), token.sub);
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
