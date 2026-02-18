'use client';

import React, { ReactNode } from 'react';
import { useEcoPro } from '@/store/EcoProContext';
import { cn } from '@/lib/utils';

export default function AppShell({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useEcoPro();

  return (
    <div
      className={cn(
        'flex-1 flex flex-col min-h-screen main-transition',
        sidebarOpen ? 'ml-[260px]' : 'ml-[68px]'
      )}
    >
      {children}
    </div>
  );
}
