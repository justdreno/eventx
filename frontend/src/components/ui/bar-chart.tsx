'use client';

interface ChartItem {
  label: string;
  value: number;
  color?: string;
}

export function BarChart({ data, height = 240 }: { data: ChartItem[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barCount = data.length;
  const barW = Math.min(48, Math.max(32, (700 - 80) / barCount - 16));
  const padL = 40;
  const padR = 16;
  const padB = 32;
  const padT = 24;
  const chartW = barCount * (barW + 12) + padL + padR;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${Math.max(chartW, 320)} ${height}`} style={{ display: 'block' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = padT + (height - padT - padB) * (1 - frac);
        return (
          <g key={frac}>
            <line x1={padL} y1={y} x2={Math.max(chartW, 320) - padR} y2={y} stroke="var(--border)" strokeWidth="1" />
            <text x={padL - 8} y={y + 4} textAnchor="end" fill="var(--text-muted)" fontSize="12">{Math.round(max * frac)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = padL + i * (barW + 12) + 6;
        const barH = Math.max((d.value / max) * (height - padT - padB), 2);
        const y = height - padB - barH;
        return (
          <g key={d.label}>
            {d.value > 0 && (
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="var(--text)" fontSize="13" fontWeight="700">
                {d.value}
              </text>
            )}
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={d.color || 'var(--gray-400)'}>
              <title>{d.label}: {d.value}</title>
            </rect>
            <text x={x + barW / 2} y={height - 6} textAnchor="middle" fill="var(--text-secondary)" fontSize="12" fontWeight="500">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function HorizontalBar({ data }: { data: ChartItem[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const rowH = 36;
  const innerH = data.length * rowH + 12;

  return (
    <svg width="100%" height={Math.max(innerH, 80)} viewBox={`0 0 500 ${Math.max(innerH, 80)}`} style={{ display: 'block' }}>
      {data.map((d, i) => {
        const barW = Math.max((d.value / max) * 300, d.value > 0 ? 20 : 0);
        const y = 8 + i * rowH;
        return (
          <g key={d.label}>
            <rect x="140" y={y} width={barW} height={24} rx="4" fill={d.color || 'var(--gray-400)'}>
              <title>{d.label}: {d.value}</title>
            </rect>
            <text x="132" y={y + 17} textAnchor="end" fill="var(--text)" fontSize="13" fontWeight="500">{d.label}</text>
            <text x={140 + barW + 10} y={y + 17} fill="var(--text)" fontSize="13" fontWeight="700">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}
