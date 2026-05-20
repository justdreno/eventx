'use client';

import { type ReactNode } from 'react';

interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  children?: ReactNode;
}

export function Shimmer({
  className,
  width,
  height = 20,
  borderRadius = 8,
  children,
}: ShimmerProps) {
  const baseStyle = {
    width,
    height,
    borderRadius,
  };

  if (children) {
    return (
      <div
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...baseStyle,
        }}
      >
        {children}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(0,0,0,0.03) 50%,
              transparent 100%
            )`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite linear',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        background: `linear-gradient(
          90deg,
          var(--shimmer-base) 0%,
          var(--shimmer-highlight) 40%,
          var(--shimmer-base) 80%
        )`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite linear',
      }}
    />
  );
}

export function PageSkeleton() {
  return (
    <div style={{ padding: '40px 32px', maxWidth: 1280, margin: '0 auto' }}>
      <Shimmer width="60%" height={48} borderRadius={12} />
      <div style={{ height: 24 }} />
      <Shimmer width="80%" height={20} />
      <div style={{ height: 12 }} />
      <Shimmer width="50%" height={20} />
      <div style={{ height: 48 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: 220, borderRadius: 16, overflow: 'hidden' }}>
            <Shimmer width="100%" height="100%" />
          </div>
        ))}
      </div>
    </div>
  );
}
