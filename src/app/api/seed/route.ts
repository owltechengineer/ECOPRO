// ═══════════════════════════════════════════════════════════════
// API: /api/seed — Popola il database con i dati mock
// POST /api/seed → inserisce tutti i dati di esempio
// ATTENZIONE: Cancella i dati esistenti prima dell'inserimento!
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { activityToDb, projectToDb } from '@/lib/db-mappers';
import {
  mockActivities, mockProjects, mockTasks,
  mockCosts, mockRevenues, mockProducts, mockServices,
  mockMarketData, mockAIInsights, mockBIMetrics,
  mockBMC, mockScorecard, mockMarketingIntel, mockAlerts,
} from '@/data/mock';

export async function POST() {
  const supabase = getServiceSupabase();
  const results: Record<string, string> = {};

  try {
    // 1. Pulisci tutto (ordine per FK)
    await supabase.from('critical_alerts').delete().neq('id', '');
    await supabase.from('marketing_intelligence').delete().neq('id', '');
    await supabase.from('ai_insights').delete().neq('id', '');
    await supabase.from('bi_metrics').delete().neq('id', '');
    await supabase.from('market_data').delete().neq('id', '');
    await supabase.from('services').delete().neq('id', '');
    await supabase.from('products').delete().neq('id', '');
    await supabase.from('revenue_items').delete().neq('id', '');
    await supabase.from('cost_items').delete().neq('id', '');
    await supabase.from('tasks').delete().neq('id', '');
    await supabase.from('projects').delete().neq('id', '');
    await supabase.from('activities').delete().neq('id', '');
    results['cleanup'] = 'OK';

    // 2. Activities (con BMC e Scorecard embedded)
    const actRows = mockActivities.map(a => {
      const bmc = mockBMC.find(b => b.activityId === a.id) || null;
      const scorecard = mockScorecard.find(s => s.activityId === a.id) || null;
      return {
        ...activityToDb(a),
        id: a.id,
        created_at: a.createdAt,
        updated_at: a.updatedAt,
        bmc: bmc ? JSON.parse(JSON.stringify(bmc)) : null,
        scorecard: scorecard ? JSON.parse(JSON.stringify(scorecard)) : null,
      };
    });
    const { error: actErr } = await supabase.from('activities').insert(actRows);
    results['activities'] = actErr ? actErr.message : `${actRows.length} inserted`;

    // 3. Projects
    const prjRows = mockProjects.map(p => ({ ...projectToDb(p), id: p.id, created_at: p.createdAt, updated_at: p.updatedAt }));
    const { error: prjErr } = await supabase.from('projects').insert(prjRows);
    results['projects'] = prjErr ? prjErr.message : `${prjRows.length} inserted`;

    // 4. Tasks
    const taskRows = mockTasks.map(t => ({
      id: t.id,
      project_id: t.projectId,
      title: t.title,
      description: t.description,
      type: t.type,
      priority: t.priority,
      status: t.status,
      deadline: t.deadline,
      dependencies: t.dependencies,
      owner: t.owner,
      estimated_time: t.estimatedTime,
      actual_time: t.actualTime,
      tags: t.tags,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
    }));
    const { error: taskErr } = await supabase.from('tasks').insert(taskRows);
    results['tasks'] = taskErr ? taskErr.message : `${taskRows.length} inserted`;

    // 5. Cost Items
    const costRows = mockCosts.map(c => ({
      id: c.id, project_id: c.projectId, category: c.category,
      description: c.description, estimated: c.estimated, actual: c.actual, date: c.date,
    }));
    const { error: costErr } = await supabase.from('cost_items').insert(costRows);
    results['cost_items'] = costErr ? costErr.message : `${costRows.length} inserted`;

    // 6. Revenue Items
    const revRows = mockRevenues.map(r => ({
      id: r.id, project_id: r.projectId, source: r.source,
      description: r.description, expected: r.expected, actual: r.actual, date: r.date,
    }));
    const { error: revErr } = await supabase.from('revenue_items').insert(revRows);
    results['revenue_items'] = revErr ? revErr.message : `${revRows.length} inserted`;

    // 7. Products
    const prodRows = mockProducts.map(p => ({
      id: p.id, project_id: p.projectId, name: p.name, sku: p.sku,
      cost_per_unit: p.costPerUnit, price: p.price, margin: p.margin,
      stock: p.stock, sales_channel: p.salesChannel, units_sold: p.unitsSold,
      conversion_rate: p.conversionRate, logistics_cost: p.logisticsCost,
    }));
    const { error: prodErr } = await supabase.from('products').insert(prodRows);
    results['products'] = prodErr ? prodErr.message : `${prodRows.length} inserted`;

    // 8. Services
    const svcRows = mockServices.map(s => ({
      id: s.id, project_id: s.projectId, name: s.name, description: s.description,
      packages: s.packages, hourly_rate: s.hourlyRate, sold_hours: s.soldHours,
      delivery_cost: s.deliveryCost, margin: s.margin,
    }));
    const { error: svcErr } = await supabase.from('services').insert(svcRows);
    results['services'] = svcErr ? svcErr.message : `${svcRows.length} inserted`;

    // 9. Market Data
    const mktRows = mockMarketData.map((m, i) => ({
      id: `mkt-${String(i + 1).padStart(3, '0')}`,
      activity_id: 'act-001',
      region: m.region, market_size: m.marketSize, growth_rate: m.growthRate,
      trends: m.trends, competitors: m.competitors,
      pricing_benchmark: m.pricingBenchmark, risks: m.risks,
    }));
    const { error: mktErr } = await supabase.from('market_data').insert(mktRows);
    results['market_data'] = mktErr ? mktErr.message : `${mktRows.length} inserted`;

    // 10. Marketing Intelligence
    const { error: mktIntelErr } = await supabase.from('marketing_intelligence').insert({
      id: 'mki-001',
      activity_id: 'act-001',
      channels: mockMarketingIntel.channels,
      funnel_stages: mockMarketingIntel.funnelStages,
      seo_metrics: mockMarketingIntel.seoMetrics,
      growth_opportunities: mockMarketingIntel.growthOpportunities,
    });
    results['marketing_intelligence'] = mktIntelErr ? mktIntelErr.message : '1 inserted';

    // 11. AI Insights
    const aiRows = mockAIInsights.map(i => ({
      id: i.id, agent_type: i.agentType, title: i.title, description: i.description,
      severity: i.severity, recommendation: i.recommendation,
      related_entity_id: i.relatedEntityId, related_entity_type: i.relatedEntityType,
      created_at: i.createdAt,
    }));
    const { error: aiErr } = await supabase.from('ai_insights').insert(aiRows);
    results['ai_insights'] = aiErr ? aiErr.message : `${aiRows.length} inserted`;

    // 12. BI Metrics
    const biRows = mockBIMetrics.map((b, i) => ({
      id: `bi-${String(i + 1).padStart(3, '0')}`,
      activity_id: b.activityId, period: b.period, revenue: b.revenue,
      costs: b.costs, profit: b.profit, roi: b.roi, roas: b.roas,
      ebitda: b.ebitda, productivity_index: b.productivityIndex,
      customer_count: b.customerCount, churn_rate: b.churnRate,
    }));
    const { error: biErr } = await supabase.from('bi_metrics').insert(biRows);
    results['bi_metrics'] = biErr ? biErr.message : `${biRows.length} inserted`;

    // 13. Critical Alerts
    const alertRows = mockAlerts.map(a => ({
      id: a.id, type: a.type, severity: a.severity,
      title: a.title, description: a.description,
      entity_id: a.entityId, entity_type: a.entityType,
      created_at: a.createdAt,
    }));
    const { error: alertErr } = await supabase.from('critical_alerts').insert(alertRows);
    results['critical_alerts'] = alertErr ? alertErr.message : `${alertRows.length} inserted`;

    return NextResponse.json({ success: true, results });

  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      results,
    }, { status: 500 });
  }
}
