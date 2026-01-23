'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchModal } from './SearchModal';
import { NotificationCenter } from './NotificationCenter';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  // Toggle search with Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function signOut() {
    try {
      const csrf = document.cookie.split('; ').find(c => c.startsWith('csrf_token='))?.split('=')[1] || '';
      await fetch('/api/auth/signout', { method: 'POST', headers: { 'x-csrf': csrf } });
    } finally {
      setSignedIn(false);
      window.location.assign('/');
    }
  }

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const json = await res.json();
        if (alive) setSignedIn(!!json?.user);
      } catch {
        if (alive) setSignedIn(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pathname]);

  const baseLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/onboarding', label: 'Onboarding' },
    { href: '/tutor', label: 'Tutor' },
    { href: '/track', label: 'Tracks' },
    { href: '/project/submit', label: 'Submit Project' }
  ];
  const accountLinks = signedIn
    ? [
        { href: '/account/profile', label: 'Profile' },
        { href: '/account/settings', label: 'Settings' }
      ]
    : [];
  const authLinks = signedIn
    ? [{ href: 'logout', label: 'Logout' }]
    : [
        { href: '/signup', label: 'Sign Up' },
        { href: '/signin', label: 'Sign In' }
      ];
  const navLinks = [...baseLinks, ...accountLinks, ...authLinks];

  const filteredLinks = !signedIn
    ? navLinks.filter(l =>
        ['/', '/signup', '/signin'].includes(l.href)
      )
    : navLinks;

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand" style={{ zIndex: 20 }}>
          DigiAfric
        </Link>

        {/* Desktop Nav */}
        <nav className="nav desktop-only" style={{ alignItems: 'center' }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => setShowSearch(true)}
            style={{ color: 'var(--muted)', fontSize: '0.9rem', padding: '6px 12px', marginRight: '8px' }}
          >
            🔍 Search <span style={{ opacity: 0.5, fontSize: '0.8em', marginLeft: 6 }}>Ctrl+K</span>
          </button>
          {filteredLinks.map((link) =>
            link.href === 'logout' ? (
              <button key="logout" onClick={signOut} className="link">
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            )
          )}
          {signedIn && <NotificationCenter />}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={`mobile-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          style={{ display: 'none', zIndex: 20 }}
        >
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </button>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
          {filteredLinks.map((link) =>
            link.href === 'logout' ? (
              <button key="logout" onClick={signOut} className="link">
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </header>
  );
}
