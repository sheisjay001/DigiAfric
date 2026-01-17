import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';

export async function GET() {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT 1 AS ok');
    return NextResponse.json({ ok: true, rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
