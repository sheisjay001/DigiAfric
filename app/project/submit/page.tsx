'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useToast } from '../../components/ToastProvider';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export default function SubmitProject() {
  const { showToast } = useToast();
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repo, setRepo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    const schema = z.object({
      handle: z.string().trim().min(2).max(32).regex(/^[a-z0-9-]+$/i, "Handle must be alphanumeric"),
      artifact: z.object({
        title: z.string().trim().min(2, "Title is too short").max(120),
        description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
        repo: z.string().url("Must be a valid URL").optional().or(z.literal(''))
      })
    });
    
    const parsed = schema.safeParse({ handle, artifact: { title, description, repo } });
    
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Please check your inputs.';
      showToast(firstError, 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      });
      const data = await res.json();
      
      if (res.ok && data.ok) {
        showToast('Project submitted successfully!', 'success');
        // Reset form
        setTitle('');
        setDescription('');
        setRepo('');
      } else {
        showToast(data.error || 'Submission failed. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please check your connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container main">
      <Breadcrumbs />
      <div className="section stack centered" style={{ maxWidth: 720 }}>
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <h1>Submit Your Project</h1>
          <p className="muted">Share your work with the community and get feedback from mentors.</p>
        </div>

        <div className="card stack" style={{ textAlign: 'left', gap: 'var(--space-4)' }}>
          <div>
            <label htmlFor="handle">Your Handle</label>
            <input 
              id="handle"
              className="input" 
              value={handle} 
              onChange={e => setHandle(e.target.value)} 
              placeholder="e.g. dev-guru" 
            />
            <small className="muted">This will be used to link the project to your portfolio.</small>
          </div>

          <div>
            <label htmlFor="title">Project Title</label>
            <input 
              id="title"
              className="input" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. E-commerce Dashboard" 
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              className="textarea" 
              rows={5} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Describe what you built, technologies used, and challenges you faced..."
            />
          </div>

          <div>
            <label htmlFor="repo">Repository URL (Optional)</label>
            <input 
              id="repo"
              className="input" 
              value={repo} 
              onChange={e => setRepo(e.target.value)} 
              placeholder="https://github.com/yourusername/project" 
            />
          </div>

          <button 
            className="btn btn-primary btn-block scale-hover" 
            onClick={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
