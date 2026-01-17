import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPool, ensureUsersTable } from '../../../lib/db';
import bcrypt from 'bcryptjs';

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(120).optional()
});

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(120).optional(),
  password: z.string().min(6).optional()
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const email = url.searchParams.get('email');
  const p = getPool();
  await ensureUsersTable();
  if (id) {
    const [rows] = await p.query('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?', [id]);
    const list = rows as any[];
    return NextResponse.json({ user: list[0] || null });
  }
  if (email) {
    const [rows] = await p.query('SELECT id, email, name, created_at, updated_at FROM users WHERE email = ?', [email]);
    const list = rows as any[];
    return NextResponse.json({ user: list[0] || null });
  }
  const [rows] = await p.query('SELECT id, email, name, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT 100');
  return NextResponse.json({ users: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { email, password, name } = parsed.data;
  const p = getPool();
  await ensureUsersTable();
  const [existsRows] = await p.query('SELECT id FROM users WHERE email = ?', [email]);
  const existing = (existsRows as any[])[0];
  if (existing) return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 });
  const id = crypto.randomUUID();
  const hash = await bcrypt.hash(password, 10);
  await p.query('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)', [id, email, hash, name || null]);
  return NextResponse.json({ ok: true, id });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { id, name, password } = parsed.data;
  const p = getPool();
  await ensureUsersTable();
  const updates: string[] = [];
  const params: any[] = [];
  if (typeof name === 'string') {
    updates.push('name = ?');
    params.push(name);
  }
  if (typeof password === 'string') {
    const hash = await bcrypt.hash(password, 10);
    updates.push('password_hash = ?');
    params.push(hash);
  }
  if (updates.length === 0) return NextResponse.json({ ok: false }, { status: 400 });
  params.push(id);
  await p.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ ok: false }, { status: 400 });
  const p = getPool();
  await ensureUsersTable();
  await p.query('DELETE FROM users WHERE id = ?', [id]);
  return NextResponse.json({ ok: true });
}
