'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Select from '@/components/ui/select';
import { eventService } from '@/services';
import type { Event } from '@/types';

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
      let coverImage: string | undefined;
      if (imageFile) {
        const url = await eventService.uploadImage(imageFile);
        if (url) coverImage = url;
      }
      const res = await eventService.create({
        title: title.trim(),
        description: description.trim(),
        type,
        venue: venue.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
        coverImage,
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
      <section style={{ padding: '48px 32px 60px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Cover image</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="ce-upload-btn"
                  >
                    Choose image
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                  {imagePreview && (
                    <div style={{ position: 'relative', width: 100, height: 64, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {!imagePreview && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Optional. Upload a cover photo for the event.</span>}
                </div>
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
        .ce-cancel:hover { background: var(--gray-50) !important; border-color: var(--gray-400) !important; }
        .ce-upload-btn:hover { background: var(--gray-50) !important; border-color: var(--gray-400) !important; }
        @media (max-width: 600px) {
          .ce-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
