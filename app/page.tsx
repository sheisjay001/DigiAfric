import Link from 'next/link';
import { cookies } from 'next/headers';
import Reveal from './components/Reveal';

export default function Home() {
  const hasSession = !!cookies().get('session')?.value;
  return (
    <>
      <section className="container">
        <div className="hero">
          <Reveal className="stack">
            <div className="badge mb-4" style={{ alignSelf: 'flex-start' }}>Beta v0.9</div>
            <h1 className="gradient-text">Master AI Skills.<br/>Build Your Remote and On‑Site Career.</h1>
            <p className="muted">
              Tailored for digital workers across Africa working remote and on site. 
              Learn by doing, verify your skills, and get hired.
            </p>
            <div className="actions">
              {hasSession ? (
                <>
                  <Link className="btn btn-primary" href="/onboarding">Start Onboarding</Link>
                  <Link className="btn btn-accent" href="/track">Browse Tracks</Link>
                </>
              ) : (
                <Link className="btn btn-primary" href="/onboarding">Get Started</Link>
              )}
            </div>
            <div className="metrics" style={{ marginTop: '2rem' }}>
              <div className="metric">
                <div className="metric-title">5+</div>
                <div className="metric-subtitle muted">Career Tracks</div>
              </div>
              <div className="metric">
                <div className="metric-title">100%</div>
                <div className="metric-subtitle muted">Project Based</div>
              </div>
            </div>
          </Reveal>
          
          {hasSession && (
            <Reveal className="card card-glass delay-2">
              <div className="card-section">
                <h3>Weekly Focus</h3>
                <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>AI-Generated Personalized Plan</p>
              </div>
              <div className="stack">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Week 1: Fundamentals</div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>Completed</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>2</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Week 2: Advanced Tooling</div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>In Progress</div>
                  </div>
                </div>
                <div className="stack">
                  <Link href="/dashboard" className="btn btn-sm btn-block btn-ghost">Go to Dashboard</Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why DigiAfric</h2>
          </Reveal>
          <div className="grid">
            <Reveal className="card">
              <div className="badge badge-green mb-4">Outcome‑Driven</div>
              <h3>Project‑Based Learning</h3>
              <p>Learn by building real deliverables aligned to industry roles.</p>
            </Reveal>
            <Reveal className="card delay-1">
              <div className="badge mb-4">Verified</div>
              <h3>Portfolio & Skill Checks</h3>
              <p>Show evidence of work with practical assessments and artifacts.</p>
            </Reveal>
            <Reveal className="card delay-2">
              <div className="badge mb-4">Career‑Ready</div>
              <h3>Job‑Aligned Tracks</h3>
              <p>Follow tailored paths for remote and on‑site roles in Customer Support, Research, VA, No‑Code, and more.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How It Works</h2>
          </Reveal>
          <div className="grid">
            <Reveal className="card">
              <h3>1. Choose a Track</h3>
              <p>Select a role path that matches your interests and goals.</p>
            </Reveal>
            <Reveal className="card delay-1">
              <h3>2. Learn the Fundamentals</h3>
              <p>Get curated materials and guidance to build core competency.</p>
            </Reveal>
            <Reveal className="card delay-2">
              <h3>3. Complete Tasks</h3>
              <p>Execute practical assignments and build portfolio artifacts.</p>
            </Reveal>
            <Reveal className="card delay-3">
              <h3>4. Verify & Showcase</h3>
              <p>Validate skills and showcase your work to potential employers.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {hasSession ? (
        <>
          <section className="section section-dark">
            <div className="container">
              <Reveal>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Choose Your Path</h2>
              </Reveal>
              <div className="grid">
                <Reveal className="card">
                  <div className="badge badge-green mb-4">Popular</div>
                  <h3>Customer Support</h3>
                  <p>Master modern CS tools (Zendesk, Intercom) and AI automation workflows.</p>
                  <Link className="btn btn-primary mt-auto" href="/track/customer-support">View Track</Link>
                </Reveal>
                <Reveal className="card delay-1">
                  <div className="badge mb-4">High Demand</div>
                  <h3>Research & Intelligence</h3>
                  <p>Conduct ethical OSINT research and produce executive-level briefs.</p>
                  <Link className="btn btn-accent mt-auto" href="/track/research-intelligence">View Track</Link>
                </Reveal>
                <Reveal className="card delay-2">
                  <div className="mb-4" style={{ height: 26 }}></div>
                  <h3>Virtual Assistant</h3>
                  <p>Become an executive powerhouse with notion, calendar management, and AI.</p>
                  <Link className="btn btn-accent mt-auto" href="/track/virtual-assistant">View Track</Link>
                </Reveal>
                <Reveal className="card">
                  <div className="mb-4" style={{ height: 26 }}></div>
                  <h3>No‑Code Builder</h3>
                  <p>Build real SaaS MVPs using Webflow, Bubble, and Airtable.</p>
                  <Link className="btn btn-accent mt-auto" href="/track/no-code-builder">View Track</Link>
                </Reveal>
                <Reveal className="card delay-1">
                  <div className="mb-4" style={{ height: 26 }}></div>
                  <h3>Content Ops</h3>
                  <p>Scale content production with AI, SEO strategy, and editorial calendars.</p>
                  <Link className="btn btn-accent mt-auto" href="/track/content-ops">View Track</Link>
                </Reveal>
                <Reveal className="card card-dashed delay-2">
                  <div className="mb-4" style={{ height: 26 }}></div>
                  <h3>More Coming Soon</h3>
                  <p>Data Analytics, Python Automation, and more.</p>
                  <div className="muted mt-auto" style={{ fontSize: '0.9rem' }}>Suggest a track?</div>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container centered">
              <Reveal>
                <h2>Ready to Prove Your Skills?</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                  Join hundreds of African digital workers building verifiable portfolios.
                </p>
                <div className="cta-row">
                  <Link className="btn btn-primary" href="/onboarding">Get Started Free</Link>
                  <Link className="btn btn-accent" href="/project/submit">Submit a Project</Link>
                </div>
              </Reveal>
            </div>
          </section>
        </>
      ) : (
        <section className="section">
          <div className="container centered">
            <Reveal>
              <h2>Join DigiAfric</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                Start learning practical skills and building a verifiable portfolio today.
              </p>
              <Link className="btn btn-primary" href="/onboarding">Get Started</Link>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
