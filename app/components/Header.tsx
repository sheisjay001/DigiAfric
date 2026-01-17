'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
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
        <nav className="nav desktop-only">
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
    </header>
  );
}
