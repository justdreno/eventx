'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { eventService } from '@/services';
import type { Event } from '@/types';

const eventTypes = ['debate', 'sports', 'exhibition', 'cultural', 'academic', 'other'] as const;
const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;

export default function CreateEventPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Event['type']>('other');
  const [venue, setVenue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<Event['status']>('upcoming');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) { setError('Title is required'); return; }
    if (!description.trim()) { setError('Description is required'); return; }
    if (!venue.trim()) { setError('Venue is required'); return; }
    if (!startDate) { setError('Start date is required'); return; }
    if (!endDate) { setError('End date is required'); return; }
    if (new Date(endDate) < new Date(startDate)) { setError('End date must be after start date'); return; }

    setSubmitting(true);
    try {
      const res = await eventService.create({
        title: title.trim(),
        description: description.trim(),
        type,
        venue: venue.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
      });
      if (res.success && res.data) {
        router.push(`/events/${res.data.id}`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section style={{ padding: '140px 32px 60px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <Link
            href="/admin"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, transition: 'color 0.2s' }}
            className="ce-back"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to dashboard
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500, background: 'var(--white)' }}>
              Admin
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 16 }}>
              Create event
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Fill in the details below to add a new event to the school calendar.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '48px 32px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ maxWidth: 680, margin: '0 auto' }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, lineHeight: 1.5 }}
              >
                {error}
              </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ce-grid">
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Spring Music Fest 2026"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="ce-input"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell attendees what to expect..."
                  rows={5}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical', fontFamily: 'inherit' }}
                  className="ce-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as Event['type'])}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}
                  className="ce-input"
                >
                  {eventTypes.map((t) => (
                    <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as Event['status'])}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}
                  className="ce-input"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Venue</label>
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Main Auditorium"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="ce-input"
                />
              </div>

              <div></div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Start date</label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="ce-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>End date</label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="ce-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <Link
                href="/admin"
                style={{ padding: '12px 28px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 500, fontSize: 14, transition: 'all 0.2s' }}
                className="ce-cancel"
              >
                Cancel
              </Link>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.01 }}
                whileTap={{ scale: submitting ? 1 : 0.99 }}
                style={{ padding: '12px 32px', borderRadius: 'var(--radius-full)', background: submitting ? 'var(--gray-400)' : 'var(--black)', color: 'var(--white)', fontWeight: 600, fontSize: 14, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', letterSpacing: '-0.01em', transition: 'background 0.2s' }}
              >
                {submitting ? 'Creating…' : 'Create event'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </section>

      <style>{`
        .ce-input:focus { border-color: var(--black) !important; }
        .ce-back:hover { color: var(--text) !important; }
        .ce-cancel:hover { background: var(--gray-50) !important; border-color: var(--gray-400) !important; }
        @media (max-width: 600px) {
          .ce-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
