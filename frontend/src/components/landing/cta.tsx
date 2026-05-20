'use client';

import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section
      data-testid="cta-section"
      style={{
        padding: '160px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Reveal>
        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <StaggerContainer staggerDelay={0.1}>
            <StaggerItem>
              <h2
                data-testid="cta-heading"
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                  fontWeight: 750,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.08,
                  marginBottom: 24,
                  color: 'var(--text)',
                }}
              >
                Ready to bring your
                <br />
                school events to life?
              </h2>
            </StaggerItem>

            <StaggerItem>
              <p
                data-testid="cta-subtitle"
                style={{
                  fontSize: 16,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  marginBottom: 48,
                  maxWidth: 460,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Join schools that have transformed chaos into clarity.
                One platform. Every event. Everyone connected.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <motion.a
                  href="/register"
                  data-testid="cta-get-started-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '17px 44px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--black)',
                    color: 'var(--white)',
                    fontWeight: 600,
                    fontSize: 16,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    letterSpacing: '-0.01em',
                    transition: 'opacity 0.2s',
                  }}
                  className="cta-btn-primary"
                >
                  Get started free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.a>

                <motion.a
                  href="#"
                  data-testid="cta-demo-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '17px 44px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--gray-300)',
                    color: 'var(--text)',
                    fontWeight: 500,
                    fontSize: 16,
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.3s, border-color 0.3s',
                    letterSpacing: '-0.01em',
                  }}
                  className="cta-btn-secondary"
                >
                  Book a demo
                </motion.a>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </Reveal>

      <style>{`
        .cta-btn-primary:hover {
          opacity: 0.9 !important;
        }
        .cta-btn-secondary:hover {
          background: var(--gray-50) !important;
          border-color: var(--gray-400) !important;
        }
      `}</style>
    </section>
  );
}
