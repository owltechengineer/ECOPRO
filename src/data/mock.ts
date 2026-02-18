// ═══════════════════════════════════════════════════════════════
// ECOPRO — Mock Data (Realistic)
// ═══════════════════════════════════════════════════════════════

import {
  Activity, Project, Task, BusinessModelCanvas, BalancedScorecard,
  FinancialSummary, Product, Service, MarketData, MarketingIntelligence,
  AIInsight, BIMetrics, ExecutiveKPIs, CriticalAlert, CostItem, RevenueItem,
} from '@/types';

// ─── ACTIVITIES ───────────────────────────────────────────────

export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    name: 'EcoWear',
    description: 'Brand di moda sostenibile D2C con ecommerce proprietario e marketplace.',
    sector: 'Fashion & Sustainability',
    geography: 'Italia, Europa',
    businessModels: ['D2C', 'B2C'],
    lifecycleStage: 'active',
    strategicObjectives: [
      { id: 'so-001', title: 'Raggiungere €500K revenue annuo', description: 'Obiettivo fatturato anno 1', targetDate: '2026-12-31', progress: 42, kpiLinks: ['revenue'] },
      { id: 'so-002', title: 'Espansione mercato EU', description: 'Apertura canali DE, FR, ES', targetDate: '2026-09-30', progress: 15, kpiLinks: ['growth'] },
      { id: 'so-003', title: 'Margine operativo >35%', description: 'Ottimizzazione supply chain', targetDate: '2026-12-31', progress: 60, kpiLinks: ['margin'] },
    ],
    risks: [
      { id: 'r-001', title: 'Supply chain disruption', description: 'Ritardi fornitore tessuti organici', probability: 'medium', impact: 'high', mitigation: 'Diversificazione fornitori, stock di sicurezza', status: 'identified', owner: 'Operations Lead' },
      { id: 'r-002', title: 'Competizione prezzo', description: 'Fast fashion con linee green', probability: 'high', impact: 'medium', mitigation: 'Differenziazione brand, storytelling', status: 'mitigated', owner: 'Marketing Lead' },
    ],
    kpis: { revenue: 210000, previousRevenue: 175000, growth: 20, margin: 38, cac: 28, ltv: 145, roi: 185, burnRate: 12000, customersTotal: 3200, monthlyRecurring: 18500 },
    createdAt: '2025-06-01', updatedAt: '2026-02-05', archived: false, color: '#10B981', icon: 'Leaf',
  },
  {
    id: 'act-002',
    name: 'DataFlow Consulting',
    description: 'Consulenza strategica e implementazione BI per PMI e startup.',
    sector: 'Consulting & Technology',
    geography: 'Italia',
    businessModels: ['B2B', 'Services'],
    lifecycleStage: 'scale',
    strategicObjectives: [
      { id: 'so-004', title: 'Portafoglio 25 clienti attivi', description: 'Crescita base clienti B2B', targetDate: '2026-12-31', progress: 72, kpiLinks: ['customersTotal'] },
      { id: 'so-005', title: 'Lancio prodotto SaaS', description: 'Dashboard BI as a Service', targetDate: '2026-10-31', progress: 25, kpiLinks: ['monthlyRecurring'] },
    ],
    risks: [
      { id: 'r-003', title: 'Concentrazione clienti', description: 'Top 3 clienti = 60% revenue', probability: 'high', impact: 'critical', mitigation: 'Diversificazione portfolio, upsell', status: 'identified', owner: 'CEO' },
    ],
    kpis: { revenue: 380000, previousRevenue: 310000, growth: 22.6, margin: 52, cac: 1200, ltv: 18000, roi: 320, burnRate: 8000, customersTotal: 18, monthlyRecurring: 32000 },
    createdAt: '2024-03-15', updatedAt: '2026-02-06', archived: false, color: '#3B82F6', icon: 'BarChart3',
  },
  {
    id: 'act-003',
    name: 'GreenTech Lab',
    description: 'Startup R&D per soluzioni IoT nel monitoraggio ambientale.',
    sector: 'CleanTech & IoT',
    geography: 'Italia, Svizzera',
    businessModels: ['SaaS', 'B2B'],
    lifecycleStage: 'validation',
    strategicObjectives: [
      { id: 'so-006', title: 'Validazione MVP con 10 beta tester', description: 'Test prodotto con early adopters', targetDate: '2026-06-30', progress: 40, kpiLinks: ['customersTotal'] },
      { id: 'so-007', title: 'Seed round €300K', description: 'Raccolta fondi per scaling', targetDate: '2026-09-30', progress: 10, kpiLinks: ['roi'] },
    ],
    risks: [
      { id: 'r-004', title: 'Rischio tecnologico', description: 'Affidabilità sensori in condizioni estreme', probability: 'medium', impact: 'high', mitigation: 'Testing estensivo, partnership con laboratorio SUPSI', status: 'identified', owner: 'CTO' },
      { id: 'r-005', title: 'Time to market', description: 'Ritardo lancio vs competitor', probability: 'high', impact: 'high', mitigation: 'Lean MVP, sprint bisettimanali', status: 'accepted', owner: 'PM' },
    ],
    kpis: { revenue: 15000, previousRevenue: 5000, growth: 200, margin: -120, cac: 0, ltv: 0, roi: -45, burnRate: 6500, customersTotal: 3, monthlyRecurring: 0 },
    createdAt: '2025-09-01', updatedAt: '2026-02-04', archived: false, color: '#8B5CF6', icon: 'Cpu',
  },
];

// ─── PROJECTS ─────────────────────────────────────────────────

