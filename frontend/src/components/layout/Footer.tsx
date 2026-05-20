import Link from 'next/link';

const footerCols = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#phases' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      data-testid="site-footer"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '72px 32px 36px',
        background: 'var(--white)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 48,
          maxWidth: 1280,
          margin: '0 auto',
        }}
        className="footer-grid"
      >
        {/* Brand */}
        <div>
          <span
            data-testid="footer-logo"
            style={{
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: '-0.04em',
              display: 'block',
              marginBottom: 14,
            }}
          >
            Event<span style={{ fontWeight: 300 }}>X</span>
          </span>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              maxWidth: 260,
            }}
          >
            The unified command center for school events. Built to connect students, teachers, and parents.
          </p>
        </div>

        {/* Link columns */}
        {footerCols.map((col) => (
          <div key={col.title}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 16,
                letterSpacing: '-0.01em',
              }}
            >
              {col.title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="footer-link"
                  style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: '56px auto 0',
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} EventX. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="#" style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s' }} className="footer-link">Privacy</Link>
          <Link href="#" style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s' }} className="footer-link">Terms</Link>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--text) !important;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
