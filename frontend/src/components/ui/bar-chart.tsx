'use client';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  maxBarWidth?: number;
}

export function BarChart({ data, height = 200, maxBarWidth = 40 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const padL = 28;
  const padR = 12;
  const w = Math.max(data.length * (maxBarWidth + 16) + padL + padR, 300);
  const barW = maxBarWidth;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = height - 20 - (height - 28) * frac;
        return (
          <g key={frac}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--border)" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fill="var(--text-muted)" fontSize="10">
              {Math.round(max * frac)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = padL + i * (barW + 16) + 8;
        const barH = ((d.value / max) * (height - 28));
        const y = height - 20 - barH;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill={d.color || 'var(--gray-400)'} opacity="0.85">
              <title>{d.label}: {d.value}</title>
            </rect>
            <text x={x + barW / 2} y={height - 4} textAnchor="end" fill="var(--text-muted)" fontSize="9" transform={`rotate(-40, ${x + barW / 2}, ${height - 4})`}>
              {d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function HorizontalBar({ data, height: h = 200 }: { data: { label: string; value: number; color?: string }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const rowH = Math.max(Math.min(28, (h - 16) / data.length), 20);
  const innerH = data.length * rowH + 16;

  return (
    <svg width="100%" height={Math.max(innerH, 60)} viewBox={`0 0 400 ${Math.max(innerH, 60)}`} style={{ display: 'block', overflow: 'visible' }}>
      {data.map((d, i) => {
        const barW = (d.value / max) * 260;
        const y = 8 + i * rowH;
        return (
          <g key={d.label}>
            <rect x="110" y={y} width={barW} height={rowH - 6} rx="3" fill={d.color || 'var(--gray-400)'} opacity="0.85">
              <title>{d.label}: {d.value}</title>
            </rect>
            <text x="104" y={y + (rowH - 6) / 2 + 4} textAnchor="end" fill="var(--text)" fontSize="11" fontWeight="500">
              {d.label.length > 16 ? d.label.slice(0, 15) + '…' : d.label}
            </text>
            <text x={110 + barW + 8} y={y + (rowH - 6) / 2 + 4} fill="var(--text-muted)" fontSize="11" fontWeight="600">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
