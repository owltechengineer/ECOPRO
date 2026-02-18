'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Filter, LayoutGrid, List } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Badge from '@/components/common/Badge';
import ProgressBar from '@/components/common/ProgressBar';
import { useEcoPro } from '@/store/EcoProContext';
import { formatCurrency, cn } from '@/lib/utils';

export default function ProjectsPage() {
  const { projects, activities } = useEcoPro();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = filterStatus === 'all' ? projects : projects.filter(p => p.status === filterStatus);

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Gestione di tutti i progetti con metodologie PMBOK, Agile e Lean."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded-md', viewMode === 'grid' ? 'bg-white shadow-sm' : '')}>
                <LayoutGrid size={14} className="text-slate-600" />
              </button>
              <button onClick={() => setViewMode('list')} className={cn('p-1.5 rounded-md', viewMode === 'list' ? 'bg-white shadow-sm' : '')}>
                <List size={14} className="text-slate-600" />
              </button>
            </div>
            <Link href="/projects/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              <Plus size={16} /> Nuovo Progetto
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} className="text-slate-400" />
        {['all', 'active', 'planning', 'on_hold', 'completed'].map(status => (
          <button key={status} onClick={() => setFilterStatus(status)}
            className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize',
              filterStatus === status ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}>
            {status === 'all' ? 'Tutti' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(project => {
            const activity = activities.find(a => a.id === project.activityId);
            const budgetUsed = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="bg-white rounded-xl border border-slate-200 card-hover overflow-hidden">
                  <div className="h-1" style={{ backgroundColor: activity?.color || '#94a3b8' }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{project.name}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{activity?.name}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge label={project.status} />
                        <Badge label={project.methodology} className="bg-slate-100 text-slate-600" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mb-4 line-clamp-2">{project.description}</p>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500">Progresso</span>
                        <span className="text-xs font-bold text-slate-900">{project.progress}%</span>
                      </div>
                      <ProgressBar value={project.progress} size="sm" showLabel={false} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase">Budget</p>
                        <p className="text-xs font-bold text-slate-900">{formatCurrency(project.budget)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase">Speso</p>
                        <p className={cn('text-xs font-bold', budgetUsed > 90 ? 'text-red-600' : 'text-slate-900')}>{formatCurrency(project.spent)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase">Tipo</p>
                        <p className="text-xs font-medium text-slate-700 capitalize">{project.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">{new Date(project.startDate).toLocaleDateString('it-IT')} → {new Date(project.endDate).toLocaleDateString('it-IT')}</span>
                      <div className="flex items-center gap-1">
                        {project.milestones.filter(m => m.status === 'completed').length}/{project.milestones.length}
                        <span className="text-[9px] text-slate-400">milestones</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Progetto</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Activity</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Metodo</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Progresso</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Budget</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Speso</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Scadenza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(project => {
                const activity = activities.find(a => a.id === project.activityId);
                return (
                  <tr key={project.id} className="table-row-hover cursor-pointer" onClick={() => window.location.href = `/projects/${project.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: activity?.color }} />
                        <span className="text-sm font-medium text-slate-900">{project.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{activity?.name}</td>
                    <td className="px-4 py-3"><Badge label={project.status} /></td>
                    <td className="px-4 py-3"><Badge label={project.methodology} className="bg-slate-100 text-slate-600" /></td>
                    <td className="px-4 py-3 w-40"><ProgressBar value={project.progress} size="sm" /></td>
                    <td className="px-4 py-3 text-right text-xs font-medium text-slate-900">{formatCurrency(project.budget)}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium text-slate-900">{formatCurrency(project.spent)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(project.endDate).toLocaleDateString('it-IT')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
