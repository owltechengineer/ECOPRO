// ═══════════════════════════════════════════════════════════════
// API: /api/ai/analyze — AI Agent Analysis (Multi-Provider)
// Ogni agente usa un modello gratuito diverso (Groq/Gemini)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { aiComplete } from '@/lib/ai-providers';
import { getAgentConfig, type AgentType } from '@/lib/ai-prompts';
import {
  dbToActivity, dbToProject, dbToTask,
  dbToBIMetrics, dbToMarketData, dbToCostItem, dbToRevenueItem,
} from '@/lib/db-mappers';

// ─── Gather context data per agent type ──────────────────────

async function gatherProjectData() {
  const supabase = getServiceSupabase();
  const [projectsRes, tasksRes] = await Promise.all([
    supabase.from('projects').select('*').in('status', ['active', 'planning']),
    supabase.from('tasks').select('*').in('status', ['backlog', 'todo', 'in_progress', 'review', 'blocked']),
  ]);
  return JSON.stringify({
    projects: (projectsRes.data ?? []).map(dbToProject),
    tasks: (tasksRes.data ?? []).map(dbToTask),
  }, null, 2);
}

async function gatherBusinessData() {
  const supabase = getServiceSupabase();
  const [activitiesRes, biRes, costsRes, revenuesRes] = await Promise.all([
    supabase.from('activities').select('*').eq('archived', false),
    supabase.from('bi_metrics').select('*').order('period', { ascending: true }),
    supabase.from('cost_items').select('*'),
    supabase.from('revenue_items').select('*'),
  ]);
  return JSON.stringify({
    activities: (activitiesRes.data ?? []).map(dbToActivity),
    biMetrics: (biRes.data ?? []).map(dbToBIMetrics),
    costs: (costsRes.data ?? []).map(dbToCostItem),
    revenues: (revenuesRes.data ?? []).map(dbToRevenueItem),
  }, null, 2);
}

async function gatherMarketData() {
  const supabase = getServiceSupabase();
  const [marketRes, activitiesRes] = await Promise.all([
    supabase.from('market_data').select('*'),
    supabase.from('activities').select('*').eq('archived', false),
  ]);

  // Arricchisci con dati live da Yahoo Finance se disponibili
  let liveContext = '';
  try {
    const { fetchMarketIndices, fetchCurrencyRates } = await import('@/lib/market-fetcher');
    const [indices, currencies] = await Promise.allSettled([
      fetchMarketIndices(),
      fetchCurrencyRates(),
    ]);
    const liveData = {
      liveIndices: indices.status === 'fulfilled' ? indices.value : [],
      liveCurrencies: currencies.status === 'fulfilled' ? currencies.value : [],
    };
    liveContext = `\n\nDATA DI MERCATO LIVE (Yahoo Finance, ${new Date().toLocaleString('it-IT')}):\n${JSON.stringify(liveData, null, 2)}`;
  } catch {
    // Live data non disponibile, procedi senza
  }

  return JSON.stringify({
    marketData: (marketRes.data ?? []).map(dbToMarketData),
    activities: (activitiesRes.data ?? []).map(dbToActivity),
  }, null, 2) + liveContext;
}

async function gatherAllData() {
  const supabase = getServiceSupabase();
  const [activitiesRes, projectsRes, tasksRes, biRes] = await Promise.all([
    supabase.from('activities').select('*').eq('archived', false),
    supabase.from('projects').select('*').in('status', ['active', 'planning']),
    supabase.from('tasks').select('*'),
    supabase.from('bi_metrics').select('*').order('period', { ascending: true }),
  ]);
  return JSON.stringify({
    activities: (activitiesRes.data ?? []).map(dbToActivity),
    projects: (projectsRes.data ?? []).map(dbToProject),
    tasks: (tasksRes.data ?? []).map(dbToTask),
    biMetrics: (biRes.data ?? []).map(dbToBIMetrics),
  }, null, 2);
}

// ─── Main handler ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { agentType, userMessage } = await request.json() as {
      agentType: AgentType;
      userMessage?: string;
    };

    if (!agentType) {
      return NextResponse.json({ error: 'agentType is required' }, { status: 400 });
    }

    // Gather relevant data based on agent type
    let contextData: string;
    switch (agentType) {
      case 'project':
        contextData = await gatherProjectData();
        break;
      case 'business':
        contextData = await gatherBusinessData();
        break;
      case 'market':
        contextData = await gatherMarketData();
        break;
      case 'chat':
        contextData = await gatherAllData();
        break;
      default:
        return NextResponse.json({ error: 'Invalid agentType' }, { status: 400 });
    }

    const config = getAgentConfig(agentType);
    const userContent = agentType === 'chat' && userMessage
      ? (config.userTemplate as (ctx: string, msg: string) => string)(contextData, userMessage)
      : (config.userTemplate as (data: string) => string)(contextData);

    // Usa il sistema multi-provider (Groq/Gemini gratuiti)
    const result = await aiComplete({
      agentType,
      systemPrompt: config.system,
      userContent,
      jsonMode: agentType !== 'chat',
    });

    // Per gli agenti analitici, salva gli insight nel DB
    if (agentType !== 'chat') {
      try {
        const parsed = JSON.parse(result.content);
        if (parsed.insights?.length > 0) {
          const supabase = getServiceSupabase();
          const insightRows = parsed.insights.map((i: {
            title: string;
            description: string;
            severity: string;
            recommendation: string;
            relatedEntityId: string;
            relatedEntityType: string;
          }) => ({
            agent_type: agentType,
            title: i.title,
            description: i.description,
            severity: i.severity || 'info',
            recommendation: i.recommendation || '',
            related_entity_id: i.relatedEntityId || '',
            related_entity_type: i.relatedEntityType || '',
          }));
          await supabase.from('ai_insights').insert(insightRows);
        }
      } catch {
        // Se il parse fallisce, restituisco comunque il testo raw
      }
    }

    return NextResponse.json({
      agentType,
      response: result.content,
      provider: result.provider,
      model: result.model,
      modelLabel: result.modelLabel,
      usage: result.usage,
    });

  } catch (error) {
    console.error('AI Analyze error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
