'use client';

import React from 'react';
import { cn, getStatusColor, getPriorityColor } from '@/lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'status' | 'priority' | 'custom';
  className?: string;
  dot?: boolean;
}

export default function Badge({ label, variant = 'status', className }: BadgeProps) {
  const colorClass = variant === 'priority' ? getPriorityColor(label) : getStatusColor(label);
  const display = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClass, className
    )}>
      {display}
    </span>
  );
}
