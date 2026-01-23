'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CURRICULUM, Task } from '../../data/curriculum';
import CapstoneProject from './CapstoneProject';
import Reveal from './Reveal';
import { useToast } from './ToastProvider';

export default function TrackView({ trackId }: { trackId: string }) {
  const track = CURRICULUM[trackId];
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      // 1. Load local
      const saved = localStorage.getItem(`track_progress_${trackId}`);
      let localIds: string[] = [];
      if (saved) {
        try { localIds = JSON.parse(saved); } catch {}
      }
      
      // 2. Load server
      try {
        const res = await fetch(`/api/track/progress?trackId=${trackId}`);
        const data = await res.json();
        if (data.ok && data.progress.length > 0) {
          // Merge or prefer server? Let's union them for now to not lose data
          const merged = Array.from(new Set([...localIds, ...data.progress]));
          setCompletedIds(merged);
        } else {
          setCompletedIds(localIds);
        }
      } catch {
        setCompletedIds(localIds);
      }
      setHydrated(true);
    })();
  }, [trackId]);

  const toggleTask = async (taskId: string) => {
    const isCompleted = completedIds.includes(taskId);
    const next = isCompleted
      ? completedIds.filter(id => id !== taskId)
      : [...completedIds, taskId];
    
    setCompletedIds(next);
    localStorage.setItem(`track_progress_${trackId}`, JSON.stringify(next));

    // Sync to server
    try {
      await fetch('/api/track/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, taskId, completed: !isCompleted })
      });
    } catch (e) {
      console.error('Failed to sync progress', e);
    }
  };

  const stats = useMemo(() => {
    if (!track) return { total: 0, completed: 0, percent: 0, blocked: true };
    const allTasks = track.modules.flatMap(m => m.tasks);
    const required = allTasks.filter(t => t.required);
    const requiredCompleted = required.filter(t => completedIds.includes(t.id));
    
    return {
      total: required.length,
      completed: requiredCompleted.length,
      percent: required.length > 0 ? Math.round((requiredCompleted.length / required.length) * 100) : 0,
      blocked: requiredCompleted.length < required.length
    };
  }, [track, completedIds]);

  if (!track) {
    return (
      <section className="section centered">
        <h2>Track Not Found</h2>
        <Link href="/track" className="btn btn-primary">Back to Tracks</Link>
      </section>
    );
  }

  if (!hydrated) return null; // Prevent hydration mismatch

  return (
    <section className="section stack" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Reveal>
        <div className="badge mb-4">Track: {track.title}</div>
        <h1>{track.title}</h1>
        <p className="muted" style={{ fontSize: '1.2rem' }}>{track.description}</p>
        
        <div className="card-glass p-6 mb-8" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div className="muted mb-2">Progress</div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${stats.percent}%`, height: '100%', background: 'var(--success)', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{stats.percent}%</div>
            <div className="muted text-sm">Completed</div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="card p-6">
          <h3 className="mb-4">Learning Materials</h3>
          <p className="muted mb-4">Study these materials before starting the tasks.</p>
          <div className="stack gap-2">
            {track.learning.map((res, idx) => (
              <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <span style={{ opacity: 0.7 }}>
                  {res.type === 'video' ? '📺' : res.type === 'article' ? '📄' : res.type === 'tool' ? '🔧' : '📝'}
                </span>
                <span>{res.title}</span>
                {res.duration && <span className="muted text-xs">({res.duration})</span>}
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="stack gap-8">
        {track.modules.map((module, i) => (
          <Reveal key={module.id} className={`delay-${i + 1}`}>
            <h3 className="mb-4">{module.title}</h3>
            <p className="muted mb-6">{module.description}</p>
            <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
              {module.tasks.map(task => (
                <div key={task.id} className={`card ${completedIds.includes(task.id) ? 'border-success' : ''}`} style={{ transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{task.title}</h4>
                        {task.required && <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>Required</span>}
                        {completedIds.includes(task.id) && <span style={{ color: 'var(--success)' }}>✓</span>}
                      </div>
                      <p className="muted text-sm mb-4">{task.description}</p>
                      
                      {task.resources && task.resources.length > 0 && (
                        <div className="stack gap-2 mb-4" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                          <div className="text-xs uppercase tracking-wider muted">Resources</div>
                          {task.resources.map((res, idx) => (
                            <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                              <span style={{ opacity: 0.7 }}>
                                {res.type === 'video' ? '📺' : res.type === 'article' ? '📄' : res.type === 'tool' ? '🔧' : '📝'}
                              </span>
                              <span>{res.title}</span>
                              {res.duration && <span className="muted text-xs">({res.duration})</span>}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      className={`btn ${completedIds.includes(task.id) ? 'btn-accent' : 'btn-primary'}`}
                      onClick={() => toggleTask(task.id)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {completedIds.includes(task.id) ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <CapstoneProject 
          {...track.capstone}
          isLocked={stats.blocked}
        />
      </Reveal>
    </section>
  );
}
