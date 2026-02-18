// ═══════════════════════════════════════════════════════════════
// API: /api/financials — GET costs, revenues per project
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToCostItem, dbToRevenueItem } from '@/lib/db-mappers';

export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase();
  const projectId = request.nextUrl.searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'projectId query param required' }, { status: 400 });
  }

  const [costsRes, revenuesRes] = await Promise.all([
    supabase.from('cost_items').select('*').eq('project_id', projectId).order('date'),
    supabase.from('revenue_items').select('*').eq('project_id', projectId).order('date'),
  ]);

  if (costsRes.error) return NextResponse.json({ error: costsRes.error.message }, { status: 500 });
  if (revenuesRes.error) return NextResponse.json({ error: revenuesRes.error.message }, { status: 500 });

  return NextResponse.json({
    costs: costsRes.data.map(dbToCostItem),
    revenues: revenuesRes.data.map(dbToRevenueItem),
  });
}
