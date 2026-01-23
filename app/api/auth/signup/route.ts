import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { getPool, ensureUsersTable, ensureSessionsTable } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { checkRate, keyFromHeaders } from '../../../../lib/rate';
import { sanitize } from '../../../../lib/security';
import { logAudit } from '../../../../lib/audit';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(120).optional()
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
    const rateKey = keyFromHeaders('signup', request.headers);
    const rate = checkRate(rateKey, 5, 60 * 60 * 1000);
    if (!rate.allowed) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const { email, password, name } = parsed.data;
    
    // Sanitize name
    const safeName = name ? sanitize(name) : null;

    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      return NextResponse.json({ ok: false, error: 'db_env' }, { status: 500 });
    }
    const p = getPool();
    await ensureUsersTable();
    await ensureSessionsTable();
    const [existsRows] = await p.query('SELECT id FROM users WHERE email = ?', [email]);
    const existing = (existsRows as any[])[0];
    if (existing) return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 });
    const id = crypto.randomUUID();
    const hash = await bcrypt.hash(password, 10);
    await p.query('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)', [id, email, hash, safeName]);
    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await p.query('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', [sessionId, id, expires]);
    
    // Audit Log
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await logAudit(id, 'signup', { email }, ip);

    const res = NextResponse.json({ ok: true, id });
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
