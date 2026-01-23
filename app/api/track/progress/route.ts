import { NextResponse } from 'next/server';
import { getPool, ensureProgressTable, ensureSessionsTable } from '../../../../lib/db';

function getCookie(req: Request, name: string) {
  const v = req.headers.get('cookie') || '';
  const m = v.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : '';
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const trackId = url.searchParams.get('trackId');
  if (!trackId) return NextResponse.json({ ok: false, error: 'Missing trackId' }, { status: 400 });

  const sid = getCookie(request, 'session');
  if (!sid) return NextResponse.json({ ok: true, progress: [] }); // No session = no server progress

  const p = getPool();
  await ensureSessionsTable();
  await ensureProgressTable();

  const [srows] = await p.query('SELECT user_id FROM sessions WHERE id = ?', [sid]);
  const s = (srows as any[])[0];
  if (!s) return NextResponse.json({ ok: true, progress: [] });

  const [rows] = await p.query(
    'SELECT task_id FROM user_progress WHERE user_id = ? AND track_id = ?',
    [s.user_id, trackId]
  );
  const progress = (rows as any[]).map(r => r.task_id);
  return NextResponse.json({ ok: true, progress });
}

export async function POST(request: Request) {
  const sid = getCookie(request, 'session');
  if (!sid) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const p = getPool();
  await ensureSessionsTable();
  await ensureProgressTable();

  const [srows] = await p.query('SELECT user_id FROM sessions WHERE id = ?', [sid]);
  const s = (srows as any[])[0];
  if (!s) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { trackId, taskId, completed } = body;

  if (!trackId || !taskId) return NextResponse.json({ ok: false, error: 'Invalid data' }, { status: 400 });

  if (completed) {
    await p.query(
      'INSERT IGNORE INTO user_progress (user_id, track_id, task_id) VALUES (?, ?, ?)',
      [s.user_id, trackId, taskId]
    );
  } else {
    await p.query(
      'DELETE FROM user_progress WHERE user_id = ? AND track_id = ? AND task_id = ?',
      [s.user_id, trackId, taskId]
    );
  }

  return NextResponse.json({ ok: true });
}
