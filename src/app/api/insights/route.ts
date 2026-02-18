// ═══════════════════════════════════════════════════════════════
// API: /api/insights — GET AI insights
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToAIInsight } from '@/lib/db-mappers';

export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase();
  const agentType = request.nextUrl.searchParams.get('agentType');

  let query = supabase.from('ai_insights').select('*').order('created_at', { ascending: false });
  if (agentType) query = query.eq('agent_type', agentType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(dbToAIInsight));
}
