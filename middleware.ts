import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Defensive error handling to prevent 500 crashes
  try {
    const { pathname } = req.nextUrl;

    // 1. Manual Exclusion (Alternative to matcher to avoid potential regex issues)
    // Exclude internal Next.js paths, API routes, and static files
    if (
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname === '/favicon.ico' ||
      pathname === '/robots.txt' ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.svg')
    ) {
      return NextResponse.next();
    }

    // 2. Auth Check
    const protectedPaths = ['/dashboard', '/onboarding', '/tutor', '/track', '/project/submit', '/account'];
    const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));

    if (isProtected) {
      const session = req.cookies.get('session')?.value;
      if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = '/signin';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
      }
    }

    // 3. Response & Headers
    const res = NextResponse.next();

    // CSRF Token (Simple & Safe)
    if (!req.cookies.has('csrf_token')) {
      const token = 'csrf-' + Math.random().toString(36).slice(2);
      res.cookies.set('csrf_token', token, { 
        path: '/', 
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }

    // Security Headers
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Simplified CSP to reduce header size/parsing risk
    const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self';";
    res.headers.set('Content-Security-Policy', csp);

    return res;
  } catch (error) {
    // If anything fails, log and allow request to proceed (Fail Open)
    console.error('Middleware failed:', error);
    return NextResponse.next();
  }
}

