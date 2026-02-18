-- ═══════════════════════════════════════════════════════════════
-- ECOPRO — Schema v2 (supplementare)
-- Esegui DOPO supabase-schema.sql nel SQL Editor
-- Aggiunge: BMC, Scorecard, Marketing Intelligence, Critical Alerts
-- ═══════════════════════════════════════════════════════════════

-- ─── Aggiungi campi JSONB alla tabella activities ────────────
ALTER TABLE activities ADD COLUMN IF NOT EXISTS bmc JSONB DEFAULT NULL;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS scorecard JSONB DEFAULT NULL;

-- ─── MARKETING INTELLIGENCE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS marketing_intelligence (
  id              TEXT PRIMARY KEY DEFAULT 'mki-' || substr(uuid_generate_v4()::text, 1, 8),
  activity_id     TEXT REFERENCES activities(id) ON DELETE CASCADE,
  channels        JSONB DEFAULT '[]',
  funnel_stages   JSONB DEFAULT '[]',
  seo_metrics     JSONB DEFAULT '{}',
  growth_opportunities TEXT[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_marketing_intel_activity ON marketing_intelligence(activity_id);

-- ─── CRITICAL ALERTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS critical_alerts (
  id          TEXT PRIMARY KEY DEFAULT 'alert-' || substr(uuid_generate_v4()::text, 1, 8),
  type        TEXT NOT NULL CHECK (type IN ('delay', 'budget', 'risk', 'performance')),
  severity    TEXT DEFAULT 'warning' CHECK (severity IN ('warning', 'critical')),
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  entity_id   TEXT DEFAULT '',
  entity_type TEXT DEFAULT '' CHECK (entity_type IN ('activity', 'project', 'task', '')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_severity ON critical_alerts(severity);
