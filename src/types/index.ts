// ═══════════════════════════════════════════════════════════════
// ECOPRO — Core Type Definitions
// Platform: Project Management, BI & Market Intelligence
// ═══════════════════════════════════════════════════════════════

// ─── ENUMS & LITERALS ─────────────────────────────────────────

export type BusinessModel = 'B2C' | 'B2B' | 'D2C' | 'SaaS' | 'Services' | 'Hybrid';
export type LifecycleStage = 'idea' | 'validation' | 'active' | 'scale' | 'paused';
export type ProjectType = 'ecommerce' | 'startup' | 'marketing' | 'R&D' | 'operations' | 'consulting' | 'mixed';
export type ProjectMethodology = 'Waterfall' | 'Agile' | 'Scrum' | 'Kanban' | 'Lean' | 'Hybrid';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
export type TaskType = 'strategic' | 'operational';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ModuleType = 'ecommerce' | 'services' | 'startup';

// ─── ACTIVITY (BUSINESS UNIT / AZIENDA) ──────────────────────

export interface StrategicObjective {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  kpiLinks: string[];
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  probability: RiskLevel;
  impact: RiskLevel;
  mitigation: string;
  status: 'identified' | 'mitigated' | 'accepted' | 'closed';
  owner: string;
}

export interface ActivityKPIs {
  revenue: number;
  previousRevenue: number;
  growth: number;
  margin: number;
  cac: number;
  ltv: number;
  roi: number;
  burnRate: number;
  customersTotal: number;
  monthlyRecurring: number;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  sector: string;
  geography: string;
  businessModels: BusinessModel[];
  lifecycleStage: LifecycleStage;
  strategicObjectives: StrategicObjective[];
  risks: Risk[];
  kpis: ActivityKPIs;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  color: string;
  icon: string;
}

// ─── BUSINESS MODEL CANVAS ────────────────────────────────────

export interface BusinessModelCanvas {
  activityId: string;
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

// ─── BALANCED SCORECARD ───────────────────────────────────────

export interface ScorecardObjective {
  title: string;
  measure: string;
  target: string;
  actual: string;
  status: 'on_track' | 'at_risk' | 'behind';
}

export interface ScorecardPerspective {
  name: string;
  objectives: ScorecardObjective[];
}

export interface BalancedScorecard {
  activityId: string;
  financial: ScorecardPerspective;
  customer: ScorecardPerspective;
  internal: ScorecardPerspective;
  learning: ScorecardPerspective;
}

// ─── PROJECT ──────────────────────────────────────────────────

export interface Stakeholder {
  name: string;
  role: string;
  influence: 'high' | 'medium' | 'low';
}

export interface ProjectCharter {
  objectives: string[];
  scope: string;
  stakeholders: Stakeholder[];
  constraints: string[];
  assumptions: string[];
  risks: Risk[];
}

export interface WBSItem {
  id: string;
  title: string;
  type: 'phase' | 'activity' | 'deliverable' | 'work_package';
  parentId: string | null;
  children: string[];
  status: TaskStatus;
  progress: number;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'completed' | 'delayed';
  deliverables: string[];
}

export interface Project {
  id: string;
  activityId: string;
  name: string;
  description: string;
  type: ProjectType;
  methodology: ProjectMethodology;
  status: ProjectStatus;
  charter: ProjectCharter;
  wbs: WBSItem[];
  milestones: Milestone[];
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  spent: number;
  expectedRevenue: number;
  actualRevenue: number;
  createdAt: string;
  updatedAt: string;
  enabledModules: ModuleType[];
}

// ─── TASK / WORK PACKAGE ──────────────────────────────────────

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  dependencies: string[];
  owner: string;
  estimatedTime: number;
  actualTime: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── FINANCIAL CONTROL ────────────────────────────────────────

export interface CostItem {
  id: string;
  projectId: string;
  category: string;
  description: string;
  estimated: number;
  actual: number;
  date: string;
}

export interface RevenueItem {
  id: string;
  projectId: string;
  source: string;
  description: string;
  expected: number;
  actual: number;
  date: string;
}

export interface CashFlowEntry {
  month: string;
  inflow: number;
  outflow: number;
  net: number;
  cumulative: number;
}

export interface FinancialSummary {
  projectId: string;
  totalBudget: number;
  totalSpent: number;
  totalExpectedRevenue: number;
  totalActualRevenue: number;
  costVariance: number;
  revenueVariance: number;
  projectMargin: number;
  breakEvenPoint: number;
  cashFlow: CashFlowEntry[];
}

// ─── ECOMMERCE MODULE ─────────────────────────────────────────

export interface Product {
  id: string;
  projectId: string;
  name: string;
  sku: string;
  costPerUnit: number;
  price: number;
  margin: number;
  stock: number;
  salesChannel: string[];
  unitsSold: number;
  conversionRate: number;
  logisticsCost: number;
}

// ─── SERVICES MODULE ──────────────────────────────────────────

export interface ServicePackage {
  name: string;
  price: number;
  features: string[];
}

export interface Service {
  id: string;
  projectId: string;
  name: string;
  description: string;
  packages: ServicePackage[];
  hourlyRate: number;
  soldHours: number;
  deliveryCost: number;
  margin: number;
}

// ─── MARKET INTELLIGENCE ──────────────────────────────────────

export interface Competitor {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
}

export interface MarketData {
  region: 'local' | 'national' | 'european' | 'global';
  marketSize: number;
  growthRate: number;
  trends: string[];
  competitors: Competitor[];
  pricingBenchmark: { low: number; median: number; high: number };
  risks: string[];
}

export interface FunnelStage {
  name: string;
  visitors: number;
  dropoff: number;
}

export interface ChannelMetric {
  name: string;
  cac: number;
  conversionRate: number;
  roi: number;
}

export interface MarketingIntelligence {
  channels: ChannelMetric[];
  funnelStages: FunnelStage[];
  seoMetrics: { organicTraffic: number; keywords: number; domainAuthority: number };
  growthOpportunities: string[];
}

// ─── AI INSIGHTS ──────────────────────────────────────────────

export interface AIInsight {
  id: string;
  agentType: 'project' | 'business' | 'market';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  recommendation: string;
  relatedEntityId: string;
  relatedEntityType: 'activity' | 'project' | 'task';
  createdAt: string;
}

// ─── BI METRICS ───────────────────────────────────────────────

export interface BIMetrics {
  activityId: string;
  period: string;
  revenue: number;
  costs: number;
  profit: number;
  roi: number;
  roas: number;
  ebitda: number;
  productivityIndex: number;
  customerCount: number;
  churnRate: number;
}

// ─── EXECUTIVE DASHBOARD ──────────────────────────────────────

export interface ExecutiveKPIs {
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  activeActivities: number;
  activeProjects: number;
  pendingTasks: number;
  overdueTasks: number;
  criticalAlerts: number;
  averageProjectProgress: number;
  cashFlowNet: number;
  aggregatedROI: number;
  monthlyGrowth: number;
}

export interface CriticalAlert {
  id: string;
  type: 'delay' | 'budget' | 'risk' | 'performance';
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  entityId: string;
  entityType: 'activity' | 'project' | 'task';
  createdAt: string;
}

// ─── NAVIGATION ───────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

// ─── TIME SERIES ──────────────────────────────────────────────

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MultiSeriesPoint {
  date: string;
  [key: string]: string | number;
}
