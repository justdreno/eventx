'use client';

import { useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart as RechartsBar,
    Bar,
    Legend,
} from 'recharts';

/* ─── shared palette ─── */
const PALETTE = [
    '#6366f1', // indigo
    '#f97316', // orange
    '#10b981', // emerald
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#eab308', // yellow
    '#14b8a6', // teal
    '#f43f5e', // rose
];

interface ChartItem {
    label: string;
    value: number;
    color?: string;
}

/* ─────────────────────────────────────────
   DONUT CHART
   ───────────────────────────────────────── */

interface DonutProps {
    data: ChartItem[];
    size?: number;
    innerRadius?: number;
    outerRadius?: number;
}

function DonutLabel({ viewBox, total }: { viewBox?: { cx: number; cy: number }; total: number }) {
    if (!viewBox) return null;
    const { cx, cy } = viewBox;
    return (
        <g>
            <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 28, fontWeight: 700, fill: 'var(--text)' }}>
                {total}
            </text>
            <text x={cx} y={cy + 18} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 500, fill: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Total
            </text>
        </g>
    );
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
        <div style={{
            background: 'var(--gray-900)',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: 'none',
        }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.payload.fill, flexShrink: 0 }} />
            <span>{item.name}</span>
            <span style={{ fontWeight: 700 }}>{item.value}</span>
        </div>
    );
};

export function DonutChart({ data, size = 260, innerRadius = 72, outerRadius = 110 }: DonutProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const total = data.reduce((s, d) => s + d.value, 0);
    const chartData = data.map((d, i) => ({
        name: d.label,
        value: d.value,
        fill: d.color || PALETTE[i % PALETTE.length],
    }));

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <div data-testid="donut-chart-visual" style={{ width: size, height: size, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={innerRadius}
                            outerRadius={activeIndex !== null ? outerRadius + 6 : outerRadius}
                            paddingAngle={3}
                            cornerRadius={6}
                            stroke="none"
                            animationBegin={0}
                            animationDuration={900}
                            onMouseEnter={(_, i) => setActiveIndex(i)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            {chartData.map((entry, i) => (
                                <Cell
                                    key={entry.name}
                                    fill={entry.fill}
                                    opacity={activeIndex !== null && activeIndex !== i ? 0.4 : 1}
                                    style={{ transition: 'opacity 0.25s ease, transform 0.25s ease', cursor: 'pointer' }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        {/* center label */}
                        <text x="50%" y="44%" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 28, fontWeight: 700, fill: 'var(--text)' }}>
                            {total}
                        </text>
                        <text x="50%" y="56%" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 500, fill: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                            TOTAL
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div data-testid="donut-chart-legend" style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
                {chartData.map((item, i) => {
                    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                    return (
                        <div
                            key={item.name}
                            data-testid={`donut-legend-${i}`}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseLeave={() => setActiveIndex(null)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '6px 10px',
                                borderRadius: 8,
                                background: activeIndex === i ? 'var(--gray-100)' : 'transparent',
                                transition: 'background 0.2s',
                                cursor: 'pointer',
                            }}
                        >
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: item.fill, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, flex: 1, textTransform: 'capitalize' }}>{item.name}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{item.value}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>{pct}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   GRADIENT AREA CHART
   ───────────────────────────────────────── */

interface AreaChartProps {
    data: ChartItem[];
    color?: string;
    height?: number;
}

const AreaTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--gray-900)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 10,
            fontSize: 13,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            border: 'none',
        }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
            <div style={{ fontWeight: 400, opacity: 0.85 }}>{payload[0].value} registrations</div>
        </div>
    );
};

export function GradientAreaChart({ data, color = '#6366f1', height = 240 }: AreaChartProps) {
    const chartData = data.map((d) => ({ name: d.label, value: d.value }));
    const gradientId = `areaGrad-${color.replace('#', '')}`;

    return (
        <div data-testid="gradient-area-chart" style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={chartData} margin={{ top: 12, right: 12, bottom: 0, left: -16 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--gray-100)" strokeDasharray="4 4" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip content={<AreaTooltip />} cursor={{ stroke: color, strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2.5}
                        fill={`url(#${gradientId})`}
                        dot={{ r: 4, fill: '#fff', stroke: color, strokeWidth: 2.5 }}
                        activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 3 }}
                        animationDuration={1200}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

/* ─────────────────────────────────────────
   ENHANCED HORIZONTAL BAR
   ───────────────────────────────────────── */

interface HBarProps {
    data: ChartItem[];
    height?: number;
    barColor?: string;
}

export function EnhancedHorizontalBar({ data, barColor }: HBarProps) {
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div data-testid="enhanced-horizontal-bar" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.map((item, i) => {
                const pct = (item.value / max) * 100;
                const color = item.color || barColor || PALETTE[i % PALETTE.length];
                return (
                    <div key={item.label} data-testid={`hbar-item-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text)',
                  maxWidth: '70%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: color }}>{item.value}</span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: 8,
                            borderRadius: 99,
                            background: 'var(--gray-100)',
                            overflow: 'hidden',
                        }}>
                            <div
                                style={{
                                    width: `${pct}%`,
                                    height: '100%',
                                    borderRadius: 99,
                                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                                    transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────
   STATUS DONUT (small variant for status)
   ───────────────────────────────────────── */

interface StatusDonutProps {
    data: { status: string; count: number; color: string }[];
}

export function StatusDonut({ data }: StatusDonutProps) {
    const chartItems = data.map((d) => ({
        label: d.status,
        value: d.count,
        color: d.color,
    }));
    return <DonutChart data={chartItems} size={200} innerRadius={56} outerRadius={84} />;
}
