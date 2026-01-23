import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getPool, ensureUsersTable, ensureSessionsTable } from '../../../../lib/db';

function getCookie(req: Request, name: string) {
  const v = req.headers.get('cookie') || '';
  const m = v.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : '';
}

export async function GET(request: Request) {
  const p = getPool();
  await ensureUsersTable();
  await ensureSessionsTable();
  const sid = getCookie(request, 'session');
  if (!sid) return NextResponse.json({ user: null });
  const [rows] = await p.query('SELECT user_id, expires_at FROM sessions WHERE id = ?', [sid]);
  const s = (rows as any[])[0];
  if (!s) return NextResponse.json({ user: null });
  if (new Date(s.expires_at).getTime() < Date.now()) return NextResponse.json({ user: null });
  const [urows] = await p.query('SELECT id, email, name, created_at FROM users WHERE id = ?', [s.user_id]);
  const user = (urows as any[])[0] || null;
  return NextResponse.json({ user });
}
