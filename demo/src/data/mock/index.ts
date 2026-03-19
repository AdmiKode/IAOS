import { MockUser, Policy, Lead, KPI, Ticket, Payment, AgendaItem, ChartDataPoint } from '@/types'

// ─── USUARIOS DEMO ───────────────────────────────────────────────────────────
export const DEMO_USERS: MockUser[] = [
  {
    id: 'u1',
    name: 'Carlos Mendoza',
    email: 'agente@demo.com',
    role: 'agent',
    agency: 'Despacho Seguros Premier',
  },
  {
    id: 'u2',
    name: 'Patricia Garza',
    email: 'admin@demo.com',
    role: 'admin',
    agency: 'Despacho Seguros Premier',
  },
  {
    id: 'u3',
    name: 'Ana López',
    email: 'cliente@demo.com',
    role: 'client',
  },
]

// Credenciales demo — login sin bloqueo
export const DEMO_CREDENTIALS = [
  { email: 'agente@demo.com', password: 'demo1234', role: 'agent', redirect: '/agent/dashboard' },
  { email: 'admin@demo.com', password: 'demo1234', role: 'admin', redirect: '/agent/dashboard' },
  { email: 'cliente@demo.com', password: 'demo1234', role: 'client', redirect: '/client/inicio' },
]

// ─── KPIs AGENTE ─────────────────────────────────────────────────────────────
export const MOCK_KPIS: KPI[] = [
  { id: 'k1', label: 'Pólizas activas', value: '247', change: '+12%', trend: 'up', period: 'vs mes anterior', icon: 'FileCheck' },
  { id: 'k2', label: 'Prima mensual', value: '$184,320', change: '+8.3%', trend: 'up', period: 'MXN acumulado', icon: 'DollarSign' },
  { id: 'k3', label: 'Leads en pipeline', value: '38', change: '+5', trend: 'up', period: 'esta semana', icon: 'Users' },
  { id: 'k4', label: 'Renovaciones próximas', value: '14', change: '30 días', trend: 'neutral', period: 'próximos 30 días', icon: 'RefreshCw' },
  { id: 'k5', label: 'Tickets abiertos', value: '6', change: '-2', trend: 'down', period: 'pendientes de atención', icon: 'MessageSquare' },
  { id: 'k6', label: 'Tasa de cierre', value: '67%', change: '+4%', trend: 'up', period: 'vs trimestre anterior', icon: 'TrendingUp' },
]

// ─── PIPELINE LEADS ──────────────────────────────────────────────────────────
export const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Roberto Sánchez', email: 'rsanchez@email.com', phone: '55-1234-5678', stage: 'nuevo', ramo: 'GMM', product: 'GMM Individual', value: '$102,000', score: 82, assignedTo: 'Carlos Mendoza', createdAt: '2026-03-10', lastContact: '2026-03-17' },
  { id: 'l2', name: 'María Torres', email: 'mtorres@email.com', phone: '55-2345-6789', stage: 'contactado', ramo: 'Auto', product: 'Auto Premium', value: '$14,800', score: 74, assignedTo: 'Carlos Mendoza', createdAt: '2026-03-08', lastContact: '2026-03-16' },
  { id: 'l3', name: 'Empresa XYZ S.A.', email: 'rh@xyz.com', phone: '55-3456-7890', stage: 'perfilamiento', ramo: 'GMM Colectivo', product: 'GMM Colectivo', value: '$1,740,000', score: 91, assignedTo: 'Carlos Mendoza', createdAt: '2026-03-05', lastContact: '2026-03-15' },
  { id: 'l4', name: 'Jorge Ramírez', email: 'jramirez@email.com', phone: '55-4567-8901', stage: 'expediente', ramo: 'Vida', product: 'Vida Temporal 20 años', value: '$50,400', score: 68, assignedTo: 'Carlos Mendoza', createdAt: '2026-03-01', lastContact: '2026-03-14' },
  { id: 'l5', name: 'Sofía Herrera', email: 'sherrera@email.com', phone: '55-5678-9012', stage: 'cotizacion', ramo: 'Hogar', product: 'Hogar Integral', value: '$45,600', score: 85, assignedTo: 'Carlos Mendoza', createdAt: '2026-02-25', lastContact: '2026-03-17' },
  { id: 'l6', name: 'Grupo Alfa SA', email: 'contacto@alfa.com', phone: '55-6789-0123', stage: 'negociacion', ramo: 'Daños', product: 'Daños Patrimoniales', value: '$284,000', score: 77, assignedTo: 'Carlos Mendoza', createdAt: '2026-02-20', lastContact: '2026-03-16' },
  { id: 'l7', name: 'Laura Vega', email: 'lvega@email.com', phone: '55-7890-1234', stage: 'aceptacion', ramo: 'Auto', product: 'Auto Amplia', value: '$17,200', score: 90, assignedTo: 'Carlos Mendoza', createdAt: '2026-02-15', lastContact: '2026-03-17' },
  { id: 'l8', name: 'Miguel Ángel Cruz', email: 'macruz@email.com', phone: '55-8901-2345', stage: 'emision', ramo: 'GMM', product: 'GMM Plus', value: '$98,400', score: 95, assignedTo: 'Carlos Mendoza', createdAt: '2026-02-10', lastContact: '2026-03-15' },
]

