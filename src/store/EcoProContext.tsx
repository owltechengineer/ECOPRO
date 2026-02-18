'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type {
  Activity, Project, Task, CriticalAlert,
  AIInsight, BIMetrics, MarketData, MarketingIntelligence,
  BusinessModelCanvas, BalancedScorecard, ExecutiveKPIs,
} from '@/types';
import { api, type ActivityWithExtras } from '@/lib/api-client';

// ─── STATE INTERFACE ──────────────────────────────────────────

interface EcoProState {
  // Core data (dal DB)
  activities: ActivityWithExtras[];
  projects: Project[];
  tasks: Task[];
  alerts: CriticalAlert[];
  biMetrics: BIMetrics[];
  aiInsights: AIInsight[];
  marketData: MarketData[];
  marketingIntel: MarketingIntelligence | null;

  // Computed
  executiveKPIs: ExecutiveKPIs;

  // UI
  selectedActivityId: string | null;
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
}

interface EcoProContextType extends EcoProState {
  // Activity operations
  selectActivity: (id: string | null) => void;
  createActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  archiveActivity: (id: string) => void;
  getActivity: (id: string) => ActivityWithExtras | undefined;
  getBMC: (activityId: string) => BusinessModelCanvas | null | undefined;
  getScorecard: (activityId: string) => BalancedScorecard | null | undefined;

  // Project operations
  createProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  closeProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  getProjectsByActivity: (activityId: string) => Project[];

  // Task operations
  createTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  getTasksByProject: (projectId: string) => Task[];

  // UI
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Alerts
  dismissAlert: (id: string) => void;

  // Refresh
  refreshData: () => Promise<void>;
}

// ─── KPI vuoti di default ─────────────────────────────────────

const EMPTY_KPIS: ExecutiveKPIs = {
  totalRevenue: 0, totalCosts: 0, totalProfit: 0,
  activeActivities: 0, activeProjects: 0,
  pendingTasks: 0, overdueTasks: 0, criticalAlerts: 0,
  averageProjectProgress: 0, cashFlowNet: 0,
  aggregatedROI: 0, monthlyGrowth: 0,
};

// ─── Compute Executive KPIs dal dato reale ───────────────────

function computeKPIs(
  activities: ActivityWithExtras[],
  projects: Project[],
  tasks: Task[],
  alerts: CriticalAlert[],
  biMetrics: BIMetrics[],
): ExecutiveKPIs {
  const active = activities.filter(a => !a.archived);
  const now = new Date();

  const totalRevenue = active.reduce((s, a) => s + (a.kpis?.revenue || 0), 0);
  const totalCosts = active.reduce((s, a) => {
    const rev = a.kpis?.revenue || 0;
    const margin = a.kpis?.margin || 0;
    return s + rev * (1 - margin / 100);
  }, 0);

  const pendingTasks = tasks.filter(t => ['todo', 'in_progress', 'backlog', 'review'].includes(t.status)).length;
  const overdueTasks = tasks.filter(t => t.deadline && new Date(t.deadline) < now && t.status !== 'done').length;

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const avgProgress = projects.length > 0
    ? projects.reduce((s, p) => s + p.progress, 0) / projects.length
    : 0;

  // Revenue growth dal BI
  const latestPeriods = [...new Set(biMetrics.map(b => b.period))].sort().slice(-2);
  let monthlyGrowth = 0;
  if (latestPeriods.length === 2) {
    const prev = biMetrics.filter(b => b.period === latestPeriods[0]).reduce((s, b) => s + b.revenue, 0);
    const curr = biMetrics.filter(b => b.period === latestPeriods[1]).reduce((s, b) => s + b.revenue, 0);
    monthlyGrowth = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
  }

  const totalProfit = totalRevenue - totalCosts;
  const aggregatedROI = totalCosts > 0 ? (totalProfit / totalCosts) * 100 : 0;

  const cashFlowNet = biMetrics.length > 0
    ? biMetrics.filter(b => b.period === latestPeriods[latestPeriods.length - 1]).reduce((s, b) => s + b.profit, 0)
    : 0;

  return {
    totalRevenue,
    totalCosts: Math.round(totalCosts),
    totalProfit: Math.round(totalProfit),
    activeActivities: active.length,
    activeProjects,
    pendingTasks,
    overdueTasks,
    criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
    averageProjectProgress: Math.round(avgProgress * 10) / 10,
    cashFlowNet,
    aggregatedROI: Math.round(aggregatedROI * 10) / 10,
    monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
  };
}

const EcoProContext = createContext<EcoProContextType | undefined>(undefined);

// ─── PROVIDER ─────────────────────────────────────────────────

