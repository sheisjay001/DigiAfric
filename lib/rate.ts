type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function now() {
  return Date.now();
}

export function checkRate(key: string, limit: number, windowMs: number) {
  const t = now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= t) {
    const nb: Bucket = { count: 1, resetAt: t + windowMs };
    buckets.set(key, nb);
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }
  if (b.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, b.resetAt - t) };
  }
  b.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - b.count), retryAfterMs: Math.max(0, b.resetAt - t) };
}

export function keyFromHeaders(route: string, headers: Headers, fallback: string = 'anon') {
  const ip =
    headers.get('x-forwarded-for') ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    headers.get('fastly-client-ip') ||
    headers.get('x-client-ip') ||
    fallback;
  return `${route}:${ip}`;
}
