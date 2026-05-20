'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '98%', label: 'Event attendance' },
  { value: '300%', label: 'Engagement boost' },
  { value: '6x', label: 'Faster setup' },
  { value: '20 days', label: 'Avg saved per term' },
  { value: '500+', label: 'Schools onboard' },
  { value: '50K+', label: 'Events managed' },
];

export function StatsTicker() {
  const doubled = [...stats, ...stats];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      data-testid="stats-ticker"
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
        padding: '28px 0',
        position: 'relative',
        background: 'var(--bg)',
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background: 'linear-gradient(90deg, var(--bg) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background: 'linear-gradient(270deg, var(--bg) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          animation: 'marquee 30s linear infinite',
          width: 'max-content',
        }}
      >
        {doubled.map((stat, i) => (
          <div
            key={i}
            data-testid={`stat-item-${i}`}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 10,
              padding: '0 48px',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                fontWeight: 400,
                letterSpacing: '0.01em',
                textTransform: 'lowercase',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
