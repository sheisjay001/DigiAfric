import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getPool, ensureUsersTable, ensureSessionsTable } from '../../../../lib/db';
import { validatePassword } from '../../../../lib/security';
import { logAudit } from '../../../../lib/audit';
import crypto from 'crypto';

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

// Simple hash function (In production, use bcrypt/argon2)
function hash(pw: string) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

export async function POST(request: Request) {
  if (!csrfOk(request)) return NextResponse.json({ ok: false, error: 'csrf' }, { status: 403 });

  const p = getPool();
  await ensureUsersTable();
  await ensureSessionsTable();

  const sid = getCookie(request, 'session');
  if (!sid) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const [srows] = await p.query('SELECT user_id FROM sessions WHERE id = ?', [sid]);
  const s = (srows as any[])[0];
  if (!s) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const body = await request.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
  }

  // Validate new password
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return NextResponse.json({ ok: false, error: validation.message }, { status: 400 });
  }

  // Verify current password
  const [urows] = await p.query('SELECT password_hash FROM users WHERE id = ?', [s.user_id]);
  const user = (urows as any[])[0];
  
  if (!user || user.password_hash !== hash(currentPassword)) {
    return NextResponse.json({ ok: false, error: 'Incorrect current password' }, { status: 400 });
  }

  // Update password
  await p.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash(newPassword), s.user_id]);

  // Audit log
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  await logAudit(s.user_id, 'password_change', { success: true }, ip);

  return NextResponse.json({ ok: true });
}
