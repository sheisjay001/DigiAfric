'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const parts = pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumbs on auth pages or simple pages if preferred, 
  // but generally good to have.
  
  let pathAccumulator = '';

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-4)' }}>
      <ol style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>
        <li>
          <Link href="/" style={{ color: 'var(--muted)' }}>Home</Link>
        </li>
        {parts.map((part, index) => {
          pathAccumulator += `/${part}`;
          const isLast = index === parts.length - 1;
          const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
          
          return (
            <li key={pathAccumulator} style={{ display: 'flex', gap: '8px' }}>
              <span>/</span>
              {isLast ? (
                <span style={{ color: 'var(--fg)' }} aria-current="page">{label}</span>
              ) : (
                <Link href={pathAccumulator} style={{ color: 'var(--muted)' }}>{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
