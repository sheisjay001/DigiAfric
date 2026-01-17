'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AccountSettings() {
  const [me, setMe] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const json = await res.json();
        setMe(json.user || null);
      } catch {
        setMe(null);
      }
    })();
  }, []);

  return (
    <section className="section">
      <div className="container max-720 stack gap-4">
        <h2>Account Settings</h2>
        <div className="card p-4 stack gap-3">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="stack">
              <div className="muted">Session</div>
              <div>{me ? 'Signed in' : 'Signed out'}</div>
            </div>
            <button
              className="btn"
              onClick={async () => {
                const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
                await fetch('/api/auth/signout', { method: 'POST', headers: { 'x-csrf': csrf } });
                window.location.assign('/');
              }}
            >
              Logout
            </button>
          </div>
          <div className="row gap-3">
            <Link className="btn btn-accent" href="/account/profile">Edit Profile</Link>
            <Link className="btn" href="/dashboard">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
