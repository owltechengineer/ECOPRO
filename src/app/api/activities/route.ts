// ═══════════════════════════════════════════════════════════════
// API: /api/activities — GET (list) & POST (create)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToActivity, activityToDb } from '@/lib/db-mappers';

export async function GET() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(dbToActivity));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getServiceSupabase();
  const row = activityToDb(body);

  const { data, error } = await supabase
    .from('activities')
    .insert(row)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(dbToActivity(data), { status: 201 });
}
