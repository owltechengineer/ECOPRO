import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('it-IT').format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(1)}K`;
  return `€${value}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    backlog: 'bg-slate-100 text-slate-600',
    todo: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-amber-50 text-amber-700',
    review: 'bg-purple-50 text-purple-700',
    done: 'bg-emerald-50 text-emerald-700',
    blocked: 'bg-red-50 text-red-700',
    planning: 'bg-blue-50 text-blue-700',
    active: 'bg-emerald-50 text-emerald-700',
    on_hold: 'bg-amber-50 text-amber-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
    idea: 'bg-violet-50 text-violet-700',
    validation: 'bg-amber-50 text-amber-700',
    scale: 'bg-blue-50 text-blue-700',
    paused: 'bg-slate-100 text-slate-600',
    low: 'bg-emerald-50 text-emerald-700',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-orange-50 text-orange-700',
    critical: 'bg-red-50 text-red-700',
    warning: 'bg-amber-50 text-amber-700',
    on_track: 'bg-emerald-50 text-emerald-700',
    at_risk: 'bg-amber-50 text-amber-700',
    behind: 'bg-red-50 text-red-700',
    info: 'bg-sky-50 text-sky-700',
    identified: 'bg-blue-50 text-blue-700',
    mitigated: 'bg-emerald-50 text-emerald-700',
    accepted: 'bg-amber-50 text-amber-700',
    closed: 'bg-slate-100 text-slate-600',
    pending: 'bg-slate-100 text-slate-600',
    delayed: 'bg-red-50 text-red-700',
  };
  return colors[status] || 'bg-slate-100 text-slate-600';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    critical: 'bg-red-600 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-amber-400 text-slate-900',
    low: 'bg-slate-200 text-slate-700',
  };
  return colors[priority] || 'bg-slate-200 text-slate-700';
}

export function getPriorityDot(priority: string): string {
  const colors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-amber-400',
    low: 'bg-slate-400',
  };
  return colors[priority] || 'bg-slate-400';
}

export function calculateVariance(estimated: number, actual: number): { value: number; percent: number; isPositive: boolean } {
  const value = estimated - actual;
  const percent = estimated !== 0 ? (value / estimated) * 100 : 0;
  return { value, percent, isPositive: value >= 0 };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '…' : str;
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

export function progressColor(progress: number): string {
  if (progress >= 75) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-amber-500';
  return 'bg-red-500';
}

export function trendIcon(current: number, previous: number): 'up' | 'down' | 'stable' {
  if (current > previous * 1.01) return 'up';
  if (current < previous * 0.99) return 'down';
  return 'stable';
}
