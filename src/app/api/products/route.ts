// ═══════════════════════════════════════════════════════════════
// API: /api/products — GET & POST
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { dbToProduct } from '@/lib/db-mappers';

export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase();
  const projectId = request.nextUrl.searchParams.get('projectId');

  let query = supabase.from('products').select('*');
  if (projectId) query = query.eq('project_id', projectId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(dbToProduct));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getServiceSupabase();

  const { data, error } = await supabase.from('products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(dbToProduct(data), { status: 201 });
}