export const mockProjects: Project[] = [
  {
    id: 'prj-001', activityId: 'act-001',
    name: 'Lancio Ecommerce Q1 2026',
    description: 'Setup completo piattaforma ecommerce, catalogo prodotti, payment gateway e logistica.',
    type: 'ecommerce', methodology: 'Agile', status: 'active',
    charter: {
      objectives: ['Lanciare shop online entro marzo 2026', 'Raggiungere 500 ordini nel primo mese', 'Conversion rate >2.5%'],
      scope: 'Sviluppo frontend, backend, integrazione pagamenti, setup logistica, marketing lancio.',
      stakeholders: [
        { name: 'Marco Rossi', role: 'Project Manager', influence: 'high' },
        { name: 'Laura Bianchi', role: 'UX Designer', influence: 'medium' },
        { name: 'Paolo Verdi', role: 'Developer Lead', influence: 'high' },
      ],
      constraints: ['Budget max €45.000', 'Deadline: 31 marzo 2026', 'Team 4 persone'],
      assumptions: ['Fornitori confermati', 'Gateway Stripe attivo', 'Hosting scalabile disponibile'],
      risks: [
        { id: 'pr-001', title: 'Ritardo sviluppo', description: 'Complessità integrazioni sottostimata', probability: 'medium', impact: 'high', mitigation: 'Sprint review settimanali', status: 'identified', owner: 'Paolo Verdi' },
      ],
    },
    wbs: [
      { id: 'wbs-001', title: 'Setup & Architettura', type: 'phase', parentId: null, children: ['wbs-002', 'wbs-003'], status: 'done', progress: 100 },
      { id: 'wbs-002', title: 'Configurazione ambiente', type: 'activity', parentId: 'wbs-001', children: [], status: 'done', progress: 100 },
      { id: 'wbs-003', title: 'Design system', type: 'deliverable', parentId: 'wbs-001', children: [], status: 'done', progress: 100 },
      { id: 'wbs-004', title: 'Sviluppo Frontend', type: 'phase', parentId: null, children: ['wbs-005', 'wbs-006'], status: 'in_progress', progress: 65 },
      { id: 'wbs-005', title: 'Catalogo prodotti', type: 'work_package', parentId: 'wbs-004', children: [], status: 'done', progress: 100 },
      { id: 'wbs-006', title: 'Checkout & pagamenti', type: 'work_package', parentId: 'wbs-004', children: [], status: 'in_progress', progress: 40 },
      { id: 'wbs-007', title: 'Testing & Lancio', type: 'phase', parentId: null, children: [], status: 'todo', progress: 0 },
    ],
    milestones: [
      { id: 'ms-001', title: 'MVP Ready', date: '2026-02-15', status: 'completed', deliverables: ['Catalogo', 'Cart', 'Checkout base'] },
      { id: 'ms-002', title: 'Beta Launch', date: '2026-03-01', status: 'pending', deliverables: ['Pagamenti live', 'Logistica attiva'] },
      { id: 'ms-003', title: 'Go Live', date: '2026-03-31', status: 'pending', deliverables: ['Marketing campaign', 'Full launch'] },
    ],
    startDate: '2025-12-01', endDate: '2026-03-31', progress: 58, budget: 45000, spent: 28500,
    expectedRevenue: 75000, actualRevenue: 12000,
    createdAt: '2025-11-15', updatedAt: '2026-02-06', enabledModules: ['ecommerce'],
  },
  {
    id: 'prj-002', activityId: 'act-001',
    name: 'Campagna Marketing Primavera',
    description: 'Strategia marketing multicanale per la collezione primavera/estate.',
    type: 'marketing', methodology: 'Kanban', status: 'planning',
    charter: {
      objectives: ['Awareness +40%', '1000 nuovi follower', 'ROAS >3x'],
      scope: 'Social media, influencer marketing, email marketing, PR.',
      stakeholders: [{ name: 'Sara Neri', role: 'Marketing Manager', influence: 'high' }],
      constraints: ['Budget €8.000', 'Lancio 1 aprile'],
      assumptions: ['Collezione pronta entro marzo', 'Influencer confermati'],
      risks: [],
    },
    wbs: [
      { id: 'wbs-100', title: 'Strategia', type: 'phase', parentId: null, children: [], status: 'in_progress', progress: 30 },
      { id: 'wbs-101', title: 'Creazione contenuti', type: 'phase', parentId: null, children: [], status: 'todo', progress: 0 },
      { id: 'wbs-102', title: 'Esecuzione campagna', type: 'phase', parentId: null, children: [], status: 'backlog', progress: 0 },
    ],
    milestones: [
      { id: 'ms-100', title: 'Strategy Approved', date: '2026-03-01', status: 'pending', deliverables: ['Piano media', 'Budget allocation'] },
      { id: 'ms-101', title: 'Campaign Launch', date: '2026-04-01', status: 'pending', deliverables: ['Go live tutti i canali'] },
    ],
    startDate: '2026-02-01', endDate: '2026-05-31', progress: 12, budget: 8000, spent: 1200,
    expectedRevenue: 32000, actualRevenue: 0,
    createdAt: '2026-01-20', updatedAt: '2026-02-05', enabledModules: [],
  },
  {
    id: 'prj-003', activityId: 'act-002',
    name: 'BI Dashboard per ClienteX',
    description: 'Sviluppo dashboard di Business Intelligence personalizzata per ClienteX (manifatturiero).',
    type: 'consulting', methodology: 'Scrum', status: 'active',
    charter: {
      objectives: ['Dashboard operativa entro 8 settimane', 'KPI real-time', 'Report automatici settimanali'],
      scope: 'Data integration, ETL, dashboard design, training.',
      stakeholders: [
        { name: 'Anna Colombo', role: 'Account Manager', influence: 'high' },
        { name: 'Luca Ferrari', role: 'Data Engineer', influence: 'high' },
      ],
      constraints: ['Budget cliente: €25.000', '8 settimane', 'Stack: Python + Metabase'],
      assumptions: ['Accesso dati ERP garantito', 'Referente IT dedicato'],
      risks: [
        { id: 'pr-010', title: 'Qualità dati', description: 'Dati ERP inconsistenti', probability: 'high', impact: 'medium', mitigation: 'Data quality assessment in Sprint 1', status: 'mitigated', owner: 'Luca Ferrari' },
      ],
    },
    wbs: [
      { id: 'wbs-200', title: 'Discovery & Assessment', type: 'phase', parentId: null, children: [], status: 'done', progress: 100 },
      { id: 'wbs-201', title: 'Data Pipeline', type: 'phase', parentId: null, children: [], status: 'in_progress', progress: 70 },
      { id: 'wbs-202', title: 'Dashboard Development', type: 'phase', parentId: null, children: [], status: 'in_progress', progress: 40 },
      { id: 'wbs-203', title: 'Testing & Delivery', type: 'phase', parentId: null, children: [], status: 'todo', progress: 0 },
    ],
    milestones: [
      { id: 'ms-200', title: 'Data Pipeline Ready', date: '2026-02-20', status: 'pending', deliverables: ['ETL funzionante', 'Data warehouse'] },
      { id: 'ms-201', title: 'Dashboard v1', date: '2026-03-10', status: 'pending', deliverables: ['Dashboard interattiva', '5 KPI operativi'] },
    ],
    startDate: '2026-01-06', endDate: '2026-03-15', progress: 52, budget: 25000, spent: 14000,
    expectedRevenue: 25000, actualRevenue: 12500,
    createdAt: '2025-12-20', updatedAt: '2026-02-06', enabledModules: ['services'],
  },
  {
    id: 'prj-004', activityId: 'act-003',
    name: 'MVP Sensore Ambientale v1',
    description: 'Sviluppo e test del primo prototipo di sensore IoT per monitoraggio qualità aria.',
    type: 'startup', methodology: 'Lean', status: 'active',
    charter: {
      objectives: ['Prototipo funzionante', '10 beta tester attivi', 'Validazione product-market fit'],
      scope: 'Hardware prototype, firmware, cloud backend, mobile app base.',
      stakeholders: [
        { name: 'Elena Rizzo', role: 'CEO/Founder', influence: 'high' },
        { name: 'Davide Galli', role: 'CTO', influence: 'high' },
      ],
      constraints: ['Budget: €18.000', 'Timeline: 6 mesi', 'Team: 3 persone'],
      assumptions: ['Componenti disponibili', 'Partnership SUPSI attiva'],
      risks: [
        { id: 'pr-020', title: 'Affidabilità hardware', description: 'Sensori non calibrati in campo', probability: 'medium', impact: 'critical', mitigation: 'Test in laboratorio prima del deploy', status: 'identified', owner: 'Davide Galli' },
      ],
    },
    wbs: [
      { id: 'wbs-300', title: 'Research & Design', type: 'phase', parentId: null, children: [], status: 'done', progress: 100 },
      { id: 'wbs-301', title: 'Hardware Prototype', type: 'phase', parentId: null, children: [], status: 'in_progress', progress: 55 },
      { id: 'wbs-302', title: 'Cloud Backend', type: 'phase', parentId: null, children: [], status: 'in_progress', progress: 30 },
      { id: 'wbs-303', title: 'Beta Testing', type: 'phase', parentId: null, children: [], status: 'backlog', progress: 0 },
    ],
    milestones: [
      { id: 'ms-300', title: 'Prototype v0.1', date: '2026-03-15', status: 'pending', deliverables: ['Hardware funzionante', 'Firmware base'] },
      { id: 'ms-301', title: 'Beta Launch', date: '2026-05-01', status: 'pending', deliverables: ['10 device deployati', 'App mobile'] },
    ],
    startDate: '2025-11-01', endDate: '2026-06-30', progress: 35, budget: 18000, spent: 7200,
    expectedRevenue: 0, actualRevenue: 0,
    createdAt: '2025-10-15', updatedAt: '2026-02-04', enabledModules: ['startup'],
  },
];

