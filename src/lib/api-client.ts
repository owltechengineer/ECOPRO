// ═══════════════════════════════════════════════════════════════
// ECOPRO — API Client (fetch wrapper)
// Tutte le chiamate al database passano da qui
// ═══════════════════════════════════════════════════════════════

import type {
  Activity, Project, Task, AIInsight, BIMetrics,
  MarketData, MarketingIntelligence, CriticalAlert,
  BusinessModelCanvas, BalancedScorecard, CostItem, RevenueItem,
} from '@/types';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API Error ${res.status}`);
  }
  return res.json();
}

// ─── Tipo esteso Activity con BMC e Scorecard ────────────────

export type ActivityWithExtras = Activity & {
  bmc?: BusinessModelCanvas | null;
  scorecard?: BalancedScorecard | null;
};

// ─── API Methods ─────────────────────────────────────────────

export const api = {
  // ── Activities ──────────────────────────────────────────────
  getActivities: () => request<ActivityWithExtras[]>('/api/activities'),
  getActivity: (id: string) => request<ActivityWithExtras>(`/api/activities/${id}`),
  createActivity: (data: Partial<Activity>) =>
    request<ActivityWithExtras>('/api/activities', { method: 'POST', body: JSON.stringify(data) }),
  updateActivity: (id: string, data: Partial<Activity>) =>
    request<ActivityWithExtras>(`/api/activities/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteActivity: (id: string) =>
    request(`/api/activities/${id}`, { method: 'DELETE' }),

  // ── Projects ────────────────────────────────────────────────
  getProjects: (activityId?: string) =>
    request<Project[]>(`/api/projects${activityId ? `?activityId=${activityId}` : ''}`),
  getProject: (id: string) => request<Project>(`/api/projects/${id}`),
  createProject: (data: Partial<Project>) =>
    request<Project>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: Partial<Project>) =>
    request<Project>(`/api/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    request(`/api/projects/${id}`, { method: 'DELETE' }),

  // ── Tasks ───────────────────────────────────────────────────
  getTasks: (projectId?: string) =>
    request<Task[]>(`/api/tasks${projectId ? `?projectId=${projectId}` : ''}`),
  getTask: (id: string) => request<Task>(`/api/tasks/${id}`),
  createTask: (data: Partial<Task>) =>
    request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: Partial<Task>) =>
    request<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id: string) =>
    request(`/api/tasks/${id}`, { method: 'DELETE' }),

  // ── Financials ──────────────────────────────────────────────
  getFinancials: (projectId: string) =>
    request<{ costs: CostItem[]; revenues: RevenueItem[] }>(`/api/financials?projectId=${projectId}`),

  // ── BI Metrics ──────────────────────────────────────────────
  getBIMetrics: (activityId?: string) =>
    request<BIMetrics[]>(`/api/bi${activityId ? `?activityId=${activityId}` : ''}`),

  // ── AI Insights ─────────────────────────────────────────────
  getInsights: (agentType?: string) =>
    request<AIInsight[]>(`/api/insights${agentType ? `?agentType=${agentType}` : ''}`),

  // ── Market Data ─────────────────────────────────────────────
  getMarketData: (activityId?: string) =>
    request<MarketData[]>(`/api/market${activityId ? `?activityId=${activityId}` : ''}`),

  // ── Marketing Intelligence ──────────────────────────────────
  getMarketingIntel: (activityId?: string) =>
    request<MarketingIntelligence | null>(`/api/marketing-intel${activityId ? `?activityId=${activityId}` : ''}`),

  // ── Critical Alerts ─────────────────────────────────────────
  getAlerts: () => request<CriticalAlert[]>('/api/alerts'),
  dismissAlert: (id: string) =>
    request('/api/alerts', { method: 'DELETE', body: JSON.stringify({ id }) }),

  // ── AI Analysis ─────────────────────────────────────────────
  aiAnalyze: (agentType: string, userMessage?: string) =>
    request<{ agentType: string; response: string; provider: string; model: string; modelLabel: string }>('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ agentType, userMessage }),
    }),

  // ── AI Models Info ────────────────────────────────────────
  getAIModels: () =>
    request<{ agents: { agentType: string; provider: string; model: string; modelLabel: string }[] }>('/api/ai/models'),

  // ── Live Market Data (Yahoo Finance) ──────────────────────
  getLiveMarket: (watchlist?: string[]) =>
    request<{
      indices: { symbol: string; name: string; value: number; change: number; changePercent: number; updatedAt: string }[];
      currencies: { pair: string; rate: number; change: number; changePercent: number; updatedAt: string }[];
      commodities: { symbol: string; name: string; price: number; change: number; changePercent: number; currency: string; updatedAt: string }[];
      sectors: { sector: string; performance: number; topStock: string }[];
      watchlist: { symbol: string; name: string; price: number; change: number; changePercent: number; currency: string; marketCap?: number; volume?: number; dayHigh?: number; dayLow?: number; exchange: string; updatedAt: string }[];
      lastUpdated: string;
      source: string;
    }>(`/api/market/live${watchlist ? `?watchlist=${watchlist.join(',')}` : ''}`),

  searchStocks: (query: string) =>
    request<{ results: { symbol: string; name: string; exchange: string }[] }>(`/api/market/search?q=${encodeURIComponent(query)}`),

  getStockHistory: (symbol: string, period?: string) =>
    request<{ symbol: string; period: string; data: { date: string; close: number }[] }>(
      `/api/market/history?symbol=${encodeURIComponent(symbol)}${period ? `&period=${period}` : ''}`
    ),
};
