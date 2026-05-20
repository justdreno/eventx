'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks';
import type { User } from '@/types';

const roles: { value: User['role']; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'parent', label: 'Parent' },
  { value: 'admin', label: 'Admin' },
];

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('student');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) { setFormError('Name is required'); return; }
    if (!email.trim()) { setFormError('Email is required'); return; }
    if (!password || password.length < 6) { setFormError('Password must be at least 6 characters'); return; }
    try {
      await register(name, email, password, role);
    } catch {
      setFormError('Registration failed. Please try again.');
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
          Create an account
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.5 }}>
          Join EventX to manage and attend school events.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {(formError || error) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="register-error"
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, lineHeight: 1.5 }}
            >
              {formError || error}
            </motion.div>
          )}

          <div>
            <label htmlFor="name" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Full name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} data-testid="register-name-input" placeholder="Jane Smith"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
              className="fi"
            />
          </div>

          <div>
            <label htmlFor="reg-email" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Email</label>
            <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="register-email-input" placeholder="you@school.edu"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
              className="fi"
            />
          </div>

          <div>
            <label htmlFor="reg-password" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>Password</label>
            <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="register-password-input" placeholder="At least 6 characters"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
              className="fi"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>I am a…</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {roles.map((r) => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)} data-testid={`register-role-${r.value}`}
                  style={{ padding: '10px 0', borderRadius: 'var(--radius-md)', border: `1px solid ${role === r.value ? 'var(--black)' : 'var(--border)'}`, background: role === r.value ? 'var(--black)' : 'var(--bg)', color: role === r.value ? 'var(--white)' : 'var(--text-secondary)', fontSize: 13, fontWeight: role === r.value ? 600 : 450, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '-0.01em' }}
                  className="rb"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button type="submit" disabled={loading} data-testid="register-submit-btn"
            whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
            style={{ padding: '12px 0', borderRadius: 'var(--radius-full)', background: loading ? 'var(--gray-400)' : 'var(--black)', color: 'var(--white)', fontWeight: 600, fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '-0.01em', transition: 'background 0.2s', marginTop: 4 }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--text)', fontWeight: 600 }} className="al">Sign in</Link>
        </p>
      </motion.div>

      <style>{`.fi:focus { border-color: var(--black) !important; } .al:hover { text-decoration: underline; } .rb:hover { border-color: var(--gray-400) !important; } .bl:hover { color: var(--text) !important; }`}</style>
    </div>
  );
}
