'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Reveal from '../components/Reveal';

type Artifact = {
  id: string;
  title: string;
  date: string;
  type: 'capstone' | 'challenge';
  verified: boolean;
  link: string;
};

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  useEffect(() => {
    // Load profile
    const p = JSON.parse(localStorage.getItem('learnerProfile') || 'null');
    setProfile(p);

    // Mock artifacts
    setArtifacts([
      {
        id: 'cert-001',
        title: 'Customer Support AI Specialist',
        date: '2024-05-15',
        type: 'capstone',
        verified: true,
        link: '#'
      }
    ]);
  }, []);

  return (
    <div className="stack" style={{ gap: 'var(--space-8)' }}>
      <Reveal className="stack animate-in">
        <h1 className="gradient-text">Dashboard</h1>
        {profile ? (
          <p className="muted" style={{ fontSize: '1.1rem' }}>
            Welcome back, <span style={{ color: 'var(--fg)' }}>{profile.name || 'Learner'}</span>. 
            Focus mode: <span className="badge" style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}>{profile.track?.replace('-', ' ')}</span>
          </p>
        ) : (
          <p className="muted">Welcome! Please <Link href="/onboarding">complete onboarding</Link> to set up your profile.</p>
        )}
      </Reveal>

      <div className="grid">
        {/* Active Track Progress */}
        <Reveal className="card animate-in delay-1">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Current Track</h3>
            <div className="muted" style={{ fontSize: '0.9rem' }}>Continue where you left off</div>
          </div>
          
          <div className="stack" style={{ marginTop: 'auto' }}>
            {profile?.track ? (
              <>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {profile.track.replace(/-/g, ' ')}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div className="badge" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>Week 1</div>
                  <span className="muted" style={{ fontSize: '0.9rem' }}>Fundamentals</span>
                </div>
                <div style={{ height: 4, background: 'var(--surface-hover)', borderRadius: 2, marginTop: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ width: '40%', height: '100%', background: 'var(--success)' }}></div>
                </div>
                <Link href={`/track/${profile.track}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Continue Learning
                </Link>
              </>
            ) : (
              <>
                <p>No active track selected.</p>
                <Link href="/onboarding" className="btn btn-accent">Select Track</Link>
              </>
            )}
          </div>
        </Reveal>

        {/* Stats / Streak */}
        <Reveal className="card animate-in delay-2">
           <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Activity</h3>
            <div className="muted" style={{ fontSize: '0.9rem' }}>Your learning momentum</div>
          </div>
          <div className="stack" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>3</div>
            <div className="muted">Day Streak</div>
            <div style={{ display: 'flex', gap: 4, marginTop: '0.5rem' }}>
               {[1,2,3,4,5,6,7].map(d => (
                 <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: d <= 3 ? 'var(--success)' : 'var(--surface-hover)' }}></div>
               ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Employer-Ready Portfolio */}
      <Reveal className="card animate-in delay-2" style={{ borderColor: 'var(--accent)', background: 'rgba(14, 165, 233, 0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Employer-Ready Portfolio</h3>
            <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>Verified artifacts you can show to recruiters.</p>
          </div>
          <Link href="/project/submit" className="btn btn-sm btn-accent">Add New Project</Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {artifacts.map(art => (
            <div key={art.id} style={{ 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '1.25rem',
              background: 'var(--surface)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge" style={{ 
                  background: art.verified ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface-hover)', 
                  color: art.verified ? 'var(--success)' : 'var(--muted)',
                  borderColor: 'transparent'
                }}>
                  {art.verified ? 'VERIFIED' : 'PENDING'}
                </span>
                <span className="muted" style={{ fontSize: '0.8rem' }}>{art.date}</span>
              </div>
              <h4 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{art.title}</h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
                {art.type === 'capstone' ? 'Capstone Project' : 'Challenge Submission'}
              </div>
              <a href={art.link} className="btn btn-sm" style={{ width: '100%', border: '1px solid var(--border)' }}>View Credential</a>
            </div>
          ))}
          
          {/* Empty State Placeholder */}
          <div style={{ 
            border: '1px dashed var(--border)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.6,
            minHeight: 180
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <div className="muted" style={{ fontSize: '0.9rem' }}>Complete capstones to earn badges</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
