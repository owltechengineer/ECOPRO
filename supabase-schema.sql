-- ═══════════════════════════════════════════════════════════════
-- ECOPRO — Supabase Database Schema
-- Esegui questo SQL nel SQL Editor di Supabase Dashboard
-- https://supabase.com/dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ─── ENABLE EXTENSIONS ───────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ACTIVITIES (Business Units / Aziende) ───────────────────
CREATE TABLE IF NOT EXISTS activities (
  id            TEXT PRIMARY KEY DEFAULT 'act-' || substr(uuid_generate_v4()::text, 1, 8),
  name          TEXT NOT NULL,
  description   TEXT DEFAULT '',
  sector        TEXT DEFAULT '',
  geography     TEXT DEFAULT '',
  business_models TEXT[] DEFAULT '{}',
  lifecycle_stage TEXT DEFAULT 'idea' CHECK (lifecycle_stage IN ('idea', 'validation', 'active', 'scale', 'paused')),
  strategic_objectives JSONB DEFAULT '[]',
  risks         JSONB DEFAULT '[]',
  kpis          JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  archived      BOOLEAN DEFAULT FALSE,
  color         TEXT DEFAULT '#3B82F6',
  icon          TEXT DEFAULT 'Briefcase'
);

-- ─── PROJECTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY DEFAULT 'prj-' || substr(uuid_generate_v4()::text, 1, 8),
  activity_id     TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT DEFAULT '',
  type            TEXT DEFAULT 'mixed' CHECK (type IN ('ecommerce', 'startup', 'marketing', 'R&D', 'operations', 'consulting', 'mixed')),
  methodology     TEXT DEFAULT 'Agile' CHECK (methodology IN ('Waterfall', 'Agile', 'Scrum', 'Kanban', 'Lean', 'Hybrid')),
  status          TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  charter         JSONB DEFAULT '{}',
  wbs             JSONB DEFAULT '[]',
  milestones      JSONB DEFAULT '[]',
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  progress        NUMERIC DEFAULT 0,
  budget          NUMERIC DEFAULT 0,
  spent           NUMERIC DEFAULT 0,
  expected_revenue NUMERIC DEFAULT 0,
  actual_revenue  NUMERIC DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  enabled_modules TEXT[] DEFAULT '{}'
);

-- ─── TASKS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id              TEXT PRIMARY KEY DEFAULT 't-' || substr(uuid_generate_v4()::text, 1, 8),
  project_id      TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT DEFAULT '',
  type            TEXT DEFAULT 'operational' CHECK (type IN ('strategic', 'operational')),
  priority        TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status          TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done', 'blocked')),
  deadline        DATE,
  dependencies    TEXT[] DEFAULT '{}',
  owner           TEXT DEFAULT '',
  estimated_time  NUMERIC DEFAULT 0,
  actual_time     NUMERIC DEFAULT 0,
  tags            TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COST ITEMS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cost_items (
  id          TEXT PRIMARY KEY DEFAULT 'c-' || substr(uuid_generate_v4()::text, 1, 8),
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,
  description TEXT DEFAULT '',
  estimated   NUMERIC DEFAULT 0,
  actual      NUMERIC DEFAULT 0,
  date        TEXT NOT NULL
);

-- ─── REVENUE ITEMS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS revenue_items (
  id          TEXT PRIMARY KEY DEFAULT 'rv-' || substr(uuid_generate_v4()::text, 1, 8),
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source      TEXT NOT NULL,
  description TEXT DEFAULT '',
  expected    NUMERIC DEFAULT 0,
  actual      NUMERIC DEFAULT 0,
  date        TEXT NOT NULL
);

-- ─── PRODUCTS (Ecommerce Module) ─────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              TEXT PRIMARY KEY DEFAULT 'prod-' || substr(uuid_generate_v4()::text, 1, 8),
  project_id      TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  sku             TEXT UNIQUE NOT NULL,
  cost_per_unit   NUMERIC DEFAULT 0,
  price           NUMERIC DEFAULT 0,
  margin          NUMERIC DEFAULT 0,
  stock           INTEGER DEFAULT 0,
  sales_channel   TEXT[] DEFAULT '{}',
  units_sold      INTEGER DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  logistics_cost  NUMERIC DEFAULT 0
);

-- ─── SERVICES (Services Module) ──────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            TEXT PRIMARY KEY DEFAULT 'svc-' || substr(uuid_generate_v4()::text, 1, 8),
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT DEFAULT '',
  packages      JSONB DEFAULT '[]',
  hourly_rate   NUMERIC DEFAULT 0,
  sold_hours    NUMERIC DEFAULT 0,
  delivery_cost NUMERIC DEFAULT 0,
  margin        NUMERIC DEFAULT 0
);

-- ─── MARKET DATA ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_data (
  id                TEXT PRIMARY KEY DEFAULT 'mkt-' || substr(uuid_generate_v4()::text, 1, 8),
  activity_id       TEXT REFERENCES activities(id) ON DELETE SET NULL,
  region            TEXT DEFAULT 'national' CHECK (region IN ('local', 'national', 'european', 'global')),
  market_size       NUMERIC DEFAULT 0,
  growth_rate       NUMERIC DEFAULT 0,
  trends            TEXT[] DEFAULT '{}',
  competitors       JSONB DEFAULT '[]',
  pricing_benchmark JSONB DEFAULT '{}',
  risks             TEXT[] DEFAULT '{}'
);

-- ─── AI INSIGHTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_insights (
  id                  TEXT PRIMARY KEY DEFAULT 'ai-' || substr(uuid_generate_v4()::text, 1, 8),
  agent_type          TEXT NOT NULL CHECK (agent_type IN ('project', 'business', 'market')),
  title               TEXT NOT NULL,
  description         TEXT DEFAULT '',
  severity            TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  recommendation      TEXT DEFAULT '',
  related_entity_id   TEXT DEFAULT '',
  related_entity_type TEXT DEFAULT '' CHECK (related_entity_type IN ('activity', 'project', 'task', '')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BI METRICS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bi_metrics (
  id                 TEXT PRIMARY KEY DEFAULT 'bi-' || substr(uuid_generate_v4()::text, 1, 8),
  activity_id        TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  period             TEXT NOT NULL,
  revenue            NUMERIC DEFAULT 0,
  costs              NUMERIC DEFAULT 0,
  profit             NUMERIC DEFAULT 0,
  roi                NUMERIC DEFAULT 0,
  roas               NUMERIC DEFAULT 0,
  ebitda             NUMERIC DEFAULT 0,
  productivity_index NUMERIC DEFAULT 0,
  customer_count     INTEGER DEFAULT 0,
  churn_rate         NUMERIC DEFAULT 0,
  UNIQUE(activity_id, period)
);

-- ─── AUTO-UPDATE updated_at TRIGGER ──────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY (opzionale, attivare per produzione) ─
-- ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cost_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE revenue_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bi_metrics ENABLE ROW LEVEL SECURITY;

-- ─── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_activity ON projects(activity_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_cost_items_project ON cost_items(project_id);
CREATE INDEX IF NOT EXISTS idx_revenue_items_project ON revenue_items(project_id);
CREATE INDEX IF NOT EXISTS idx_products_project ON products(project_id);
CREATE INDEX IF NOT EXISTS idx_services_project ON services(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_agent ON ai_insights(agent_type);
CREATE INDEX IF NOT EXISTS idx_bi_metrics_activity ON bi_metrics(activity_id);
CREATE INDEX IF NOT EXISTS idx_market_data_activity ON market_data(activity_id);
