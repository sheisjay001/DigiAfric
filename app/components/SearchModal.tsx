'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SEARCH_ITEMS = [
  { title: 'Dashboard', href: '/dashboard', type: 'Page' },
  { title: 'Profile', href: '/account/profile', type: 'Account' },
  { title: 'Tracks', href: '/track', type: 'Learning' },
  { title: 'Customer Support AI', href: '/track/customer-support', type: 'Track' },
  { title: 'Research & Intelligence', href: '/track/research-intelligence', type: 'Track' },
  { title: 'Virtual Assistant', href: '/track/virtual-assistant', type: 'Track' },
  { title: 'No-Code Builder', href: '/track/no-code-builder', type: 'Track' },
  { title: 'Content Operations', href: '/track/content-ops', type: 'Track' },
  { title: 'Submit Project', href: '/project/submit', type: 'Action' },
];

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const results = SEARCH_ITEMS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="search-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 100,
      display: 'flex', justifyContent: 'center', paddingTop: '10vh',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div className="search-modal card" style={{
        width: '100%', maxWidth: '600px', maxHeight: '60vh',
        display: 'flex', flexDirection: 'column', padding: 0,
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
          <input
            autoFocus
            className="input"
            placeholder="Search for tracks, lessons, or settings..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', padding: 0, boxShadow: 'none' }}
          />
        </div>
        <div style={{ overflowY: 'auto', padding: 'var(--space-2)' }}>
          {results.length === 0 ? (
            <div className="muted" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              No results found.
            </div>
          ) : (
            results.map(item => (
              <button
                key={item.href}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'space-between', textAlign: 'left', marginBottom: 4 }}
                onClick={() => handleSelect(item.href)}
              >
                <span>{item.title}</span>
                <span className="badge" style={{ fontSize: '0.7rem' }}>{item.type}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