// ─── TASKS ────────────────────────────────────────────────────

export const mockTasks: Task[] = [
  // Project prj-001 tasks
  { id: 't-001', projectId: 'prj-001', title: 'Setup Shopify/Headless CMS', description: 'Configurare piattaforma ecommerce con headless CMS', type: 'operational', priority: 'high', status: 'done', deadline: '2026-01-15', dependencies: [], owner: 'Paolo Verdi', estimatedTime: 24, actualTime: 28, tags: ['tech', 'setup'], createdAt: '2025-12-01', updatedAt: '2026-01-14' },
  { id: 't-002', projectId: 'prj-001', title: 'Design UI Kit completo', description: 'Creare design system con componenti riutilizzabili', type: 'operational', priority: 'high', status: 'done', deadline: '2026-01-20', dependencies: [], owner: 'Laura Bianchi', estimatedTime: 32, actualTime: 35, tags: ['design', 'ui'], createdAt: '2025-12-01', updatedAt: '2026-01-19' },
  { id: 't-003', projectId: 'prj-001', title: 'Sviluppo pagine catalogo', description: 'Implementare pagine listing, filtri, search, PDP', type: 'operational', priority: 'high', status: 'done', deadline: '2026-02-01', dependencies: ['t-001', 't-002'], owner: 'Paolo Verdi', estimatedTime: 40, actualTime: 42, tags: ['dev', 'frontend'], createdAt: '2025-12-15', updatedAt: '2026-02-01' },
  { id: 't-004', projectId: 'prj-001', title: 'Integrazione Stripe', description: 'Setup payment gateway con Stripe, gestione webhook', type: 'operational', priority: 'critical', status: 'in_progress', deadline: '2026-02-15', dependencies: ['t-001'], owner: 'Paolo Verdi', estimatedTime: 20, actualTime: 12, tags: ['dev', 'payments'], createdAt: '2026-01-10', updatedAt: '2026-02-06' },
  { id: 't-005', projectId: 'prj-001', title: 'Setup logistica e spedizioni', description: 'Integrazione corriere, calcolo spese spedizione, tracking', type: 'operational', priority: 'high', status: 'todo', deadline: '2026-02-20', dependencies: ['t-004'], owner: 'Marco Rossi', estimatedTime: 16, actualTime: 0, tags: ['logistics'], createdAt: '2026-01-15', updatedAt: '2026-02-05' },
  { id: 't-006', projectId: 'prj-001', title: 'Email marketing automation', description: 'Setup flussi email: welcome, abandoned cart, post-purchase', type: 'strategic', priority: 'medium', status: 'todo', deadline: '2026-03-01', dependencies: [], owner: 'Sara Neri', estimatedTime: 12, actualTime: 0, tags: ['marketing', 'automation'], createdAt: '2026-01-20', updatedAt: '2026-02-05' },
  { id: 't-007', projectId: 'prj-001', title: 'SEO ottimizzazione', description: 'Meta tag, sitemap, schema markup, page speed', type: 'strategic', priority: 'medium', status: 'backlog', deadline: '2026-03-15', dependencies: ['t-003'], owner: 'Laura Bianchi', estimatedTime: 8, actualTime: 0, tags: ['seo', 'marketing'], createdAt: '2026-01-25', updatedAt: '2026-02-05' },
  { id: 't-008', projectId: 'prj-001', title: 'UAT e bug fixing', description: 'User acceptance testing e risoluzione bug critici', type: 'operational', priority: 'critical', status: 'backlog', deadline: '2026-03-20', dependencies: ['t-004', 't-005'], owner: 'Marco Rossi', estimatedTime: 24, actualTime: 0, tags: ['qa', 'testing'], createdAt: '2026-02-01', updatedAt: '2026-02-05' },

  // Project prj-003 tasks
  { id: 't-020', projectId: 'prj-003', title: 'Assessment dati ERP', description: 'Analisi qualità e struttura dati sistema ERP cliente', type: 'operational', priority: 'critical', status: 'done', deadline: '2026-01-20', dependencies: [], owner: 'Luca Ferrari', estimatedTime: 16, actualTime: 14, tags: ['data', 'assessment'], createdAt: '2026-01-06', updatedAt: '2026-01-18' },
  { id: 't-021', projectId: 'prj-003', title: 'ETL Pipeline sviluppo', description: 'Costruire pipeline estrazione-trasformazione-caricamento', type: 'operational', priority: 'high', status: 'in_progress', deadline: '2026-02-10', dependencies: ['t-020'], owner: 'Luca Ferrari', estimatedTime: 32, actualTime: 22, tags: ['data', 'etl'], createdAt: '2026-01-10', updatedAt: '2026-02-06' },
  { id: 't-022', projectId: 'prj-003', title: 'Design dashboard mockup', description: 'Wireframe e mockup dashboard KPI', type: 'operational', priority: 'high', status: 'review', deadline: '2026-02-05', dependencies: ['t-020'], owner: 'Anna Colombo', estimatedTime: 12, actualTime: 10, tags: ['design', 'ux'], createdAt: '2026-01-15', updatedAt: '2026-02-04' },
  { id: 't-023', projectId: 'prj-003', title: 'Implementazione Metabase', description: 'Setup e configurazione dashboard in Metabase', type: 'operational', priority: 'high', status: 'todo', deadline: '2026-02-25', dependencies: ['t-021', 't-022'], owner: 'Luca Ferrari', estimatedTime: 24, actualTime: 0, tags: ['dev', 'bi'], createdAt: '2026-01-20', updatedAt: '2026-02-05' },
  { id: 't-024', projectId: 'prj-003', title: 'Report automatici', description: 'Configurazione report settimanali automatici', type: 'operational', priority: 'medium', status: 'backlog', deadline: '2026-03-05', dependencies: ['t-023'], owner: 'Luca Ferrari', estimatedTime: 8, actualTime: 0, tags: ['automation', 'reporting'], createdAt: '2026-01-25', updatedAt: '2026-02-05' },

  // Project prj-004 tasks
  { id: 't-030', projectId: 'prj-004', title: 'Selezione componenti sensore', description: 'Ricerca e selezione sensori, microcontroller, modulo comunicazione', type: 'strategic', priority: 'critical', status: 'done', deadline: '2025-12-15', dependencies: [], owner: 'Davide Galli', estimatedTime: 20, actualTime: 18, tags: ['hardware', 'R&D'], createdAt: '2025-11-01', updatedAt: '2025-12-14' },
  { id: 't-031', projectId: 'prj-004', title: 'Design PCB v1', description: 'Progettazione PCB per prototipo', type: 'operational', priority: 'high', status: 'in_progress', deadline: '2026-02-28', dependencies: ['t-030'], owner: 'Davide Galli', estimatedTime: 40, actualTime: 25, tags: ['hardware', 'design'], createdAt: '2025-12-15', updatedAt: '2026-02-06' },
  { id: 't-032', projectId: 'prj-004', title: 'Firmware base', description: 'Sviluppo firmware lettura sensori e trasmissione dati', type: 'operational', priority: 'high', status: 'in_progress', deadline: '2026-03-15', dependencies: ['t-030'], owner: 'Davide Galli', estimatedTime: 48, actualTime: 15, tags: ['firmware', 'embedded'], createdAt: '2026-01-01', updatedAt: '2026-02-05' },
  { id: 't-033', projectId: 'prj-004', title: 'API Backend cloud', description: 'REST API per ricezione e storage dati sensori', type: 'operational', priority: 'high', status: 'todo', deadline: '2026-03-30', dependencies: [], owner: 'Elena Rizzo', estimatedTime: 32, actualTime: 0, tags: ['backend', 'cloud'], createdAt: '2026-01-10', updatedAt: '2026-02-04' },
  { id: 't-034', projectId: 'prj-004', title: 'Mobile app MVP', description: 'App React Native per visualizzazione dati', type: 'operational', priority: 'medium', status: 'backlog', deadline: '2026-04-30', dependencies: ['t-033'], owner: 'Elena Rizzo', estimatedTime: 40, actualTime: 0, tags: ['mobile', 'frontend'], createdAt: '2026-01-15', updatedAt: '2026-02-04' },
];

