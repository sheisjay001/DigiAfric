import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // 1. Auth Check: Redirect to signin if accessing protected routes without session
    const protectedPaths = ['/dashboard', '/onboarding', '/tutor', '/track', '/project/submit', '/account'];
    const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));

    if (isProtected) {
      const session = req.cookies.get('session')?.value;
      if (!session) {
        const url = new URL('/signin', req.url);
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
      }
    }

    // 2. Prepare Response
    const res = NextResponse.next();

    // 3. CSRF Token
    if (!req.cookies.has('csrf_token')) {
      const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      res.cookies.set('csrf_token', token, {
        httpOnly: false, 
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      });
    }

    // 4. Security Headers
    const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests;";
    
    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return res;
  } catch (e) {
    // Failsafe: If middleware errors, log it and let the request proceed
    console.error('Middleware error:', e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

