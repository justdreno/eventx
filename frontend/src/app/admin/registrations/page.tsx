'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Select from '@/components/ui/select';
import { adminService, eventService } from '@/services';
import type { AdminRegistration, Event } from '@/types';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState('all');
  const [checkedFilter, setCheckedFilter] = useState('all');
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const fetchRegistrations = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (eventFilter !== 'all') params.eventId = eventFilter;
    if (checkedFilter !== 'all') params.checkedIn = checkedFilter;
    adminService.getRegistrations(params).then((res) => {
      if (res.success && res.data) setRegistrations(res.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRegistrations(); }, [eventFilter, checkedFilter]);

  useEffect(() => {
    eventService.getAll().then((res) => {
      if (res.success && res.data) setEvents(res.data);
    });
  }, []);

  const handleCheckIn = async (id: string) => {
    setCheckingIn(id);
    try {
      await adminService.checkInRegistration(id);
      setRegistrations((prev) =>
        prev.map((r) => r.id === id ? { ...r, checkedIn: true, checkedInAt: new Date().toISOString() } : r)
      );
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setCheckingIn(null);
    }
  };

  return (
    <div>
      <section style={{ padding: '48px 32px 32px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 8 }}>
              Registrations
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
              {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ width: 220 }}>
                <Select
                  value={eventFilter}
                  onChange={setEventFilter}
                  placeholder="All events"
                  options={[
                    { value: 'all', label: 'All events' },
                    ...events.map((ev) => ({ value: ev.id, label: ev.title })),
                  ]}
                />
              </div>
              <div style={{ width: 160 }}>
                <Select
                  value={checkedFilter}
                  onChange={setCheckedFilter}
                  options={[
                    { value: 'all', label: 'All statuses' },
                    { value: 'true', label: 'Checked in' },
                    { value: 'false', label: 'Pending' },
                  ]}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '32px 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Attendee</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Event</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Registered</th>
                    <th style={{ textAlign: 'center', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ textAlign: 'right', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 48, textAlign: 'center' }}>
                        <div style={{ display: 'inline-block', width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--black)', animation: 'ar-spin 0.6s linear infinite' }} />
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '48px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                        No registrations found.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg, i) => (
                      <motion.tr
                        key={reg.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
                        className="ar-row"
                      >
                        <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                            {reg.user.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500, color: 'var(--text)' }}>{reg.user.name}</span>
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13 }}>{reg.user.email}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <Link href={`/events/${reg.eventId}`} style={{ color: 'var(--text)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }} className="ar-event">
                            {reg.event?.title || '—'}
                          </Link>
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>
                          {new Date(reg.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          {reg.checkedIn ? (
                            <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: '#16a34a16', color: '#16a34a', fontSize: 11, fontWeight: 600 }}>
                              Checked in
                            </span>
                          ) : (
                            <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--gray-100)', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          {!reg.checkedIn && (
                            <button
                              onClick={() => handleCheckIn(reg.id)}
                              disabled={checkingIn === reg.id}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #16a34a',
                                background: checkingIn === reg.id ? '#f0fdf4' : 'transparent',
                                color: '#16a34a',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: checkingIn === reg.id ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s',
                              }}
                              className="ar-checkin"
                            >
                              {checkingIn === reg.id ? '…' : 'Check in'}
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ar-spin { to { transform: rotate(360deg) } }
        .ar-row:hover { background: var(--gray-50) !important; }
        .ar-event:hover { color: var(--black) !important; }
        .ar-checkin:hover { background: #f0fdf4 !important; }
      `}</style>
    </div>
  );
}