// ─── BUSINESS MODEL CANVAS ────────────────────────────────────

export const mockBMC: BusinessModelCanvas[] = [
  {
    activityId: 'act-001',
    keyPartners: ['Fornitori tessuti organici certificati', 'Corriere eco-friendly', 'Piattaforma Shopify', 'Influencer sostenibilità'],
    keyActivities: ['Design collezioni', 'Produzione', 'Marketing digitale', 'Customer care', 'Logistica'],
    keyResources: ['Brand identity', 'Piattaforma ecommerce', 'Community social', 'Team creativo', 'Supply chain certificata'],
    valuePropositions: ['Moda sostenibile accessibile', 'Trasparenza filiera', 'Design italiano contemporaneo', 'Impatto ambientale misurabile'],
    customerRelationships: ['Community engagement', 'Newsletter personalizzate', 'Customer support rapido', 'Programma fedeltà'],
    channels: ['Ecommerce diretto', 'Instagram', 'TikTok', 'Newsletter', 'Pop-up store', 'Marketplace selezionati'],
    customerSegments: ['Millennials eco-conscious', 'Gen Z fashion-forward', 'Professional 30-45 attenti alla qualità'],
    costStructure: ['Produzione (40%)', 'Marketing (25%)', 'Logistica (15%)', 'Team (12%)', 'Tech (8%)'],
    revenueStreams: ['Vendita diretta online', 'Wholesale B2B selezionato', 'Capsule collection limited', 'Subscription box'],
  },
];

