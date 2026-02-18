'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import { useEcoPro } from '@/store/EcoProContext';
import { generateId } from '@/lib/utils';
import type { Project, ProjectType, ProjectMethodology, ModuleType } from '@/types';

const projectTypes: ProjectType[] = ['ecommerce', 'startup', 'marketing', 'R&D', 'operations', 'consulting', 'mixed'];
const methodologies: ProjectMethodology[] = ['Waterfall', 'Agile', 'Scrum', 'Kanban', 'Lean', 'Hybrid'];
const moduleTypes: ModuleType[] = ['ecommerce', 'services', 'startup'];

export default function NewProjectPage() {
  const router = useRouter();
  const { activities, createProject } = useEcoPro();

  const [form, setForm] = useState({
    name: '', description: '', activityId: activities[0]?.id || '',
    type: 'mixed' as ProjectType, methodology: 'Agile' as ProjectMethodology,
    startDate: '', endDate: '', budget: 0,
    enabledModules: [] as ModuleType[],
    objectives: '', scope: '',
  });

  const toggleModule = (m: ModuleType) => {
    setForm(prev => ({
      ...prev,
      enabledModules: prev.enabledModules.includes(m) ? prev.enabledModules.filter(x => x !== m) : [...prev.enabledModules, m],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: generateId(),
      activityId: form.activityId,
      name: form.name, description: form.description,
      type: form.type, methodology: form.methodology,
      status: 'planning',
      charter: {
        objectives: form.objectives.split('\n').filter(Boolean),
        scope: form.scope,
        stakeholders: [], constraints: [], assumptions: [], risks: [],
      },
      wbs: [], milestones: [],
      startDate: form.startDate, endDate: form.endDate,
      progress: 0, budget: form.budget, spent: 0,
      expectedRevenue: 0, actualRevenue: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      enabledModules: form.enabledModules,
    };
    createProject(newProject);
    router.push('/projects');
  };

  return (
    <div>
      <PageHeader title="Nuovo Progetto" description="Crea un nuovo progetto con charter, WBS e configurazione metodologica."
        breadcrumbs={[{ label: 'Projects', href: '/projects' }, { label: 'Nuovo Progetto' }]} />

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <Card title="Informazioni Base" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Activity associata *</label>
              <select value={form.activityId} onChange={e => setForm(p => ({ ...p, activityId: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Nome progetto *</label>
              <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Descrizione</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Data inizio</label>
                <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Data fine prevista</label>
                <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Budget (€)</label>
              <input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
          </div>
        </Card>

        <Card title="Metodologia & Tipo" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Tipo progetto</label>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-colors ${form.type === t ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Metodologia</label>
              <div className="flex flex-wrap gap-2">
                {methodologies.map(m => (
                  <button key={m} type="button" onClick={() => setForm(p => ({ ...p, methodology: m }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${form.methodology === m ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Moduli aggiuntivi</label>
              <div className="flex flex-wrap gap-2">
                {moduleTypes.map(m => (
                  <button key={m} type="button" onClick={() => toggleModule(m)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-colors ${form.enabledModules.includes(m) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Project Charter (base)" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Obiettivi (uno per riga)</label>
              <textarea rows={4} value={form.objectives} onChange={e => setForm(p => ({ ...p, objectives: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" placeholder="Obiettivo 1\nObiettivo 2\nObiettivo 3" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Scope</label>
              <textarea rows={3} value={form.scope} onChange={e => setForm(p => ({ ...p, scope: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Annulla</button>
          <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Crea Progetto</button>
        </div>
      </form>
    </div>
  );
}
