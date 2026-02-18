'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: Record<string, string | number>[];
  bars: { key: string; color: string; name: string }[];
  xKey?: string;
  height?: number;
  stacked?: boolean;
}

export default function BarChartComponent({ data, bars, xKey = 'label', height = 300, stacked }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {bars.map(bar => (
          <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} radius={[4, 4, 0, 0]} stackId={stacked ? 'stack' : undefined} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
