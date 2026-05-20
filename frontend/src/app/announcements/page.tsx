'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { announcementService } from '@/services';
import type { Announcement } from '@/types';

const priorityColors: Record<string, { bg: string; border: string; badge: string }> = {
  urgent: { bg: '#fef2f2', border: '#fecaca', badge: '#dc2626' },
  high: { bg: '#fff7ed', border: '#fed7aa', badge: '#ea580c' },
  medium: { bg: '#eff6ff', border: '#bfdbfe', badge: '#2563eb' },
  low: { bg: 'var(--gray-50)', border: 'var(--border)', badge: '#6b7280' },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    announcementService
      .getAll()
      .then((res) => {
        if (res.success && res.data) setAnnouncements(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? announcements : announcements.filter((a) => a.priority === filter);

  return (
    <div>
      <section style={{ padding: '140px 32px 60px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500, background: 'var(--white)' }}>
              Updates
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 16 }}>
              Announcements
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7 }}>
              Stay informed with the latest updates from the school administration.
            </p>
          </motion.div>
        </div>
      </section>

      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${filter === p ? 'var(--black)' : 'var(--border)'}`,
                background: filter === p ? 'var(--black)' : 'var(--bg)',
                color: filter === p ? 'var(--white)' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: filter === p ? 600 : 450,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
              className="ann-chip"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <section style={{ padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ height: 120, borderRadius: 'var(--radius-md)', background: 'var(--gray-100)', animation: 'shimmer 2s infinite linear', backgroundImage: 'linear-gradient(90deg, var(--gray-100) 0%, var(--gray-200) 40%, var(--gray-100) 80%)', backgroundSize: '200% 100%' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>No announcements</p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Check back later for updates.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  style={{
                    padding: '20px 24px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${priorityColors[a.priority]?.border || 'var(--border)'}`,
                    background: priorityColors[a.priority]?.bg || 'var(--bg)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: priorityColors[a.priority]?.badge || '#6b7280',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {a.priority}
                    </span>
                    {a.event && (
                      <Link
                        href={`/events/${a.event.id}`}
                        style={{
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                          textDecoration: 'underline',
                          textUnderlineOffset: 2,
                        }}
                      >
                        {a.event.title}
                      </Link>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em' }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {a.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .ann-chip:hover {
          border-color: var(--gray-400) !important;
        }
      `}</style>
    </div>
  );
}
