import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });
  if (!token) {
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
    if (req.nextUrl.pathname.startsWith('/story/')) {
      home.searchParams.set('alert', 'auth-story');
      return NextResponse.redirect(home);
    } else if (req.nextUrl.pathname.startsWith('/profile')) {
      home.searchParams.set('alert', 'auth-profile');
      return NextResponse.redirect(home);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/story/((?!featured).+)',
    '/contact',
  ],
};
