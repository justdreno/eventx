'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('eventx_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          localStorage.removeItem('eventx_token');
        }
      })
      .catch(() => {
        localStorage.removeItem('eventx_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const res = await authService.login({ email, password });
        if (res.success && res.data) {
          localStorage.setItem('eventx_token', res.data.token);
          setUser(res.data.user);
          router.push('/events');
        }
      } catch (err) {
        setError((err as Error).message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, role: User['role']) => {
      setError(null);
      setLoading(true);
      try {
        const res = await authService.register({ name, email, password, role });
        if (res.success && res.data) {
          localStorage.setItem('eventx_token', res.data.token);
          setUser(res.data.user);
          router.push('/events');
        }
      } catch (err) {
        setError((err as Error).message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('eventx_token');
    setUser(null);
    router.push('/');
  }, [router]);

  return { user, loading, error, login, register, logout, isAuthenticated: !!user };
}
