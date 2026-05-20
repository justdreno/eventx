'use client';

import { lazy, Suspense } from 'react';
import { PageSkeleton } from '@/components/ui';

const Hero = lazy(() => import('@/components/landing/hero').then((m) => ({ default: m.Hero })));
const StatsTicker = lazy(() => import('@/components/landing/stats-ticker').then((m) => ({ default: m.StatsTicker })));
const Features = lazy(() => import('@/components/landing/features').then((m) => ({ default: m.Features })));
const HowItWorks = lazy(() => import('@/components/landing/how-it-works').then((m) => ({ default: m.HowItWorks })));
const CTA = lazy(() => import('@/components/landing/cta').then((m) => ({ default: m.CTA })));

function SectionFallback() {
  return (
    <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PageSkeleton />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<PageSkeleton />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<div style={{ height: 80 }} />}>
        <StatsTicker />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Features />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CTA />
      </Suspense>
    </>
  );
}