// ─── BALANCED SCORECARD ───────────────────────────────────────

export const mockScorecard: BalancedScorecard[] = [
  {
    activityId: 'act-001',
    financial: {
      name: 'Financial',
      objectives: [
        { title: 'Revenue Growth', measure: 'Revenue YoY %', target: '+25%', actual: '+20%', status: 'at_risk' },
        { title: 'Profit Margin', measure: 'Gross Margin %', target: '40%', actual: '38%', status: 'at_risk' },
        { title: 'Cash Flow', measure: 'Monthly net CF', target: '>€5K', actual: '€6.5K', status: 'on_track' },
      ],
    },
    customer: {
      name: 'Customer',
      objectives: [
        { title: 'Customer Satisfaction', measure: 'NPS Score', target: '>60', actual: '72', status: 'on_track' },
        { title: 'Customer Retention', measure: 'Repeat purchase %', target: '35%', actual: '28%', status: 'behind' },
        { title: 'Brand Awareness', measure: 'Social followers', target: '15K', actual: '12.4K', status: 'at_risk' },
      ],
    },
    internal: {
      name: 'Internal Processes',
      objectives: [
        { title: 'Order Fulfillment', measure: 'Avg delivery days', target: '<3 days', actual: '2.8 days', status: 'on_track' },
        { title: 'Defect Rate', measure: 'Returns %', target: '<5%', actual: '3.2%', status: 'on_track' },
        { title: 'Time to Market', measure: 'Collection lead time', target: '<12 weeks', actual: '14 weeks', status: 'behind' },
      ],
    },
    learning: {
      name: 'Learning & Growth',
      objectives: [
        { title: 'Team Skills', measure: 'Training hours/month', target: '8h', actual: '6h', status: 'at_risk' },
        { title: 'Innovation', measure: 'New products launched', target: '4/quarter', actual: '3/quarter', status: 'at_risk' },
        { title: 'Tech Adoption', measure: 'Automation %', target: '60%', actual: '45%', status: 'behind' },
      ],
    },
  },
];

// ─── FINANCIAL DATA ───────────────────────────────────────────

export const mockCosts: CostItem[] = [
  { id: 'c-001', projectId: 'prj-001', category: 'Sviluppo', description: 'Developer frontend', estimated: 15000, actual: 12000, date: '2026-01' },
  { id: 'c-002', projectId: 'prj-001', category: 'Design', description: 'UX/UI design', estimated: 8000, actual: 7500, date: '2026-01' },
  { id: 'c-003', projectId: 'prj-001', category: 'Infrastruttura', description: 'Hosting & servizi cloud', estimated: 3000, actual: 2800, date: '2026-01' },
  { id: 'c-004', projectId: 'prj-001', category: 'Marketing', description: 'Pre-lancio ads', estimated: 5000, actual: 3200, date: '2026-02' },
  { id: 'c-005', projectId: 'prj-001', category: 'Logistica', description: 'Setup magazzino', estimated: 4000, actual: 3000, date: '2026-02' },
  { id: 'c-010', projectId: 'prj-003', category: 'Consulenza', description: 'Data engineering', estimated: 12000, actual: 10000, date: '2026-01' },
  { id: 'c-011', projectId: 'prj-003', category: 'Software', description: 'Licenze Metabase Pro', estimated: 2000, actual: 2000, date: '2026-01' },
  { id: 'c-012', projectId: 'prj-003', category: 'Consulenza', description: 'Account management', estimated: 5000, actual: 2000, date: '2026-02' },
];

