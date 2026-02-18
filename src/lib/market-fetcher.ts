// ═══════════════════════════════════════════════════════════════
// ECOPRO — Market Data Fetcher (Dati Reali)
// Yahoo Finance, ECB, e altre fonti gratuite
// ═══════════════════════════════════════════════════════════════

import YahooFinance from 'yahoo-finance2';

// yahoo-finance2 v3 richiede una nuova istanza
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const YF = (YahooFinance as any).default || YahooFinance;
const yahooFinance = new YF({ suppressNotices: ['yahooSurvey'] });

// ─── Types ───────────────────────────────────────────────────

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketCap?: number;
  volume?: number;
  dayHigh?: number;
  dayLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  exchange: string;
  updatedAt: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  updatedAt: string;
}

export interface CurrencyRate {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
  updatedAt: string;
}

export interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  updatedAt: string;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SectorPerformance {
  sector: string;
  performance: number;
  topStock: string;
}

export interface LiveMarketData {
  indices: MarketIndex[];
  currencies: CurrencyRate[];
  commodities: CommodityPrice[];
  sectors: SectorPerformance[];
  watchlist: StockQuote[];
  lastUpdated: string;
}

// ─── Default Watchlists ──────────────────────────────────────

// Indici principali
const INDEX_SYMBOLS = [
  { symbol: '^FTSEMIB', name: 'FTSE MIB' },
  { symbol: '^STOXX50E', name: 'Euro Stoxx 50' },
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^DJI', name: 'Dow Jones' },
  { symbol: '^IXIC', name: 'NASDAQ' },
  { symbol: '^N225', name: 'Nikkei 225' },
];

// Valute
const CURRENCY_PAIRS = [
  'EURUSD=X',
  'EURGBP=X',
  'EURJPY=X',
  'EURCHF=X',
  'BTCEUR=X',
  'ETHEUR=X',
];

const CURRENCY_NAMES: Record<string, string> = {
  'EURUSD=X': 'EUR/USD',
  'EURGBP=X': 'EUR/GBP',
  'EURJPY=X': 'EUR/JPY',
  'EURCHF=X': 'EUR/CHF',
  'BTCEUR=X': 'BTC/EUR',
  'ETHEUR=X': 'ETH/EUR',
};

// Materie prime
const COMMODITY_SYMBOLS = [
  { symbol: 'GC=F', name: 'Oro' },
  { symbol: 'SI=F', name: 'Argento' },
  { symbol: 'CL=F', name: 'Petrolio WTI' },
  { symbol: 'BZ=F', name: 'Petrolio Brent' },
  { symbol: 'NG=F', name: 'Gas Naturale' },
];

// Settori ETF (per performance settoriale)
const SECTOR_ETFS = [
  { symbol: 'XLK', name: 'Tecnologia', sector: 'Technology' },
  { symbol: 'XLF', name: 'Finanza', sector: 'Financial' },
  { symbol: 'XLV', name: 'Healthcare', sector: 'Healthcare' },
  { symbol: 'XLE', name: 'Energia', sector: 'Energy' },
  { symbol: 'XLY', name: 'Consumi Discrezionali', sector: 'Consumer Disc.' },
  { symbol: 'XLP', name: 'Consumi Base', sector: 'Consumer Staples' },
  { symbol: 'XLI', name: 'Industriali', sector: 'Industrials' },
];

// Stock italiane ed europee interessanti
const DEFAULT_WATCHLIST = [
  'ENEL.MI',    // Enel
  'ISP.MI',     // Intesa Sanpaolo
  'UCG.MI',     // UniCredit
  'ENI.MI',     // ENI
  'RACE.MI',    // Ferrari
  'STLAM.MI',   // Stellantis
];

// ─── Fetch Functions ─────────────────────────────────────────

/**
 * Fetch quotes per un array di simboli (con error handling robusto)
 */
