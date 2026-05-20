'use client';

import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '@/components/ui';
import { ParticleSphere } from '@/components/ui/particle-sphere';

export function Hero() {
  return (
    <section
      data-testid="hero-section"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '140px 32px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          maxWidth: 1280,
          margin: '0 auto',
          width: '100%',
          gap: 40,
        }}
        className="hero-grid"
      >
        {/* Left - Content */}
        <StaggerContainer staggerDelay={0.08}>
          <div style={{ maxWidth: 640 }}>
            {/* Badge */}
            <StaggerItem>
              <div
                data-testid="hero-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 32,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    fontWeight: 450,
                    letterSpacing: '0.02em',
                  }}
                >
                  The platform for school events
                </span>
              </div>
            </StaggerItem>

            {/* Headline */}
            <StaggerItem>
              <h1
                data-testid="hero-headline"
                style={{
                  fontSize: 'clamp(3rem, 6.5vw, 5.2rem)',
                  fontWeight: 750,
                  letterSpacing: '-0.045em',
                  lineHeight: 1.02,
                  marginBottom: 28,
                  color: 'var(--text)',
                }}
              >
                Every school
                <br />
                event, one
                <br />
                command center
              </h1>
            </StaggerItem>

            {/* Subtitle */}
            <StaggerItem>
              <p
                data-testid="hero-subtitle"
                style={{
                  fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  marginBottom: 44,
                  maxWidth: 420,
                }}
              >
                Your toolkit to stop configuring and start connecting.
                Securely manage, schedule, and scale the best school experiences.
              </p>
            </StaggerItem>

            {/* CTA Buttons */}
            <StaggerItem>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <motion.a
                  href="/register"
                  data-testid="hero-cta-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '15px 36px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--black)',
                    color: 'var(--white)',
                    fontWeight: 600,
                    fontSize: 15,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'opacity 0.2s',
                    letterSpacing: '-0.01em',
                  }}
                  className="cta-primary"
                >
                  Start for free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.a>

                <motion.a
                  href="#phases"
                  data-testid="hero-cta-secondary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '15px 36px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--gray-300)',
                    color: 'var(--text)',
                    fontWeight: 500,
                    fontSize: 15,
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.3s, border-color 0.3s',
                    letterSpacing: '-0.01em',
                  }}
                  className="cta-secondary"
                >
                  Watch demo
                </motion.a>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Right - Particle Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: '100%',
            height: '100%',
            minHeight: 500,
            position: 'relative',
          }}
          className="hero-particle-wrap"
        >
          <ParticleSphere />
        </motion.div>
      </div>

      <style>{`
        .cta-primary:hover {
          opacity: 0.9 !important;
        }
        .cta-secondary:hover {
          background: var(--gray-50) !important;
          border-color: var(--gray-400) !important;
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-particle-wrap {
            min-height: 320px !important;
            margin-top: 20px;
          }
        }
      `}</style>
    </section>
  );
}
