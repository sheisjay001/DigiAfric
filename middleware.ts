import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Auth Check: Handle redirects for protected routes
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

  // 2. Prepare Response for non-redirects (add headers)
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

  // 4. Security Headers (CSP, etc.)
  // Minified CSP string to reduce processing overhead
  const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests;";
  
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
