'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, FolderKanban, BarChart3, Globe2, Brain,
  Settings, ChevronLeft, ChevronRight, Target, TrendingUp,
  Layers,
} from 'lucide-react';
import { useEcoPro } from '@/store/EcoProContext';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Activities', href: '/activities', icon: Building2 },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Business Intelligence', href: '/bi', icon: BarChart3 },
  { label: 'Market Intelligence', href: '/market', icon: Globe2 },
  { label: 'AI Decision Support', href: '/ai', icon: Brain },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const quickStats = [
  { label: 'Activities', value: '3', icon: Layers },
  { label: 'Projects', value: '4', icon: Target },
  { label: 'Growth', value: '+8.5%', icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useEcoPro();

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen bg-slate-900 text-white flex flex-col sidebar-transition',
        sidebarOpen ? 'w-[260px]' : 'w-[68px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-slate-700/50">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-sm">
              EP
            </div>
            <span className="font-semibold text-base tracking-tight">ECOPRO</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      {sidebarOpen && (
        <div className="p-3 mx-2 mb-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-medium">System Overview</p>
          <div className="space-y-2">
            {quickStats.map(stat => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <stat.icon size={13} />
                  <span className="text-xs">{stat.label}</span>
                </div>
                <span className="text-xs font-semibold text-slate-200">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User */}
      <div className="p-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">
            GF
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">Gaio Fabiano</p>
              <p className="text-[11px] text-slate-500 truncate">CEO / Founder</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
