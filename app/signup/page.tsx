'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(120).optional()
});

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; id?: string; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const valid = useMemo(() => schema.safeParse({ email, password, name: name || undefined }).success, [email, password, name]);

  function strengthLabel(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  }

  async function submit() {
    const parsed = schema.safeParse({ email, password, name: name || undefined });
    if (!parsed.success) {
      setStatus({ ok: false, error: 'invalid' });
      return;
    }
    setBusy(true);
    try {
      const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf': csrf },
        body: JSON.stringify(parsed.data)
      });
      try {
        const json = await res.json();
        setStatus(json);
        if (json.ok) {
          const params = new URLSearchParams(window.location.search);
          const next = params.get('next') || '/dashboard';
          window.location.assign(next);
        }
      } catch {
        const text = await res.text();
        setStatus({ ok: res.ok, error: text || 'server' });
      }
    } catch {
      setStatus({ ok: false, error: 'network' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section stack" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1>Sign Up</h1>
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
            {password.length > 0 && (
              <div className="row gap-2">
                <div className="badge">{strengthLabel(password)}</div>
                {password.length < 8 && <div className="badge">Min 8 characters</div>}
              </div>
            )}
          </div>
        </label>
        <label className="stack gap-2">
          <span className="muted">Name (optional)</span>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" />
        </label>
        <button className="btn btn-primary" onClick={submit} disabled={busy || !valid}>
          {busy ? 'Submitting...' : 'Create Account'}
        </button>
        <div className="row gap-3">
          <a href="/signin" className="link">Already have an account</a>
        </div>
        {status && (
          <div>
            {status.ok ? (
              <div className="badge badge-green">Created. ID: {status.id}</div>
            ) : (
              <div className="badge">Error: {status.error || 'failed'}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
