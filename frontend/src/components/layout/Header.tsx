'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks';

const navLinks = [
  { label: 'Events', href: '/events' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#phases' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 32px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
      }}
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 1280,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          data-testid="logo-link"
          style={{
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: '-0.04em',
            color: 'var(--text)',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          Event<span style={{ fontWeight: 300 }}>X</span>
          <span style={{
            fontSize: 9,
            fontWeight: 500,
            background: 'var(--gray-100)',
            color: 'var(--gray-500)',
            padding: '2px 6px',
            borderRadius: 4,
            marginLeft: 6,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            v2
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
          }}
          className="nav-desktop"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                fontWeight: 450,
                letterSpacing: '-0.01em',
                padding: '6px 0',
                transition: 'color 0.2s',
                position: 'relative',
              }}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          className="nav-desktop"
        >
          {isAuthenticated ? (
            <>
              <Link
                href="/my-registrations"
                data-testid="nav-my-registrations"
                style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  fontWeight: 450,
                  padding: '8px 16px',
                  transition: 'color 0.2s',
                }}
                className="nav-link"
              >
                My registrations
              </Link>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', padding: '0 4px' }}>{user?.name}</span>
              <button
                onClick={logout}
                data-testid="nav-signout-btn"
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '-0.01em',
                }}
                className="nav-signout"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                data-testid="nav-signin-link"
                style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  fontWeight: 450,
                  padding: '8px 16px',
                  transition: 'color 0.2s',
                }}
                className="nav-link"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                data-testid="nav-get-started-btn"
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--black)',
                  color: 'var(--white)',
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: '-0.01em',
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                className="nav-cta"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          data-testid="mobile-menu-toggle"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            padding: 6,
            display: 'none',
          }}
          className="nav-hamburger"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'fixed',
              top: 72,
              left: 0,
              right: 0,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)',
              padding: '8px 24px 24px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: '16px 0',
                    fontSize: 16,
                    color: 'var(--text)',
                    fontWeight: 500,
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <Link
                    href="/my-registrations"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      padding: '14px 0',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--black)',
                      color: 'var(--white)',
                      fontWeight: 600,
                      fontSize: 15,
                      textAlign: 'center',
                    }}
                  >
                    My registrations
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    style={{
                      flex: 1,
                      padding: '14px 0',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontWeight: 500,
                      fontSize: 15,
                      textAlign: 'center',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      padding: '14px 0',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontWeight: 500,
                      fontSize: 15,
                      textAlign: 'center',
                    }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      padding: '14px 0',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--black)',
                      color: 'var(--white)',
                      fontWeight: 600,
                      fontSize: 15,
                      textAlign: 'center',
                    }}
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-link:hover {
          color: var(--text) !important;
        }
        .nav-cta:hover {
          opacity: 0.85 !important;
          transform: translateY(-1px);
        }
        .nav-signout:hover {
          border-color: var(--gray-400) !important;
          color: var(--text) !important;
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
