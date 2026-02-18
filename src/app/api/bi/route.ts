// ═══════════════════════════════════════════════════════════════
// API: /api/bi — GET BI metrics
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToBIMetrics } from '@/lib/db-mappers';

export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase();
  const activityId = request.nextUrl.searchParams.get('activityId');

  let query = supabase.from('bi_metrics').select('*').order('period', { ascending: true });
  if (activityId) query = query.eq('activity_id', activityId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(dbToBIMetrics));
}
