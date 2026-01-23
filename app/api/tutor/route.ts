import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'local';
  const key = `rl_tutor_${ip}`;
  // @ts-ignore
  globalThis.__rate__ = globalThis.__rate__ || new Map<string, { count: number; ts: number }>();
  // @ts-ignore
  const store = globalThis.__rate__ as Map<string, { count: number; ts: number }>;
  const now = Date.now();
  const rec = store.get(key);
  if (!rec || now - rec.ts > 5 * 60 * 1000) store.set(key, { count: 1, ts: now });
  else {
    if (rec.count > 60) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    store.set(key, { count: rec.count + 1, ts: rec.ts });
  }
  const body = await request.json();
  const schema = z.object({
    messages: z.array(z.object({ role: z.string(), content: z.string().max(2000) })).min(1).max(30)
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const messages = parsed.data.messages;
  const last = messages[messages.length - 1]?.content || '';
  const reply =
    `Let us break this down:\n` +
    `1) Clarify goal: ${last.slice(0, 120)}\n` +
    `2) Key concepts: support workflows, tools, communication\n` +
    `3) Practice: write a macro for a refund case\n` +
    `4) Reflect: explain escalation criteria in your words\n` +
    `5) Submit: artifact and explanation to unlock progress`;
  return NextResponse.json({ reply });
}
