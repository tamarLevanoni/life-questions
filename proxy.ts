import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AUTH_IDENTITY_VERSION } from '@/lib/auth-identity';

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token || token.identityVersion !== AUTH_IDENTITY_VERSION) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (req.nextUrl.pathname.startsWith('/contact')) {
      const isStoryContact = req.nextUrl.pathname === '/contact' &&
      req.nextUrl.searchParams.get('category') === 'story_question';
      const contact = new URL('/contact', req.url);
      if (isStoryContact) {
        contact.searchParams.set('alert', 'auth-contact');
        return NextResponse.redirect(contact);
      }
      else {
        return NextResponse.next();
      }
    }
    const home = new URL('/', req.url);
    if (req.nextUrl.pathname.startsWith('/profile')) {
      home.searchParams.set('alert', 'auth-profile');
      return NextResponse.redirect(home);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/contact',
  ],
};
