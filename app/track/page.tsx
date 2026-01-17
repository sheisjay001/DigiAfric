'use client';

import Link from 'next/link';
import Reveal from '../components/Reveal';

export default function TracksIndex() {
  const tracks = [
    { 
      id: 'cs',
      href: '/track/customer-support', 
      title: 'Customer Support AI Specialist', 
      desc: 'Master modern CS tools (Zendesk, Intercom) and AI automation workflows to deliver world-class support.',
      icon: '🎧',
      level: 'Beginner'
    },
    { 
      id: 'res',
      href: '/track/research-intelligence', 
      title: 'Research & Online Intelligence', 
      desc: 'Learn advanced web research, OSINT ethics, and how to synthesize complex data into executive briefs.',
      icon: '🔍',
      level: 'Intermediate'
    },
    { 
      id: 'va',
      href: '/track/virtual-assistant', 
      title: 'AI-Powered Virtual Assistant', 
      desc: 'Supercharge your productivity with AI tools for inbox management, scheduling, and document creation.',
      icon: '🤖',
      level: 'Beginner'
    },
    { 
      id: 'nocode',
      href: '/track/no-code-builder', 
      title: 'No-Code Web Builder', 
      desc: 'Build professional websites and landing pages using Webflow, Framer, and AI design tools.',
      icon: '🎨',
      level: 'Intermediate'
    },
    { 
      id: 'content',
      href: '/track/content-ops', 
      title: 'Content Operations Manager', 
      desc: 'Scale content production with AI, manage social calendars, and track performance KPIs.',
      icon: '📈',
      level: 'Advanced'
    }
  ];

  return (
    <section className="section">
      <Reveal className="stack animate-in" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto var(--space-8)' }}>
        <h1 className="gradient-text">Choose Your Path</h1>
        <p className="muted" style={{ fontSize: '1.2rem' }}>
          Industry-verified learning tracks designed to get you hired. 
          Master the tools and workflows top global companies demand.
        </p>
      </Reveal>
      
      <div className="grid">
        {tracks.map((t, i) => (
          <Reveal key={t.id} className="card" style={{ transitionDelay: `${i * 100}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{t.icon}</div>
              <div className="badge">{t.level}</div>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t.title}</h3>
            <p className="muted" style={{ marginBottom: '1.5rem', flex: 1 }}>{t.desc}</p>
            <Link className="btn btn-primary" href={t.href} style={{ width: '100%', textAlign: 'center' }}>
              Start Track
            </Link>
          </Reveal>
        ))}
        
        {/* Coming Soon Card */}
        <Reveal className="card" style={{ borderStyle: 'dashed', opacity: 0.7, transitionDelay: '600ms' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>🚀</div>
            <div className="badge" style={{ background: 'var(--surface-hover)', color: 'var(--muted)' }}>Planned</div>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Data Annotation</h3>
          <p className="muted" style={{ marginBottom: '1.5rem', flex: 1 }}>
            Training AI models through high-quality data labeling and RLHF workflows.
          </p>
          <button className="btn" disabled style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
            Coming Soon
          </button>
        </Reveal>
      </div>
    </section>
  );
}