export function EcoProProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityWithExtras[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [biMetrics, setBiMetrics] = useState<BIMetrics[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [marketingIntel, setMarketingIntel] = useState<MarketingIntelligence | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch TUTTO dal database ─────────────────────────────
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Helper: fetch con fallback sicuro per tabelle mancanti
    async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
      try { return await fn(); } catch { return fallback; }
    }

    try {
      const [
        activitiesData,
        projectsData,
        tasksData,
        alertsData,
        biData,
        insightsData,
        marketDataRes,
        mktIntelRes,
      ] = await Promise.all([
        api.getActivities(),
        api.getProjects(),
        api.getTasks(),
        safe(() => api.getAlerts(), []),
        safe(() => api.getBIMetrics(), []),
        safe(() => api.getInsights(), []),
        safe(() => api.getMarketData(), []),
        safe(() => api.getMarketingIntel(), null),
      ]);

      setActivities(activitiesData);
      setProjects(projectsData);
      setTasks(tasksData);
      setAlerts(alertsData);
      setBiMetrics(biData);
      setAiInsights(insightsData);
      setMarketData(marketDataRes);
      setMarketingIntel(mktIntelRes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore connessione database';
      setError(msg);
      console.error('EcoPro: Errore caricamento dati dal database:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ─── Computed KPIs ─────────────────────────────────────────
  const executiveKPIs = activities.length > 0
    ? computeKPIs(activities, projects, tasks, alerts, biMetrics)
    : EMPTY_KPIS;

  // ─── Activity operations ───────────────────────────────────
  const selectActivity = useCallback((id: string | null) => setSelectedActivityId(id), []);

  const createActivity = useCallback(async (activity: Activity) => {
    try {
      const created = await api.createActivity(activity);
      setActivities(prev => [...prev, created]);
    } catch (err) {
      console.error('Errore creazione activity:', err);
      throw err;
    }
  }, []);

  const updateActivity = useCallback(async (id: string, updates: Partial<Activity>) => {
    try {
      const updated = await api.updateActivity(id, updates);
      setActivities(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Errore aggiornamento activity:', err);
      throw err;
    }
  }, []);

  const archiveActivity = useCallback(async (id: string) => {
    try {
      const updated = await api.updateActivity(id, { archived: true } as Partial<Activity>);
      setActivities(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Errore archiviazione activity:', err);
      throw err;
    }
  }, []);

  const getActivity = useCallback((id: string) => activities.find(a => a.id === id), [activities]);
  const getBMC = useCallback((activityId: string) => activities.find(a => a.id === activityId)?.bmc, [activities]);
  const getScorecard = useCallback((activityId: string) => activities.find(a => a.id === activityId)?.scorecard, [activities]);

  // ─── Project operations ────────────────────────────────────
  const createProject = useCallback(async (project: Project) => {
    try {
      const created = await api.createProject(project);
      setProjects(prev => [...prev, created]);
    } catch (err) {
      console.error('Errore creazione progetto:', err);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      const updated = await api.updateProject(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
      console.error('Errore aggiornamento progetto:', err);
      throw err;
    }
  }, []);

  const closeProject = useCallback(async (id: string) => {
    try {
      const updated = await api.updateProject(id, { status: 'completed' } as Partial<Project>);
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
      console.error('Errore chiusura progetto:', err);
      throw err;
    }
  }, []);

  const getProject = useCallback((id: string) => projects.find(p => p.id === id), [projects]);
  const getProjectsByActivity = useCallback((activityId: string) => projects.filter(p => p.activityId === activityId), [projects]);

  // ─── Task operations ───────────────────────────────────────
  const createTask = useCallback(async (task: Task) => {
    try {
      const created = await api.createTask(task);
      setTasks(prev => [...prev, created]);
    } catch (err) {
      console.error('Errore creazione task:', err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const updated = await api.updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error('Errore aggiornamento task:', err);
      throw err;
    }
  }, []);

  const getTasksByProject = useCallback((projectId: string) => tasks.filter(t => t.projectId === projectId), [tasks]);

  // ─── UI ────────────────────────────────────────────────────
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  // ─── Alerts ────────────────────────────────────────────────
  const dismissAlert = useCallback(async (id: string) => {
    try {
      await api.dismissAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Errore eliminazione alert:', err);
    }
  }, []);

  const value: EcoProContextType = {
    activities, projects, tasks, alerts, biMetrics, aiInsights,
    marketData, marketingIntel, executiveKPIs,
    selectedActivityId, sidebarOpen, loading, error,
    selectActivity, createActivity, updateActivity, archiveActivity, getActivity,
    getBMC, getScorecard,
    createProject, updateProject, closeProject, getProject, getProjectsByActivity,
    createTask, updateTask, getTasksByProject,
    toggleSidebar, setSidebarOpen,
    dismissAlert, refreshData,
  };

  return (
    <EcoProContext.Provider value={value}>
      {children}
    </EcoProContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────

export function useEcoPro() {
  const context = useContext(EcoProContext);
  if (!context) {
    throw new Error('useEcoPro must be used within an EcoProProvider');
  }
  return context;
}
