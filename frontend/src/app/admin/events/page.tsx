'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Select from '@/components/ui/select';
import { adminService } from '@/services';
import type { AdminEvent } from '@/types';

const statusColors: Record<string, string> = {
  upcoming: '#2563eb',
  ongoing: '#16a34a',
  completed: '#6b7280',
  cancelled: '#dc2626',
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchEvents = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (typeFilter !== 'all') params.type = typeFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (search.trim()) params.search = search.trim();
    adminService.getEvents(params).then((res) => {
      if (res.success && res.data) setEvents(res.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, [typeFilter, statusFilter]);
  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const { eventService } = await import('@/services');
      await eventService.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <section style={{ padding: '48px 32px 32px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 8 }}>
                  Events
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                  {events.length} event{events.length !== 1 ? 's' : ''} total
                </p>
              </div>
              <Link
                href="/admin/events/new"
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--black)',
                  color: 'var(--white)',
                  fontWeight: 600,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                New event
              </Link>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events…"
                style={{
                  padding: '9px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: 13,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  outline: 'none',
                  minWidth: 200,
                  flex: '1 1 200px',
                  transition: 'border-color 0.2s',
                }}
                className="aev-input"
              />
              <div style={{ width: 140 }}>
                <Select
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={[
                    { value: 'all', label: 'All types' },
                    { value: 'debate', label: 'Debate' },
                    { value: 'sports', label: 'Sports' },
                    { value: 'exhibition', label: 'Exhibition' },
                    { value: 'cultural', label: 'Cultural' },
                    { value: 'academic', label: 'Academic' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </div>
              <div style={{ width: 140 }}>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'all', label: 'All statuses' },
                    { value: 'upcoming', label: 'Upcoming' },
                    { value: 'ongoing', label: 'Ongoing' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '32px 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Table */}
          <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Title</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Venue</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ textAlign: 'center', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Registered</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Created by</th>
                    <th style={{ textAlign: 'right', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {loading ? (
                      <tr>
                        <td colSpan={8} style={{ padding: 48, textAlign: 'center' }}>
                          <div style={{ display: 'inline-block', width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--black)', animation: 'aev-spin 0.6s linear infinite' }} />
                        </td>
                      </tr>
                    ) : events.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: '48px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                          {search || typeFilter !== 'all' || statusFilter !== 'all'
                            ? 'No events match your filters.'
                            : 'No events yet. Create your first event.'}
                        </td>
                      </tr>
                    ) : (
                      events.map((event, i) => (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
                          className="aev-row"
                        >
                          <td style={{ padding: '14px 18px' }}>
                            <Link href={`/events/${event.id}`} style={{ fontWeight: 600, color: 'var(--text)', textDecoration: 'none', transition: 'color 0.15s' }} className="aev-title">
                              {event.title}
                            </Link>
                          </td>
                          <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13, textTransform: 'capitalize' }}>{event.type}</td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-full)',
                              background: `${statusColors[event.status]}16`,
                              color: statusColors[event.status],
                              fontSize: 11,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}>
                              {event.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13 }}>{event.venue}</td>
                          <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                            {event._count.registrations}
                          </td>
                          <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13 }}>{event.createdByUser?.name || '—'}</td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                              <Link
                                href={`/admin/events/${event.id}/edit`}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid var(--border)',
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: 'var(--text)',
                                  textDecoration: 'none',
                                  transition: 'all 0.15s',
                                }}
                                className="aev-action"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(event.id, event.title)}
                                disabled={deleting === event.id}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid #fecaca',
                                  background: deleting === event.id ? '#fef2f2' : 'transparent',
                                  color: deleting === event.id ? '#991b1b' : '#dc2626',
                                  fontSize: 12,
                                  fontWeight: 500,
                                  cursor: deleting === event.id ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.15s',
                                }}
                                className="aev-del"
                              >
                                {deleting === event.id ? '…' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes aev-spin { to { transform: rotate(360deg) } }
        .aev-input:focus { border-color: var(--black) !important; }
        .aev-row:hover { background: var(--gray-50) !important; }
        .aev-title:hover { color: var(--black) !important; }
        .aev-action:hover { background: var(--gray-50) !important; border-color: var(--gray-400) !important; }
        .aev-del:hover { background: #fef2f2 !important; border-color: #fca5a5 !important; }
      `}</style>
    </div>
  );
}
