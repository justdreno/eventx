'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminService } from '@/services';
import { useAuth } from '@/hooks';
import type { AdminStats } from '@/types';

const statusColors: Record<string, string> = {
  upcoming: '#2563eb',
  ongoing: '#16a34a',
  completed: '#6b7280',
  cancelled: '#dc2626',
};

const quickActions = [
  {
    label: 'New Event',
    href: '/admin/events/new',
    desc: 'Create a new school event',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
  },
  {
    label: 'Events',
    href: '/admin/events',
    desc: 'View, edit and manage events',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    label: 'Announcements',
    href: '/admin/announcements/new',
    desc: 'Post an update to everyone',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
    ),
  },
  {
    label: 'Registrations',
    href: '/admin/registrations',
    desc: 'All registrations and check-ins',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M16 15h2"/><path d="M16 19h2"/><path d="M6 15h2"/><path d="M6 19h2"/>
      </svg>
    ),
  },
  {
    label: 'Check-in',
    href: '/admin/checkin',
    desc: 'Check-in attendees by QR',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
  },
  {
    label: 'Users',
    href: '/admin/users',
    desc: 'Manage users and roles',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Live updates',
    href: '/admin/live-updates',
    desc: 'Post and manage live updates',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
    ),
  },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'teacher';

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
      return;
    }
    adminService.getStats().then((res) => {
      if (res.success && res.data) setStats(res.data);
    }).catch(() => setStatsError('Failed to load dashboard data.')).finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div style={{ padding: '48px 32px 60px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ height: 36, width: 280, borderRadius: 8, background: 'var(--gray-100)', marginBottom: 16 }} />
        <div style={{ height: 18, width: 200, borderRadius: 8, background: 'var(--gray-100)', marginBottom: 40 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 120, borderRadius: 'var(--radius-lg)', background: 'var(--gray-100)', animation: 'shimmer 2s infinite linear', backgroundImage: 'linear-gradient(90deg, var(--gray-100) 0%, var(--gray-200) 40%, var(--gray-100) 80%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      </div>
    );
  }

  const statusSummary: Record<string, number> = {};
  stats?.eventsByStatus.forEach((s) => { statusSummary[s.status] = s._count.id; });

  const statCards = [
    { label: 'Total Events', value: stats?.counts.events ?? 0, color: '#2563eb', href: '/admin/events' },
    { label: 'Registrations', value: stats?.counts.registrations ?? 0, color: '#16a34a', href: '/admin/registrations' },
    { label: 'Users', value: stats?.counts.users ?? 0, color: '#ea580c', href: '/admin/users' },
    { label: 'Announcements', value: stats?.counts.announcements ?? 0, color: '#6b7280', href: '/admin/announcements/new' },
    { label: 'Live Updates', value: stats?.counts.liveUpdates ?? 0, color: '#7c3aed', href: '/admin/live-updates' },
  ];

  return (
    <div>
      <section style={{ padding: '48px 32px 60px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 16 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7 }}>
              Welcome back, {user?.name}. Here&apos;s what&apos;s happening across your school.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {statsError && (
            <div style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
              {statsError}
            </div>
          )}
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 48 }}>
              {statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={card.href}
                    style={{
                      display: 'block',
                      padding: '24px 28px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border)',
                      background: 'var(--white)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    className="admin-stat-link"
                  >
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8, letterSpacing: '-0.01em' }}>{card.label}</p>
                    <p style={{ fontSize: 36, fontWeight: 750, letterSpacing: '-0.04em', color: card.color, lineHeight: 1 }}>{card.value}</p>
                  </Link>
                </motion.div>
              ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="admin-grid">
            {/* Recent registrations */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 20 }}>
                Recent registrations
              </h2>
              {stats && stats.recentRegistrations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stats.recentRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                          {reg.user.name}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          {reg.event?.title || 'Unknown event'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {reg.checkedIn ? (
                          <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: '#16a34a', color: '#fff', fontSize: 10, fontWeight: 600 }}>
                            Checked in
                          </span>
                        ) : (
                          <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--gray-100)', color: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}>
                            Pending
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {new Date(reg.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 14, color: 'var(--text-muted)', padding: '24px 0' }}>No registrations yet.</p>
              )}
            </motion.div>

            {/* Quick actions + status summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 20 }}>
                Quick actions
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    style={{
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                    className="admin-action"
                  >
                    <div style={{ color: 'var(--text)' }}>{action.icon}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>{action.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Status breakdown */}
              {Object.keys(statusSummary).length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.01em' }}>
                    Events by status
                  </h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Object.entries(statusSummary).map(([status, count]) => (
                      <div
                        key={status}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          border: `1px solid ${statusColors[status] || 'var(--border)'}`,
                          background: 'var(--bg)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[status] || '#6b7280', display: 'inline-block' }} />
                        <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, textTransform: 'capitalize' }}>{status}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        .admin-action:hover {
          border-color: var(--gray-400) !important;
          background: var(--gray-50) !important;
        }
        .admin-stat-link:hover {
          border-color: var(--gray-400) !important;
          background: var(--gray-50) !important;
        }
        @media (max-width: 768px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
