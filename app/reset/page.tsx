'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(12),
  password: z.string().min(6)
});

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const valid = useMemo(() => schema.safeParse({ email, code, password }).success, [email, code, password]);

  async function submit() {
    const parsed = schema.safeParse({ email, code, password });
    if (!parsed.success) {
      setStatus({ ok: false });
      return;
    }
    setBusy(true);
    try {
      const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf': csrf },
        body: JSON.stringify(parsed.data)
      });
      const json = await res.json();
      setStatus(json);
      if (json.ok) {
        window.location.assign('/dashboard');
      }
    } catch {
      setStatus({ ok: false, error: 'network' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section stack" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1>Reset Password</h1>
      <div className="card p-6 stack gap-4" aria-live="polite">
        <label className="stack gap-2">
          <span className="muted">Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
        </label>
        <label className="stack gap-2">
          <span className="muted">Reset Code</span>
          <input type="text" value={code} onChange={e => setCode(e.target.value)} className="input" />
        </label>
        <label className="stack gap-2">
          <span className="muted">New Password</span>
          <div className="row gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
            />
            <button type="button" className="btn" onClick={() => setShowPassword(s => !s)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {password.length > 0 && password.length < 6 && <div className="badge">Minimum 6 characters</div>}
        </label>
        <button className="btn btn-primary" onClick={submit} disabled={busy || !valid}>
          {busy ? 'Resetting...' : 'Reset Password'}
        </button>
        {status && (
          <div>
            {status.ok ? (
              <div className="badge badge-green">Password updated</div>
            ) : (
              <div className="badge">Error: {status.error || 'failed'}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
