'use client';

import Link from 'next/link';

interface CapstoneProps {
  title: string;
  role: string;
  scenario: string;
  deliverables: string[];
  templateUrl?: string;
  isLocked?: boolean;
}

export default function CapstoneProject({
  title,
  role,
  scenario,
  deliverables,
  templateUrl = '#',
  isLocked = true
}: CapstoneProps) {
  return (
    <div className={`card ${isLocked ? 'opacity-75' : 'animate-in'}`} style={{ border: '1px solid var(--accent)', background: 'linear-gradient(to bottom, var(--background), var(--surface))' }}>
      <div className="stack">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="badge" style={{ background: 'var(--accent)', color: 'var(--background)', fontWeight: 'bold' }}>
              EMPLOYER-READY CAPSTONE
            </div>
            <h3 style={{ marginTop: '0.5rem' }}>{title}</h3>
            <div className="muted">{role}</div>
          </div>
          {isLocked && <span className="badge">LOCKED</span>}
        </div>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
          <strong>Scenario:</strong> {scenario}
        </p>

        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)' }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Required Deliverables</h4>
          <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {deliverables.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="actions" style={{ marginTop: '1rem' }}>
          <button className="btn" disabled={isLocked}>
            Download Template
          </button>
          <Link href="/project/submit" className={`btn ${isLocked ? 'disabled' : 'btn-primary'}`} style={isLocked ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
            Submit Solution
          </Link>
        </div>
      </div>
    </div>
  );
}
