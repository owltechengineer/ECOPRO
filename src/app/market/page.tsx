'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe2, TrendingUp, TrendingDown, Users, DollarSign,
  BarChart3, AlertTriangle, Zap, Loader2, RefreshCw,
  ArrowUpRight, ArrowDownRight, Minus, Clock,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import KPICard from '@/components/common/KPICard';
import BarChartComponent from '@/components/charts/BarChartComponent';
import DonutChart from '@/components/charts/DonutChart';
import LineChartComponent from '@/components/charts/LineChartComponent';
import { useEcoPro } from '@/store/EcoProContext';
import { formatCurrency, cn } from '@/lib/utils';
import { api } from '@/lib/api-client';

// ─── Types per live market data ──────────────────────────────

interface LiveMarketData {
  indices: { symbol: string; name: string; value: number; change: number; changePercent: number }[];
  currencies: { pair: string; rate: number; change: number; changePercent: number }[];
  commodities: { symbol: string; name: string; price: number; change: number; changePercent: number; currency: string }[];
  sectors: { sector: string; performance: number }[];
  watchlist: { symbol: string; name: string; price: number; change: number; changePercent: number; currency: string; marketCap?: number; volume?: number; dayHigh?: number; dayLow?: number; exchange: string }[];
  lastUpdated: string;
  source: string;
}

// ─── Helper per frecce e colori ──────────────────────────────

