'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { registrationService } from '@/services';
import type { Registration } from '@/types';

export default function CheckinPage() {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Registration | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!qrCode.trim()) { setError('Enter or scan a QR code'); return; }
    setLoading(true);
    try {
      const res = await registrationService.checkInByQr(qrCode.trim());
      if (res.success && res.data) {
        setResult(res.data);
        setQrCode('');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section style={{ padding: '48px 32px 60px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 16 }}>
              Check-in
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Scan or enter the QR code from the attendee&apos;s ticket to mark them present.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '48px 32px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Paste or scan QR code…"
              autoFocus
              style={{
                flex: 1,
                padding: '13px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: 15,
                background: 'var(--bg)',
                color: 'var(--text)',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace',
              }}
              className="ci-input"
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              style={{
                padding: '13px 28px',
                borderRadius: 'var(--radius-md)',
                background: loading ? 'var(--gray-400)' : 'var(--black)',
                color: 'var(--white)',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Checking…' : 'Check in'}
            </motion.button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{ marginTop: 16, padding: '14px 18px', borderRadius: 'var(--radius-md)', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 14, lineHeight: 1.5 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginTop: 24,
                  padding: 28,
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #bbf7d0',
                  background: '#f0fdf4',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#166534', letterSpacing: '-0.01em', marginBottom: 4 }}>Checked in!</h3>
                <p style={{ fontSize: 15, color: '#15803d', fontWeight: 500 }}>{(result as any).user?.name || 'Attendee'}</p>
                <p style={{ fontSize: 13, color: '#16a34a', marginTop: 4 }}>{(result as any).event?.title || 'Event'}</p>
                <button
                  onClick={() => setResult(null)}
                  style={{ marginTop: 20, padding: '8px 24px', borderRadius: 'var(--radius-full)', border: '1px solid #bbf7d0', background: 'transparent', color: '#15803d', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}
                >
                  Check in another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <style>{`
        .ci-input:focus { border-color: var(--black) !important; }
      `}</style>
    </div>
  );
}