export const mockRevenues: RevenueItem[] = [
  { id: 'rv-001', projectId: 'prj-001', source: 'Ecommerce', description: 'Vendite pre-lancio', expected: 5000, actual: 4200, date: '2026-01' },
  { id: 'rv-002', projectId: 'prj-001', source: 'Ecommerce', description: 'Vendite beta', expected: 10000, actual: 7800, date: '2026-02' },
  { id: 'rv-010', projectId: 'prj-003', source: 'Consulenza', description: 'Fee progetto (50% anticipo)', expected: 12500, actual: 12500, date: '2026-01' },
];

export const mockFinancials: FinancialSummary[] = [
  {
    projectId: 'prj-001', totalBudget: 45000, totalSpent: 28500, totalExpectedRevenue: 75000, totalActualRevenue: 12000,
    costVariance: 16500, revenueVariance: -63000, projectMargin: -57.9, breakEvenPoint: 45000,
    cashFlow: [
      { month: 'Dic 2025', inflow: 0, outflow: 8000, net: -8000, cumulative: -8000 },
      { month: 'Gen 2026', inflow: 4200, outflow: 14500, net: -10300, cumulative: -18300 },
      { month: 'Feb 2026', inflow: 7800, outflow: 6000, net: 1800, cumulative: -16500 },
      { month: 'Mar 2026', inflow: 25000, outflow: 8000, net: 17000, cumulative: 500 },
      { month: 'Apr 2026', inflow: 35000, outflow: 4000, net: 31000, cumulative: 31500 },
    ],
  },
  {
    projectId: 'prj-003', totalBudget: 25000, totalSpent: 14000, totalExpectedRevenue: 25000, totalActualRevenue: 12500,
    costVariance: 11000, revenueVariance: -12500, projectMargin: -10.7, breakEvenPoint: 14000,
    cashFlow: [
      { month: 'Gen 2026', inflow: 12500, outflow: 10000, net: 2500, cumulative: 2500 },
      { month: 'Feb 2026', inflow: 0, outflow: 4000, net: -4000, cumulative: -1500 },
      { month: 'Mar 2026', inflow: 12500, outflow: 5000, net: 7500, cumulative: 6000 },
    ],
  },
];

// ─── PRODUCTS (ECOMMERCE MODULE) ──────────────────────────────

export const mockProducts: Product[] = [
  { id: 'prod-001', projectId: 'prj-001', name: 'T-Shirt Organic Cotton', sku: 'ECW-TS-001', costPerUnit: 12, price: 39.90, margin: 69.9, stock: 250, salesChannel: ['Ecommerce', 'Instagram Shop'], unitsSold: 89, conversionRate: 3.2, logisticsCost: 2.5 },
  { id: 'prod-002', projectId: 'prj-001', name: 'Hoodie Recycled Blend', sku: 'ECW-HD-001', costPerUnit: 22, price: 79.90, margin: 72.5, stock: 120, salesChannel: ['Ecommerce'], unitsSold: 45, conversionRate: 2.1, logisticsCost: 3.5 },
  { id: 'prod-003', projectId: 'prj-001', name: 'Jeans Hemp Denim', sku: 'ECW-JN-001', costPerUnit: 28, price: 99.90, margin: 72.0, stock: 80, salesChannel: ['Ecommerce', 'Pop-up Store'], unitsSold: 32, conversionRate: 1.8, logisticsCost: 3.0 },
  { id: 'prod-004', projectId: 'prj-001', name: 'Sneaker EcoLeather', sku: 'ECW-SN-001', costPerUnit: 35, price: 129.90, margin: 73.1, stock: 60, salesChannel: ['Ecommerce'], unitsSold: 18, conversionRate: 1.5, logisticsCost: 4.0 },
  { id: 'prod-005', projectId: 'prj-001', name: 'Tote Bag Canvas', sku: 'ECW-BG-001', costPerUnit: 5, price: 24.90, margin: 79.9, stock: 400, salesChannel: ['Ecommerce', 'Instagram Shop', 'Pop-up Store'], unitsSold: 156, conversionRate: 4.5, logisticsCost: 1.5 },
];

// ─── SERVICES MODULE ──────────────────────────────────────────

export const mockServices: Service[] = [
  {
    id: 'svc-001', projectId: 'prj-003', name: 'BI Dashboard Development',
    description: 'Sviluppo dashboard Business Intelligence personalizzata',
    packages: [
      { name: 'Starter', price: 8000, features: ['5 KPI dashboard', 'Report mensile', 'Training 2h'] },
      { name: 'Professional', price: 18000, features: ['15 KPI dashboard', 'Report settimanale', 'Training 8h', 'Supporto 3 mesi'] },
      { name: 'Enterprise', price: 35000, features: ['Dashboard illimitata', 'Report real-time', 'Training team', 'Supporto 12 mesi', 'Custom integrations'] },
    ],
    hourlyRate: 120, soldHours: 180, deliveryCost: 3200, margin: 72,
  },
];

// ─── MARKET DATA ──────────────────────────────────────────────

