// ═══════════════════════════════════════════════════════════════
// API: /api/market/search — Cerca azioni/ETF per nome o ticker
// Fonte: Yahoo Finance (gratuito)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { searchStocks } from '@/lib/market-fetcher';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchStocks(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Market search error:', error);
    return NextResponse.json({ results: [] });
  }
}
