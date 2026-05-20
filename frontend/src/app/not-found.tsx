'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        background: 'var(--bg)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ textAlign: 'center', maxWidth: 480 }}
      >
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            fontSize: 'clamp(6rem, 18vw, 12rem)',
            fontWeight: 800,
            letterSpacing: '-0.06em',
            lineHeight: 1,
            color: 'var(--gray-200)',
            marginBottom: 8,
            userSelect: 'none',
          }}
        >
          404
        </motion.p>

        <p
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            marginBottom: 12,
          }}
        >
          Page not found
        </p>

        <p
          style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 48,
          }}
        >
          The link might be broken, or the page may have moved.
          Let&apos;s get you back on track.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '14px 36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--black)',
              color: 'var(--white)',
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '-0.01em',
              transition: 'opacity 0.2s',
            }}
            className="nf-btn-primary"
          >
            Go home
          </Link>
          <Link
            href="/events"
            style={{
              padding: '14px 36px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontWeight: 500,
              fontSize: 15,
              letterSpacing: '-0.01em',
              transition: 'all 0.2s',
            }}
            className="nf-btn-secondary"
          >
            Browse events
          </Link>
        </div>
      </motion.div>

      <style>{`
        .nf-btn-primary:hover {
          opacity: 0.85 !important;
        }
        .nf-btn-secondary:hover {
          background: var(--gray-50) !important;
          border-color: var(--gray-400) !important;
        }
      `}</style>
    </div>
  );
}
