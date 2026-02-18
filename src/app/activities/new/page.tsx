'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import { useEcoPro } from '@/store/EcoProContext';
import { generateId } from '@/lib/utils';
import type { BusinessModel, LifecycleStage, Activity } from '@/types';

const businessModelOptions: BusinessModel[] = ['B2C', 'B2B', 'D2C', 'SaaS', 'Services', 'Hybrid'];
const lifecycleOptions: LifecycleStage[] = ['idea', 'validation', 'active', 'scale', 'paused'];
const colorOptions = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

export default function NewActivityPage() {
  const router = useRouter();
  const { createActivity } = useEcoPro();

  const [form, setForm] = useState({
    name: '',
    description: '',
    sector: '',
    geography: '',
    businessModels: [] as BusinessModel[],
    lifecycleStage: 'idea' as LifecycleStage,
    color: '#3b82f6',
  });

  const toggleBM = (bm: BusinessModel) => {
    setForm(prev => ({
      ...prev,
      businessModels: prev.businessModels.includes(bm)
        ? prev.businessModels.filter(b => b !== bm)
        : [...prev.businessModels, bm],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity: Activity = {
      id: generateId(),
      ...form,
      strategicObjectives: [],
      risks: [],
      kpis: { revenue: 0, previousRevenue: 0, growth: 0, margin: 0, cac: 0, ltv: 0, roi: 0, burnRate: 0, customersTotal: 0, monthlyRecurring: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
      icon: 'Building2',
    };
    createActivity(newActivity);
    router.push('/activities');
  };

  return (
    <div>
      <PageHeader
        title="Nuova Activity"
        description="Crea una nuova Business Unit / Azienda nel sistema."
        breadcrumbs={[
          { label: 'Activities', href: '/activities' },
          { label: 'Nuova Activity' },
        ]}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <Card title="Informazioni Generali" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Nome Activity *</label>
              <input type="text" required value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="Es. EcoWear, DataFlow Consulting..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Descrizione</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="Descrivi l'attività, il suo scopo e la visione..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Settore</label>
                <input type="text" value={form.sector} onChange={e => setForm(prev => ({ ...prev, sector: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="Es. Fashion, Tech, Consulting..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Geografia</label>
                <input type="text" value={form.geography} onChange={e => setForm(prev => ({ ...prev, geography: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="Es. Italia, Europa, Globale..." />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Business Model" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Modelli di Business (multipli)</label>
              <div className="flex flex-wrap gap-2">
                {businessModelOptions.map(bm => (
                  <button key={bm} type="button" onClick={() => toggleBM(bm)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${form.businessModels.includes(bm) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {bm}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Lifecycle Stage</label>
              <div className="flex flex-wrap gap-2">
                {lifecycleOptions.map(stage => (
                  <button key={stage} type="button" onClick={() => setForm(prev => ({ ...prev, lifecycleStage: stage }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${form.lifecycleStage === stage ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {stage}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Personalizzazione" className="mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Colore identificativo</label>
            <div className="flex gap-2">
              {colorOptions.map(color => (
                <button key={color} type="button" onClick={() => setForm(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            Annulla
          </button>
          <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Crea Activity
          </button>
        </div>
      </form>
    </div>
  );
}
