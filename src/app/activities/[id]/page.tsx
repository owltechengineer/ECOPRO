'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUpRight, ArrowDownRight, Target, Shield, DollarSign,
  Users, TrendingUp, Flame, Loader2,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import KPICard from '@/components/common/KPICard';
import ProgressBar from '@/components/common/ProgressBar';
import { useEcoPro } from '@/store/EcoProContext';
import { formatCurrency, cn } from '@/lib/utils';

export default function ActivityDetailPage() {
  const params = useParams();
  const { activities, projects, getBMC, getScorecard, loading } = useEcoPro();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-sm text-slate-500">Caricamento…</span>
      </div>
    );
  }

  const activity = activities.find(a => a.id === params.id);

  if (!activity) {
    return <div className="p-8 text-center text-slate-500">Activity non trovata</div>;
  }

  const activityProjects = projects.filter(p => p.activityId === activity.id);
  const bmc = getBMC(activity.id);
  const scorecard = getScorecard(activity.id);

  return (
    <div>
      <PageHeader
        title={activity.name}
        description={activity.description}
        breadcrumbs={[
          { label: 'Activities', href: '/activities' },
          { label: activity.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge label={activity.lifecycleStage} />
            <span className="text-xs text-slate-400">{activity.geography}</span>
          </div>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <KPICard title="Revenue" value={activity.kpis?.revenue || 0} format="currency" icon={DollarSign} iconColor="text-emerald-500" previousValue={activity.kpis?.previousRevenue} />
        <KPICard title="Margine" value={activity.kpis?.margin || 0} format="percent" icon={TrendingUp} iconColor="text-blue-500" />
        <KPICard title="ROI" value={activity.kpis?.roi || 0} format="percent" icon={Target} iconColor="text-violet-500" />
        <KPICard title="Clienti" value={activity.kpis?.customersTotal || 0} format="number" icon={Users} iconColor="text-amber-500" subtitle={`CAC: ${formatCurrency(activity.kpis?.cac || 0)}`} />
        <KPICard title="Burn Rate" value={activity.kpis?.burnRate || 0} format="currency" icon={Flame} iconColor="text-red-500" subtitle="Mensile" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Strategic Objectives */}
        <Card title="Obiettivi Strategici" subtitle={`${activity.strategicObjectives.length} obiettivi definiti`} headerAction={
          <Target size={16} className="text-slate-400" />
        }>
          <div className="space-y-4">
            {activity.strategicObjectives.map(obj => (
              <div key={obj.id} className="p-3 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">{obj.title}</span>
                  <span className="text-[10px] text-slate-400">{new Date(obj.targetDate).toLocaleDateString('it-IT')}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{obj.description}</p>
                <ProgressBar value={obj.progress} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        {/* Risk Register */}
        <Card title="Risk Register" subtitle={`${activity.risks.length} rischi identificati`} headerAction={
          <Shield size={16} className="text-slate-400" />
        }>
          <div className="space-y-3">
            {activity.risks.map(risk => (
              <div key={risk.id} className="p-3 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-900">{risk.title}</span>
                  <Badge label={risk.status} />
                </div>
                <p className="text-xs text-slate-500 mb-2">{risk.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Probabilità:</span>
                    <Badge label={risk.probability} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Impatto:</span>
                    <Badge label={risk.impact} />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 italic">Mitigation: {risk.mitigation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Business Model Canvas */}
      {bmc && (
        <Card title="Business Model Canvas" subtitle="Modello di business strutturato" className="mb-6">
          <div className="grid grid-cols-5 gap-px bg-slate-200 rounded-lg overflow-hidden">
            <div className="bg-white p-3 row-span-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Key Partners</p>
              <ul className="space-y-1">{bmc.keyPartners.map((item, i) => <li key={i} className="text-[11px] text-slate-700">• {item}</li>)}</ul>
            </div>
            <div className="bg-white p-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Key Activities</p>
              <ul className="space-y-1">{bmc.keyActivities.map((item, i) => <li key={i} className="text-[11px] text-slate-700">• {item}</li>)}</ul>
            </div>
            <div className="bg-white p-3 row-span-2">
              <p className="text-[10px] font-bold text-blue-600 uppercase mb-2">Value Propositions</p>
              <ul className="space-y-1">{bmc.valuePropositions.map((item, i) => <li key={i} className="text-[11px] text-slate-700 font-medium">• {item}</li>)}</ul>
            </div>
            <div className="bg-white p-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Customer Relationships</p>
              <ul className="space-y-1">{bmc.customerRelationships.map((item, i) => <li key={i} className="text-[11px] text-slate-700">• {item}</li>)}</ul>
            </div>
            <div className="bg-white p-3 row-span-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Customer Segments</p>
              <ul className="space-y-1">{bmc.customerSegments.map((item, i) => <li key={i} className="text-[11px] text-slate-700">• {item}</li>)}</ul>
            </div>
            <div className="bg-white p-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Key Resources</p>
              <ul className="space-y-1">{bmc.keyResources.map((item, i) => <li key={i} className="text-[11px] text-slate-700">• {item}</li>)}</ul>
            </div>
            <div className="bg-white p-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Channels</p>
              <ul className="space-y-1">{bmc.channels.map((item, i) => <li key={i} className="text-[11px] text-slate-700">• {item}</li>)}</ul>
            </div>
            <div className="bg-white p-3 col-span-2">
              <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Cost Structure</p>
              <div className="flex flex-wrap gap-1.5">{bmc.costStructure.map((item, i) => <span key={i} className="text-[11px] text-slate-700 bg-red-50 px-2 py-0.5 rounded">• {item}</span>)}</div>
            </div>
            <div className="bg-white p-3 col-span-3">
              <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Revenue Streams</p>
              <div className="flex flex-wrap gap-1.5">{bmc.revenueStreams.map((item, i) => <span key={i} className="text-[11px] text-slate-700 bg-emerald-50 px-2 py-0.5 rounded">• {item}</span>)}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Balanced Scorecard */}
      {scorecard && (
        <Card title="Balanced Scorecard" subtitle="4 prospettive strategiche" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[scorecard.financial, scorecard.customer, scorecard.internal, scorecard.learning].map(perspective => (
              <div key={perspective.name} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase">{perspective.name}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {perspective.objectives.map((obj, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-900">{obj.title}</p>
                        <p className="text-[10px] text-slate-500">{obj.measure}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900">{obj.actual}</p>
                          <p className="text-[10px] text-slate-400">Target: {obj.target}</p>
                        </div>
                        <Badge label={obj.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Projects for this Activity */}
      <Card title="Progetti Collegati" subtitle={`${activityProjects.length} progetti`}>
        <div className="space-y-3">
          {activityProjects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`} className="block">
              <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">{project.name}</span>
                    <Badge label={project.status} />
                    <Badge label={project.methodology} className="bg-slate-100 text-slate-600" />
                  </div>
                  <ProgressBar value={project.progress} size="sm" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">{formatCurrency(project.budget)}</p>
                  <p className="text-[10px] text-slate-400">budget</p>
                </div>
              </div>
            </Link>
          ))}
          {activityProjects.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">Nessun progetto collegato</p>
          )}
        </div>
      </Card>
    </div>
  );
}
