'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim()) { setFormError('Email is required'); return; }
    if (!password) { setFormError('Password is required'); return; }
    try {
      await login(email, password);
    } catch {
      setFormError('Invalid email or password.');
    }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: '100%', maxWidth: 380 }}
      >
        <div style={{ marginBottom: 36 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s' }} className="bl">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to home
          </Link>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6, color: 'var(--text)' }}>
          Sign in
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.5 }}>
          Enter your email and password to access your account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {(formError || error) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="login-error"
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, lineHeight: 1.5 }}
            >
              {formError || error}
            </motion.div>
          )}

          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email-input" placeholder="you@school.edu"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
              className="fi"
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password-input" placeholder="Enter your password"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
              className="fi"
            />
          </div>

          <motion.button type="submit" disabled={loading} data-testid="login-submit-btn"
            whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
            style={{ padding: '12px 0', borderRadius: 'var(--radius-full)', background: loading ? 'var(--gray-400)' : 'var(--black)', color: 'var(--white)', fontWeight: 600, fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '-0.01em', transition: 'background 0.2s' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--text)', fontWeight: 600 }} className="al">Create one</Link>
        </p>
      </motion.div>

      <style>{`.fi:focus { border-color: var(--black) !important; } .al:hover { text-decoration: underline; } .bl:hover { color: var(--text) !important; }`}</style>
    </div>
  );
}
