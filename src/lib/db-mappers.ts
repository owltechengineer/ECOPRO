// ═══════════════════════════════════════════════════════════════
// ECOPRO — DB ↔ App Mappers (snake_case ↔ camelCase)
// ═══════════════════════════════════════════════════════════════

import type {
  Activity, Project, Task, CostItem, RevenueItem,
  Product, Service, MarketData, MarketingIntelligence,
  AIInsight, BIMetrics, CriticalAlert,
  BusinessModelCanvas, BalancedScorecard,
} from '@/types';

// ─── ACTIVITY ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToActivity(row: any): Activity & { bmc?: BusinessModelCanvas | null; scorecard?: BalancedScorecard | null } {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sector: row.sector,
    geography: row.geography,
    businessModels: row.business_models ?? [],
    lifecycleStage: row.lifecycle_stage,
    strategicObjectives: row.strategic_objectives ?? [],
    risks: row.risks ?? [],
    kpis: row.kpis ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archived: row.archived,
    color: row.color,
    icon: row.icon,
    bmc: row.bmc ?? null,
    scorecard: row.scorecard ?? null,
  };
}

export function activityToDb(a: Partial<Activity> & { bmc?: BusinessModelCanvas | null; scorecard?: BalancedScorecard | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = {};
  if (a.id !== undefined) row.id = a.id;
  if (a.name !== undefined) row.name = a.name;
  if (a.description !== undefined) row.description = a.description;
  if (a.sector !== undefined) row.sector = a.sector;
  if (a.geography !== undefined) row.geography = a.geography;
  if (a.businessModels !== undefined) row.business_models = a.businessModels;
  if (a.lifecycleStage !== undefined) row.lifecycle_stage = a.lifecycleStage;
  if (a.strategicObjectives !== undefined) row.strategic_objectives = a.strategicObjectives;
  if (a.risks !== undefined) row.risks = a.risks;
  if (a.kpis !== undefined) row.kpis = a.kpis;
  if (a.archived !== undefined) row.archived = a.archived;
  if (a.color !== undefined) row.color = a.color;
  if (a.icon !== undefined) row.icon = a.icon;
  if (a.bmc !== undefined) row.bmc = a.bmc;
  if (a.scorecard !== undefined) row.scorecard = a.scorecard;
  return row;
}

// ─── PROJECT ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToProject(row: any): Project {
  return {
    id: row.id,
    activityId: row.activity_id,
    name: row.name,
    description: row.description,
    type: row.type,
    methodology: row.methodology,
    status: row.status,
    charter: row.charter ?? {},
    wbs: row.wbs ?? [],
    milestones: row.milestones ?? [],
    startDate: row.start_date,
    endDate: row.end_date,
    progress: Number(row.progress),
    budget: Number(row.budget),
    spent: Number(row.spent),
    expectedRevenue: Number(row.expected_revenue),
    actualRevenue: Number(row.actual_revenue),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    enabledModules: row.enabled_modules ?? [],
  };
}

export function projectToDb(p: Partial<Project>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.activityId !== undefined) row.activity_id = p.activityId;
  if (p.name !== undefined) row.name = p.name;
  if (p.description !== undefined) row.description = p.description;
  if (p.type !== undefined) row.type = p.type;
  if (p.methodology !== undefined) row.methodology = p.methodology;
  if (p.status !== undefined) row.status = p.status;
  if (p.charter !== undefined) row.charter = p.charter;
  if (p.wbs !== undefined) row.wbs = p.wbs;
  if (p.milestones !== undefined) row.milestones = p.milestones;
  if (p.startDate !== undefined) row.start_date = p.startDate;
  if (p.endDate !== undefined) row.end_date = p.endDate;
  if (p.progress !== undefined) row.progress = p.progress;
  if (p.budget !== undefined) row.budget = p.budget;
  if (p.spent !== undefined) row.spent = p.spent;
  if (p.expectedRevenue !== undefined) row.expected_revenue = p.expectedRevenue;
  if (p.actualRevenue !== undefined) row.actual_revenue = p.actualRevenue;
  if (p.enabledModules !== undefined) row.enabled_modules = p.enabledModules;
  return row;
}

