'use client';

import React, { useState, useEffect } from 'react';
import {
  Lightbulb, AlertTriangle, Target, BarChart3,
  Globe2, Bot, Sparkles, Loader2, RefreshCw, Cpu,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { useEcoPro } from '@/store/EcoProContext';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';

// ─── Agent definitions con icone ─────────────────────────────

const agents = [
  { key: 'project', label: 'AI Project Agent', icon: Target, description: 'Analisi ritardi, priorita e rischi di progetto', color: 'bg-blue-500' },
  { key: 'business', label: 'AI Business Agent', icon: BarChart3, description: 'Analisi margini, ottimizzazioni e performance', color: 'bg-emerald-500' },
  { key: 'market', label: 'AI Market Agent', icon: Globe2, description: 'Interpretazione trend e mosse strategiche', color: 'bg-violet-500' },
];

// ─── Type per model info ─────────────────────────────────────

interface AgentModelInfo {
  agentType: string;
  provider: string;
  model: string;
  modelLabel: string;
}

export default function AIPage() {
  const { aiInsights, loading, refreshData } = useEcoPro();
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<AgentModelInfo[]>([]);
  const [lastAnalysisModel, setLastAnalysisModel] = useState<Record<string, string>>({});

  // Carica info modelli AI al mount
  useEffect(() => {
    api.getAIModels()
      .then(res => setModelInfo(res.agents))
      .catch(() => {});
  }, []);

  const insights = selectedAgent === 'all'
    ? aiInsights
    : aiInsights.filter(i => i.agentType === selectedAgent);

  // Lancia analisi AI per un agente specifico
  const runAnalysis = async (agentType: string) => {
    setAnalyzing(agentType);
    try {
      const result = await api.aiAnalyze(agentType);
      // Salva info sul modello usato
      setLastAnalysisModel(prev => ({
        ...prev,
        [agentType]: result.modelLabel || `${result.provider} · ${result.model}`,
      }));
      // Ricarica gli insight dal DB dopo l'analisi
      await refreshData();
    } catch (err) {
      console.error('Errore analisi AI:', err);
    } finally {
      setAnalyzing(null);
    }
  };

  // Helper per ottenere il modello configurato per un agente
  const getAgentModel = (agentKey: string): string => {
    if (lastAnalysisModel[agentKey]) return lastAnalysisModel[agentKey];
    const info = modelInfo.find(m => m.agentType === agentKey);
    return info?.modelLabel || 'Caricamento...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-violet-500" size={32} />
        <span className="ml-3 text-sm text-slate-500">Caricamento insight…</span>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="AI Decision Support"
        description="Analisi intelligente con modelli AI gratuiti. Ogni agente usa un modello ottimizzato per il suo compito."
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">100% Gratuito · Groq + Gemini</span>
          </div>
        }
      />

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {agents.map(agent => {
          const agentInsights = aiInsights.filter(i => i.agentType === agent.key);
          const criticalCount = agentInsights.filter(i => i.severity === 'critical').length;
          const isAnalyzing = analyzing === agent.key;
          const agentModel = getAgentModel(agent.key);

          return (
            <div key={agent.key} className={cn('text-left p-5 rounded-xl border transition-all',
              selectedAgent === agent.key ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200' : 'border-slate-200 bg-white')}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('p-2.5 rounded-lg text-white', agent.color)}>
                  <agent.icon size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">{agent.label}</h3>
                  <p className="text-[10px] text-slate-500">{agent.description}</p>
                </div>
              </div>

              {/* Model Badge */}
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md mb-3 border border-slate-100">
                <Cpu size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-500 font-medium truncate">{agentModel}</span>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedAgent(selectedAgent === agent.key ? 'all' : agent.key)}
                  className="text-xs text-slate-500 hover:text-blue-600">
                  {agentInsights.length} insight
                  {criticalCount > 0 && (
                    <span className="ml-2 text-red-600 font-medium">
                      · {criticalCount} critici
                    </span>
                  )}
                </button>
                <button
                  onClick={() => runAnalysis(agent.key)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 disabled:opacity-50 transition-colors"
                >
                  {isAnalyzing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                  {isAnalyzing ? 'Analisi…' : 'Analizza'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-slate-400 mr-2">Filtra:</span>
        <button onClick={() => setSelectedAgent('all')}
          className={cn('px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors',
            selectedAgent === 'all' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600')}>
          Tutti ({aiInsights.length})
        </button>
        {agents.map(a => {
          const count = aiInsights.filter(i => i.agentType === a.key).length;
          return (
            <button key={a.key} onClick={() => setSelectedAgent(a.key)}
              className={cn('px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors capitalize',
                selectedAgent === a.key ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600')}>
              {a.key} ({count})
            </button>
          );
        })}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.length === 0 && (
          <div className="text-center py-12">
            <Bot size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Nessun insight disponibile.</p>
            <p className="text-xs text-slate-400 mt-1">Clicca &quot;Analizza&quot; su un agente per generare insight dai dati reali.</p>
          </div>
        )}
        {insights.map(insight => (
          <div key={insight.id} className={cn(
            'p-5 rounded-xl border',
            insight.severity === 'critical' ? 'bg-red-50 border-red-200' :
            insight.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
            'bg-blue-50 border-blue-200'
          )}>
            <div className="flex items-start gap-4">
              <div className={cn('p-2 rounded-lg shrink-0',
                insight.severity === 'critical' ? 'bg-red-100 text-red-600' :
                insight.severity === 'warning' ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              )}>
                {insight.agentType === 'project' && <Target size={18} />}
                {insight.agentType === 'business' && <BarChart3 size={18} />}
                {insight.agentType === 'market' && <Globe2 size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge label={insight.agentType} className="bg-slate-200 text-slate-600 capitalize" />
                  <Badge label={insight.severity} />
                  <span className="text-[10px] text-slate-400">{new Date(insight.createdAt).toLocaleDateString('it-IT')}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{insight.title}</h3>
                <p className="text-xs text-slate-700 mb-3">{insight.description}</p>

                {/* Recommendation */}
                {insight.recommendation && (
                  <div className="bg-white/60 rounded-lg p-3 border border-slate-200/60">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Lightbulb size={12} className="text-amber-500" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase">Raccomandazione AI</span>
                    </div>
                    <p className="text-xs text-slate-700">{insight.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Info */}
      <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-start gap-3 mb-3">
          <Bot size={18} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1">AI Decision Support — Multi-Provider (Gratuito)</p>
            <p className="text-[11px] text-slate-500">
              Gli insight sono generati analizzando i dati reali della piattaforma tramite modelli AI gratuiti.
              Ogni agente usa il modello piu adatto al suo compito: Groq (Llama 3.3) per analisi progetti e chat,
              Google Gemini Flash per analisi business. Fallback automatico tra provider.
            </p>
          </div>
        </div>

        {/* Model Details */}
        {modelInfo.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-[10px] font-semibold text-slate-500 uppercase mb-2">Modelli configurati</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {modelInfo.map(m => (
                <div key={m.agentType} className="flex items-center gap-2 px-2.5 py-1.5 bg-white rounded-md border border-slate-100">
                  <Cpu size={10} className="text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-slate-700 capitalize">{m.agentType}</p>
                    <p className="text-[9px] text-slate-400 truncate">{m.modelLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