export const mockMarketData: MarketData[] = [
  {
    region: 'national',
    marketSize: 28_000_000_000,
    growthRate: 3.2,
    trends: ['Crescita sustainable fashion +18% YoY', 'Shift verso D2C', 'Social commerce +25%', 'Circular fashion in crescita', 'AI-powered personalization'],
    competitors: [
      { name: 'Patagonia Italia', marketShare: 4.2, strengths: ['Brand awareness', 'Heritage'], weaknesses: ['Prezzo elevato', 'Limited styles'] },
      { name: 'Rifò', marketShare: 0.8, strengths: ['Made in Italy', 'Circular economy'], weaknesses: ['Scala limitata', 'Marketing'] },
      { name: 'Ecoalf', marketShare: 1.5, strengths: ['Design', 'Ocean plastic story'], weaknesses: ['Distribuzione IT limitata'] },
    ],
    pricingBenchmark: { low: 25, median: 55, high: 120 },
    risks: ['Greenwashing normative', 'Costi materie prime in aumento', 'Recessione potenziale', 'Supply chain fragile'],
  },
  {
    region: 'european',
    marketSize: 350_000_000_000,
    growthRate: 2.8,
    trends: ['Digital Product Passport EU', 'EPR regulations', 'Resale market boom', 'Gen Z purchasing power'],
    competitors: [
      { name: 'H&M Conscious', marketShare: 8.5, strengths: ['Scala', 'Distribuzione'], weaknesses: ['Percezione greenwashing'] },
      { name: 'Veja', marketShare: 0.4, strengths: ['Sneaker niche leader', 'Transparency'], weaknesses: ['Categoria limitata'] },
    ],
    pricingBenchmark: { low: 30, median: 65, high: 150 },
    risks: ['Regolamentazione EU stringente', 'Brexit implications', 'Currency fluctuations'],
  },
];

export const mockMarketingIntel: MarketingIntelligence = {
  channels: [
    { name: 'Instagram Ads', cac: 22, conversionRate: 2.8, roi: 340 },
    { name: 'Google Ads', cac: 35, conversionRate: 3.5, roi: 280 },
    { name: 'TikTok Organic', cac: 8, conversionRate: 1.2, roi: 520 },
    { name: 'Email Marketing', cac: 3, conversionRate: 4.8, roi: 890 },
    { name: 'Influencer', cac: 45, conversionRate: 1.8, roi: 210 },
    { name: 'SEO Organic', cac: 12, conversionRate: 3.2, roi: 450 },
  ],
  funnelStages: [
    { name: 'Awareness', visitors: 45000, dropoff: 0 },
    { name: 'Interest', visitors: 12000, dropoff: 73.3 },
    { name: 'Consideration', visitors: 4500, dropoff: 62.5 },
    { name: 'Intent', visitors: 1800, dropoff: 60 },
    { name: 'Purchase', visitors: 680, dropoff: 62.2 },
    { name: 'Retention', visitors: 190, dropoff: 72.1 },
  ],
  seoMetrics: { organicTraffic: 8500, keywords: 342, domainAuthority: 28 },
  growthOpportunities: [
    'Espansione TikTok Shop (conversione social commerce)',
    'Programma referral con incentivi 15%',
    'Content marketing blog SEO (keyword gap analysis)',
    'Partnership micro-influencer nicchia sostenibilità',
    'Retargeting carrelli abbandonati (tasso recupero stimato 12%)',
  ],
};

// ─── AI INSIGHTS ──────────────────────────────────────────────

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ai-001', agentType: 'project', title: 'Ritardo critico su integrazione pagamenti',
    description: 'Il task "Integrazione Stripe" (prj-001) mostra un tempo stimato di 20h con solo 12h lavorate e deadline tra 9 giorni. Al ritmo attuale, rischio sforamento di 5 giorni.',
    severity: 'warning', recommendation: 'Allocare risorse aggiuntive o rivedere scope dell\'integrazione. Considerare Stripe Checkout per ridurre complessità del 40%.',
    relatedEntityId: 'prj-001', relatedEntityType: 'project', createdAt: '2026-02-06',
  },
  {
    id: 'ai-002', agentType: 'business', title: 'Margine EcoWear sotto target',
    description: 'Il margine operativo di EcoWear è al 38% vs target 40%. Principale driver: costi logistica +12% rispetto al budget.',
    severity: 'warning', recommendation: 'Negoziare tariffe corriere volume con contratto annuale. Stimato risparmio 8-12% su logistica, portando il margine al 40.5%.',
    relatedEntityId: 'act-001', relatedEntityType: 'activity', createdAt: '2026-02-05',
  },
  {
    id: 'ai-003', agentType: 'market', title: 'Opportunità TikTok Shop',
    description: 'Il social commerce su TikTok cresce +25% in Italia. Il CAC su TikTok organic è 8€ vs 22€ Instagram Ads, con un gap di penetrazione significativo.',
    severity: 'info', recommendation: 'Investire €2.000/mese in TikTok content creation. ROI stimato 5.2x basato su benchmark settore sustainable fashion.',
    relatedEntityId: 'act-001', relatedEntityType: 'activity', createdAt: '2026-02-04',
  },
  {
    id: 'ai-004', agentType: 'business', title: 'Concentrazione revenue DataFlow',
    description: 'I top 3 clienti di DataFlow Consulting rappresentano il 60% del fatturato. Rischio elevato di dipendenza.',
    severity: 'critical', recommendation: 'Implementare strategia di diversificazione: target 5 nuovi clienti mid-market in Q2. Lanciare offerta SaaS per ridurre concentrazione a <40%.',
    relatedEntityId: 'act-002', relatedEntityType: 'activity', createdAt: '2026-02-03',
  },
  {
    id: 'ai-005', agentType: 'project', title: 'Burn rate GreenTech sopra budget',
    description: 'GreenTech Lab ha un burn rate di €6.500/mese con pista di 4.2 mesi rimanente. Al ritmo attuale, il budget si esaurisce prima del beta launch.',
    severity: 'critical', recommendation: 'Ridurre scope MVP: focus su 3 sensori chiave invece di 5. Anticipare beta a 8 unità. Savings stimati: €4.200.',
    relatedEntityId: 'act-003', relatedEntityType: 'activity', createdAt: '2026-02-06',
  },
];

