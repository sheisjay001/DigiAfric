import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const csrf = req.cookies.get('csrf_token')?.value;
  if (!csrf) {
    res.cookies.set('csrf_token', crypto.randomUUID(), {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    });
  }
  const { pathname } = req.nextUrl;
  const protectedPaths = ['/dashboard', '/onboarding', '/tutor', '/track', '/project/submit', '/account'];
  const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!isProtected) return res;
  const session = req.cookies.get('session')?.value;
  if (!session) {
    const url = new URL('/signin', req.nextUrl.origin);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
