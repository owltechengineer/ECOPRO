// ═══════════════════════════════════════════════════════════════
// API: /api/tasks/[id] — GET, PATCH, DELETE
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToTask, taskToDb } from '@/lib/db-mappers';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(dbToTask(data));
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const supabase = getServiceSupabase();
  const row = taskToDb(body);

  const { data, error } = await supabase.from('tasks').update(row).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(dbToTask(data));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
