import { NextResponse } from 'next/server';
import { getPool, ensureProfilesTable, ensureUsersTable, ensureSessionsTable } from '../../../../lib/db';

function getCookie(req: Request, name: string) {
  const v = req.headers.get('cookie') || '';
  const m = v.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : '';
}

function csrfOk(req: Request) {
  const cookies = req.headers.get('cookie') || '';
  const cm = cookies.match(/csrf_token=([^;]+)/);
  const tokenCookie = cm ? decodeURIComponent(cm[1]) : '';
  const headerToken = req.headers.get('x-csrf') || '';
  return tokenCookie && headerToken && tokenCookie === headerToken;
}

export async function GET(request: Request) {
  const p = getPool();
  await ensureProfilesTable();
  await ensureSessionsTable();
  const sid = getCookie(request, 'session');
  if (!sid) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });
  const [srows] = await p.query('SELECT user_id FROM sessions WHERE id = ?', [sid]);
  const s = (srows as any[])[0];
  if (!s) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });
  const [rows] = await p.query('SELECT user_id, avatar_url, bio, timezone, location, preferred_roles FROM profiles WHERE user_id = ?', [s.user_id]);
  const profile = (rows as any[])[0] || null;
  return NextResponse.json({ ok: true, profile });
}

export async function POST(request: Request) {
  if (!csrfOk(request)) return NextResponse.json({ ok: false, error: 'csrf' }, { status: 403 });
  const p = getPool();
  await ensureProfilesTable();
  await ensureUsersTable();
  await ensureSessionsTable();
  const sid = getCookie(request, 'session');
  if (!sid) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });
  const [srows] = await p.query('SELECT user_id FROM sessions WHERE id = ?', [sid]);
  const s = (srows as any[])[0];
  if (!s) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });
  const body = await request.json();
  const { avatar_url, bio, timezone, location, preferred_roles } = body || {};
  await p.query(
    `INSERT INTO profiles (user_id, avatar_url, bio, timezone, location, preferred_roles)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE avatar_url=VALUES(avatar_url), bio=VALUES(bio), timezone=VALUES(timezone),
       location=VALUES(location), preferred_roles=VALUES(preferred_roles)`,
    [s.user_id, avatar_url || null, bio || null, timezone || null, location || null, preferred_roles || null]
  );
  return NextResponse.json({ ok: true });
}
