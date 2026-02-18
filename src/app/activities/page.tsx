'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ArrowUpRight, ArrowDownRight, Users, Globe, Layers } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import KPICard from '@/components/common/KPICard';
import ProgressBar from '@/components/common/ProgressBar';
import { useEcoPro } from '@/store/EcoProContext';
import { formatCurrency, cn } from '@/lib/utils';

export default function ActivitiesPage() {
  const { activities, projects } = useEcoPro();
  const activeActivities = activities.filter(a => !a.archived);

  const totalRevenue = activeActivities.reduce((s, a) => s + a.kpis.revenue, 0);
  const avgMargin = activeActivities.reduce((s, a) => s + a.kpis.margin, 0) / activeActivities.length;
  const totalCustomers = activeActivities.reduce((s, a) => s + a.kpis.customersTotal, 0);

  return (
    <div>
      <PageHeader
        title="Activities (Business Units)"
        description="Gestione di tutte le aziende, brand e business unit nel sistema."
        actions={
          <Link href="/activities/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Nuova Activity
          </Link>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard title="Revenue Totale" value={totalRevenue} format="compact" icon={Layers} iconColor="text-emerald-500" />
        <KPICard title="Margine Medio" value={avgMargin} format="percent" icon={ArrowUpRight} iconColor="text-blue-500" />
        <KPICard title="Clienti Totali" value={totalCustomers} format="number" icon={Users} iconColor="text-violet-500" />
        <KPICard title="Activities Attive" value={activeActivities.length} format="number" icon={Globe} iconColor="text-amber-500" />
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {activeActivities.map(activity => {
          const activityProjects = projects.filter(p => p.activityId === activity.id);
          const objectivesProgress = activity.strategicObjectives.length > 0
            ? Math.round(activity.strategicObjectives.reduce((s, o) => s + o.progress, 0) / activity.strategicObjectives.length)
            : 0;

          return (
            <Link key={activity.id} href={`/activities/${activity.id}`}>
              <div className="bg-white rounded-xl border border-slate-200 card-hover overflow-hidden">
                {/* Color bar */}
                <div className="h-1.5" style={{ backgroundColor: activity.color }} />
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: activity.color }}>
                        {activity.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{activity.name}</h3>
                        <p className="text-[11px] text-slate-500">{activity.sector}</p>
                      </div>
                    </div>
                    <Badge label={activity.lifecycleStage} />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">{activity.description}</p>

                  {/* Business Models */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {activity.businessModels.map(bm => (
                      <span key={bm} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md">{bm}</span>
                    ))}
                  </div>

                  {/* KPI Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Revenue</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(activity.kpis.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Margine</p>
                      <p className="text-sm font-bold text-slate-900">{activity.kpis.margin}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Growth</p>
                      <p className={cn('text-sm font-bold flex items-center gap-0.5', activity.kpis.growth >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                        {activity.kpis.growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {activity.kpis.growth}%
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">{activityProjects.length} progetti · {activity.kpis.customersTotal} clienti</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">Obiettivi</span>
                      <ProgressBar value={objectivesProgress} size="sm" showLabel={true} className="w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
