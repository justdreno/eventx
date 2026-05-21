'use client';

import { BarChart as RechartsBar, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartItem {
  label: string;
  value: number;
  color?: string;
}

const barColors = ['#2563eb', '#16a34a', '#7c3aed', '#ea580c', '#6b7280', '#dc2626', '#0891b2', '#ca8a04'];

export function BarChart({ data }: { data: ChartItem[] }) {
  const chartData = data.map((d) => ({ name: d.label, value: d.value }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsBar data={chartData} margin={{ top: 20, right: 12, bottom: 4, left: -12 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'var(--gray-50)' }}
          contentStyle={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
          labelStyle={{ fontWeight: 600, color: 'var(--text)' }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={44}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={data[i]?.color || barColors[i % barColors.length]} />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  );
}

export function HorizontalBar({ data }: { data: ChartItem[] }) {
  const chartData = data.map((d) => ({ name: d.label, value: d.value }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 36 + 20, 80)}>
      <RechartsBar data={chartData} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 100 }}>
        <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--text)' }} axisLine={false} tickLine={false} width={96} />
        <Tooltip
          cursor={{ fill: 'var(--gray-50)' }}
          contentStyle={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
          labelStyle={{ fontWeight: 600, color: 'var(--text)' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={data[i]?.color || barColors[i % barColors.length]} />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  );
}
