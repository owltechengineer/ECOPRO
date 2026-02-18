'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartProps {
  data: Record<string, string | number>[];
  lines: { key: string; color: string; name: string; dashed?: boolean }[];
  xKey?: string;
  height?: number;
}

export default function LineChartComponent({ data, lines, xKey = 'label', height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {lines.map(line => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            name={line.name}
            strokeWidth={2}
            dot={{ r: 3 }}
            strokeDasharray={line.dashed ? '5 5' : undefined}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
