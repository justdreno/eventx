'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/ui/page-transition';

export default function AuthAwareLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isAdminPage = pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      <Footer />
    </>
  );
}
