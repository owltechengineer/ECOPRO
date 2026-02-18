'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, Target, Users, AlertTriangle, CheckCircle2, Clock,
  ListTodo, DollarSign, Layers, GitBranch, Milestone as MilestoneIcon,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import KPICard from '@/components/common/KPICard';
import ProgressBar from '@/components/common/ProgressBar';
import { useEcoPro } from '@/store/EcoProContext';
import { formatCurrency, cn, getStatusColor } from '@/lib/utils';

type TabType = 'overview' | 'charter' | 'wbs' | 'tasks' | 'milestones' | 'financials';

export default function ProjectDetailPage() {
  const params = useParams();
  const { projects, activities, tasks: allTasks } = useEcoPro();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const project = projects.find(p => p.id === params.id);
  const activity = project ? activities.find(a => a.id === project.activityId) : null;
  const tasks = allTasks.filter(t => t.projectId === params.id);

  if (!project) return <div className="p-8 text-center text-slate-500">Progetto non trovato</div>;

  const budgetUsed = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const tasksByStatus = {
    done: tasks.filter(t => t.status === 'done').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo' || t.status === 'backlog').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Layers size={14} /> },
    { key: 'charter', label: 'Project Charter', icon: <FileText size={14} /> },
    { key: 'wbs', label: 'WBS', icon: <GitBranch size={14} /> },
    { key: 'tasks', label: 'Kanban Board', icon: <ListTodo size={14} /> },
    { key: 'milestones', label: 'Milestones', icon: <Target size={14} /> },
    { key: 'financials', label: 'Financials', icon: <DollarSign size={14} /> },
  ];

  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.description}
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: project.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge label={project.status} />
            <Badge label={project.methodology} className="bg-slate-100 text-slate-600" />
            <Badge label={project.type} className="bg-slate-100 text-slate-600" />
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KPICard title="Progresso" value={project.progress} format="percent" icon={Target} iconColor="text-blue-500" />
        <KPICard title="Budget" value={project.budget} format="currency" icon={DollarSign} iconColor="text-emerald-500" subtitle={`${budgetUsed.toFixed(0)}% utilizzato`} />
        <KPICard title="Speso" value={project.spent} format="currency" icon={DollarSign} iconColor={budgetUsed > 80 ? 'text-red-500' : 'text-amber-500'} />
        <KPICard title="Task Totali" value={tasks.length} format="number" icon={ListTodo} iconColor="text-slate-500" subtitle={`${tasksByStatus.done} completati`} />
        <KPICard title="Milestones" value={project.milestones.filter(m => m.status === 'completed').length} format="number" icon={CheckCircle2} iconColor="text-emerald-500" subtitle={`di ${project.milestones.length} totali`} />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 border-b border-slate-200 -mx-6 px-6">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px',
              activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            )}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Info */}
          <Card title="Informazioni Progetto">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-xs text-slate-500">Activity</span><span className="text-xs font-medium text-slate-900">{activity?.name}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Tipo</span><span className="text-xs font-medium text-slate-900 capitalize">{project.type}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Metodologia</span><span className="text-xs font-medium text-slate-900">{project.methodology}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Inizio</span><span className="text-xs font-medium text-slate-900">{new Date(project.startDate).toLocaleDateString('it-IT')}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Fine prevista</span><span className="text-xs font-medium text-slate-900">{new Date(project.endDate).toLocaleDateString('it-IT')}</span></div>
              <div className="flex justify-between"><span className="text-xs text-slate-500">Moduli attivi</span><span className="text-xs font-medium text-slate-900">{project.enabledModules.length > 0 ? project.enabledModules.join(', ') : 'Nessuno'}</span></div>
            </div>
          </Card>

          {/* Task Summary */}
          <Card title="Distribuzione Task">
            <div className="space-y-3">
              {Object.entries(tasksByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <Badge label={status} />
                  <div className="flex-1">
                    <ProgressBar value={count} max={tasks.length || 1} size="sm" showLabel={false} color={
                      status === 'done' ? 'bg-emerald-500' : status === 'in_progress' ? 'bg-amber-500' : status === 'blocked' ? 'bg-red-500' : 'bg-slate-300'
                    } />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'charter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Objectives">
            <ul className="space-y-2">
              {project.charter.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Target size={14} className="text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-700">{obj}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Scope">
            <p className="text-sm text-slate-700">{project.charter.scope}</p>
          </Card>
          <Card title="Stakeholders">
            <div className="space-y-2">
              {project.charter.stakeholders.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <div>
                      <span className="text-xs font-medium text-slate-900">{s.name}</span>
                      <span className="text-[10px] text-slate-500 ml-2">{s.role}</span>
                    </div>
                  </div>
                  <Badge label={s.influence} />
                </div>
              ))}
            </div>
          </Card>
          <div className="space-y-6">
            <Card title="Constraints">
              <ul className="space-y-1.5">{project.charter.constraints.map((c, i) => <li key={i} className="text-xs text-slate-700 flex items-start gap-2"><AlertTriangle size={12} className="text-amber-500 mt-0.5 shrink-0" />{c}</li>)}</ul>
            </Card>
            <Card title="Assumptions">
              <ul className="space-y-1.5">{project.charter.assumptions.map((a, i) => <li key={i} className="text-xs text-slate-700 flex items-start gap-2"><CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />{a}</li>)}</ul>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'wbs' && (
        <Card title="Work Breakdown Structure" subtitle="Struttura gerarchica delle attività">
          <div className="space-y-2">
            {project.wbs.filter(w => w.parentId === null).map(phase => (
              <div key={phase.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <GitBranch size={14} className="text-slate-500" />
                    <span className="text-sm font-semibold text-slate-900">{phase.title}</span>
                    <Badge label={phase.type} className="bg-slate-200 text-slate-600 !text-[9px]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge label={phase.status} />
                    <span className="text-xs font-bold text-slate-700">{phase.progress}%</span>
                  </div>
                </div>
                {phase.children.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {project.wbs.filter(w => phase.children.includes(w.id)).map(child => (
                      <div key={child.id} className="flex items-center justify-between p-3 pl-10">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-4 bg-slate-300 rounded-full" />
                          <span className="text-xs font-medium text-slate-700">{child.title}</span>
                          <Badge label={child.type} className="bg-slate-100 text-slate-500 !text-[9px]" />
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge label={child.status} />
                          <ProgressBar value={child.progress} size="sm" className="w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'tasks' && (
        <KanbanBoard tasks={tasks} />
      )}

      {activeTab === 'milestones' && (
        <Card title="Milestones Timeline">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div className="space-y-6">
              {project.milestones.map(ms => (
                <div key={ms.id} className="flex items-start gap-4 ml-0">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10',
                    ms.status === 'completed' ? 'bg-emerald-500 text-white' : ms.status === 'delayed' ? 'bg-red-500 text-white' : 'bg-white border-2 border-slate-300 text-slate-400'
                  )}>
                    {ms.status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{ms.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{new Date(ms.date).toLocaleDateString('it-IT')}</span>
                        <Badge label={ms.status} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {ms.deliverables.map((d, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Budget Overview">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs text-slate-500">Budget Totale</span><span className="text-sm font-bold">{formatCurrency(project.budget)}</span></div>
                <ProgressBar value={project.spent} max={project.budget} color={budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 70 ? 'bg-amber-500' : 'bg-blue-500'} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div><p className="text-[10px] text-slate-400 uppercase">Speso</p><p className="text-lg font-bold text-slate-900">{formatCurrency(project.spent)}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase">Rimanente</p><p className="text-lg font-bold text-emerald-600">{formatCurrency(project.budget - project.spent)}</p></div>
              </div>
            </div>
          </Card>
          <Card title="Revenue">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-slate-400 uppercase">Revenue atteso</p><p className="text-lg font-bold text-slate-900">{formatCurrency(project.expectedRevenue)}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase">Revenue attuale</p><p className="text-lg font-bold text-emerald-600">{formatCurrency(project.actualRevenue)}</p></div>
              </div>
              <ProgressBar value={project.actualRevenue} max={project.expectedRevenue || 1} color="bg-emerald-500" />
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase mb-1">Margine progetto</p>
                <p className={cn('text-lg font-bold', (project.actualRevenue - project.spent) >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                  {formatCurrency(project.actualRevenue - project.spent)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── KANBAN BOARD COMPONENT ───────────────────────────────────

function KanbanBoard({ tasks }: { tasks: import('@/types').Task[] }) {
  const columns: { key: import('@/types').TaskStatus; label: string; color: string }[] = [
    { key: 'backlog', label: 'Backlog', color: 'border-slate-300' },
    { key: 'todo', label: 'To Do', color: 'border-blue-400' },
    { key: 'in_progress', label: 'In Progress', color: 'border-amber-400' },
    { key: 'review', label: 'Review', color: 'border-purple-400' },
    { key: 'done', label: 'Done', color: 'border-emerald-400' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.key);
        return (
          <div key={col.key} className={cn('min-w-[260px] flex-1 rounded-xl bg-slate-50 border-t-2', col.color)}>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">{col.label}</span>
                <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">{colTasks.length}</span>
              </div>
            </div>
            <div className="px-3 pb-3 space-y-2 kanban-column">
              {colTasks.map(task => (
                <div key={task.id} className="bg-white rounded-lg border border-slate-200 p-3 card-hover">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-slate-900 leading-tight">{task.title}</span>
                    <Badge label={task.priority} variant="priority" className="!text-[8px] !px-1.5 !py-0 ml-2 shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{task.owner}</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock size={10} />
                      <span>{task.estimatedTime}h</span>
                    </div>
                  </div>
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map(tag => (
                        <span key={tag} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0 rounded">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
