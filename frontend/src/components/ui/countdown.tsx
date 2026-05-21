'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
  size?: 'sm' | 'md' | 'lg';
  onEnd?: () => void;
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function Countdown({ targetDate, size = 'md', onEnd }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(new Date(targetDate)));

  useEffect(() => {
    const timer = setInterval(() => {
      const t = calcTimeLeft(new Date(targetDate));
      setTimeLeft(t);
      if (!t && onEnd) { clearInterval(timer); onEnd(); }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onEnd]);

  if (!timeLeft) return null;

  const units = [
    { label: 'days', value: timeLeft.days },
    { label: 'hrs', value: timeLeft.hours },
    { label: 'min', value: timeLeft.minutes },
    { label: 'sec', value: timeLeft.seconds },
  ];

  const isSm = size === 'sm';
  const numSize = isSm ? 20 : size === 'lg' ? 36 : 28;
  const labelSize = isSm ? 9 : size === 'lg' ? 11 : 10;
  const gap = isSm ? 6 : size === 'lg' ? 16 : 12;

  return (
    <div style={{ display: 'flex', gap, alignItems: 'center' }}>
      {units.map((u, i) => (
        <div key={u.label} style={{ textAlign: 'center', minWidth: isSm ? 28 : size === 'lg' ? 52 : 40 }}>
          <div style={{
            fontSize: numSize,
            fontWeight: 750,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            color: 'inherit',
          }}>
            {String(u.value).padStart(2, '0')}
          </div>
          <div style={{ fontSize: labelSize, color: 'inherit', opacity: 0.55, fontWeight: 500, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {u.label}
          </div>
          {i < units.length - 1 && (
            <span style={{
              position: 'absolute',
              marginLeft: gap / 2,
              marginTop: -numSize * 0.15,
              fontSize: numSize * 0.6,
              fontWeight: 300,
              color: 'inherit',
              opacity: 0.3,
            }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}
