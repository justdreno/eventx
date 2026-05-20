'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface FloatingOrbsProps {
  count?: number;
  children?: ReactNode;
}

export function FloatingOrbs({ count = 3, children }: FloatingOrbsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const orbs = container.querySelectorAll<HTMLDivElement>('.orb');
    orbs.forEach((orb) => {
      const duration = 6 + Math.random() * 8;
      const delay = Math.random() * 4;
      const xDrift = (Math.random() - 0.5) * 40;
      const yDrift = (Math.random() - 0.5) * 40;

      orb.style.setProperty('--duration', `${duration}s`);
      orb.style.setProperty('--delay', `${delay}s`);
      orb.style.setProperty('--x-drift', `${xDrift}px`);
      orb.style.setProperty('--y-drift', `${yDrift}px`);
    });
  }, [count]);

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="orb"
          style={{
            position: 'absolute',
            width: 300 + Math.random() * 400,
            height: 300 + Math.random() * 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)`,
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            animation: `float var(--duration) ease-in-out var(--delay) infinite`,
          }}
        />
      ))}
      {children}
    </div>
  );
}
