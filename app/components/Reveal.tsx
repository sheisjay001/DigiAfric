'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export default function Reveal({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setShow(true);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-show={show} className={`reveal ${className || ''}`} style={{ ...style, willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
}
