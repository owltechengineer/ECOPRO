'use client';

import React from 'react';
import {
  DollarSign, TrendingUp, FolderKanban, AlertTriangle, Target,
  ListTodo, Clock, ArrowUpRight, ArrowDownRight,
  XCircle, BarChart3, Loader2,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/common/KPICard';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import ProgressBar from '@/components/common/ProgressBar';
import BarChartComponent from '@/components/charts/BarChartComponent';
import LineChartComponent from '@/components/charts/LineChartComponent';
import DonutChart from '@/components/charts/DonutChart';
import { useEcoPro } from '@/store/EcoProContext';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    activities, projects, tasks, alerts, dismissAlert,
    executiveKPIs: kpis, biMetrics, loading, error,
  } = useEcoPro();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-sm text-slate-500">Caricamento dati dal database…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertTriangle size={32} className="text-amber-500" />
        <p className="text-sm text-slate-700 font-medium">Errore connessione database</p>
        <p className="text-xs text-slate-500">{error}</p>
        <p className="text-xs text-slate-400">Verifica le credenziali Supabase in .env.local</p>
      </div>
    );
  }

  // Revenue by activity chart data
  const revenueByActivity = activities.filter(a => !a.archived).map(a => ({
    label: a.name,
    revenue: a.kpis?.revenue || 0,
    costs: (a.kpis?.revenue || 0) * (1 - (a.kpis?.margin || 0) / 100),
    color: a.color,
  }));

  // Monthly trend from BI metrics (prima attività)
  const firstActivityId = activities[0]?.id;
  const monthlyTrend = biMetrics
    .filter(m => m.activityId === firstActivityId)
    .map(m => ({
      label: m.period.replace('2025-', '').replace('2026-', ''),
      revenue: m.revenue,
      profit: m.profit,
      costs: m.costs,
    }));

  // Revenue distribution donut
  const revenueDistribution = activities.filter(a => !a.archived).map(a => ({
    name: a.name,
    value: a.kpis?.revenue || 0,
    color: a.color,
  }));

  // Recent tasks across projects
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  // Project status overview
  const projectStatusData = [
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#10b981' },
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: '#3b82f6' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on_hold').length, color: '#f59e0b' },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#6b7280' },
  ];

  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        description="Panoramica globale di tutte le Business Unit, i progetti e i KPI aggregati."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <KPICard title="Revenue Totale" value={kpis.totalRevenue} format="compact" icon={DollarSign} iconColor="text-emerald-500" trend="up" trendValue={kpis.monthlyGrowth} subtitle="Tutte le activity" />
        <KPICard title="Profit Netto" value={kpis.totalProfit} format="compact" icon={TrendingUp} iconColor="text-blue-500" trend="up" trendValue={12.3} subtitle="Revenue - Costi" />
        <KPICard title="ROI Aggregato" value={kpis.aggregatedROI} format="percent" icon={Target} iconColor="text-violet-500" trend="up" trendValue={5.2} />
        <KPICard title="Progetti Attivi" value={kpis.activeProjects} format="number" icon={FolderKanban} iconColor="text-amber-500" subtitle={`${projects.length} totali`} />
        <KPICard title="Task Pendenti" value={kpis.pendingTasks} format="number" icon={ListTodo} iconColor="text-slate-500" subtitle={`${kpis.overdueTasks} overdue`} />
        <KPICard title="Cash Flow Netto" value={kpis.cashFlowNet} format="currency" icon={BarChart3} iconColor="text-emerald-500" trend="up" trendValue={15.4} subtitle="Questo mese" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Trend */}
        <Card title="Trend Revenue & Profitto" subtitle={`${activities[0]?.name || 'Activity'} — Ultimi 6 mesi`} className="lg:col-span-2">
          {monthlyTrend.length > 0 ? (
            <LineChartComponent
              data={monthlyTrend}
              lines={[
                { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
                { key: 'profit', color: '#10b981', name: 'Profitto' },
                { key: 'costs', color: '#f59e0b', name: 'Costi', dashed: true },
              ]}
              xKey="label"
              height={280}
            />
          ) : (
            <p className="text-xs text-slate-400 text-center py-12">Nessun dato BI disponibile</p>
          )}
        </Card>

        {/* Revenue Distribution */}
        <Card title="Revenue per Activity" subtitle="Distribuzione attuale">
          {revenueDistribution.length > 0 ? (
            <>
              <DonutChart
                data={revenueDistribution}
                centerValue={formatCurrency(kpis.totalRevenue)}
                centerLabel="Totale"
                height={200}
              />
              <div className="space-y-2 mt-4">
                {revenueDistribution.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-12">Nessuna attività</p>
          )}
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue by Activity Bar */}
        <Card title="Revenue vs Costi per Activity" subtitle="Confronto performance" className="lg:col-span-2">
          {revenueByActivity.length > 0 ? (
            <BarChartComponent
              data={revenueByActivity}
              bars={[
                { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
                { key: 'costs', color: '#f87171', name: 'Costi' },
              ]}
              xKey="label"
              height={260}
            />
          ) : (
            <p className="text-xs text-slate-400 text-center py-12">Nessun dato</p>
          )}
        </Card>

        {/* Projects Overview */}
        <Card title="Stato Progetti" subtitle={`${projects.length} progetti totali`}>
          <DonutChart
            data={projectStatusData}
            centerValue={String(projects.length)}
            centerLabel="Progetti"
            height={160}
            innerRadius={45}
            outerRadius={65}
          />
          <div className="space-y-2 mt-3">
            {projectStatusData.filter(p => p.value > 0).map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Third Row: Activities + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Activities Summary */}
        <Card title="Business Units" subtitle="Panoramica attività" headerAction={
          <Link href="/activities" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Vedi tutte →</Link>
        }>
          <div className="space-y-3">
            {activities.filter(a => !a.archived).map(activity => (
              <Link key={activity.id} href={`/activities/${activity.id}`} className="block">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: activity.color }}>
                    {activity.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{activity.name}</span>
                      <Badge label={activity.lifecycleStage} />
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-500">{activity.sector}</span>
                      <span className="text-xs font-medium text-emerald-600">{formatCurrency(activity.kpis?.revenue || 0)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn('flex items-center gap-1 text-xs font-medium', (activity.kpis?.growth || 0) >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                      {(activity.kpis?.growth || 0) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {activity.kpis?.growth || 0}%
                    </div>
                    <span className="text-[10px] text-slate-400">growth</span>
                  </div>
                </div>
              </Link>
            ))}
            {activities.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">Nessuna attività nel database. Esegui il seed.</p>
            )}
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card title="Alert Critici" subtitle={`${alerts.length} alert attivi`} headerAction={
          <span className={cn('inline-flex items-center gap-1 text-xs font-medium', alerts.filter(a => a.severity === 'critical').length > 0 ? 'text-red-600' : 'text-slate-400')}>
            <AlertTriangle size={12} />
            {alerts.filter(a => a.severity === 'critical').length} critici
          </span>
        }>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className={cn(
                'p-3 rounded-lg border flex items-start gap-3',
                alert.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
              )}>
                <div className={cn('p-1 rounded', alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500')}>
                  {alert.type === 'delay' && <Clock size={16} />}
                  {alert.type === 'budget' && <DollarSign size={16} />}
                  {alert.type === 'risk' && <AlertTriangle size={16} />}
                  {alert.type === 'performance' && <TrendingUp size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900">{alert.title}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{alert.description}</p>
                </div>
                <button onClick={() => dismissAlert(alert.id)} className="text-slate-400 hover:text-slate-600 p-0.5">
                  <XCircle size={14} />
                </button>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">Nessun alert attivo</p>
            )}
          </div>
        </Card>
      </div>

      {/* Projects Progress + Cross-project Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <Card title="Avanzamento Progetti" headerAction={
          <Link href="/projects" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Vedi tutti →</Link>
        }>
          <div className="space-y-4">
            {projects.map(project => {
              const activity = activities.find(a => a.id === project.activityId);
              return (
                <Link key={project.id} href={`/projects/${project.id}`} className="block">
                  <div className="flex items-center gap-3 group">
                    <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: activity?.color || '#94a3b8' }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge label={project.status} />
                          <Badge label={project.methodology} className="bg-slate-100 text-slate-600" />
                        </div>
                      </div>
                      <ProgressBar value={project.progress} size="sm" />
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] text-slate-400">Budget: {formatCurrency(project.budget)}</span>
                        <span className="text-[10px] text-slate-400">Spent: {formatCurrency(project.spent)}</span>
                        <span className="text-[10px] text-slate-400">Scadenza: {new Date(project.endDate).toLocaleDateString('it-IT')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card title="Task Recenti (Cross-Project)" headerAction={
          <span className="text-xs text-slate-400">{recentTasks.length} task</span>
        }>
          <div className="space-y-1">
            {recentTasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={cn('w-1.5 h-1.5 rounded-full', task.status === 'done' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-amber-500' : task.status === 'blocked' ? 'bg-red-500' : 'bg-slate-300')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-medium', task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900')}>{task.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{project?.name} · {task.owner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={task.priority} variant="priority" className="!text-[9px] !px-1.5 !py-0" />
                    <Badge label={task.status} className="!text-[9px] !px-1.5 !py-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
