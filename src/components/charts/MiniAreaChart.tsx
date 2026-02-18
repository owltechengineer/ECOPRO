'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface MiniAreaChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export default function MiniAreaChart({ data, color = '#3b82f6', height = 80 }: MiniAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" hide />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          formatter={(val) => [`€${Number(val).toLocaleString('it-IT')}`, 'Valore']}
        />
        <Area type="monotone" dataKey="value" stroke={color} fill={`url(#grad-${color.replace('#', '')})`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