function ChangeIndicator({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';
  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <span className={cn('inline-flex items-center gap-0.5 font-semibold', textSize,
      isPositive ? 'text-emerald-600' : isNeutral ? 'text-slate-400' : 'text-red-600')}>
      {isPositive ? <ArrowUpRight size={iconSize} /> : isNeutral ? <Minus size={iconSize} /> : <ArrowDownRight size={iconSize} />}
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

function formatCompact(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(2);
}

// ─── Main Component ──────────────────────────────────────────

export default function MarketPage() {
  const { marketData, marketingIntel, loading } = useEcoPro();
  const [selectedRegion, setSelectedRegion] = useState<string>('national');
  const [liveData, setLiveData] = useState<LiveMarketData | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'analysis'>('live');

  const fetchLiveData = useCallback(async () => {
    setLiveLoading(true);
    setLiveError(null);
    try {
      const data = await api.getLiveMarket();
      setLiveData(data);
    } catch (err) {
      setLiveError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati live');
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    // Auto-refresh ogni 2 minuti
    const interval = setInterval(fetchLiveData, 120_000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  if (loading && liveLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-sm text-slate-500">Caricamento dati di mercato…</span>
      </div>
    );
  }

  const currentMarketData = marketData.find(m => m.region === selectedRegion);
  const availableRegions = [...new Set(marketData.map(m => m.region))];

  // Funnel colors
  const funnelColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#10b981', '#f59e0b'];

  // Competitor market share donut
  const competitorDonut = currentMarketData ? [
    ...currentMarketData.competitors.map((c, idx) => ({
      name: c.name,
      value: c.marketShare,
      color: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][idx % 4],
    })),
    {
      name: 'Others',
      value: 100 - currentMarketData.competitors.reduce((s, c) => s + c.marketShare, 0),
      color: '#e2e8f0',
    },
  ] : [];

  return (
    <div>
      <PageHeader
        title="Market Intelligence"
        description="Dati di mercato live da Yahoo Finance, analisi competitor e marketing intelligence."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Globe2 size={13} className="text-emerald-600" />
              <span className="text-[10px] font-medium text-emerald-700">Yahoo Finance · Live</span>
            </div>
          </div>
        }
      />

      {/* Tab Switch */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit mb-6">
        <button onClick={() => setActiveTab('live')}
          className={cn('px-4 py-2 text-xs font-medium rounded-md transition-all',
            activeTab === 'live' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
          <span className="flex items-center gap-1.5">
            <TrendingUp size={13} /> Live Market
          </span>
        </button>
        <button onClick={() => setActiveTab('analysis')}
          className={cn('px-4 py-2 text-xs font-medium rounded-md transition-all',
            activeTab === 'analysis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
          <span className="flex items-center gap-1.5">
            <BarChart3 size={13} /> Market Analysis
          </span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* LIVE MARKET TAB                                             */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === 'live' && (
        <div>
          {/* Last Updated & Refresh */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Clock size={12} />
              {liveData?.lastUpdated
                ? `Aggiornato: ${new Date(liveData.lastUpdated).toLocaleString('it-IT')}`
                : 'Caricamento...'}
              <span className="text-slate-300">·</span>
              <span>Fonte: {liveData?.source || 'Yahoo Finance'}</span>
            </div>
            <button onClick={fetchLiveData} disabled={liveLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors">
              <RefreshCw size={12} className={liveLoading ? 'animate-spin' : ''} />
              Aggiorna
            </button>
          </div>

          {liveError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertTriangle size={14} className="inline mr-2" />{liveError}
            </div>
          )}

          {liveData && (
            <>
              {/* Indices Ticker */}
              {liveData.indices.length > 0 && (
                <Card title="Indici Principali" subtitle="Aggiornamento in tempo reale" className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {liveData.indices.map(idx => (
                      <div key={idx.symbol} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">{idx.name}</p>
                        <p className="text-sm font-bold text-slate-900">{formatCompact(idx.value)}</p>
                        <ChangeIndicator value={idx.changePercent} />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Currencies */}
                {liveData.currencies.length > 0 && (
                  <Card title="Tassi di Cambio" subtitle="EUR cross rates + Crypto" noPadding>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Coppia</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Tasso</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Variazione</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {liveData.currencies.map(cur => (
                          <tr key={cur.pair} className="table-row-hover">
                            <td className="px-4 py-2.5 text-xs font-medium text-slate-900">{cur.pair}</td>
                            <td className="px-4 py-2.5 text-xs text-right font-bold text-slate-900">{cur.rate.toFixed(cur.rate > 100 ? 2 : 4)}</td>
                            <td className="px-4 py-2.5 text-right"><ChangeIndicator value={cur.changePercent} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                )}

                {/* Commodities */}
                {liveData.commodities.length > 0 && (
                  <Card title="Materie Prime" subtitle="Prezzi futures" noPadding>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Commodity</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Prezzo</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-2.5">Variazione</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {liveData.commodities.map(com => (
                          <tr key={com.symbol} className="table-row-hover">
                            <td className="px-4 py-2.5 text-xs font-medium text-slate-900">{com.name}</td>
                            <td className="px-4 py-2.5 text-xs text-right font-bold text-slate-900">${com.price.toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-right"><ChangeIndicator value={com.changePercent} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                )}
              </div>

              {/* Sector Performance */}
              {liveData.sectors.length > 0 && (
                <Card title="Performance Settoriale" subtitle="Variazione giornaliera ETF settoriali (S&P 500)" className="mb-6">
                  <BarChartComponent
                    data={liveData.sectors.map(s => ({
                      label: s.sector,
                      Performance: Number(s.performance.toFixed(2)),
                    }))}
                    bars={[{ key: 'Performance', color: '#3b82f6', name: 'Variazione %' }]}
                    xKey="label" height={260}
                  />
                </Card>
              )}

              {/* Watchlist */}
              {liveData.watchlist.length > 0 && (
                <Card title="Watchlist Italia" subtitle="Principali titoli Borsa Italiana" noPadding className="mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Titolo</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Prezzo</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Variazione</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Market Cap</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Volume</th>
                          <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Min/Max Giorno</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {liveData.watchlist.map(stock => (
                          <tr key={stock.symbol} className="table-row-hover">
                            <td className="px-4 py-2.5">
                              <div className="text-xs font-medium text-slate-900">{stock.name}</div>
                              <div className="text-[10px] text-slate-400">{stock.symbol}</div>
                            </td>
                            <td className="px-4 py-2.5 text-xs text-right font-bold text-slate-900">
                              {stock.currency === 'EUR' ? '€' : '$'}{stock.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-2.5 text-right"><ChangeIndicator value={stock.changePercent} size="md" /></td>
                            <td className="px-4 py-2.5 text-xs text-right text-slate-600">
                              {stock.marketCap ? formatCompact(stock.marketCap) : '—'}
                            </td>
                            <td className="px-4 py-2.5 text-xs text-right text-slate-600">
                              {stock.volume ? formatCompact(stock.volume) : '—'}
                            </td>
                            <td className="px-4 py-2.5 text-xs text-right text-slate-600">
                              {stock.dayLow?.toFixed(2) || '—'} / {stock.dayHigh?.toFixed(2) || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {liveData.indices.length === 0 && liveData.currencies.length === 0 && !liveLoading && (
                <div className="text-center py-12">
                  <Globe2 size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Nessun dato live disponibile al momento.</p>
                  <p className="text-xs text-slate-400 mt-1">I mercati potrebbero essere chiusi. Riprova durante gli orari di apertura.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MARKET ANALYSIS TAB (dati DB esistenti)                     */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === 'analysis' && (
        <div>
          {/* Region Selector */}
          <div className="flex items-center gap-2 mb-6">
            {(availableRegions.length > 0 ? availableRegions : ['national', 'european']).map(region => (
              <button key={region} onClick={() => setSelectedRegion(region)}
                className={cn('flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                  selectedRegion === region ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>
                <Globe2 size={14} /> {region === 'national' ? 'Italia' : region === 'european' ? 'Europa' : region}
              </button>
            ))}
          </div>

          {currentMarketData ? (
            <>
              {/* Market KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KPICard title="Market Size" value={currentMarketData.marketSize} format="compact" icon={BarChart3} iconColor="text-blue-500" />
                <KPICard title="Growth Rate" value={currentMarketData.growthRate} format="percent" icon={TrendingUp} iconColor="text-emerald-500" />
                <KPICard title="Competitors Tracked" value={currentMarketData.competitors.length} format="number" icon={Users} iconColor="text-violet-500" />
                <KPICard title="Pricing Median" value={currentMarketData.pricingBenchmark.median} format="currency" icon={DollarSign} iconColor="text-amber-500" subtitle={`Range: €${currentMarketData.pricingBenchmark.low} - €${currentMarketData.pricingBenchmark.high}`} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Trends */}
                <Card title="Market Trends" subtitle={`${currentMarketData.region === 'national' ? 'Italia' : 'Europa'} — Trend attuali`} headerAction={<TrendingUp size={16} className="text-slate-400" />}>
                  <div className="space-y-2">
                    {currentMarketData.trends.map((trend, i) => (
                      <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
                        <div className="p-1 rounded bg-blue-100 text-blue-600"><Zap size={12} /></div>
                        <span className="text-xs text-slate-700">{trend}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Competitor Market Share */}
                <Card title="Competitor Market Share" subtitle="Distribuzione quote di mercato">
                  <DonutChart data={competitorDonut} centerLabel="Market Share" height={200} />
                  <div className="space-y-2 mt-3">
                    {competitorDonut.filter(c => c.name !== 'Others').map(c => (
                      <div key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="text-xs text-slate-600">{c.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{c.value.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Competitor Analysis */}
              <Card title="Competitor Analysis" subtitle="Analisi dettagliata competitor principali" className="mb-6" noPadding>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Competitor</th>
                        <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Market Share</th>
                        <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Strengths</th>
                        <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Weaknesses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentMarketData.competitors.map(comp => (
                        <tr key={comp.name} className="table-row-hover">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{comp.name}</td>
                          <td className="px-4 py-3 text-xs text-right font-bold text-slate-900">{comp.marketShare}%</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">{comp.strengths.map((s, i) => <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{s}</span>)}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">{comp.weaknesses.map((w, i) => <span key={i} className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded">{w}</span>)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Market Risks */}
              <Card title="Market Risks" subtitle="Rischi di mercato identificati" className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentMarketData.risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                      <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-700">{risk}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <div className="text-center py-16">
              <Globe2 size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Nessun dato di analisi mercato disponibile.</p>
              <p className="text-xs text-slate-400 mt-1">Esegui il seed del database per caricare i dati.</p>
            </div>
          )}

          {/* MARKETING INTELLIGENCE SECTION */}
          {marketingIntel && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Marketing Intelligence</h2>
              <p className="text-sm text-slate-500 mb-6">Canali, funnel, SEO e opportunita di crescita.</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Channel Performance */}
                <Card title="Channel Performance" subtitle="CAC, Conversion & ROI per canale">
                  <BarChartComponent
                    data={marketingIntel.channels.map(ch => ({
                      label: ch.name,
                      CAC: ch.cac,
                      ROI: ch.roi,
                    }))}
                    bars={[
                      { key: 'CAC', color: '#ef4444', name: 'CAC (€)' },
                      { key: 'ROI', color: '#10b981', name: 'ROI %' },
                    ]}
                    xKey="label" height={280}
                  />
                </Card>

                {/* Channel Detail Table */}
                <Card title="Dettaglio Canali" noPadding>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Canale</th>
                        <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">CAC</th>
                        <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Conv. Rate</th>
                        <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">ROI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...marketingIntel.channels].sort((a, b) => b.roi - a.roi).map(ch => (
                        <tr key={ch.name} className="table-row-hover">
                          <td className="px-4 py-2.5 text-xs font-medium text-slate-900">{ch.name}</td>
                          <td className="px-4 py-2.5 text-xs text-right">{formatCurrency(ch.cac)}</td>
                          <td className="px-4 py-2.5 text-xs text-right">{ch.conversionRate}%</td>
                          <td className="px-4 py-2.5 text-xs text-right font-bold text-emerald-600">{ch.roi}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>

              {/* Funnel */}
              <Card title="Marketing Funnel" subtitle="Conversione per stage" className="mb-6">
                <div className="flex items-end gap-3 h-52">
                  {marketingIntel.funnelStages.map((stage, i) => {
                    const maxVisitors = marketingIntel.funnelStages[0]?.visitors || 1;
                    const heightPercent = (stage.visitors / maxVisitors) * 100;
                    return (
                      <div key={stage.name} className="flex-1 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-900 mb-1">{stage.visitors.toLocaleString()}</span>
                        <div className="w-full rounded-t-lg" style={{ height: `${heightPercent}%`, backgroundColor: funnelColors[i], minHeight: '20px' }} />
                        <span className="text-[10px] text-slate-500 mt-2 text-center">{stage.name}</span>
                        {stage.dropoff > 0 && <span className="text-[9px] text-red-500">-{stage.dropoff}%</span>}
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SEO */}
                <Card title="SEO Metrics" subtitle="Performance organica">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-slate-50">
                      <p className="text-2xl font-bold text-blue-600">{marketingIntel.seoMetrics.organicTraffic.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Organic Traffic</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-50">
                      <p className="text-2xl font-bold text-violet-600">{marketingIntel.seoMetrics.keywords}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Keywords Ranked</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-50">
                      <p className="text-2xl font-bold text-emerald-600">{marketingIntel.seoMetrics.domainAuthority}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Domain Authority</p>
                    </div>
                  </div>
                </Card>

                {/* Growth Opportunities */}
                <Card title="Growth Opportunities" subtitle="Opportunita strategiche identificate">
                  <div className="space-y-2">
                    {marketingIntel.growthOpportunities.map((opp, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                        <Zap size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-700">{opp}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
