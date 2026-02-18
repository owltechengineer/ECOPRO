// ═══════════════════════════════════════════════════════════════
// API: /api/market/live — Dati di mercato in tempo reale
// Fonte: Yahoo Finance (gratuito, nessuna API key richiesta)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { fetchAllLiveMarketData, fetchWatchlist } from '@/lib/market-fetcher';

// Cache in-memory (evita troppe richieste a Yahoo)
let cachedData: { data: Awaited<ReturnType<typeof fetchAllLiveMarketData>>; timestamp: number } | null = null;
const CACHE_TTL = 60_000; // 1 minuto

export async function GET(request: NextRequest) {
  try {
    // Parametri opzionali
    const watchlistParam = request.nextUrl.searchParams.get('watchlist');
    const watchlistSymbols = watchlistParam ? watchlistParam.split(',').map(s => s.trim()) : undefined;

    // Controlla cache
    const now = Date.now();
    if (cachedData && !watchlistSymbols && (now - cachedData.timestamp) < CACHE_TTL) {
      return NextResponse.json({
        ...cachedData.data,
        cached: true,
        source: 'Yahoo Finance',
      });
    }

    // Fetch dati freschi
    const data = await fetchAllLiveMarketData(watchlistSymbols);

    // Aggiorna cache (solo per la richiesta default)
    if (!watchlistSymbols) {
      cachedData = { data, timestamp: now };
    }

    return NextResponse.json({
      ...data,
      cached: false,
      source: 'Yahoo Finance',
    });

  } catch (error) {
    console.error('Market live error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
