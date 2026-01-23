import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Check for session cookie
  const session = req.cookies.get('session')?.value;

  // If no session, redirect to signin
  if (!session) {
    const url = new URL('/signin', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ONLY run this middleware on these specific protected paths
// This avoids running on API routes, static files, or public pages
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/tutor/:path*',
    '/track/:path*',
    '/project/submit',
    '/account/:path*',
  ],
};

