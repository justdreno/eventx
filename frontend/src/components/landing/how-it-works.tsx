'use client';

import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui';
import { motion } from 'framer-motion';

const phases = [
  {
    num: '01',
    title: 'Plan & Publish',
    desc: 'Admins create events with dates, venues, and media. Everything goes live on the unified calendar instantly.',
  },
  {
    num: '02',
    title: 'Register & Ticket',
    desc: 'Students and parents browse events, register in one click, and receive QR-coded digital tickets.',
  },
  {
    num: '03',
    title: 'Engage & Track',
    desc: 'Scores, highlights, and photos stream live. QR check-ins at the door. No paper, no queues.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="phases"
      data-testid="how-it-works-section"
      style={{
        padding: '140px 32px',
        position: 'relative',
        background: 'var(--gray-50)',
      }}
    >
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 80, maxWidth: 560, margin: '0 auto 80px' }}>
          <span
            data-testid="phases-label"
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 24,
              fontWeight: 500,
              background: 'var(--white)',
            }}
          >
            How it works
          </span>
          <h2
            data-testid="phases-heading"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              color: 'var(--text)',
            }}
          >
            From setup to showtime
          </h2>
        </div>
      </Reveal>

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <StaggerContainer staggerDelay={0.12}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              position: 'relative',
            }}
            className="phases-grid"
          >
            {phases.map((phase, i) => (
              <StaggerItem key={i}>
                <motion.div
                  data-testid={`phase-card-${i}`}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  style={{
                    padding: '36px 28px',
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'default',
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 800,
                      color: 'var(--gray-100)',
                      letterSpacing: '-0.05em',
                      lineHeight: 1,
                      marginBottom: 20,
                      userSelect: 'none',
                    }}
                  >
                    {phase.num}
                  </div>

                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginBottom: 10,
                      letterSpacing: '-0.02em',
                      color: 'var(--text)',
                    }}
                  >
                    {phase.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.75,
                    }}
                  >
                    {phase.desc}
                  </p>

                  {/* Subtle connector dot */}
                  {i < phases.length - 1 && (
                    <div
                      className="phase-connector"
                      style={{
                        position: 'absolute',
                        right: -14,
                        top: '50%',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--gray-300)',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                      }}
                    />
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .phases-grid {
            grid-template-columns: 1fr !important;
          }
          .phase-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