// ─── TASK ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToTask(row: any): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    type: row.type,
    priority: row.priority,
    status: row.status,
    deadline: row.deadline,
    dependencies: row.dependencies ?? [],
    owner: row.owner,
    estimatedTime: Number(row.estimated_time),
    actualTime: Number(row.actual_time),
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function taskToDb(t: Partial<Task>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = {};
  if (t.id !== undefined) row.id = t.id;
  if (t.projectId !== undefined) row.project_id = t.projectId;
  if (t.title !== undefined) row.title = t.title;
  if (t.description !== undefined) row.description = t.description;
  if (t.type !== undefined) row.type = t.type;
  if (t.priority !== undefined) row.priority = t.priority;
  if (t.status !== undefined) row.status = t.status;
  if (t.deadline !== undefined) row.deadline = t.deadline;
  if (t.dependencies !== undefined) row.dependencies = t.dependencies;
  if (t.owner !== undefined) row.owner = t.owner;
  if (t.estimatedTime !== undefined) row.estimated_time = t.estimatedTime;
  if (t.actualTime !== undefined) row.actual_time = t.actualTime;
  if (t.tags !== undefined) row.tags = t.tags;
  return row;
}

// ─── COST ITEM ───────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToCostItem(row: any): CostItem {
  return {
    id: row.id,
    projectId: row.project_id,
    category: row.category,
    description: row.description,
    estimated: Number(row.estimated),
    actual: Number(row.actual),
    date: row.date,
  };
}

// ─── REVENUE ITEM ────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToRevenueItem(row: any): RevenueItem {
  return {
    id: row.id,
    projectId: row.project_id,
    source: row.source,
    description: row.description,
    expected: Number(row.expected),
    actual: Number(row.actual),
    date: row.date,
  };
}

// ─── PRODUCT ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToProduct(row: any): Product {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    sku: row.sku,
    costPerUnit: Number(row.cost_per_unit),
    price: Number(row.price),
    margin: Number(row.margin),
    stock: Number(row.stock),
    salesChannel: row.sales_channel ?? [],
    unitsSold: Number(row.units_sold),
    conversionRate: Number(row.conversion_rate),
    logisticsCost: Number(row.logistics_cost),
  };
}

// ─── SERVICE ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToService(row: any): Service {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    description: row.description,
    packages: row.packages ?? [],
    hourlyRate: Number(row.hourly_rate),
    soldHours: Number(row.sold_hours),
    deliveryCost: Number(row.delivery_cost),
    margin: Number(row.margin),
  };
}

// ─── MARKET DATA ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToMarketData(row: any): MarketData {
  return {
    region: row.region,
    marketSize: Number(row.market_size),
    growthRate: Number(row.growth_rate),
    trends: row.trends ?? [],
    competitors: row.competitors ?? [],
    pricingBenchmark: row.pricing_benchmark ?? { low: 0, median: 0, high: 0 },
    risks: row.risks ?? [],
  };
}

// ─── MARKETING INTELLIGENCE ──────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToMarketingIntel(row: any): MarketingIntelligence {
  return {
    channels: row.channels ?? [],
    funnelStages: row.funnel_stages ?? [],
    seoMetrics: row.seo_metrics ?? { organicTraffic: 0, keywords: 0, domainAuthority: 0 },
    growthOpportunities: row.growth_opportunities ?? [],
  };
}

// ─── AI INSIGHT ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToAIInsight(row: any): AIInsight {
  return {
    id: row.id,
    agentType: row.agent_type,
    title: row.title,
    description: row.description,
    severity: row.severity,
    recommendation: row.recommendation,
    relatedEntityId: row.related_entity_id,
    relatedEntityType: row.related_entity_type,
    createdAt: row.created_at,
  };
}

// ─── BI METRICS ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToBIMetrics(row: any): BIMetrics {
  return {
    activityId: row.activity_id,
    period: row.period,
    revenue: Number(row.revenue),
    costs: Number(row.costs),
    profit: Number(row.profit),
    roi: Number(row.roi),
    roas: Number(row.roas),
    ebitda: Number(row.ebitda),
    productivityIndex: Number(row.productivity_index),
    customerCount: Number(row.customer_count),
    churnRate: Number(row.churn_rate),
  };
}

// ─── CRITICAL ALERT ──────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToCriticalAlert(row: any): CriticalAlert {
  return {
    id: row.id,
    type: row.type,
    severity: row.severity,
    title: row.title,
    description: row.description,
    entityId: row.entity_id,
    entityType: row.entity_type,
    createdAt: row.created_at,
  };
}
