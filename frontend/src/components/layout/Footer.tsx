import Link from 'next/link';

export function Footer() {
  return (
    <footer
      data-testid="site-footer"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 32px',
        background: 'var(--white)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          maxWidth: 1280,
          margin: '0 auto',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.04em' }}>
            Event<span style={{ fontWeight: 300 }}>X</span>
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          <Link
            href="/events"
            style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s' }}
            className="footer-min-link"
          >
            Events
          </Link>
          <Link
            href="/announcements"
            style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s' }}
            className="footer-min-link"
          >
            Announcements
          </Link>
        </div>
      </div>

      <style>{`
        .footer-min-link:hover {
          color: var(--text) !important;
        }
      `}</style>
    </footer>
  );
}
