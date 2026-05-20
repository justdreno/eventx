'use client';

import { motion } from 'framer-motion';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
    title: 'Unified Dashboard',
    description: 'Every event on one beautiful timeline. Filter, search, and never lose track of debates, sports, exhibitions, or fests.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </svg>
    ),
    title: 'Smart Announcements',
    description: 'Push urgent updates in real time. Priority-tagged bulletins reach students, teachers, and parents instantly.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
    title: 'Live Event Feed',
    description: 'Scores, highlights, and photo galleries stream as the action happens. Keep the whole school in the stands.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h5l3-9 4 18 3-9h5"/>
      </svg>
    ),
    title: 'Seamless Ticketing',
    description: 'Register in seconds. Digital tickets with QR codes mean zero queues at the door and effortless check-ins.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
      </svg>
    ),
    title: 'Interactive Calendar',
    description: 'Your school year at a glance. Sync with countdowns that build anticipation for every major event.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Real-time Notifications',
    description: 'Get pinged the moment scores change, schedules shift, or announcements drop. Always in the loop.',
  },
];

export function Features() {
  return (
    <section
      id="features"
      data-testid="features-section"
      style={{
        padding: '140px 32px',
        position: 'relative',
      }}
    >
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 80, maxWidth: 600, margin: '0 auto 80px' }}>
          <span
            data-testid="features-label"
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
            }}
          >
            Features
          </span>
          <h2
            data-testid="features-heading"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              color: 'var(--text)',
            }}
          >
            Built for the entire
            <br />
            school community
          </h2>
        </div>
      </Reveal>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <StaggerContainer staggerDelay={0.06}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              background: 'var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}
            className="features-grid"
          >
            {features.map((feature, i) => (
              <StaggerItem key={i}>
                <motion.div
                  data-testid={`feature-card-${i}`}
                  whileHover={{
                    backgroundColor: 'var(--gray-50)',
                    transition: { duration: 0.25 },
                  }}
                  style={{
                    padding: '40px 32px',
                    background: 'var(--white)',
                    cursor: 'default',
                    height: '100%',
                    transition: 'background-color 0.3s',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'var(--white)',
                      marginBottom: 24,
                      color: 'var(--text)',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      marginBottom: 10,
                      letterSpacing: '-0.02em',
                      color: 'var(--text)',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
