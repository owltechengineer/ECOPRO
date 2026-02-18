// ═══════════════════════════════════════════════════════════════
// API: /api/ai/models — Info sui modelli AI per ogni agente
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { getAgentsInfo } from '@/lib/ai-providers';

export async function GET() {
  const agents = getAgentsInfo();
  return NextResponse.json({ agents });
}
