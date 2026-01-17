'use client';

import { useEffect, useRef, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function Tutor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'What would you like to learn today?' } as Message
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const next: Message[] = [...messages, { role: 'user', content: input } as Message];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      });
      if (!res.ok) throw new Error('Tutor unavailable');
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply } as Message]);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section stack" style={{ maxWidth: 720 }}>
      <h2>AI Tutor</h2>
      <div ref={listRef} className="card animate-in" style={{ height: 360, overflowY: 'auto' }} aria-live="polite">
        <div className="stack">
          {messages.map((m, i) => (
            <div key={i} className="animate-in" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div className="badge">{m.role}</div>
              <div>{m.content}</div>
            </div>
          ))}
          {loading && <div className="muted">Thinking...</div>}
          {error && <div className="muted">{error}</div>}
        </div>
      </div>
      <div className="row">
        <input className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about the track or tasks" aria-label="Message to Tutor" disabled={loading} />
        <button className="btn btn-primary" onClick={send} disabled={loading}>Send</button>
      </div>
      <div className="muted">Step-by-step reasoning and localized examples.</div>
    </section>
  );
}
