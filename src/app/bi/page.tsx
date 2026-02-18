'use client';

import React, { useState } from 'react';
import {
  TrendingUp, BarChart3, Target, DollarSign, Users, Activity, Loader2,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import KPICard from '@/components/common/KPICard';
import LineChartComponent from '@/components/charts/LineChartComponent';
import BarChartComponent from '@/components/charts/BarChartComponent';
import { useEcoPro } from '@/store/EcoProContext';
import { formatCurrency, cn } from '@/lib/utils';

export default function BIPage() {
  const { activities, biMetrics, loading } = useEcoPro();
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  // Auto-seleziona la prima activity se non selezionata
  const activeActivities = activities.filter(a => !a.archived);
  const currentActivityId = selectedActivity || activeActivities[0]?.id || '';

  const activityMetrics = biMetrics.filter(m => m.activityId === currentActivityId);
  const activity = activities.find(a => a.id === currentActivityId);
  const latestMetrics = activityMetrics[activityMetrics.length - 1];
  const previousMetrics = activityMetrics[activityMetrics.length - 2];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-sm text-slate-500">Caricamento metriche BI…</span>
      </div>
    );
  }

  // Revenue trend
  const revenueTrend = activityMetrics.map(m => ({
    label: m.period,
    revenue: m.revenue,
    costs: m.costs,
    profit: m.profit,
  }));

  // KPI trend
  const kpiTrend = activityMetrics.map(m => ({
    label: m.period,
    roi: m.roi,
    productivity: m.productivityIndex,
  }));

  // Comparison data
  const comparisonData = activeActivities.map(a => {
    const metrics = biMetrics.filter(m => m.activityId === a.id);
    const latest = metrics[metrics.length - 1];
    return {
      label: a.name,
      revenue: latest?.revenue || 0,
      profit: latest?.profit || 0,
      roi: latest?.roi || 0,
      productivity: latest?.productivityIndex || 0,
    };
  });

  // Forecast (simulated +3 months)
  const forecastData = (() => {
    const last3 = activityMetrics.slice(-3);
    const avgGrowth = last3.length >= 2
      ? (last3[last3.length - 1].revenue - last3[0].revenue) / last3[0].revenue / (last3.length - 1)
      : 0.05;
    const lastRev = latestMetrics?.revenue || 0;
    const months = ['Mar 2026', 'Apr 2026', 'Mag 2026'];
    return [
      ...activityMetrics.map(m => ({ label: m.period, actual: m.revenue, forecast: null as number | null })),
      ...months.map((label, i) => ({
        label,
        actual: null as number | null,
        forecast: Math.round(lastRev * Math.pow(1 + avgGrowth, i + 1)),
      })),
    ];
  })();

  return (
    <div>
      <PageHeader
        title="Business Intelligence"
        description="Performance analysis, trend, forecast e comparazioni tra Business Unit."
      />

      {/* Activity Selector */}
      <div className="flex items-center gap-2 mb-6">
        {activeActivities.map(a => (
          <button key={a.id} onClick={() => setSelectedActivity(a.id)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
              currentActivityId === a.id ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
            {a.name}
          </button>
        ))}
      </div>

      {latestMetrics ? (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            <KPICard title="Revenue" value={latestMetrics.revenue} format="currency" icon={DollarSign} iconColor="text-emerald-500" previousValue={previousMetrics?.revenue} />
            <KPICard title="EBITDA" value={latestMetrics.ebitda} format="currency" icon={BarChart3} iconColor="text-blue-500" previousValue={previousMetrics?.ebitda} />
            <KPICard title="ROI" value={latestMetrics.roi} format="percent" icon={Target} iconColor="text-violet-500" previousValue={previousMetrics?.roi} />
            <KPICard title="Productivity Index" value={latestMetrics.productivityIndex} format="number" icon={Activity} iconColor="text-amber-500" subtitle="Score 0-100" />
            <KPICard title="Clienti" value={latestMetrics.customerCount} format="number" icon={Users} iconColor="text-cyan-500" subtitle={`Churn: ${latestMetrics.churnRate}%`} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card title="Revenue, Costi & Profitto" subtitle={`${activity?.name} — Trend 6 mesi`}>
              <LineChartComponent
                data={revenueTrend}
                lines={[
                  { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
                  { key: 'profit', color: '#10b981', name: 'Profitto' },
                  { key: 'costs', color: '#ef4444', name: 'Costi', dashed: true },
                ]}
                xKey="label" height={280}
              />
            </Card>

            <Card title="ROI & Productivity Index" subtitle="Trend performance">
              <LineChartComponent
                data={kpiTrend}
                lines={[
                  { key: 'roi', color: '#8b5cf6', name: 'ROI %' },
                  { key: 'productivity', color: '#f59e0b', name: 'Productivity Index' },
                ]}
                xKey="label" height={280}
              />
            </Card>
          </div>

          {/* Forecast */}
          <Card title="Revenue Forecast" subtitle="Proiezione basata su trend storico" className="mb-6">
            <LineChartComponent
              data={forecastData.map(d => ({ label: d.label, Actual: d.actual ?? 0, Forecast: d.forecast ?? 0 }))}
              lines={[
                { key: 'Actual', color: '#3b82f6', name: 'Actual' },
                { key: 'Forecast', color: '#f59e0b', name: 'Forecast', dashed: true },
              ]}
              xKey="label" height={280}
            />
          </Card>

          {/* Comparison */}
          <Card title="Confronto tra Activity" subtitle="Performance comparativa tutte le Business Unit">
            <BarChartComponent
              data={comparisonData}
              bars={[
                { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
                { key: 'profit', color: '#10b981', name: 'Profitto' },
              ]}
              xKey="label" height={300}
            />
          </Card>

          {/* Detailed Metrics Table */}
          <Card title="Metriche Dettagliate" subtitle="Storico mensile" className="mt-6" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Periodo</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Revenue</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Costi</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Profitto</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">EBITDA</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">ROI</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Productivity</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Churn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activityMetrics.map(m => (
                    <tr key={m.period} className="table-row-hover">
                      <td className="px-4 py-2.5 text-xs font-medium text-slate-900">{m.period}</td>
                      <td className="px-4 py-2.5 text-xs text-right font-medium text-slate-900">{formatCurrency(m.revenue)}</td>
                      <td className="px-4 py-2.5 text-xs text-right text-slate-600">{formatCurrency(m.costs)}</td>
                      <td className="px-4 py-2.5 text-xs text-right font-medium text-emerald-600">{formatCurrency(m.profit)}</td>
                      <td className="px-4 py-2.5 text-xs text-right text-slate-600">{formatCurrency(m.ebitda)}</td>
                      <td className="px-4 py-2.5 text-xs text-right font-medium text-violet-600">{m.roi.toFixed(1)}%</td>
                      <td className="px-4 py-2.5 text-xs text-right text-slate-600">{m.productivityIndex}</td>
                      <td className="px-4 py-2.5 text-xs text-right text-slate-600">{m.churnRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <div className="text-center py-16">
          <BarChart3 size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Nessuna metrica BI disponibile per questa attività.</p>
          <p className="text-xs text-slate-400 mt-1">Esegui il seed del database per caricare i dati.</p>
        </div>
      )}
    </div>
  );
}
