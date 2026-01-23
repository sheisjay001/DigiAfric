import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getPool, ensureSessionsTable } from '../../../../lib/db';

function getCookie(req: Request, name: string) {
  const v = req.headers.get('cookie') || '';
  const m = v.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : '';
}

export async function POST(request: Request) {
  const cookies = request.headers.get('cookie') || '';
  const cm = cookies.match(/csrf_token=([^;]+)/);
  const tokenCookie = cm ? decodeURIComponent(cm[1]) : '';
  const headerToken = request.headers.get('x-csrf') || '';
  if (!tokenCookie || tokenCookie !== headerToken) {
    return NextResponse.json({ ok: false, error: 'csrf' }, { status: 403 });
  }
  const p = getPool();
  await ensureSessionsTable();
  const sid = getCookie(request, 'session');
  if (sid) {
    await p.query('DELETE FROM sessions WHERE id = ?', [sid]);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0)
  });
  return res;
}
