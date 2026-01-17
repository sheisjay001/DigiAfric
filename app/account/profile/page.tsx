'use client';

import { useEffect, useState } from 'react';

export default function AccountProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({ avatar_url: '', bio: '', timezone: '', location: '', preferred_roles: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/account/profile', { cache: 'no-store' });
        const json = await res.json();
        if (alive) {
          if (json.ok && json.profile) setProfile(json.profile);
          setLoading(false);
        }
      } catch {
        if (alive) {
          setError('Failed to load profile');
          setLoading(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
      const res = await fetch('/api/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf': csrf },
        body: JSON.stringify(profile)
      });
      const json = await res.json();
      if (!json.ok) setError(json.error || 'Save failed');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="section"><div className="container">Loading...</div></section>;

  return (
    <section className="section">
      <div className="container max-720 stack gap-4">
        <h2>Profile</h2>
        {error && <div className="badge">{error}</div>}
        <label className="stack">
          <span className="muted">Avatar URL</span>
          <input className="input" value={profile.avatar_url || ''} onChange={e => setProfile({ ...profile, avatar_url: e.target.value })} />
        </label>
        <label className="stack">
          <span className="muted">Bio</span>
          <textarea className="textarea" rows={4} value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
        </label>
        <div className="row gap-4">
          <label className="stack" style={{ flex: 1 }}>
            <span className="muted">Timezone</span>
            <input className="input" value={profile.timezone || ''} onChange={e => setProfile({ ...profile, timezone: e.target.value })} placeholder="Africa/Lagos" />
          </label>
          <label className="stack" style={{ flex: 1 }}>
            <span className="muted">Location</span>
            <input className="input" value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} placeholder="Lagos, Nigeria" />
          </label>
        </div>
        <label className="stack">
          <span className="muted">Preferred Roles</span>
          <input className="input" value={profile.preferred_roles || ''} onChange={e => setProfile({ ...profile, preferred_roles: e.target.value })} placeholder="Customer Support, Research" />
        </label>
        <div className="row gap-3">
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </section>
  );
}