// ─── PÓLIZAS ─────────────────────────────────────────────────────────────────
export const MOCK_POLICIES: Policy[] = [
  { id: 'p1', clientName: 'Ana López', type: 'GMM Individual', insurer: 'GNP', premium: '$8,500/mes', coverage: '$2,000,000', status: 'activa', startDate: '2025-04-01', endDate: '2026-04-01', policyNumber: 'GNP-2025-001234' },
  { id: 'p2', clientName: 'Ana López', type: 'Auto Amplia', insurer: 'Qualitas', premium: '$1,025/mes', coverage: '$350,000', status: 'activa', startDate: '2025-09-15', endDate: '2026-09-15', policyNumber: 'QUA-2025-005678' },
  { id: 'p3', clientName: 'Roberto Sánchez', type: 'Vida Temporal', insurer: 'Metlife', premium: '$4,200/mes', coverage: '$1,500,000', status: 'pendiente', startDate: '2026-04-01', endDate: '2027-04-01', policyNumber: 'MET-2026-009012' },
  { id: 'p4', clientName: 'Empresa XYZ', type: 'GMM Colectivo', insurer: 'AXA', premium: '$145,000/mes', coverage: 'Colectivo 50 personas', status: 'vigente', startDate: '2025-01-01', endDate: '2026-01-01', policyNumber: 'AXA-2025-000345' },
  { id: 'p5', clientName: 'Laura Vega', type: 'Hogar Integral', insurer: 'MAPFRE', premium: '$3,800/año', coverage: '$800,000', status: 'vencida', startDate: '2024-03-01', endDate: '2025-03-01', policyNumber: 'MAP-2024-007890' },
]

// ─── TICKETS ─────────────────────────────────────────────────────────────────
export const MOCK_TICKETS: Ticket[] = [
  { id: 't1', clientName: 'Ana López', subject: 'Aclaración de cobro — recibo duplicado', status: 'abierto', priority: 'alta', createdAt: '2026-03-16' },
  { id: 't2', clientName: 'Roberto Sánchez', subject: 'Solicitud de endoso — cambio de dirección', status: 'en_proceso', priority: 'media', createdAt: '2026-03-14' },
  { id: 't3', clientName: 'Empresa XYZ', subject: 'Alta de empleado nuevo al colectivo', status: 'en_proceso', priority: 'media', createdAt: '2026-03-12' },
  { id: 't4', clientName: 'Laura Vega', subject: 'Renovación de póliza de hogar vencida', status: 'abierto', priority: 'alta', createdAt: '2026-03-10' },
]

// ─── PAGOS ───────────────────────────────────────────────────────────────────
export const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay1', policyId: 'p1', clientName: 'Ana López', concept: 'GMM Individual — Abril 2026', amount: '$8,500', dueDate: '2026-04-01', status: 'pendiente' },
  { id: 'pay2', policyId: 'p2', clientName: 'Ana López', concept: 'Auto Amplia — Marzo 2026', amount: '$1,025', dueDate: '2026-03-15', status: 'pagado' },
  { id: 'pay3', policyId: 'p4', clientName: 'Empresa XYZ', concept: 'GMM Colectivo — Abril 2026', amount: '$145,000', dueDate: '2026-04-01', status: 'pendiente' },
  { id: 'pay4', policyId: 'p5', clientName: 'Laura Vega', concept: 'Hogar Integral — Renovación', amount: '$3,800', dueDate: '2025-03-01', status: 'vencido' },
]

// ─── DATOS CLIENTE DEMO (Ana López) ──────────────────────────────────────────
export const CLIENT_POLICIES = MOCK_POLICIES.filter(p => p.clientName === 'Ana López')
export const CLIENT_PAYMENTS = MOCK_PAYMENTS.filter(p => p.clientName === 'Ana López')

// ─── PIPELINE STAGES LABELS ──────────────────────────────────────────────────
export const PIPELINE_STAGES = [
  { id: 'nuevo', label: 'Nuevo' },
  { id: 'contactado', label: 'Contactado' },
  { id: 'perfilamiento', label: 'Perfilamiento' },
  { id: 'expediente', label: 'Expediente' },
  { id: 'cotizacion', label: 'Cotización' },
  { id: 'negociacion', label: 'Negociación' },
  { id: 'aceptacion', label: 'Aceptación' },
  { id: 'emision', label: 'Emisión' },
]

// ─── AGENDA DEL DÍA ──────────────────────────────────────────────────────────
export const MOCK_AGENDA: AgendaItem[] = [
  { id: 'a1', time: '09:00', title: 'Llamada con Empresa XYZ — GMM colectivo', type: 'call', client: 'Empresa XYZ' },
  { id: 'a2', time: '11:00', title: 'Presentación de propuesta — Laura Vega', type: 'meeting', client: 'Laura Vega' },
  { id: 'a3', time: '13:00', title: 'Seguimiento renovación — Ana López', type: 'followup', client: 'Ana López' },
  { id: 'a4', time: '16:00', title: 'Revisión expediente — Miguel Ángel Cruz', type: 'task', client: 'Miguel Ángel Cruz' },
]

// ─── GRÁFICO PRIMAS MENSUALES ────────────────────────────────────────────────
export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { month: 'Oct', primas: 142000, leads: 12 },
  { month: 'Nov', primas: 158000, leads: 15 },
  { month: 'Dic', primas: 134000, leads: 9 },
  { month: 'Ene', primas: 171000, leads: 18 },
  { month: 'Feb', primas: 165000, leads: 14 },
  { month: 'Mar', primas: 184320, leads: 22 },
]
