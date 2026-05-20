'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { eventService, registrationService, announcementService } from '@/services';
import { useAuth } from '@/hooks';
import type { Event, Registration, Announcement } from '@/types';

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

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    eventService
      .getById(id)
      .then((res) => {
        if (res.success && res.data) setEvent(res.data);
      })
      .finally(() => setLoading(false));
    announcementService.getByEvent(id).then((res) => {
      if (res.success && res.data) setAnnouncements(res.data);
    });
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setRegistering(true);
    setRegisterError(null);
    try {
      const res = await registrationService.register({ eventId: id, ticketType: 'attendee' } as any);
      if (res.success && res.data) {
        setRegistration(res.data);
      }
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('already registered')) {
        setRegisterError('You are already registered for this event.');
      } else {
        setRegisterError('Registration failed. Please try again.');
      }
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = registration !== null;

  if (loading) {
    return (
      <div style={{ padding: '140px 32px 60px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ height: 320, borderRadius: 'var(--radius-lg)', background: 'var(--gray-100)', marginBottom: 32, animation: 'shimmer 2s infinite linear', backgroundImage: 'linear-gradient(90deg, var(--gray-100) 0%, var(--gray-200) 40%, var(--gray-100) 80%)', backgroundSize: '200% 100%' }} />
        <div style={{ height: 36, width: '60%', borderRadius: 8, background: 'var(--gray-100)', marginBottom: 16 }} />
        <div style={{ height: 20, width: '40%', borderRadius: 8, background: 'var(--gray-100)', marginBottom: 32 }} />
        <div style={{ height: 16, width: '100%', borderRadius: 8, background: 'var(--gray-100)', marginBottom: 8 }} />
        <div style={{ height: 16, width: '80%', borderRadius: 8, background: 'var(--gray-100)' }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ padding: '140px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>Event not found</p>
        <Link href="/events" style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, display: 'inline-block' }}>← Back to events</Link>
      </div>
    );
  }

  const formatRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    if (s.toDateString() === e.toDateString()) return s.toLocaleDateString('en-US', opts);
    return `${s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${e.toLocaleDateString('en-US', opts)}`;
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ padding: '100px 32px 0', maxWidth: 1280, margin: '0 auto' }}>
        <Link
          href="/events"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s' }}
          className="ev-back"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to events
        </Link>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          margin: '20px 32px 0',
          maxWidth: 1280,
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          position: 'relative',
          minHeight: 320,
          background: `linear-gradient(135deg, var(--gray-900) 0%, var(--gray-700) 100%)`,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 48,
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>{typeIcons[event.type] || '📌'}</span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: statusColors[event.status],
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'capitalize',
                letterSpacing: '0.02em',
              }}
            >
              {event.status}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
              {event.type}
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 750,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              color: '#fff',
              marginBottom: 20,
            }}
          >
            {event.title}
          </h1>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
              {formatRange(event.startDate, event.endDate)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {event.venue}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <section style={{ padding: '48px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48 }} className="ev-detail-grid">
          {/* Left - Description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 16 }}>
              About this event
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {event.description}
            </p>

            {announcements.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 20 }}>
                  Announcements
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${
                          a.priority === 'urgent' ? '#fecaca' : a.priority === 'high' ? '#fed7aa' : 'var(--border)'
                        }`,
                        background: `${
                          a.priority === 'urgent' ? '#fef2f2' : a.priority === 'high' ? '#fff7ed' : 'var(--gray-50)'
                        }`,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: a.priority === 'urgent' ? '#dc2626' : a.priority === 'high' ? '#ea580c' : a.priority === 'medium' ? '#2563eb' : '#6b7280',
                            color: '#fff',
                            fontSize: 10,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {a.priority}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.01em' }}>
                        {a.title}
                      </h4>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {a.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right - Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isRegistered ? (
              <div
                style={{
                  padding: 28,
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  background: 'var(--gray-50)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em' }}>
                  You&apos;re registered!
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
                  Show this QR code at the entrance for check-in.
                </p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${registration.qrCode}`}
                  alt="Registration QR code"
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    display: 'block',
                    margin: '0 auto 20px',
                  }}
                />
                <Link
                  href="/my-registrations"
                  style={{
                    display: 'inline-block',
                    fontSize: 13,
                    color: 'var(--text)',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                  className="ev-back"
                >
                  View all my registrations →
                </Link>
              </div>
            ) : (
              <div
                style={{
                  padding: 28,
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  background: 'var(--gray-50)',
                }}
              >
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 20, letterSpacing: '-0.01em' }}>
                  Event details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 4 }}>
                      Date
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text)' }}>{formatRange(event.startDate, event.endDate)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 4 }}>
                      Venue
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text)' }}>{event.venue}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 4 }}>
                      Type
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text)', textTransform: 'capitalize' }}>{event.type}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 4 }}>
                      Status
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: statusColors[event.status],
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>

                {registerError && (
                  <p style={{ fontSize: 13, color: '#991b1b', marginTop: 16, textAlign: 'center' }}>
                    {registerError}
                  </p>
                )}

                {event.status === 'upcoming' || event.status === 'ongoing' ? (
                  <motion.button
                    onClick={handleRegister}
                    disabled={registering}
                    whileHover={{ scale: registering ? 1 : 1.01 }}
                    whileTap={{ scale: registering ? 1 : 0.99 }}
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      borderRadius: 'var(--radius-full)',
                      background: registering ? 'var(--gray-400)' : 'var(--black)',
                      color: 'var(--white)',
                      fontWeight: 600,
                      fontSize: 14,
                      border: 'none',
                      cursor: registering ? 'not-allowed' : 'pointer',
                      letterSpacing: '-0.01em',
                      transition: 'background 0.2s',
                      marginTop: 24,
                    }}
                  >
                    {registering ? 'Registering…' : isAuthenticated ? 'Register for this event' : 'Sign in to register'}
                  </motion.button>
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 24 }}>
                    {event.status === 'completed' ? 'This event has ended.' : 'Registration is closed for this event.'}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <style>{`
        .ev-back:hover {
          color: var(--text) !important;
        }
        @media (max-width: 768px) {
          .ev-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
