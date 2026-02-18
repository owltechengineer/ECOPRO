'use client';

import React from 'react';
import { Bell, Search, Calendar, AlertTriangle } from 'lucide-react';
import { useEcoPro } from '@/store/EcoProContext';

export default function Header() {
  const { alerts } = useEcoPro();
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca progetti, task, attività..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 mr-3">
          <Calendar size={14} />
          <span>{new Date().toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Alerts */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          {criticalCount > 0 ? (
            <AlertTriangle size={18} className="text-red-500" />
          ) : (
            <Bell size={18} className="text-slate-500" />
          )}
          {alerts.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center badge-pulse">
              {alerts.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
