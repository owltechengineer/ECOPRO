// ═══════════════════════════════════════════════════════════════
// ECOPRO — Multi-Provider AI System (100% Gratuito)
// Ogni agente usa un modello diverso via Groq / Gemini
// ═══════════════════════════════════════════════════════════════

import OpenAI from 'openai';
import type { AgentType } from './ai-prompts';

// ─── Provider Configuration ──────────────────────────────────

export type ProviderName = 'groq' | 'gemini';

interface ProviderConfig {
  name: ProviderName;
  label: string;
  baseURL: string;
  apiKeyEnv: string;
  defaultModel: string;
  models: Record<string, string>; // key → display name
  supportsJsonFormat: boolean;
  supportsStreaming: boolean;
}

const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  groq: {
    name: 'groq',
    label: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    defaultModel: 'llama-3.3-70b-versatile',
    models: {
      'llama-3.3-70b-versatile': 'Llama 3.3 70B',
      'llama-3.1-8b-instant': 'Llama 3.1 8B (fast)',
      'mixtral-8x7b-32768': 'Mixtral 8x7B',
      'gemma2-9b-it': 'Gemma 2 9B',
    },
    supportsJsonFormat: true,
    supportsStreaming: true,
  },
  gemini: {
    name: 'gemini',
    label: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKeyEnv: 'GEMINI_API_KEY',
    defaultModel: 'gemini-2.0-flash',
    models: {
      'gemini-2.0-flash': 'Gemini 2.0 Flash',
      'gemini-2.0-flash-lite': 'Gemini 2.0 Flash Lite',
      'gemini-1.5-flash': 'Gemini 1.5 Flash',
    },
    supportsJsonFormat: true,
    supportsStreaming: true,
  },
};

// ─── Agent → Provider/Model Mapping ─────────────────────────

interface AgentModelConfig {
  provider: ProviderName;
  model: string;
  temperature: number;
  maxTokens: number;
}

// Configurazione default: ogni agente ha il suo modello
const AGENT_MODEL_MAP: Record<AgentType, AgentModelConfig> = {
  project: {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    maxTokens: 2000,
  },
  business: {
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    temperature: 0.3,
    maxTokens: 2000,
  },
  market: {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.4,
    maxTokens: 2000,
  },
  chat: {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    maxTokens: 1500,
  },
};

// ─── Client Cache ────────────────────────────────────────────

const clientCache = new Map<ProviderName, OpenAI>();

function getClient(providerName: ProviderName): OpenAI {
  if (clientCache.has(providerName)) {
    return clientCache.get(providerName)!;
  }

  const provider = PROVIDERS[providerName];
  const apiKey = process.env[provider.apiKeyEnv];

  if (!apiKey) {
    throw new Error(
      `API key mancante per ${provider.label}. ` +
      `Imposta ${provider.apiKeyEnv} nel file .env.local. ` +
      `È gratuito: ${providerName === 'groq' ? 'https://console.groq.com' : 'https://aistudio.google.com/apikey'}`
    );
  }

  const client = new OpenAI({
    apiKey,
    baseURL: provider.baseURL,
  });

  clientCache.set(providerName, client);
  return client;
}

// ─── Override da env (opzionale) ─────────────────────────────

function getAgentConfig(agentType: AgentType): AgentModelConfig {
  const base = { ...AGENT_MODEL_MAP[agentType] };

  // Permetti override da env: AI_PROJECT_PROVIDER=gemini, AI_PROJECT_MODEL=gemini-2.0-flash
  const prefix = `AI_${agentType.toUpperCase()}`;
  const envProvider = process.env[`${prefix}_PROVIDER`] as ProviderName | undefined;
  const envModel = process.env[`${prefix}_MODEL`];

  if (envProvider && PROVIDERS[envProvider]) {
    base.provider = envProvider;
  }
  if (envModel) {
    base.model = envModel;
  }

  return base;
}

// ─── Public API ──────────────────────────────────────────────

export interface AICompletionOptions {
  agentType: AgentType;
  systemPrompt: string;
  userContent: string;
  jsonMode?: boolean;
}

