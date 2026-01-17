'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    void error;
  }, [error]);

  return (
    <section className="section centered">
      <h2>Something went wrong</h2>
      <p className="muted">An unexpected error occurred. Please try again.</p>
      <button className="btn btn-primary" onClick={() => reset()}>Retry</button>
    </section>
  );
}