// ─── BI METRICS ───────────────────────────────────────────────

export const mockBIMetrics: BIMetrics[] = [
  // EcoWear monthly metrics
  { activityId: 'act-001', period: '2025-09', revenue: 28000, costs: 18000, profit: 10000, roi: 55.6, roas: 3.2, ebitda: 8500, productivityIndex: 72, customerCount: 2100, churnRate: 8.2 },
  { activityId: 'act-001', period: '2025-10', revenue: 32000, costs: 19500, profit: 12500, roi: 64.1, roas: 3.5, ebitda: 10200, productivityIndex: 75, customerCount: 2400, churnRate: 7.8 },
  { activityId: 'act-001', period: '2025-11', revenue: 38000, costs: 22000, profit: 16000, roi: 72.7, roas: 3.8, ebitda: 13500, productivityIndex: 78, customerCount: 2700, churnRate: 7.1 },
  { activityId: 'act-001', period: '2025-12', revenue: 45000, costs: 25000, profit: 20000, roi: 80.0, roas: 4.1, ebitda: 17000, productivityIndex: 82, customerCount: 2900, churnRate: 6.5 },
  { activityId: 'act-001', period: '2026-01', revenue: 35000, costs: 21000, profit: 14000, roi: 66.7, roas: 3.4, ebitda: 11500, productivityIndex: 76, customerCount: 3100, churnRate: 7.3 },
  { activityId: 'act-001', period: '2026-02', revenue: 42000, costs: 23500, profit: 18500, roi: 78.7, roas: 4.0, ebitda: 15800, productivityIndex: 80, customerCount: 3200, churnRate: 6.8 },
  // DataFlow monthly metrics
  { activityId: 'act-002', period: '2025-09', revenue: 55000, costs: 28000, profit: 27000, roi: 96.4, roas: 0, ebitda: 24000, productivityIndex: 88, customerCount: 14, churnRate: 2.1 },
  { activityId: 'act-002', period: '2025-10', revenue: 58000, costs: 29000, profit: 29000, roi: 100.0, roas: 0, ebitda: 26000, productivityIndex: 89, customerCount: 15, churnRate: 1.8 },
  { activityId: 'act-002', period: '2025-11', revenue: 62000, costs: 30000, profit: 32000, roi: 106.7, roas: 0, ebitda: 28500, productivityIndex: 91, customerCount: 16, churnRate: 1.5 },
  { activityId: 'act-002', period: '2025-12', revenue: 68000, costs: 32000, profit: 36000, roi: 112.5, roas: 0, ebitda: 33000, productivityIndex: 93, customerCount: 17, churnRate: 1.2 },
  { activityId: 'act-002', period: '2026-01', revenue: 65000, costs: 31000, profit: 34000, roi: 109.7, roas: 0, ebitda: 31000, productivityIndex: 92, customerCount: 18, churnRate: 1.4 },
  { activityId: 'act-002', period: '2026-02', revenue: 72000, costs: 33000, profit: 39000, roi: 118.2, roas: 0, ebitda: 36000, productivityIndex: 94, customerCount: 18, churnRate: 1.1 },
];

// ─── EXECUTIVE KPIS ───────────────────────────────────────────

export const mockExecutiveKPIs: ExecutiveKPIs = {
  totalRevenue: 605000,
  totalCosts: 348000,
  totalProfit: 257000,
  activeActivities: 3,
  activeProjects: 4,
  pendingTasks: 12,
  overdueTasks: 2,
  criticalAlerts: 3,
  averageProjectProgress: 39.3,
  cashFlowNet: 18500,
  aggregatedROI: 73.9,
  monthlyGrowth: 8.5,
};

// ─── CRITICAL ALERTS ──────────────────────────────────────────

export const mockAlerts: CriticalAlert[] = [
  { id: 'alert-001', type: 'delay', severity: 'warning', title: 'Stripe Integration in ritardo', description: 'Task critico su prj-001 a rischio sforamento deadline', entityId: 'prj-001', entityType: 'project', createdAt: '2026-02-06' },
  { id: 'alert-002', type: 'budget', severity: 'critical', title: 'Burn rate GreenTech elevato', description: 'Pista finanziaria insufficiente per raggiungere beta launch', entityId: 'act-003', entityType: 'activity', createdAt: '2026-02-06' },
  { id: 'alert-003', type: 'risk', severity: 'critical', title: 'Concentrazione clienti DataFlow', description: 'Top 3 clienti = 60% revenue. Rischio business continuity.', entityId: 'act-002', entityType: 'activity', createdAt: '2026-02-05' },
  { id: 'alert-004', type: 'performance', severity: 'warning', title: 'Margine sotto target EcoWear', description: 'Margine 38% vs target 40%. Gap causato da costi logistica.', entityId: 'act-001', entityType: 'activity', createdAt: '2026-02-05' },
  { id: 'alert-005', type: 'delay', severity: 'warning', title: 'Time to market collezione', description: 'Lead time 14 settimane vs target 12. Impatto su campagna primavera.', entityId: 'prj-002', entityType: 'project', createdAt: '2026-02-04' },
];
