'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

export default function Onboarding() {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [goals, setGoals] = useState('');
  const [hours, setHours] = useState(10);
  const [prior, setPrior] = useState('');
  const [track, setTrack] = useState('customer-support');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const handleRef = useRef<HTMLInputElement>(null);
  const goalsRef = useRef<HTMLTextAreaElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  const priorRef = useRef<HTMLTextAreaElement>(null);
  const trackRef = useRef<HTMLSelectElement>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('onboardingDraft') || 'null');
      if (saved) {
        setHandle(saved.handle || '');
        setGoals(saved.goals || '');
        setHours(saved.hours || 10);
        setPrior(saved.prior || '');
        setTrack(saved.track || 'customer-support');
      }
    } catch {}
  }, []);
  useEffect(() => {
    const draft = { handle, goals, hours, prior, track };
    localStorage.setItem('onboardingDraft', JSON.stringify(draft));
  }, [handle, goals, hours, prior, track]);

  function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setFieldErrors({});
    const schema = z.object({
      handle: z.string().trim().min(2).max(32).regex(/^[a-z0-9-]+$/i),
      goals: z.string().trim().min(3).max(500),
      hours: z.number().int().min(1).max(60),
      prior: z.string().trim().min(0).max(500),
      track: z.enum(['customer-support','research-intelligence','virtual-assistant','no-code-builder','content-ops'])
    });
    const parsed = schema.safeParse({ handle, goals, hours, prior, track });
    if (!parsed.success) {
      setError('Please fix the highlighted fields.');
      const f = parsed.error.flatten().fieldErrors;
      const errs: Record<string, string> = {};
      if (f.handle?.length) errs.handle = 'Handle must be 2-32 chars, letters/numbers/dashes.';
      if (f.goals?.length) errs.goals = 'Provide your goals (3-500 chars).';
      if (f.hours?.length) errs.hours = 'Hours must be between 1 and 60.';
      if (f.prior?.length) errs.prior = 'Describe prior knowledge (optional, up to 500 chars).';
      if (f.track?.length) errs.track = 'Select a valid track.';
      setFieldErrors(errs);
      const order = ['handle','goals','hours','track','prior'];
      const first = order.find((k) => errs[k]);
      if (first === 'handle') handleRef.current?.focus();
      else if (first === 'goals') goalsRef.current?.focus();
      else if (first === 'hours') hoursRef.current?.focus();
      else if (first === 'track') trackRef.current?.focus();
      else if (first === 'prior') priorRef.current?.focus();
      return;
    }
    const profile = parsed.data;
    localStorage.setItem('learnerProfile', JSON.stringify(profile));
    router.push(`/track/${profile.track}`);
  }

  return (
    <section className="section">
      <form className="stack max-720" onSubmit={submit} noValidate aria-describedby="form-error" aria-live="polite">
        <h2>Onboarding Diagnostics</h2>
        <div className="row" style={{ gap: '0.5rem', alignItems: 'center' }}>
          {[1,2,3].map(s => (
            <div key={s} className="badge" style={{ 
              background: s <= step ? 'var(--primary)' : 'var(--surface-hover)', 
              color: s <= step ? '#fff' : 'var(--muted)',
              border: 'none'
            }}>Step {s}</div>
          ))}
          <div className="muted" style={{ marginLeft: 'auto' }}>Autosaved</div>
        </div>
        <label htmlFor="handle">Handle</label>
        <input
          id="handle"
          ref={handleRef}
          className="input"
          value={handle}
          onChange={e => { setHandle(e.target.value); setStep(1); }}
          placeholder="your-name"
          required
          aria-invalid={!!fieldErrors.handle}
          aria-describedby="handle-error"
          autoComplete="username"
        />
        {fieldErrors.handle && <div className="muted" id="handle-error">{fieldErrors.handle}</div>}
        <label htmlFor="goals">Learner Goals</label>
        <textarea
          id="goals"
          ref={goalsRef}
          className="textarea"
          rows={4}
          value={goals}
          onChange={e => { setGoals(e.target.value); setStep(2); }}
          placeholder="job, contract, apprenticeship"
          required
          aria-invalid={!!fieldErrors.goals}
          aria-describedby="goals-error"
        />
        {fieldErrors.goals && <div className="muted" id="goals-error">{fieldErrors.goals}</div>}
        <div className="row">
          <div className="stack">
            <label htmlFor="hours">Hours per week</label>
            <input
              id="hours"
              ref={hoursRef}
              className="input"
              type="number"
              value={hours}
              onChange={e => setHours(parseInt(e.target.value || '0'))}
              min={1}
              max={60}
              required
              aria-invalid={!!fieldErrors.hours}
              aria-describedby="hours-error"
            />
            {fieldErrors.hours && <div className="muted" id="hours-error">{fieldErrors.hours}</div>}
          </div>
          <div className="stack">
            <label htmlFor="track">Track</label>
            <select
              id="track"
              ref={trackRef}
              className="select"
              value={track}
              onChange={e => { setTrack(e.target.value); setStep(3); }}
              required
              aria-invalid={!!fieldErrors.track}
              aria-describedby="track-error"
            >
              <option value="customer-support">Customer Support (Global SaaS)</option>
              <option value="research-intelligence">Research & Online Intelligence</option>
              <option value="virtual-assistant">Virtual Assistant (AI-powered)</option>
              <option value="no-code-builder">Frontend / No-Code Builder</option>
              <option value="content-ops">Content & Social Media Operations</option>
            </select>
            {fieldErrors.track && <div className="muted" id="track-error">{fieldErrors.track}</div>}
          </div>
        </div>
        <label htmlFor="prior">Prior Knowledge</label>
        <textarea
          id="prior"
          ref={priorRef}
          className="textarea"
          rows={3}
          value={prior}
          onChange={e => setPrior(e.target.value)}
          placeholder="tools, concepts, experience"
          aria-invalid={!!fieldErrors.prior}
          aria-describedby="prior-error"
        />
        {fieldErrors.prior && <div className="muted" id="prior-error">{fieldErrors.prior}</div>}
        <button className="btn btn-primary" type="submit">Create Plan</button>
        {error && <div className="muted" id="form-error" role="alert">{error}</div>}
        <div className="muted">Progress is blocked without proof of understanding.</div>
      </form>
    </section>
  );
}
