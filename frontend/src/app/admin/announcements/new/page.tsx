'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { announcementService, eventService } from '@/services';
import type { Event, Announcement } from '@/types';

const priorityColors: Record<string, { bg: string; badge: string }> = {
  low: { bg: 'var(--gray-50)', badge: '#6b7280' },
  medium: { bg: '#eff6ff', badge: '#2563eb' },
  high: { bg: '#fff7ed', badge: '#ea580c' },
  urgent: { bg: '#fef2f2', badge: '#dc2626' },
};

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<string>('low');
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    eventService.getAll().then((res) => {
      if (res.success && res.data) setEvents(res.data);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError('Title is required'); return; }
    if (!content.trim()) { setError('Content is required'); return; }
    setSubmitting(true);
    try {
      const res = await announcementService.create({
        title: title.trim(),
        content: content.trim(),
        priority: priority as Announcement['priority'],
        eventId: eventId || undefined,
      } as any);
      if (res.success) {
        router.push('/announcements');
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
            className="ca-back"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to dashboard
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500, background: 'var(--white)' }}>
              Admin
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 16 }}>
              Post announcement
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Send an update to the school community. Choose a priority level and optionally link it to an event.
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

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Schedule change for Friday"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                className="ca-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your announcement here..."
                rows={5}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical', fontFamily: 'inherit' }}
                className="ca-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ca-grid">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Priority</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['low', 'medium', 'high', 'urgent'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${priority === p ? priorityColors[p].badge : 'var(--border)'}`,
                        background: priority === p ? priorityColors[p].bg : 'var(--bg)',
                        color: priority === p ? priorityColors[p].badge : 'var(--text-secondary)',
                        fontSize: 11,
                        fontWeight: priority === p ? 600 : 450,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s',
                      }}
                      className="ca-prio"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Linked event (optional)</label>
                <select value={eventId} onChange={(e) => setEventId(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}
                  className="ca-input"
                >
                  <option value="">No event</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <Link
                href="/admin"
                style={{ padding: '12px 28px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 500, fontSize: 14, transition: 'all 0.2s' }}
                className="ca-cancel"
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
                {submitting ? 'Posting…' : 'Post announcement'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </section>

      <style>{`
        .ca-input:focus { border-color: var(--black) !important; }
        .ca-back:hover { color: var(--text) !important; }
        .ca-cancel:hover { background: var(--gray-50) !important; border-color: var(--gray-400) !important; }
        .ca-prio:hover { border-color: var(--gray-400) !important; }
        @media (max-width: 600px) {
          .ca-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
