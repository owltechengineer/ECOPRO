'use client';

import React from 'react';
import {
  User, Building2, Bell, Palette, Database, Key, Globe, Shield,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import { useEcoPro } from '@/store/EcoProContext';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profilo Utente', description: 'Nome, email, avatar e preferenze personali', status: 'Configurabile' },
      { icon: Key, label: 'Autenticazione', description: 'Password, 2FA e sessioni attive', status: 'Supabase Auth Ready' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { icon: Building2, label: 'Organizzazione', description: 'Impostazioni aziendali, team e ruoli', status: 'Placeholder' },
      { icon: Bell, label: 'Notifiche', description: 'Configurazione alert, email e push notifications', status: 'Placeholder' },
      { icon: Palette, label: 'Aspetto', description: 'Tema, colori e personalizzazione interfaccia', status: 'Coming Soon' },
      { icon: Globe, label: 'Lingua & Locale', description: 'Lingua, formato date, valuta', status: 'IT Default' },
    ],
  },
  {
    title: 'Integrazioni',
    items: [
      { icon: Database, label: 'Database (Supabase)', description: 'Connessione database PostgreSQL, tabelle e sincronizzazione', status: 'Connesso' },
      { icon: Shield, label: 'API Esterne', description: 'OpenAI GPT-4o, market data, analytics', status: 'Configurabile' },
    ],
  },
];

export default function SettingsPage() {
  const { activities, projects, tasks, loading, error } = useEcoPro();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configurazione sistema, integrazioni e preferenze utente."
      />

      <div className="max-w-3xl space-y-6">
        {settingsGroups.map(group => (
          <Card key={group.title} title={group.title}>
            <div className="divide-y divide-slate-100 -mx-5 -mb-5">
              {group.items.map(item => (
                <div key={item.label} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-500">
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900">{item.label}</h4>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-medium rounded-full">{item.status}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* System Info */}
        <Card title="Informazioni Sistema">
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Piattaforma</span>
              <span className="font-medium text-slate-900">ECOPRO v0.2.0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Stack</span>
              <span className="font-medium text-slate-900">Next.js + React + Tailwind CSS</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Database</span>
              <span className={`font-medium ${error ? 'text-red-600' : 'text-emerald-600'}`}>
                {loading ? 'Connessione…' : error ? 'Errore connessione' : 'Supabase PostgreSQL — Connesso'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">AI Engine</span>
              <span className="font-medium text-slate-900">OpenAI GPT-4o</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Dati caricati</span>
              <span className="font-medium text-slate-900">
                {activities.length} attività · {projects.length} progetti · {tasks.length} task
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Architettura</span>
              <span className="font-medium text-slate-900">API Routes → Supabase PostgreSQL</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
