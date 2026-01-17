'use client';

import { useState } from 'react';
import { z } from 'zod';

export default function SubmitProject() {
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repo, setRepo] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    const schema = z.object({
      handle: z.string().trim().min(2).max(32).regex(/^[a-z0-9-]+$/i),
      artifact: z.object({
        title: z.string().trim().min(2).max(120),
        description: z.string().trim().min(2).max(1000),
        repo: z.string().url().optional().or(z.literal(''))
      })
    });
    const parsed = schema.safeParse({ handle, artifact: { title, description, repo } });
    if (!parsed.success) {
      setError('Please check your inputs.');
      return;
    }
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      });
      const data = await res.json();
      setStatus(data?.ok ? 'Saved' : 'Failed');
    } catch {
      setError('Network error.');
    }
  }

  return (
    <section className="section stack" style={{ maxWidth: 720 }}>
      <h2>Project Submission</h2>
      <label>Handle</label>
      <input className="input" value={handle} onChange={e => setHandle(e.target.value)} placeholder="your-name" />
      <label>Project Title</label>
      <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Capstone name" />
      <label>Description</label>
      <textarea className="textarea" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
      <label>Repository URL</label>
      <input className="input" value={repo} onChange={e => setRepo(e.target.value)} placeholder="https://github.com/..." />
      <button className="btn btn-primary" onClick={submit}>Submit</button>
      {status && <div className="muted">Status: {status}</div>}
      {error && <div className="muted">{error}</div>}
    </section>
  );
}
