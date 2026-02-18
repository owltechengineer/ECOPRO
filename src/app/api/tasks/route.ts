// ═══════════════════════════════════════════════════════════════
// API: /api/tasks — GET (list) & POST (create)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToTask, taskToDb } from '@/lib/db-mappers';

export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase();
  const projectId = request.nextUrl.searchParams.get('projectId');

  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(dbToTask));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getServiceSupabase();
  const row = taskToDb(body);

  const { data, error } = await supabase
    .from('tasks')
    .insert(row)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(dbToTask(data), { status: 201 });
}
