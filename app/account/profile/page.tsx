'use client';

import { useEffect, useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import { Skeleton } from '../../components/Skeleton';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export default function AccountProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({ avatar_url: '', bio: '', timezone: '', location: '', preferred_roles: '' });
  const { showToast } = useToast();

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
          showToast('Failed to load profile', 'error');
          setLoading(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [showToast]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
      const res = await fetch('/api/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf': csrf },
        body: JSON.stringify(profile)
      });
      const json = await res.json();
      if (!json.ok) {
        showToast(json.error || 'Save failed', 'error');
      } else {
        showToast('Profile updated successfully', 'success');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="section">
      <div className="container max-720">
        <Breadcrumbs />
        <div className="stack" style={{ gap: 'var(--space-6)' }}>
          <div className="stack">
            <h2>Public Profile</h2>
            <p className="muted">Manage how you appear to other students and potential employers.</p>
          </div>

          {loading ? (
            <div className="stack" style={{ gap: 'var(--space-5)' }}>
              <Skeleton height="40px" />
              <Skeleton height="100px" />
              <div className="row">
                <Skeleton height="40px" />
                <Skeleton height="40px" />
              </div>
            </div>
          ) : (
            <form onSubmit={save} className="stack" style={{ gap: 'var(--space-5)' }}>
              <div className="card">
                <div className="stack" style={{ gap: 'var(--space-4)' }}>
                  <label htmlFor="avatar">
                    Avatar URL
                    <div className="muted" style={{ fontSize: '0.85rem', fontWeight: 400 }}>Link to your profile picture (e.g., from GitHub or Gravatar).</div>
                  </label>
                  <input 
                    id="avatar"
                    className="input" 
                    value={profile.avatar_url || ''} 
                    onChange={e => setProfile({ ...profile, avatar_url: e.target.value })} 
                    placeholder="https://..."
                  />

                  <label htmlFor="bio">
                    Bio
                    <div className="muted" style={{ fontSize: '0.85rem', fontWeight: 400 }}>Tell us about your background and what you&apos;re learning.</div>
                  </label>
                  <textarea 
                    id="bio"
                    className="textarea" 
                    rows={4} 
                    value={profile.bio || ''} 
                    onChange={e => setProfile({ ...profile, bio: e.target.value })} 
                  />

                  <div className="row">
                    <div className="stack" style={{ flex: 1 }}>
                      <label htmlFor="timezone">Timezone</label>
                      <input 
                        id="timezone"
                        className="input" 
                        value={profile.timezone || ''} 
                        onChange={e => setProfile({ ...profile, timezone: e.target.value })} 
                        placeholder="Africa/Lagos" 
                      />
                    </div>
                    <div className="stack" style={{ flex: 1 }}>
                      <label htmlFor="location">Location</label>
                      <input 
                        id="location"
                        className="input" 
                        value={profile.location || ''} 
                        onChange={e => setProfile({ ...profile, location: e.target.value })} 
                        placeholder="Lagos, Nigeria" 
                      />
                    </div>
                  </div>

                  <label htmlFor="roles">
                    Preferred Roles
                    <div className="muted" style={{ fontSize: '0.85rem', fontWeight: 400 }}>Comma-separated list of roles you are interested in.</div>
                  </label>
                  <input 
                    id="roles"
                    className="input" 
                    value={profile.preferred_roles || ''} 
                    onChange={e => setProfile({ ...profile, preferred_roles: e.target.value })} 
                    placeholder="Customer Support, Research, Data Entry" 
                  />
                </div>
              </div>

              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
