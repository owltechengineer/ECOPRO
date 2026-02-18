// ═══════════════════════════════════════════════════════════════
// API: /api/alerts — GET & DELETE critical alerts
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToCriticalAlert } from '@/lib/db-mappers';

export async function GET() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('critical_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(dbToCriticalAlert));
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const supabase = getServiceSupabase();
  const { error } = await supabase.from('critical_alerts').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