async function fetchQuotes(symbols: string[]): Promise<Map<string, Record<string, unknown>>> {
  const results = new Map<string, Record<string, unknown>>();

  // Fetch in parallelo con catch per ogni simbolo
  const promises = symbols.map(async (symbol) => {
    try {
      const quote = await yahooFinance.quote(symbol);
      if (quote) results.set(symbol, quote as unknown as Record<string, unknown>);
    } catch (err) {
      console.warn(`[Market] Quote fetch failed for ${symbol}:`, err instanceof Error ? err.message : err);
    }
  });

  await Promise.allSettled(promises);
  return results;
}

/**
 * Fetch indici di mercato principali
 */
export async function fetchMarketIndices(): Promise<MarketIndex[]> {
  const symbols = INDEX_SYMBOLS.map(i => i.symbol);
  const quotes = await fetchQuotes(symbols);

  return INDEX_SYMBOLS.map(idx => {
    const q = quotes.get(idx.symbol) as Record<string, number | string | undefined> | undefined;
    return {
      symbol: idx.symbol,
      name: idx.name,
      value: (q?.regularMarketPrice as number) ?? 0,
      change: (q?.regularMarketChange as number) ?? 0,
      changePercent: (q?.regularMarketChangePercent as number) ?? 0,
      updatedAt: new Date().toISOString(),
    };
  }).filter(i => i.value > 0);
}

/**
 * Fetch tassi di cambio
 */
export async function fetchCurrencyRates(): Promise<CurrencyRate[]> {
  const quotes = await fetchQuotes(CURRENCY_PAIRS);

  return CURRENCY_PAIRS.map(pair => {
    const q = quotes.get(pair) as Record<string, number | string | undefined> | undefined;
    return {
      pair: CURRENCY_NAMES[pair] || pair,
      rate: (q?.regularMarketPrice as number) ?? 0,
      change: (q?.regularMarketChange as number) ?? 0,
      changePercent: (q?.regularMarketChangePercent as number) ?? 0,
      updatedAt: new Date().toISOString(),
    };
  }).filter(c => c.rate > 0);
}

/**
 * Fetch prezzi materie prime
 */
export async function fetchCommodities(): Promise<CommodityPrice[]> {
  const symbols = COMMODITY_SYMBOLS.map(c => c.symbol);
  const quotes = await fetchQuotes(symbols);

  return COMMODITY_SYMBOLS.map(com => {
    const q = quotes.get(com.symbol) as Record<string, number | string | undefined> | undefined;
    return {
      symbol: com.symbol,
      name: com.name,
      price: (q?.regularMarketPrice as number) ?? 0,
      change: (q?.regularMarketChange as number) ?? 0,
      changePercent: (q?.regularMarketChangePercent as number) ?? 0,
      currency: (q?.currency as string) ?? 'USD',
      updatedAt: new Date().toISOString(),
    };
  }).filter(c => c.price > 0);
}

/**
 * Fetch performance settoriale
 */
export async function fetchSectorPerformance(): Promise<SectorPerformance[]> {
  const symbols = SECTOR_ETFS.map(s => s.symbol);
  const quotes = await fetchQuotes(symbols);

  return SECTOR_ETFS.map(sec => {
    const q = quotes.get(sec.symbol) as Record<string, number | string | undefined> | undefined;
    return {
      sector: sec.name,
      performance: (q?.regularMarketChangePercent as number) ?? 0,
      topStock: sec.sector,
    };
  }).filter(s => s.performance !== 0);
}

/**
 * Fetch watchlist (azioni personalizzate)
 */
