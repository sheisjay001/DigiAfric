import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { getPool, ensureUsersTable, ensurePasswordResetsTable } from '../../../../lib/db';
import { checkRate, keyFromHeaders } from '../../../../lib/rate';

const schema = z.object({
  email: z.string().email()
});

function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

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
    const rateKey = `${keyFromHeaders('forgot', request.headers)}:${parsed.data.email}`;
    const rate = checkRate(rateKey, 3, 15 * 60 * 1000);
    if (!rate.allowed) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      return NextResponse.json({ ok: false, error: 'db_env' }, { status: 500 });
    }
    const { email } = parsed.data;
    const p = getPool();
    await ensureUsersTable();
    await ensurePasswordResetsTable();
    const [urows] = await p.query('SELECT id FROM users WHERE email = ?', [email]);
    const user = (urows as any[])[0];
    if (!user) return NextResponse.json({ ok: true }); // don't reveal existence
    const code = makeCode();
    const id = crypto.randomUUID();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await p.query('INSERT INTO password_resets (id, user_id, code, expires_at) VALUES (?, ?, ?, ?)', [id, user.id, code, expires]);
    return NextResponse.json({ ok: true, code });
  } catch {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}
