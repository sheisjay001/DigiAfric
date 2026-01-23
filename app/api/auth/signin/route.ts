import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { getPool, ensureUsersTable, ensureSessionsTable } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { checkRate, keyFromHeaders } from '../../../../lib/rate';
import { logAudit } from '../../../../lib/audit';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  try {
    const cookies = request.headers.get('cookie') || '';
    const cm = cookies.match(/csrf_token=([^;]+)/);
    const tokenCookie = cm ? decodeURIComponent(cm[1]) : '';
    const headerToken = request.headers.get('x-csrf') || '';
    if (!tokenCookie || tokenCookie !== headerToken) {
      return NextResponse.json({ ok: false, error: 'csrf' }, { status: 403 });
    }
    const rateKey = keyFromHeaders('signin', request.headers);
    const rate = checkRate(rateKey, 10, 10 * 60 * 1000);
    if (!rate.allowed) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const { email, password } = parsed.data;
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      return NextResponse.json({ ok: false, error: 'db_env' }, { status: 500 });
    }
    const p = getPool();
    await ensureUsersTable();
    await ensureSessionsTable();
    const [rows] = await p.query('SELECT id, password_hash FROM users WHERE email = ?', [email]);
    const user = (rows as any[])[0];
    if (!user) return NextResponse.json({ ok: false }, { status: 401 });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await p.query('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', [sessionId, user.id, expires]);
    
    // Audit Log
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await logAudit(user.id, 'signin', { email }, ip);

    const res = NextResponse.json({ ok: true, id: user.id });
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
