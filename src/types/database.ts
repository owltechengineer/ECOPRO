// ═══════════════════════════════════════════════════════════════
// ECOPRO — Supabase Database Types
// ═══════════════════════════════════════════════════════════════

// ─── Row types ────────────────────────────────────────────────

export interface ActivityRow {
  id: string;
  name: string;
  description: string;
  sector: string;
  geography: string;
  business_models: string[];
  lifecycle_stage: string;
  strategic_objectives: Record<string, unknown>[];
  risks: Record<string, unknown>[];
  kpis: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  archived: boolean;
  color: string;
  icon: string;
  bmc: Record<string, unknown> | null;
  scorecard: Record<string, unknown> | null;
}

export interface ProjectRow {
  id: string;
  activity_id: string;
  name: string;
  description: string;
  type: string;
  methodology: string;
  status: string;
  charter: Record<string, unknown>;
  wbs: Record<string, unknown>[];
  milestones: Record<string, unknown>[];
  start_date: string;
  end_date: string;
  progress: number;
  budget: number;
  spent: number;
  expected_revenue: number;
  actual_revenue: number;
  created_at: string;
  updated_at: string;
  enabled_modules: string[];
}

export interface TaskRow {
  id: string;
  project_id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  deadline: string;
  dependencies: string[];
  owner: string;
  estimated_time: number;
  actual_time: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CostItemRow {
  id: string;
  project_id: string;
  category: string;
  description: string;
  estimated: number;
  actual: number;
  date: string;
}

export interface RevenueItemRow {
  id: string;
  project_id: string;
  source: string;
  description: string;
  expected: number;
  actual: number;
  date: string;
}

export interface ProductRow {
  id: string;
  project_id: string;
  name: string;
  sku: string;
  cost_per_unit: number;
  price: number;
  margin: number;
  stock: number;
  sales_channel: string[];
  units_sold: number;
  conversion_rate: number;
  logistics_cost: number;
}

export interface ServiceRow {
  id: string;
  project_id: string;
  name: string;
  description: string;
  packages: Record<string, unknown>[];
  hourly_rate: number;
  sold_hours: number;
  delivery_cost: number;
  margin: number;
}

export interface MarketDataRow {
  id: string;
  activity_id: string;
  region: string;
  market_size: number;
  growth_rate: number;
  trends: string[];
  competitors: Record<string, unknown>[];
  pricing_benchmark: Record<string, unknown>;
  risks: string[];
}

export interface MarketingIntelligenceRow {
  id: string;
  activity_id: string;
  channels: Record<string, unknown>[];
  funnel_stages: Record<string, unknown>[];
  seo_metrics: Record<string, unknown>;
  growth_opportunities: string[];
}

export interface AIInsightRow {
  id: string;
  agent_type: string;
  title: string;
  description: string;
  severity: string;
  recommendation: string;
  related_entity_id: string;
  related_entity_type: string;
  created_at: string;
}

export interface BIMetricsRow {
  id: string;
  activity_id: string;
  period: string;
  revenue: number;
  costs: number;
  profit: number;
  roi: number;
  roas: number;
  ebitda: number;
  productivity_index: number;
  customer_count: number;
  churn_rate: number;
}

export interface CriticalAlertRow {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  entity_id: string;
  entity_type: string;
  created_at: string;
}

// ─── Database interface ───────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: ActivityRow;
        Insert: Partial<ActivityRow> & { name: string };
        Update: Partial<ActivityRow>;
      };
      projects: {
        Row: ProjectRow;
        Insert: Partial<ProjectRow> & { name: string; activity_id: string };
        Update: Partial<ProjectRow>;
      };
      tasks: {
        Row: TaskRow;
        Insert: Partial<TaskRow> & { title: string; project_id: string };
        Update: Partial<TaskRow>;
      };
      cost_items: {
        Row: CostItemRow;
        Insert: CostItemRow;
        Update: Partial<CostItemRow>;
      };
      revenue_items: {
        Row: RevenueItemRow;
        Insert: RevenueItemRow;
        Update: Partial<RevenueItemRow>;
      };
      products: {
        Row: ProductRow;
        Insert: ProductRow;
        Update: Partial<ProductRow>;
      };
      services: {
        Row: ServiceRow;
        Insert: ServiceRow;
        Update: Partial<ServiceRow>;
      };
      market_data: {
        Row: MarketDataRow;
        Insert: MarketDataRow;
        Update: Partial<MarketDataRow>;
      };
      marketing_intelligence: {
        Row: MarketingIntelligenceRow;
        Insert: MarketingIntelligenceRow;
        Update: Partial<MarketingIntelligenceRow>;
      };
      ai_insights: {
        Row: AIInsightRow;
        Insert: Partial<AIInsightRow> & { title: string; agent_type: string };
        Update: Partial<AIInsightRow>;
      };
      bi_metrics: {
        Row: BIMetricsRow;
        Insert: BIMetricsRow;
        Update: Partial<BIMetricsRow>;
      };
      critical_alerts: {
        Row: CriticalAlertRow;
        Insert: Partial<CriticalAlertRow> & { title: string; type: string };
        Update: Partial<CriticalAlertRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
