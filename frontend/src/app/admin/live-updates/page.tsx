'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Select from '@/components/ui/select';
import { adminService, liveUpdateService, eventService } from '@/services';
import type { AdminLiveUpdate, Event } from '@/types';

const typeColors: Record<string, string> = {
  announcement: '#6b7280',
  score: '#2563eb',
  highlight: '#ea580c',
  photo: '#16a34a',
};

export default function AdminLiveUpdatesPage() {
  const [updates, setUpdates] = useState<AdminLiveUpdate[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [eventId, setEventId] = useState('');
  const [type, setType] = useState('announcement');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const fetchUpdates = () => {
    setLoading(true);
    adminService.getLiveUpdates().then((res) => {
      if (res.success && res.data) setUpdates(res.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUpdates(); }, []);
  useEffect(() => {
    eventService.getAll().then((res) => {
      if (res.success && res.data) setEvents(res.data);
    });
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!eventId) { setError('Select an event'); return; }
    if (!content.trim()) { setError('Content is required'); return; }
    setSubmitting(true);
    try {
      const res = await liveUpdateService.create({
        eventId,
        type,
        content: content.trim(),
        mediaUrl: mediaUrl.trim() || undefined,
      } as any);
      if (res.success) {
        setContent('');
        setMediaUrl('');
        fetchUpdates();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await adminService.deleteLiveUpdate(id);
      setUpdates((prev) => prev.filter((u) => u.id !== id));
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
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 8 }}>
              Live updates
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
              {updates.length} update{updates.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '32px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              padding: 28,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              background: 'var(--white)',
              marginBottom: 32,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 20 }}>
              New live update
            </h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, lineHeight: 1.5 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="alu-grid">
                <div>
                  <Select label="Event" value={eventId} onChange={setEventId}
                    placeholder="Select an event"
                    options={events.map((ev) => ({ value: ev.id, label: ev.title }))}
                  />
                </div>
                <div>
                  <Select label="Type" value={type} onChange={setType}
                    options={[
                      { value: 'announcement', label: 'Announcement' },
                      { value: 'score', label: 'Score' },
                      { value: 'highlight', label: 'Highlight' },
                      { value: 'photo', label: 'Photo' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="What's happening?"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical', fontFamily: 'inherit' }}
                  className="alu-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Media URL (optional)</label>
                <input type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://..."
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="alu-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.99 }}
                  style={{ padding: '11px 28px', borderRadius: 'var(--radius-full)', background: submitting ? 'var(--gray-400)' : 'var(--black)', color: 'var(--white)', fontWeight: 600, fontSize: 14, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', letterSpacing: '-0.01em', transition: 'background 0.2s' }}
                >
                  {submitting ? 'Posting…' : 'Post update'}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* List */}
          <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Event</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Content</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Time</th>
                    <th style={{ textAlign: 'right', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 48, textAlign: 'center' }}>
                        <div style={{ display: 'inline-block', width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--black)', animation: 'alu-spin 0.6s linear infinite' }} />
                      </td>
                    </tr>
                  ) : updates.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '48px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                        No live updates yet.
                      </td>
                    </tr>
                  ) : (
                    updates.map((u, i) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
                        className="alu-row"
                      >
                        <td style={{ padding: '14px 18px' }}>
                          <Link href={`/events/${u.eventId}`} style={{ color: 'var(--text)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }} className="alu-event">
                            {u.event?.title || '—'}
                          </Link>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            background: `${typeColors[u.type] || '#6b7280'}16`,
                            color: typeColors[u.type] || '#6b7280',
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}>
                            {u.type}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.content}
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 12, whiteSpace: 'nowrap' }}>
                          {new Date(u.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          <span style={{ color: 'var(--text-muted)' }}> {new Date(u.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={deleting === u.id}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid #fecaca',
                              background: deleting === u.id ? '#fef2f2' : 'transparent',
                              color: deleting === u.id ? '#991b1b' : '#dc2626',
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: deleting === u.id ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s',
                            }}
                            className="alu-del"
                          >
                            {deleting === u.id ? '…' : 'Delete'}
                          </button>
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
        @keyframes alu-spin { to { transform: rotate(360deg) } }
        .alu-input:focus { border-color: var(--black) !important; }
        .alu-row:hover { background: var(--gray-50) !important; }
        .alu-event:hover { color: var(--black) !important; }
        .alu-del:hover { background: #fef2f2 !important; border-color: #fca5a5 !important; }
        @media (max-width: 600px) {
          .alu-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
