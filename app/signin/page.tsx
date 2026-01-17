'use client';

import { useState, useMemo } from 'react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; id?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const valid = useMemo(() => schema.safeParse({ email, password }).success, [email, password]);

  async function submit() {
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setStatus({ ok: false });
      return;
    }
    setBusy(true);
    try {
      const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf': csrf },
        body: JSON.stringify(parsed.data)
      });
      const json = await res.json();
      setStatus(json);
      if (json.ok) {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next') || '/dashboard';
        window.location.assign(next);
      }
    } catch {
      setStatus({ ok: false });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section stack" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1>Sign In</h1>
      <div className="card p-6 stack gap-4" aria-live="polite">
        <label className="stack gap-2">
          <span className="muted">Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
        </label>
        <label className="stack gap-2">
          <span className="muted">Password</span>
          <div className="stack">
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
          </div>
        </label>
        <button className="btn btn-primary" onClick={submit} disabled={busy || !valid}>
          {busy ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="row gap-3">
          <a href="/forgot" className="link">Forgot password</a>
          <a href="/signup" className="link">Create account</a>
        </div>
        {status && (
          <div>
            {status.ok ? (
              <div className="badge badge-green">Signed in</div>
            ) : (
              <div className="badge">Error signing in</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
