'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from '@/components/ui/countdown';
import { eventService } from '@/services';
import type { Event } from '@/types';

const statusColors: Record<string, string> = {
  upcoming: '#2563eb',
  ongoing: '#16a34a',
  completed: '#6b7280',
  cancelled: '#dc2626',
};

const typeIcons: Record<string, string> = {
  debate: '⚖️', sports: '🏅', exhibition: '🔬', cultural: '🎭', academic: '📚', other: '📌',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  useEffect(() => {
    eventService.getAll().then((res) => {
      if (res.success && res.data) setEvents(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((ev) => {
      const key = new Date(ev.startDate).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const todayKey = today.toDateString();
  const selDate = selectedDay ? new Date(year, month, selectedDay) : null;
  const selKey = selDate?.toDateString() || '';
  const dayEvents = eventsByDate[selKey] || [];
  const isToday = today.getMonth() === month && today.getFullYear() === year;

  const goPrev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); setSelectedDay(null); };
  const goNext = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); setSelectedDay(null); };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDay(today.getDate()); };

  const grid = [];
  for (let i = 0; i < startDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  const cellSize = 'minmax(40px, 1fr)';

  if (loading) {
    return (
      <div style={{ padding: '140px 32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--black)', animation: 'cal-spin 0.6s linear infinite' }} />
        <style>{'@keyframes cal-spin { to { transform: rotate(360deg) } }'}</style>
      </div>
    );
  }

  return (
    <div>
      <section style={{ padding: '120px 32px 48px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500, background: 'var(--white)' }}>
              Events
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 16 }}>
              Calendar
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7 }}>
              Browse events by date. Click any day to see what&apos;s happening.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }} className="cal-grid"
          >
            {/* Calendar */}
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                    {MONTHS[month]} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{year}</span>
                  </h2>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={goPrev} style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }} className="cal-nav-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button onClick={goNext} style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }} className="cal-nav-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
                <button
                  onClick={goToday}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border)',
                    background: isToday ? 'var(--black)' : 'var(--bg)',
                    color: isToday ? 'var(--white)' : 'var(--text)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  className="cal-today-btn"
                >
                  Today
                </button>
              </div>

              {/* Weekday headers */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cellSize})`, gap: 4, marginBottom: 8 }}>
                {DAYS.map((d) => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '8px 0' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cellSize})`, gap: 4 }}>
                {grid.map((day, i) => {
                  if (day === null) return <div key={`e-${i}`} />;

                  const date = new Date(year, month, day);
                  const dateKey = date.toDateString();
                  const dayEvents = eventsByDate[dateKey] || [];
                  const isCurrentDay = isToday && day === today.getDate();
                  const isSelected = selectedDay === day;
                  const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <motion.button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--black)' : isCurrentDay ? '2px solid var(--black)' : '1px solid transparent',
                        background: isSelected ? 'var(--gray-100)' : isCurrentDay ? 'var(--gray-50)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                        position: 'relative',
                        transition: 'all 0.12s',
                        opacity: isPast ? 0.4 : 1,
                      }}
                      className="cal-day"
                    >
                      <span style={{ fontSize: 14, fontWeight: isCurrentDay || isSelected ? 700 : 450, color: isCurrentDay ? 'var(--black)' : 'var(--text)', lineHeight: 1 }}>
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <div style={{ display: 'flex', gap: 2 }}>
                          {dayEvents.slice(0, 3).map((ev) => (
                            <span key={ev.id} style={{ width: 5, height: 5, borderRadius: '50%', background: statusColors[ev.status] || '#6b7280' }} />
                          ))}
                          {dayEvents.length > 3 && <span style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 600 }}>+</span>}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Selected day panel */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selKey || 'none'}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {selDate ? (
                    <div style={{
                      padding: 28,
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border)',
                      background: 'var(--white)',
                      position: 'sticky',
                      top: 100,
                    }}>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                        {selDate.toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                      <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 20 }}>
                        {MONTHS[selDate.getMonth()]} {selDate.getDate()}, {selDate.getFullYear()}
                      </h3>

                      {dayEvents.length === 0 ? (
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', padding: '12px 0' }}>No events on this day.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {dayEvents.map((ev) => (
                            <Link
                              key={ev.id}
                              href={`/events/${ev.id}`}
                              style={{
                                display: 'block',
                                padding: '16px 18px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                textDecoration: 'none',
                                transition: 'all 0.15s',
                              }}
                              className="cal-event-card"
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 20 }}>{typeIcons[ev.type] || '📌'}</span>
                                <div>
                                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>{ev.title}</p>
                                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{ev.venue}</p>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: `${statusColors[ev.status]}16`, color: statusColors[ev.status], fontSize: 10, fontWeight: 600, textTransform: 'capitalize' }}>
                                  {ev.status}
                                </span>
                                {ev.status === 'upcoming' && (
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                    <Countdown targetDate={ev.startDate} size="sm" />
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: 28, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--white)' }}>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Select a day to see events.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .cal-nav-btn:hover { background: var(--gray-100) !important; border-color: var(--gray-400) !important; color: var(--text) !important; }
        .cal-today-btn:hover { border-color: var(--gray-400) !important; }
        .cal-today-btn:not(.cal-today-btn-active):hover { background: var(--gray-50) !important; }
        .cal-day:hover { background: var(--gray-50) !important; border-color: var(--gray-300) !important; }
        .cal-event-card:hover { border-color: var(--gray-400) !important; background: var(--gray-50) !important; transform: translateY(-1px); }
        @media (max-width: 768px) {
          .cal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
