import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { getPool, ensureUsersTable, ensurePasswordResetsTable, ensureSessionsTable } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { checkRate, keyFromHeaders } from '../../../../lib/rate';

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(12),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const cookies = request.headers.get('cookie') || '';
    const cm = cookies.match(/csrf_token=([^;]+)/);
    const tokenCookie = cm ? decodeURIComponent(cm[1]) : '';
    const headerToken = request.headers.get('x-csrf') || '';
    if (!tokenCookie || tokenCookie !== headerToken) {
      return NextResponse.json({ ok: false, error: 'csrf' }, { status: 403 });
    }
    const rateKey = `${keyFromHeaders('reset', request.headers)}:${parsed.data.email}`;
    const rate = checkRate(rateKey, 5, 15 * 60 * 1000);
    if (!rate.allowed) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      return NextResponse.json({ ok: false, error: 'db_env' }, { status: 500 });
    }
    const { email, code, password } = parsed.data;
    const p = getPool();
    await ensureUsersTable();
    await ensurePasswordResetsTable();
    await ensureSessionsTable();
    const [urows] = await p.query('SELECT id FROM users WHERE email = ?', [email]);
    const user = (urows as any[])[0];
    if (!user) return NextResponse.json({ ok: false }, { status: 400 });
    const [rrows] = await p.query('SELECT id, expires_at, used FROM password_resets WHERE user_id = ? AND code = ? ORDER BY created_at DESC LIMIT 1', [user.id, code]);
    const reset = (rrows as any[])[0];
    if (!reset) return NextResponse.json({ ok: false }, { status: 400 });
    if (reset.used) return NextResponse.json({ ok: false }, { status: 400 });
    if (new Date(reset.expires_at).getTime() < Date.now()) return NextResponse.json({ ok: false }, { status: 400 });
    const hash = await bcrypt.hash(password, 10);
    await p.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id]);
    await p.query('UPDATE password_resets SET used = 1 WHERE id = ?', [reset.id]);
    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await p.query('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', [sessionId, user.id, expires]);
    const res = NextResponse.json({ ok: true });
    res.cookies.set('session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      expires
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
