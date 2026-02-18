// ═══════════════════════════════════════════════════════════════
// API: /api/projects — GET (list) & POST (create)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToProject, projectToDb } from '@/lib/db-mappers';

export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase();
  const activityId = request.nextUrl.searchParams.get('activityId');

  let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (activityId) query = query.eq('activity_id', activityId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(dbToProject));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getServiceSupabase();
  const row = projectToDb(body);

  const { data, error } = await supabase
    .from('projects')
    .insert(row)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(dbToProject(data), { status: 201 });
}
