'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../components/ToastProvider';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export default function AccountSettings() {
  const { showToast } = useToast();
  const [me, setMe] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  async function updatePassword() {
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
      const res = await fetch('/api/account/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf': csrf
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      if (res.ok && data.ok) {
        showToast('Password updated successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.error || 'Failed to update password', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container main">
      <Breadcrumbs />
      <div className="section stack centered" style={{ maxWidth: 720 }}>
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <h1>Account Settings</h1>
          <p className="muted">Manage your security and preferences.</p>
        </div>

        <div className="card stack" style={{ textAlign: 'left', gap: 'var(--space-4)' }}>
          <h3>Security</h3>
          <div className="stack" style={{ gap: 'var(--space-3)' }}>
            <div>
              <label>Current Password</label>
              <input 
                type="password"
                className="input" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label>New Password</label>
              <input 
                type="password"
                className="input" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="Enter new password (min 8 chars)"
              />
            </div>
            <div>
              <label>Confirm New Password</label>
              <input 
                type="password"
                className="input" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Confirm new password"
              />
            </div>
            <button 
              className="btn btn-primary scale-hover" 
              onClick={updatePassword}
              disabled={loading}
              style={{ alignSelf: 'flex-start' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>

          <div className="stack" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <h3>Session</h3>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="muted">
                Currently signed in as <strong>{me?.email}</strong>
              </div>
              <button
                className="btn btn-accent"
                onClick={async () => {
                  const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
                  await fetch('/api/auth/signout', { method: 'POST', headers: { 'x-csrf': csrf } });
                  window.location.assign('/');
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
