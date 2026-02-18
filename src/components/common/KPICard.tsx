'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn, formatCurrency, formatCompactNumber, formatPercent } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  format?: 'currency' | 'number' | 'percent' | 'compact';
  icon?: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  subtitle?: string;
  className?: string;
}

export default function KPICard({
  title, value, previousValue, format = 'currency',
  icon: Icon, iconColor = 'text-blue-500', trend, trendValue,
  subtitle, className,
}: KPICardProps) {
  const displayValue = () => {
    switch (format) {
      case 'currency': return formatCurrency(value);
      case 'compact': return formatCompactNumber(value);
      case 'percent': return `${value.toFixed(1)}%`;
      case 'number': return value.toLocaleString('it-IT');
      default: return value.toString();
    }
  };

  const computedTrend = trend || (previousValue !== undefined
    ? value > previousValue ? 'up' : value < previousValue ? 'down' : 'stable'
    : undefined);

  const computedTrendValue = trendValue ?? (previousValue !== undefined && previousValue !== 0
    ? ((value - previousValue) / previousValue) * 100
    : undefined);

  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-5 card-hover', className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={cn('p-2 rounded-lg bg-slate-50', iconColor)}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-3">
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{displayValue()}</p>
        {computedTrend && computedTrendValue !== undefined && (
          <div className={cn(
            'flex items-center gap-0.5 text-xs font-medium pb-1',
            computedTrend === 'up' ? 'text-emerald-600' : computedTrend === 'down' ? 'text-red-500' : 'text-slate-400'
          )}>
            {computedTrend === 'up' && <TrendingUp size={13} />}
            {computedTrend === 'down' && <TrendingDown size={13} />}
            {computedTrend === 'stable' && <Minus size={13} />}
            <span>{formatPercent(computedTrendValue)}</span>
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>}
    </div>
  );
}
