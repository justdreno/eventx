'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
  },
  {
    label: 'Announcements',
    href: '/admin/announcements/new',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
    ),
  },
  {
    label: 'Check-in',
    href: '/admin/checkin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
  },
  {
    label: 'Registrations',
    href: '/admin/registrations',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M16 15h2"/><path d="M16 19h2"/><path d="M6 15h2"/><path d="M6 19h2"/>
      </svg>
    ),
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Live updates',
    href: '/admin/live-updates',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'teacher';

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--black)', animation: 'admin-spin 0.6s linear infinite' }} />
        <style>{`@keyframes admin-spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const sidebarW = collapsed ? 64 : 240;

  return (
    <div className={mobileOpen ? 'admin-mobile-open' : ''} style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          background: 'var(--white)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 24px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {!collapsed && (
            <Link href="/admin" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', textDecoration: 'none' }}>
              EventX
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', textDecoration: 'none' }}>
              X
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            className="admin-collapse-btn"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.svg
              animate={{ rotate: collapsed ? 180 : 0 }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>
            </motion.svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? '12px 0' : '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '12px 0' : '10px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--gray-100)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 450,
                  fontSize: 14,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                className="admin-nav-item"
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {!collapsed && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.3)' }}
        />
      )}

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 90,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--black)',
          color: 'var(--white)',
          border: 'none',
          cursor: 'pointer',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}
        className="admin-mobile-toggle"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/>
        </svg>
      </button>

      {/* Main content */}
      <div style={{ marginLeft: sidebarW, flex: 1, minWidth: 0, transition: 'margin-left 0.25s ease-in-out', width: '100%' }}>
        {children}
      </div>

      <style>{`
        .admin-sidebar {
          scrollbar-width: thin;
          scrollbar-color: var(--gray-200) transparent;
        }
        .admin-sidebar::-webkit-scrollbar { width: 3px; }
        .admin-sidebar::-webkit-scrollbar-thumb { background: var(--gray-300); border-radius: 2px; }
        .admin-nav-item:hover { background: var(--gray-50) !important; color: var(--text) !important; }
        .admin-collapse-btn:hover { color: var(--text) !important; }
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none;
          }
          .admin-mobile-toggle {
            display: flex !important;
          }
          .admin-mobile-open .admin-sidebar {
            display: flex !important;
            width: 280px !important;
          }
        }
      `}</style>
    </div>
  );
}
