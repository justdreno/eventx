'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { registrationService } from '@/services';
import { useAuth } from '@/hooks';
import type { Registration } from '@/types';

const statusColors: Record<string, string> = {
  upcoming: '#2563eb',
  ongoing: '#16a34a',
  completed: '#6b7280',
  cancelled: '#dc2626',
};

const typeIcons: Record<string, string> = {
  debate: '⚖️',
  sports: '🏅',
  exhibition: '🔬',
  cultural: '🎭',
  academic: '📚',
  other: '📌',
};

export default function MyRegistrationsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    registrationService
      .getMyRegistrations()
      .then((res) => {
        if (res.success && res.data) setRegistrations(res.data);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div style={{ padding: '140px 32px 60px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ height: 36, width: 280, borderRadius: 8, background: 'var(--gray-100)', marginBottom: 16 }} />
        <div style={{ height: 18, width: 200, borderRadius: 8, background: 'var(--gray-100)', marginBottom: 40 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 240, borderRadius: 'var(--radius-lg)', background: 'var(--gray-100)', animation: 'shimmer 2s infinite linear', backgroundImage: 'linear-gradient(90deg, var(--gray-100) 0%, var(--gray-200) 40%, var(--gray-100) 80%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section style={{ padding: '140px 32px 60px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500, background: 'var(--white)' }}>
              My Dashboard
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 16 }}>
              My registrations
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7 }}>
              View all events you&apos;ve registered for. Show your QR code at the door for quick check-in.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {registrations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>No registrations yet</p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Browse events and register to get started.</p>
              <Link href="/events" style={{ display: 'inline-block', padding: '12px 32px', borderRadius: 'var(--radius-full)', background: 'var(--black)', color: 'var(--white)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', transition: 'opacity 0.2s' }} className="ev-cta">
                Browse events
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
              {registrations.map((reg, i) => (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <div
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border)',
                      background: 'var(--white)',
                      overflow: 'hidden',
                      transition: 'all 0.25s',
                    }}
                    className="reg-card"
                  >
                    <div style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
                      {/* QR code */}
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${reg.qrCode}`}
                          alt="QR code"
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            background: '#fff',
                            display: 'block',
                          }}
                        />
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/events/${reg.eventId}`;
                            if (typeof navigator !== 'undefined' && navigator.share) {
                              navigator.share({ title: reg.event?.title || 'Event', url });
                            } else {
                              navigator.clipboard.writeText(url);
                            }
                          }}
                          style={{
                            marginTop: 8,
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-full)',
                            padding: '3px 10px',
                            fontSize: 10,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontWeight: 500,
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98"/><path d="M15.41 6.51l-6.82 3.98"/></svg>
                          Share
                        </button>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                            {reg.event?.type || 'Event'}
                          </span>
                          {reg.event?.status && (
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                background: statusColors[reg.event.status] || '#6b7280',
                                color: '#fff',
                                fontSize: 10,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                              }}
                            >
                              {reg.event.status}
                            </span>
                          )}
                          {reg.checkedIn && (
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                background: '#16a34a',
                                color: '#fff',
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            >
                              Checked in
                            </span>
                          )}
                        </div>
                        <Link href={`/events/${reg.eventId}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 6 }} className="reg-title">
                            {reg.event?.title || 'Event'}
                          </h3>
                        </Link>
                        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                            {reg.event?.startDate ? new Date(reg.event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {reg.event?.venue || ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .reg-card:hover {
          border-color: var(--gray-400) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        }
        .reg-title:hover {
          text-decoration: underline;
        }
        .ev-cta:hover {
          opacity: 0.85 !important;
        }
      `}</style>
    </div>
  );
}
