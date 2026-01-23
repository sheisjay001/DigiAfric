'use client';

import { useState, useRef, useEffect } from 'react';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Welcome to DigiAfric! Start your first track.', time: '2m ago', read: false },
  { id: 2, text: 'New course added: Advanced Webflow', time: '1h ago', read: false },
  { id: 3, text: 'Your profile was updated successfully', time: '1d ago', read: true },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button 
        className="btn btn-ghost" 
        style={{ padding: '8px', position: 'relative' }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <span style={{ fontSize: '1.2rem' }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: 'var(--error)', color: 'white',
            fontSize: '0.7rem', padding: '2px 5px',
            borderRadius: '99px', lineHeight: 1
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="card stack" style={{
          position: 'absolute', top: '100%', right: 0,
          width: '320px', zIndex: 100,
          marginTop: 'var(--space-2)', padding: 0,
          maxHeight: '400px', overflowY: 'auto'
        }}>
          <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>
            Notifications
          </div>
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <div className="muted" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              No notifications
            </div>
          ) : (
            <div>
              {MOCK_NOTIFICATIONS.map(n => (
                <div key={n.id} style={{
                  padding: 'var(--space-3)',
                  borderBottom: '1px solid var(--border)',
                  background: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)'
                }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{n.text}</p>
                  <span className="muted" style={{ fontSize: '0.75rem' }}>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