export interface AICompletionResult {
  content: string;
  provider: string;
  model: string;
  modelLabel: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Esegue una completion AI usando il provider/modello configurato per l'agente.
 * Fallback automatico: se il provider primario fallisce, prova l'altro.
 */
export async function aiComplete(options: AICompletionOptions): Promise<AICompletionResult> {
  const config = getAgentConfig(options.agentType);
  const provider = PROVIDERS[config.provider];

  // Prova provider primario
  try {
    return await executeCompletion(config, provider, options);
  } catch (primaryError) {
    console.warn(
      `[AI] ${provider.label} fallito per ${options.agentType}:`,
      primaryError instanceof Error ? primaryError.message : primaryError
    );

    // Fallback: prova l'altro provider
    const fallbackName: ProviderName = config.provider === 'groq' ? 'gemini' : 'groq';
    const fallbackProvider = PROVIDERS[fallbackName];
    const fallbackConfig: AgentModelConfig = {
      ...config,
      provider: fallbackName,
      model: fallbackProvider.defaultModel,
    };

    try {
      console.log(`[AI] Fallback a ${fallbackProvider.label} per ${options.agentType}`);
      return await executeCompletion(fallbackConfig, fallbackProvider, options);
    } catch (fallbackError) {
      console.error(`[AI] Anche il fallback ${fallbackProvider.label} è fallito:`, fallbackError);
      throw new Error(
        `Tutti i provider AI hanno fallito. ` +
        `Verifica le API key in .env.local (GROQ_API_KEY e/o GEMINI_API_KEY). ` +
        `Errore primario: ${primaryError instanceof Error ? primaryError.message : 'unknown'}`
      );
    }
  }
}

async function executeCompletion(
  config: AgentModelConfig,
  provider: ProviderConfig,
  options: AICompletionOptions
): Promise<AICompletionResult> {
  const client = getClient(config.provider);

  const completion = await client.chat.completions.create({
    model: config.model,
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userContent },
    ],
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    ...(options.jsonMode && provider.supportsJsonFormat
      ? { response_format: { type: 'json_object' as const } }
      : {}),
  });

  const modelLabel = provider.models[config.model] || config.model;

  return {
    content: completion.choices[0]?.message?.content ?? '',
    provider: provider.label,
    model: config.model,
    modelLabel: `${provider.label} · ${modelLabel}`,
    usage: completion.usage
      ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
        }
      : undefined,
  };
}

/**
 * Streaming completion per la chat.
 * Restituisce un ReadableStream SSE-compatible.
 */
export async function aiStreamChat(options: {
  agentType: AgentType;
  messages: OpenAI.ChatCompletionMessageParam[];
}): Promise<{ stream: ReadableStream; provider: string; model: string; modelLabel: string }> {
  const config = getAgentConfig(options.agentType);
  const provider = PROVIDERS[config.provider];

  const tryStream = async (cfg: AgentModelConfig, prov: ProviderConfig) => {
    const client = getClient(cfg.provider);
    const stream = await client.chat.completions.create({
      model: cfg.model,
      messages: options.messages,
      temperature: cfg.temperature,
      max_tokens: cfg.maxTokens,
      stream: true,
    });

    const encoder = new TextEncoder();
    const modelLabel = prov.models[cfg.model] || cfg.model;

    const readable = new ReadableStream({
      async start(controller) {
        // Invia info sul modello come primo evento
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ meta: { provider: prov.label, model: cfg.model, modelLabel: `${prov.label} · ${modelLabel}` } })}\n\n`)
        );
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return {
      stream: readable,
      provider: prov.label,
      model: cfg.model,
      modelLabel: `${prov.label} · ${modelLabel}`,
    };
  };

  // Prova provider primario
  try {
    return await tryStream(config, provider);
  } catch (primaryError) {
    console.warn(`[AI Chat] ${provider.label} fallito, provo fallback`);
    const fallbackName: ProviderName = config.provider === 'groq' ? 'gemini' : 'groq';
    const fallbackProvider = PROVIDERS[fallbackName];
    const fallbackConfig: AgentModelConfig = {
      ...config,
      provider: fallbackName,
      model: fallbackProvider.defaultModel,
    };
    return await tryStream(fallbackConfig, fallbackProvider);
  }
}

// ─── Info per il frontend ────────────────────────────────────

export interface AgentInfo {
  agentType: AgentType;
  provider: string;
  model: string;
  modelLabel: string;
}

export function getAgentsInfo(): AgentInfo[] {
  return (['project', 'business', 'market', 'chat'] as AgentType[]).map(agentType => {
    const config = getAgentConfig(agentType);
    const provider = PROVIDERS[config.provider];
    const modelLabel = provider.models[config.model] || config.model;
    return {
      agentType,
      provider: provider.label,
      model: config.model,
      modelLabel: `${provider.label} · ${modelLabel}`,
    };
  });
}
