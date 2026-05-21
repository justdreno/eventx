'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Select from '@/components/ui/select';
import Countdown from '@/components/ui/countdown';
import { eventService } from '@/services';
import type { Event } from '@/types';

const eventTypes = ['all', 'debate', 'sports', 'exhibition', 'cultural', 'academic', 'other'] as const;

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    eventService
      .getAll()
      .then((res) => {
        if (res.success && res.data) setEvents(res.data);
      })
      .catch(() => setError('Failed to load events. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.title.toLowerCase().includes(q) && !e.venue.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          padding: '140px 32px 60px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--gray-50)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 20,
                fontWeight: 500,
                background: 'var(--white)',
              }}
            >
              Events
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 750,
                letterSpacing: '-0.04em',
                lineHeight: 1.08,
                color: 'var(--text)',
                marginBottom: 16,
              }}
            >
              School events
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7 }}>
              Browse upcoming and past events. Register, track live updates, and never miss a moment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div
        style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events…"
            style={{
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: 14,
              background: 'var(--bg)',
              color: 'var(--text)',
              outline: 'none',
              minWidth: 220,
              flex: '1 1 200px',
              transition: 'border-color 0.2s',
            }}
            className="ev-filter-input"
          />

          {/* Type filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {eventTypes.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${typeFilter === t ? 'var(--black)' : 'var(--border)'}`,
                  background: typeFilter === t ? 'var(--black)' : 'var(--bg)',
                  color: typeFilter === t ? 'var(--white)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: typeFilter === t ? 600 : 450,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                  letterSpacing: '-0.01em',
                }}
                className="ev-chip"
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{ minWidth: 140, width: 160 }}>
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
      </div>

      {/* Events grid */}
      <section style={{ padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 240,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--gray-100)',
                    animation: 'shimmer 2s infinite linear',
                    backgroundImage: 'linear-gradient(90deg, var(--gray-100) 0%, var(--gray-200) 40%, var(--gray-100) 80%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                {error || (search || typeFilter !== 'all' || statusFilter !== 'all' ? 'No events match your filters' : 'No events yet')}
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                {error ? 'Something went wrong loading events.' : 'Try adjusting your search or filters.'}
              </p>
              {(search || typeFilter !== 'all' || statusFilter !== 'all') && (
                <button onClick={() => { setSearch(''); setTypeFilter('all'); setStatusFilter('all'); }}
                  style={{ display: 'inline-block', padding: '12px 32px', borderRadius: 'var(--radius-full)', background: 'var(--black)', color: 'var(--white)', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none' }}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link
                    href={`/events/${event.id}`}
                    style={{ display: 'block', textDecoration: 'none' }}
                  >
                    <div
                      className="ev-card"
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        background: 'var(--white)',
                        overflow: 'hidden',
                        transition: 'all 0.25s',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          height: 140,
                          background: `linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 40,
                          position: 'relative',
                        }}
                      >
                        {typeIcons[event.type] || '📌'}
                        <span
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            background: statusColors[event.status],
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div style={{ padding: '20px 20px 22px' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                          {event.type}
                        </span>
                        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: '6px 0 10px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                          {event.title}
                        </h3>
                        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)', marginBottom: event.status === 'upcoming' ? 12 : 0 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {event.venue}
                          </span>
                        </div>
                        {event.status === 'upcoming' && (
                          <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Starts in</div>
                            <Countdown targetDate={event.startDate} size="sm" />
                          </div>
                        )}
                        {event.status === 'ongoing' && (
                          <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: '#16a34a10', border: '1px solid #16a34a30', fontSize: 12, fontWeight: 600, color: '#16a34a', textAlign: 'center' }}>
                            Live now
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .ev-filter-input:focus {
          border-color: var(--black) !important;
        }
        .ev-chip:hover {
          border-color: var(--gray-400) !important;
        }
        .ev-card:hover {
          border-color: var(--gray-400) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
      `}</style>
    </div>
  );
}
