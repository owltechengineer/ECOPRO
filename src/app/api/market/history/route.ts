// ═══════════════════════════════════════════════════════════════
// API: /api/market/history — Dati storici per un simbolo
// Fonte: Yahoo Finance (gratuito)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { fetchHistorical } from '@/lib/market-fetcher';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  const period = request.nextUrl.searchParams.get('period') as '1mo' | '3mo' | '6mo' | '1y' || '3mo';

  if (!symbol) {
    return NextResponse.json({ error: 'symbol parameter required' }, { status: 400 });
  }

  try {
    const data = await fetchHistorical(symbol, period);
    return NextResponse.json({ symbol, period, data, source: 'Yahoo Finance' });
  } catch (error) {
    console.error('Market history error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
