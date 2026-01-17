'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email()
});

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; code?: string; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const valid = useMemo(() => schema.safeParse({ email }).success, [email]);

  async function submit() {
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setStatus({ ok: false });
      return;
    }
    setBusy(true);
    try {
      const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf': csrf },
        body: JSON.stringify(parsed.data)
      });
      const json = await res.json();
      setStatus(json);
    } catch {
      setStatus({ ok: false, error: 'network' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section stack" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1>Forgot Password</h1>
      <div className="card p-6 stack gap-4" aria-live="polite">
        <label className="stack gap-2">
          <span className="muted">Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
        </label>
        <button className="btn btn-primary" onClick={submit} disabled={busy || !valid}>
          {busy ? 'Submitting...' : 'Request Reset Code'}
        </button>
        {status && (
          <div className="stack gap-2">
            {status.ok ? (
              <>
                <div className="badge badge-green">Code generated</div>
                {status.code && <div className="card p-3">Your reset code: <strong>{status.code}</strong></div>}
                <Link href="/reset" className="btn btn-accent">Go to Reset Page</Link>
              </>
            ) : (
              <div className="badge">Error: {status.error || 'failed'}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
