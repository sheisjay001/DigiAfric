import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { checkRate, keyFromHeaders } from '../../../lib/rate';
import { sanitize } from '../../../lib/security';

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'portfolio.json');

async function readStore() {
  try {
    const buf = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(buf);
  } catch {
    return {};
  }
}

async function writeStore(obj: any) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(obj, null, 2));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const handle = url.searchParams.get('handle') || '';
  if (!/^[a-z0-9-]{2,32}$/i.test(handle)) return NextResponse.json({ profile: null });
  const store = await readStore();
  const profile = store[handle] || null;
  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const rkey = keyFromHeaders('portfolio_post', request.headers);
  const { allowed, retryAfterMs } = checkRate(rkey, 10, 60 * 60 * 1000); // 10 requests per hour
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': Math.ceil(retryAfterMs / 1000).toString() } }
    );
  }

  const origin = request.headers.get('origin') || '';
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  if (origin && !origin.startsWith(site)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const body = await request.json();
  const schema = z.object({
    handle: z.string().trim().min(2).max(32).regex(/^[a-z0-9-]+$/i),
    artifact: z.object({
      title: z.string().trim().min(2).max(120),
      description: z.string().trim().min(2).max(1000),
      repo: z.string().url().optional().or(z.literal(''))
    })
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  
  const { handle, artifact } = parsed.data;
  
  // Sanitize inputs
  const safeArtifact = {
    ...artifact,
    title: sanitize(artifact.title),
    description: sanitize(artifact.description),
    repo: sanitize(artifact.repo)
  };

  const store = await readStore();
  const prev = store[handle] || { artifacts: [], badges: [] };
  const enriched = {
    ...safeArtifact,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const next = { ...prev, artifacts: [...prev.artifacts, enriched] };
  store[handle] = next;
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
