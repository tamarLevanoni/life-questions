import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
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
    async jwt({ token, trigger, session }) {
      // בעת עדכון session (מהאונבורדינג) - מיזוג הנתונים לתוך ה-JWT
      if (trigger === 'update' && session) {
        token.phone = session.phone;
        token.occupations = session.occupations;
        token.marketingConsent = session.marketingConsent;
        token.isRegistrationComplete = session.isRegistrationComplete;
      }
      return token;
    },
    async session({ session, token }) {
      // העברת כל השדות המורחבים מה-JWT ל-session
      session.user.id = token.sub;
      session.user.phone = token.phone;
      session.user.occupations = token.occupations;
      session.user.marketingConsent = token.marketingConsent;
      session.user.isRegistrationComplete = token.isRegistrationComplete;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
