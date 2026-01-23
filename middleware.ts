import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    
    // Determine if we need to redirect first
    let res = NextResponse.next();
    
    const protectedPaths = ['/dashboard', '/onboarding', '/tutor', '/track', '/project/submit', '/account'];
    const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
    
    if (isProtected) {
      const session = req.cookies.get('session')?.value;
      if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = '/signin';
        url.searchParams.set('next', pathname);
        res = NextResponse.redirect(url);
      }
    }

    // CSRF Token
    const csrf = req.cookies.get('csrf_token')?.value;
    if (!csrf) {
      // Simple fallback ID generation to avoid crypto issues in edge runtime
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      res.cookies.set('csrf_token', token, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      });
    }

    // Content Security Policy
    const csp = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