export async function fetchWatchlist(symbols?: string[]): Promise<StockQuote[]> {
  const watchSymbols = symbols || DEFAULT_WATCHLIST;
  const quotes = await fetchQuotes(watchSymbols);

  return watchSymbols.map(symbol => {
    const q = quotes.get(symbol) as Record<string, number | string | undefined> | undefined;
    if (!q) return null;
    return {
      symbol,
      name: (q.shortName as string) || (q.longName as string) || symbol,
      price: (q.regularMarketPrice as number) ?? 0,
      change: (q.regularMarketChange as number) ?? 0,
      changePercent: (q.regularMarketChangePercent as number) ?? 0,
      currency: (q.currency as string) ?? 'EUR',
      marketCap: (q.marketCap as number) ?? undefined,
      volume: (q.regularMarketVolume as number) ?? undefined,
      dayHigh: (q.regularMarketDayHigh as number) ?? undefined,
      dayLow: (q.regularMarketDayLow as number) ?? undefined,
      fiftyTwoWeekHigh: (q.fiftyTwoWeekHigh as number) ?? undefined,
      fiftyTwoWeekLow: (q.fiftyTwoWeekLow as number) ?? undefined,
      exchange: (q.exchange as string) ?? '',
      updatedAt: new Date().toISOString(),
    };
  }).filter((q): q is StockQuote => q !== null && q.price > 0);
}

/**
 * Fetch dati storici per un simbolo
 */
export async function fetchHistorical(
  symbol: string,
  period: '1mo' | '3mo' | '6mo' | '1y' = '3mo'
): Promise<HistoricalDataPoint[]> {
  try {
    const result = await yahooFinance.chart(symbol, {
      period1: getStartDate(period),
      interval: period === '1mo' ? '1d' : '1wk',
    });

    if (!result?.quotes) return [];

    return result.quotes.map((q: Record<string, unknown>) => ({
      date: new Date(q.date as string).toISOString().split('T')[0],
      open: (q.open as number) ?? 0,
      high: (q.high as number) ?? 0,
      low: (q.low as number) ?? 0,
      close: (q.close as number) ?? 0,
      volume: (q.volume as number) ?? 0,
    }));
  } catch (err) {
    console.warn(`[Market] Historical fetch failed for ${symbol}:`, err);
    return [];
  }
}

function getStartDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case '1mo': now.setMonth(now.getMonth() - 1); break;
    case '3mo': now.setMonth(now.getMonth() - 3); break;
    case '6mo': now.setMonth(now.getMonth() - 6); break;
    case '1y': now.setFullYear(now.getFullYear() - 1); break;
  }
  return now;
}

/**
 * Cerca azioni per nome/ticker
 */
export async function searchStocks(query: string): Promise<{ symbol: string; name: string; exchange: string }[]> {
  try {
    const results = await yahooFinance.search(query, { newsCount: 0 });
    return (results.quotes || [])
      .filter((q: Record<string, unknown>) => q.quoteType === 'EQUITY' || q.quoteType === 'ETF')
      .slice(0, 10)
      .map((q: Record<string, unknown>) => ({
        symbol: (q.symbol as string) || '',
        name: (q.shortname as string) || (q.longname as string) || '',
        exchange: (q.exchange as string) || '',
      }));
  } catch {
    return [];
  }
}

/**
 * Fetch tutti i dati di mercato live (panoramica completa)
 */
export async function fetchAllLiveMarketData(watchlistSymbols?: string[]): Promise<LiveMarketData> {
  const [indices, currencies, commodities, sectors, watchlist] = await Promise.allSettled([
    fetchMarketIndices(),
    fetchCurrencyRates(),
    fetchCommodities(),
    fetchSectorPerformance(),
    fetchWatchlist(watchlistSymbols),
  ]);

  return {
    indices: indices.status === 'fulfilled' ? indices.value : [],
    currencies: currencies.status === 'fulfilled' ? currencies.value : [],
    commodities: commodities.status === 'fulfilled' ? commodities.value : [],
    sectors: sectors.status === 'fulfilled' ? sectors.value : [],
    watchlist: watchlist.status === 'fulfilled' ? watchlist.value : [],
    lastUpdated: new Date().toISOString(),
  };
}
