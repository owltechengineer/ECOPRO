// ═══════════════════════════════════════════════════════════════
// API: /api/marketing-intel — GET marketing intelligence
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToMarketingIntel } from '@/lib/db-mappers';

export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase();
  const activityId = request.nextUrl.searchParams.get('activityId');

  let query = supabase.from('marketing_intelligence').select('*');
  if (activityId) query = query.eq('activity_id', activityId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Restituisci il primo risultato (è tipicamente uno per attività)
  if (data.length > 0) {
    return NextResponse.json(dbToMarketingIntel(data[0]));
  }
  return NextResponse.json(null);
}
