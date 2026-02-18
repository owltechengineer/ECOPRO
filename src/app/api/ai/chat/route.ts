// ═══════════════════════════════════════════════════════════════
// API: /api/ai/chat — Chat conversazionale con streaming
// Usa modelli gratuiti (Groq Llama / Gemini Flash)
// ═══════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { aiStreamChat } from '@/lib/ai-providers';
import { CHAT_SYSTEM, CHAT_USER } from '@/lib/ai-prompts';
import { dbToActivity, dbToProject, dbToTask, dbToBIMetrics } from '@/lib/db-mappers';
import type OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[];
    };

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: 'messages required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Gather platform context
    const supabase = getServiceSupabase();
    const [activitiesRes, projectsRes, tasksRes, biRes] = await Promise.all([
      supabase.from('activities').select('*').eq('archived', false),
      supabase.from('projects').select('*').in('status', ['active', 'planning']),
      supabase.from('tasks').select('*').in('status', ['in_progress', 'todo', 'blocked', 'review']),
      supabase.from('bi_metrics').select('*').order('period', { ascending: false }).limit(20),
    ]);

    const contextData = JSON.stringify({
      activities: (activitiesRes.data ?? []).map(dbToActivity),
      projects: (projectsRes.data ?? []).map(dbToProject),
      activeTasks: (tasksRes.data ?? []).map(dbToTask),
      recentMetrics: (biRes.data ?? []).map(dbToBIMetrics),
    }, null, 2);

    const lastUserMessage = messages[messages.length - 1].content;

    // Build message history with context in first user message
    const apiMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: CHAT_SYSTEM },
    ];

    // Add history (skip last, we'll add it with context)
    for (let i = 0; i < messages.length - 1; i++) {
      apiMessages.push({
        role: messages[i].role,
        content: messages[i].content,
      });
    }

    // Add last message with fresh platform context
    apiMessages.push({
      role: 'user',
      content: CHAT_USER(contextData, lastUserMessage),
    });

    // Streaming via multi-provider system
    const { stream } = await aiStreamChat({
      agentType: 'chat',
      messages: apiMessages,
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
