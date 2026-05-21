'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Select from '@/components/ui/select';
import { adminService } from '@/services';
import type { AdminUser } from '@/types';

const roleColors: Record<string, string> = {
  admin: '#dc2626',
  teacher: '#2563eb',
  student: '#16a34a',
  parent: '#ea580c',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    adminService.getUsers().then((res) => {
      if (res.success && res.data) setUsers(res.data);
    }).catch(() => setFetchError('Failed to load users.')).finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await adminService.updateUser(id, { role });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
    } catch (err) {
      setFetchError((err as Error).message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"? All their registrations, events, and announcements will also be removed.`)) return;
    setDeleting(id);
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setFetchError((err as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div>
      <section style={{ padding: '48px 32px 32px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'var(--text)', marginBottom: 8 }}>
                  Users
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                  {users.length} user{users.length !== 1 ? 's' : ''} total
                </p>
              </div>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: 13,
                background: 'var(--bg)',
                color: 'var(--text)',
                outline: 'none',
                minWidth: 240,
                width: '100%',
                maxWidth: 360,
                transition: 'border-color 0.2s',
              }}
              className="au-input"
            />
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '32px 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Role</th>
                    <th style={{ textAlign: 'center', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Events</th>
                    <th style={{ textAlign: 'center', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Registrations</th>
                    <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Joined</th>
                    <th style={{ textAlign: 'right', padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 48, textAlign: 'center' }}>
                        <div style={{ display: 'inline-block', width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--black)', animation: 'au-spin 0.6s linear infinite' }} />
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '48px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                        {search ? 'No users match your search.' : 'No users yet.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: i * 0.02 }}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
                        className="au-row"
                      >
                        <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: '50%', background: 'var(--gray-100)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0,
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500, color: 'var(--text)' }}>{user.name}</span>
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13 }}>{user.email}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ width: 130 }}>
                            <Select
                              value={user.role}
                              onChange={(v) => handleRoleChange(user.id, v)}
                              options={[
                                { value: 'student', label: 'Student' },
                                { value: 'teacher', label: 'Teacher' },
                                { value: 'parent', label: 'Parent' },
                                { value: 'admin', label: 'Admin' },
                              ]}
                            />
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, color: 'var(--text)' }}>{user._count.events}</td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, color: 'var(--text)' }}>{user._count.registrations}</td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={deleting === user.id}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid #fecaca',
                              background: deleting === user.id ? '#fef2f2' : 'transparent',
                              color: deleting === user.id ? '#991b1b' : '#dc2626',
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: deleting === user.id ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s',
                            }}
                            className="au-del"
                          >
                            {deleting === user.id ? '…' : 'Delete'}
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes au-spin { to { transform: rotate(360deg) } }
        .au-input:focus { border-color: var(--black) !important; }
        .au-row:hover { background: var(--gray-50) !important; }
        .au-del:hover { background: #fef2f2 !important; border-color: #fca5a5 !important; }
      `}</style>
    </div>
  );
}
