'use client';

import React from 'react';
import { cn, progressColor } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export default function ProgressBar({ value, max = 100, showLabel = true, size = 'md', className, color }: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = color || progressColor(percent);

  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 bg-slate-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('rounded-full progress-animate', barColor, heights[size])}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 tabular-nums w-10 text-right">{Math.round(percent)}%</span>
      )}
    </div>
  );
}
