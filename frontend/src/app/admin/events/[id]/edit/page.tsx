'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Select from '@/components/ui/select';
import { eventService } from '@/services';
import type { Event } from '@/types';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Event['type']>('other');
  const [venue, setVenue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<Event['status']>('upcoming');

  useEffect(() => {
    eventService.getById(id).then((res) => {
      if (res.success && res.data) {
        const e = res.data;
        setTitle(e.title);
        setDescription(e.description);
        setType(e.type);
        setVenue(e.venue);
        setStartDate(new Date(e.startDate).toISOString().slice(0, 16));
        setEndDate(new Date(e.endDate).toISOString().slice(0, 16));
        setStatus(e.status);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError('Title is required'); return; }
    if (!description.trim()) { setError('Description is required'); return; }
    if (!venue.trim()) { setError('Venue is required'); return; }
    setSubmitting(true);
    try {
      const res = await eventService.update(id, {
        title: title.trim(),
        description: description.trim(),
        type,
        venue: venue.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
      } as any);
      if (res.success) {
        router.push(`/events/${id}`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await eventService.delete(id);
      router.push('/events');
    } catch (err) {
      setError((err as Error).message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '48px 32px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ height: 24, width: 200, borderRadius: 8, background: 'var(--gray-100)', marginBottom: 24 }} />
        <div style={{ height: 36, width: 300, borderRadius: 8, background: 'var(--gray-100)', marginBottom: 32 }} />
        <div style={{ height: 400, borderRadius: 'var(--radius-lg)', background: 'var(--gray-100)' }} />
      </div>
    );
  }

  return (
    <div>
      <section style={{ padding: '48px 32px 60px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 16 }}>
              Edit event
            </h1>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ee-grid">
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="ee-input"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical', fontFamily: 'inherit' }}
                  className="ee-input"
                />
              </div>

              <div>
                <Select label="Type" value={type} onChange={(v) => setType(v as Event['type'])}
                  options={[
                    { value: 'debate', label: 'Debate' },
                    { value: 'sports', label: 'Sports' },
                    { value: 'exhibition', label: 'Exhibition' },
                    { value: 'cultural', label: 'Cultural' },
                    { value: 'academic', label: 'Academic' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </div>

              <div>
                <Select label="Status" value={status} onChange={(v) => setStatus(v as Event['status'])}
                  options={[
                    { value: 'upcoming', label: 'Upcoming' },
                    { value: 'ongoing', label: 'Ongoing' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Venue</label>
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="ee-input"
                />
              </div>

              <div></div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Start date</label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="ee-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>End date</label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                  className="ee-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
              <motion.button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                whileHover={{ scale: deleting ? 1 : 1.01 }}
                whileTap={{ scale: deleting ? 1 : 0.99 }}
                style={{ padding: '12px 24px', borderRadius: 'var(--radius-full)', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', fontWeight: 500, fontSize: 14, cursor: deleting ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                className="ee-delete"
              >
                {deleting ? 'Deleting…' : 'Delete event'}
              </motion.button>

              <div style={{ display: 'flex', gap: 12 }}>
                <Link
                  href={`/events/${id}`}
                  style={{ padding: '12px 28px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 500, fontSize: 14, transition: 'all 0.2s' }}
                  className="ee-cancel"
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
                  {submitting ? 'Saving…' : 'Save changes'}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </section>

      <style>{`
        .ee-input:focus { border-color: var(--black) !important; }
        .ee-cancel:hover { background: var(--gray-50) !important; border-color: var(--gray-400) !important; }
        .ee-delete:hover { background: #fee2e2 !important; border-color: #fca5a5 !important; }
        @media (max-width: 600px) {
          .ee-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
