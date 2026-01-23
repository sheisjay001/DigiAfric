import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, actionLink, icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon || (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 14.25V10.5C19.5 9.67157 18.8284 9 18 9H6C5.17157 9 4.5 9.67157 4.5 10.5V14.25M19.5 14.25L13.5607 20.1893C12.682 21.068 11.318 21.068 10.4393 20.1893L4.5 14.25M19.5 14.25H4.5M12 9V3" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && actionLink && (
        <Link href={actionLink} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
