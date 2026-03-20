import { MockUser, Policy, Lead, KPI, Ticket, Payment, AgendaItem, ChartDataPoint } from '@/types'

// ─── USUARIOS DEMO ───────────────────────────────────────────────────────────
export const DEMO_USERS: MockUser[] = [
  { id: 'u1', name: 'Carlos Mendoza', email: 'agente@demo.com', role: 'agent', agency: 'Seguros Premier' },
  { id: 'u2', name: 'Patricia Garza', email: 'admin@demo.com', role: 'admin', agency: 'Seguros Premier' },
  { id: 'u3', name: 'Ana López', email: 'cliente@demo.com', role: 'client' },
  { id: 'u4', name: 'Marco Reyes', email: 'broker@demo.com', role: 'broker' as UserRole, agency: 'Reyes Broker & Asociados' },
  { id: 'u5', name: 'Sandra Vidal', email: 'promotoria@demo.com', role: 'promotoria' as UserRole, agency: 'Promotoria Vidal Grupo' },
]

export const DEMO_CREDENTIALS = [
  { email: 'agente@demo.com',     password: 'demo1234', role: 'agent',      redirect: '/agent/dashboard' },
  { email: 'admin@demo.com',      password: 'demo1234', role: 'admin',      redirect: '/agent/dashboard' },
  { email: 'cliente@demo.com',    password: 'demo1234', role: 'client',     redirect: '/client/inicio' },
  { email: 'broker@demo.com',     password: 'demo1234', role: 'broker',     redirect: '/agent/dashboard' },
  { email: 'promotoria@demo.com', password: 'demo1234', role: 'promotoria', redirect: '/agent/equipo' },
]

// ─── EQUIPO DE AGENTES (vista promotoria/broker/admin) ───────────────────────
export const MOCK_AGENTES_EQUIPO = [
  {
    id: 'ag1', name: 'Carlos Mendoza', email: 'agente@demo.com', cedula: 'CNSF-MX-2019-04521',
    status: 'activo', plan: 'Profesional', avatar: 'CM',
    polizasActivas: 247, primaTotal: 184320, leads: 38, tasaCierre: 67,
    comisionMes: 27648, metaMes: 200000, avanceMeta: 92,
    ramos: ['GMM', 'Auto', 'Vida', 'Daños'],
    aseguradoras: ['GNP', 'AXA', 'Qualitas', 'MAPFRE'],
    ultimoAcceso: '2026-03-19 08:02',
  },
  {
    id: 'ag2', name: 'Diego Pacheco', email: 'dpacheco@demo.com', cedula: 'CNSF-MX-2021-07834',
    status: 'activo', plan: 'Básico', avatar: 'DP',
    polizasActivas: 89, primaTotal: 64200, leads: 14, tasaCierre: 52,
    comisionMes: 9630, metaMes: 80000, avanceMeta: 80,
    ramos: ['Auto', 'Hogar'],
    aseguradoras: ['Qualitas', 'HDI'],
    ultimoAcceso: '2026-03-18 17:30',
  },
  {
    id: 'ag3', name: 'Lucía Morán', email: 'lmoran@demo.com', cedula: 'CNSF-MX-2020-06120',
    status: 'activo', plan: 'Profesional', avatar: 'LM',
    polizasActivas: 178, primaTotal: 142800, leads: 22, tasaCierre: 71,
    comisionMes: 21420, metaMes: 150000, avanceMeta: 95,
    ramos: ['GMM', 'Vida'],
    aseguradoras: ['GNP', 'Metlife'],
    ultimoAcceso: '2026-03-19 07:45',
  },
  {
    id: 'ag4', name: 'Héctor Ríos', email: 'hrios@demo.com', cedula: 'CNSF-MX-2022-09003',
    status: 'inactivo', plan: 'Básico', avatar: 'HR',
    polizasActivas: 34, primaTotal: 21500, leads: 5, tasaCierre: 38,
    comisionMes: 3225, metaMes: 50000, avanceMeta: 43,
    ramos: ['Auto'],
    aseguradoras: ['Qualitas'],
    ultimoAcceso: '2026-03-10 11:00',
  },
  {
    id: 'ag5', name: 'Valeria Castillo', email: 'vcastillo@demo.com', cedula: 'CNSF-MX-2023-11245',
    status: 'activo', plan: 'Empresarial', avatar: 'VC',
    polizasActivas: 312, primaTotal: 298400, leads: 51, tasaCierre: 74,
    comisionMes: 44760, metaMes: 300000, avanceMeta: 99,
    ramos: ['GMM', 'GMM Colectivo', 'Vida', 'Daños', 'RC'],
    aseguradoras: ['GNP', 'AXA', 'Metlife', 'MAPFRE'],
    ultimoAcceso: '2026-03-19 09:00',
  },
]

// ─── HISTORIAL PAGOS DETALLADO (con método y destino) ────────────────────────
export const MOCK_PAYMENT_HISTORY = [
  { id: 'ph1', policyNumber: 'GNP-2025-001234', clientName: 'Ana López', concepto: 'GMM Individual — Marzo 2026', monto: 8500, fecha: '2026-03-01', metodoPago: 'Transferencia SPEI', destino: 'Cuenta aseguradora GNP', banco: 'BBVA', referencia: 'SPEI-GNP-20260301-0042', status: 'confirmado', comprobante: true },
  { id: 'ph2', policyNumber: 'GNP-2025-001234', clientName: 'Ana López', concepto: 'GMM Individual — Febrero 2026', monto: 8500, fecha: '2026-02-01', metodoPago: 'Tarjeta débito', destino: 'Cuenta promotoria Seguros Premier', banco: 'Santander', referencia: 'TDC-SP-20260201-8841', status: 'confirmado', comprobante: true },
  { id: 'ph3', policyNumber: 'QUA-2026-008912', clientName: 'Laura Vega', concepto: 'Auto Amplia — Marzo 2026', monto: 1420, fecha: '2026-03-10', metodoPago: 'Efectivo', destino: 'Cuenta promotoria Seguros Premier', banco: 'Caja', referencia: 'EFV-20260310-001', status: 'confirmado', comprobante: false },
  { id: 'ph4', policyNumber: 'AXA-2025-000345', clientName: 'Empresa XYZ', concepto: 'GMM Colectivo — Febrero 2026', monto: 145000, fecha: '2026-02-01', metodoPago: 'Transferencia SPEI', destino: 'Cuenta aseguradora AXA', banco: 'Banamex', referencia: 'SPEI-AXA-20260201-1190', status: 'confirmado', comprobante: true },
  { id: 'ph5', policyNumber: 'MET-2026-009012', clientName: 'Roberto Sánchez', concepto: 'Vida Temporal — Primer recibo', monto: 4200, fecha: '2026-04-01', metodoPago: 'Domiciliación', destino: 'Cuenta aseguradora Metlife', banco: 'HSBC', referencia: 'DOM-MET-20260401-3310', status: 'pendiente', comprobante: false },
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
  { id: 'l9', name: 'Fernanda Ruiz', email: 'fruiz@email.com', phone: '55-9012-3456', stage: 'nuevo', ramo: 'Vida', product: 'Vida Entera', value: '$72,000', score: 60, assignedTo: 'Carlos Mendoza', createdAt: '2026-03-18', lastContact: '2026-03-18' },
  { id: 'l10', name: 'Constructora Olmedo', email: 'compras@olmedo.mx', phone: '55-0123-4567', stage: 'contactado', ramo: 'RC', product: 'Responsabilidad Civil', value: '$520,000', score: 78, assignedTo: 'Carlos Mendoza', createdAt: '2026-03-15', lastContact: '2026-03-17' },
  { id: 'l11', name: 'Diego Pacheco', email: 'dpacheco@email.com', phone: '55-1111-2222', stage: 'expediente', ramo: 'Auto', product: 'Auto Terceros', value: '$8,400', score: 55, assignedTo: 'Carlos Mendoza', createdAt: '2026-03-03', lastContact: '2026-03-12' },
  { id: 'l12', name: 'Farmacia Salud+', email: 'admin@saludmas.com', phone: '55-3333-4444', stage: 'cotizacion', ramo: 'Daños', product: 'Daños Empresarial', value: '$190,000', score: 83, assignedTo: 'Carlos Mendoza', createdAt: '2026-02-28', lastContact: '2026-03-16' },
]

// ─── CLIENTES REGISTRADOS (expediente vivo) ──────────────────────────────────
export const MOCK_CLIENTS = [
  {
    id: 'c1', name: 'Ana López', email: 'cliente@demo.com', phone: '55-9876-5432',
    rfc: 'LOAA850312MDF', fechaNac: '1985-03-12', genero: 'F',
    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX, 03100',
    ocupacion: 'Médico Especialista', estadoCivil: 'Casada',
    assignedAgent: 'Carlos Mendoza', createdAt: '2024-01-15', lastContact: '2026-03-15',
    score: 94, tags: ['Cliente VIP', 'GMM', 'Auto'],
    notas: [
      { id: 'n1', text: 'Cliente muy puntual en pagos, siempre responde WhatsApp.', date: '2026-03-15', author: 'Carlos Mendoza' },
      { id: 'n2', text: 'Interesada en GMM Colectivo para su consultorio.', date: '2026-02-20', author: 'Carlos Mendoza' },
    ],
  },
  {
    id: 'c2', name: 'Roberto Sánchez', email: 'rsanchez@email.com', phone: '55-1234-5678',
    rfc: 'SARB770608HDF', fechaNac: '1977-06-08', genero: 'M',
    direccion: 'Calle Durango 45, Col. Roma Norte, CDMX, 06700',
    ocupacion: 'Empresario', estadoCivil: 'Casado',
    assignedAgent: 'Carlos Mendoza', createdAt: '2026-03-10', lastContact: '2026-03-17',
    score: 82, tags: ['Prospecto', 'GMM'],
    notas: [
      { id: 'n3', text: 'Necesita GMM antes de abril, viaje internacional en mayo.', date: '2026-03-17', author: 'Carlos Mendoza' },
    ],
  },
  {
    id: 'c3', name: 'Laura Vega', email: 'lvega@email.com', phone: '55-7890-1234',
    rfc: 'VEGL920415QRO', fechaNac: '1992-04-15', genero: 'F',
    direccion: 'Blvd. Juárez 892, Querétaro, QRO, 76000',
    ocupacion: 'Diseñadora', estadoCivil: 'Soltera',
    assignedAgent: 'Carlos Mendoza', createdAt: '2025-09-01', lastContact: '2026-03-17',
    score: 90, tags: ['Auto', 'Hogar'],
    notas: [],
  },
  {
    id: 'c4', name: 'Empresa XYZ S.A.', email: 'rh@xyz.com', phone: '55-3456-7890',
    rfc: 'EXY980101MMX', fechaNac: '', genero: 'empresa',
    direccion: 'Paseo de la Reforma 500, CDMX, 06600',
    ocupacion: 'Manufactura', estadoCivil: '',
    assignedAgent: 'Carlos Mendoza', createdAt: '2025-01-01', lastContact: '2026-03-15',
    score: 91, tags: ['Corporativo', 'GMM Colectivo'],
    notas: [
      { id: 'n4', text: 'Solicitan incremento de suma asegurada en renovación.', date: '2026-03-10', author: 'Carlos Mendoza' },
    ],
  },
  {
    id: 'c5', name: 'Miguel Ángel Cruz', email: 'macruz@email.com', phone: '55-8901-2345',
    rfc: 'CUCM851120NLE', fechaNac: '1985-11-20', genero: 'M',
    direccion: 'Av. Garza Sada 2501, Monterrey, NLE, 64849',
    ocupacion: 'Ingeniero', estadoCivil: 'Casado',
    assignedAgent: 'Carlos Mendoza', createdAt: '2026-02-10', lastContact: '2026-03-15',
    score: 95, tags: ['GMM', 'En emisión'],
    notas: [],
  },
  {
    id: 'c6', name: 'Jorge Ramírez', email: 'jramirez@email.com', phone: '55-4567-8901',
    rfc: 'RAJJ800905JAL', fechaNac: '1980-09-05', genero: 'M',
    direccion: 'Av. Vallarta 2300, Guadalajara, JAL, 44690',
    ocupacion: 'Contador', estadoCivil: 'Divorciado',
    assignedAgent: 'Carlos Mendoza', createdAt: '2026-03-01', lastContact: '2026-03-14',
    score: 68, tags: ['Vida'],
    notas: [],
  },
]

// ─── PÓLIZAS ─────────────────────────────────────────────────────────────────
export const MOCK_POLICIES: Policy[] = [
  { id: 'p1', clientName: 'Ana López', type: 'GMM Individual', insurer: 'GNP', premium: '$8,500/mes', coverage: '$2,000,000', status: 'activa', startDate: '2025-04-01', endDate: '2026-04-01', policyNumber: 'GNP-2025-001234' },
  { id: 'p2', clientName: 'Ana López', type: 'Auto Amplia', insurer: 'Qualitas', premium: '$1,025/mes', coverage: '$350,000', status: 'activa', startDate: '2025-09-15', endDate: '2026-09-15', policyNumber: 'QUA-2025-005678' },
  { id: 'p3', clientName: 'Roberto Sánchez', type: 'Vida Temporal', insurer: 'Metlife', premium: '$4,200/mes', coverage: '$1,500,000', status: 'pendiente', startDate: '2026-04-01', endDate: '2027-04-01', policyNumber: 'MET-2026-009012' },
  { id: 'p4', clientName: 'Empresa XYZ', type: 'GMM Colectivo', insurer: 'AXA', premium: '$145,000/mes', coverage: 'Colectivo 50 personas', status: 'vigente', startDate: '2025-01-01', endDate: '2026-01-01', policyNumber: 'AXA-2025-000345' },
  { id: 'p5', clientName: 'Laura Vega', type: 'Hogar Integral', insurer: 'MAPFRE', premium: '$3,800/año', coverage: '$800,000', status: 'vencida', startDate: '2024-03-01', endDate: '2025-03-01', policyNumber: 'MAP-2024-007890' },
  { id: 'p6', clientName: 'Miguel Ángel Cruz', type: 'GMM Plus', insurer: 'GNP', premium: '$9,200/mes', coverage: '$3,000,000', status: 'activa', startDate: '2026-03-01', endDate: '2027-03-01', policyNumber: 'GNP-2026-002100' },
  { id: 'p7', clientName: 'Laura Vega', type: 'Auto Amplia', insurer: 'Qualitas', premium: '$1,420/mes', coverage: '$280,000', status: 'activa', startDate: '2026-01-10', endDate: '2027-01-10', policyNumber: 'QUA-2026-008912' },
  { id: 'p8', clientName: 'Empresa XYZ', type: 'RC Empresarial', insurer: 'MAPFRE', premium: '$28,000/mes', coverage: '$10,000,000', status: 'activa', startDate: '2025-06-01', endDate: '2026-06-01', policyNumber: 'MAP-2025-003300' },
]

// ─── TICKETS ─────────────────────────────────────────────────────────────────
export const MOCK_TICKETS: Ticket[] = [
  { id: 't1', clientName: 'Ana López', subject: 'Aclaración de cobro — recibo duplicado', status: 'abierto', priority: 'alta', createdAt: '2026-03-16' },
  { id: 't2', clientName: 'Roberto Sánchez', subject: 'Solicitud de endoso — cambio de dirección', status: 'en_proceso', priority: 'media', createdAt: '2026-03-14' },
  { id: 't3', clientName: 'Empresa XYZ', subject: 'Alta de empleado nuevo al colectivo', status: 'en_proceso', priority: 'media', createdAt: '2026-03-12' },
  { id: 't4', clientName: 'Laura Vega', subject: 'Renovación de póliza de hogar vencida', status: 'abierto', priority: 'alta', createdAt: '2026-03-10' },
  { id: 't5', clientName: 'Miguel Ángel Cruz', subject: 'Solicitud de constancia de vigencia', status: 'cerrado', priority: 'baja', createdAt: '2026-03-08' },
  { id: 't6', clientName: 'Empresa XYZ', subject: 'Baja de empleado del colectivo — 3 bajas', status: 'abierto', priority: 'media', createdAt: '2026-03-18' },
  { id: 't7', clientName: 'Ana López', subject: 'Siniestro — hospitalización urgente', status: 'en_proceso', priority: 'urgente', createdAt: '2026-03-17' },
  { id: 't8', clientName: 'Jorge Ramírez', subject: 'Duda sobre cobertura de vida en accidente', status: 'abierto', priority: 'media', createdAt: '2026-03-15' },
]

// ─── TICKET TIMELINES ────────────────────────────────────────────────────────
export const MOCK_TICKET_TIMELINE: Record<string, Array<{id:string; text:string; author:string; date:string; type:'nota'|'accion'|'cliente'}>> = {
  t1: [
    { id: 'tt1', text: 'Ticket creado por cliente desde app.', author: 'Sistema', date: '2026-03-16 09:12', type: 'accion' },
    { id: 'tt2', text: 'Revisé el estado de cuenta. Efectivamente hay un cargo duplicado del día 14. Lo reporté a GNP.', author: 'Carlos Mendoza', date: '2026-03-16 10:45', type: 'nota' },
    { id: 'tt3', text: 'Gracias, espero su respuesta pronto.', author: 'Ana López', date: '2026-03-16 11:02', type: 'cliente' },
    { id: 'tt4', text: 'GNP confirmó la devolución en 3-5 días hábiles.', author: 'Carlos Mendoza', date: '2026-03-17 14:30', type: 'nota' },
  ],
  t7: [
    { id: 'tt10', text: 'Ticket abierto por siniestro — hospitalización de emergencia.', author: 'Sistema', date: '2026-03-17 22:10', type: 'accion' },
    { id: 'tt11', text: 'Contacté al hospital. Es el Hospital Ángeles Lomas. Notifiqué a GNP carta aval.', author: 'Carlos Mendoza', date: '2026-03-18 08:15', type: 'nota' },
    { id: 'tt12', text: 'GNP aprobó carta aval por $85,000. Cama disponible, procedimiento autorizado.', author: 'Carlos Mendoza', date: '2026-03-18 10:00', type: 'accion' },
  ],
}

// ─── PAGOS ───────────────────────────────────────────────────────────────────
export const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay1', policyId: 'p1', clientName: 'Ana López', concept: 'GMM Individual — Abril 2026', amount: '$8,500', dueDate: '2026-04-01', status: 'pendiente' },
  { id: 'pay2', policyId: 'p2', clientName: 'Ana López', concept: 'Auto Amplia — Marzo 2026', amount: '$1,025', dueDate: '2026-03-15', status: 'pagado' },
  { id: 'pay3', policyId: 'p4', clientName: 'Empresa XYZ', concept: 'GMM Colectivo — Abril 2026', amount: '$145,000', dueDate: '2026-04-01', status: 'pendiente' },
  { id: 'pay4', policyId: 'p5', clientName: 'Laura Vega', concept: 'Hogar Integral — Renovación', amount: '$3,800', dueDate: '2025-03-01', status: 'vencido' },
  { id: 'pay5', policyId: 'p6', clientName: 'Miguel Ángel Cruz', concept: 'GMM Plus — Marzo 2026', amount: '$9,200', dueDate: '2026-03-01', status: 'pagado' },
  { id: 'pay6', policyId: 'p7', clientName: 'Laura Vega', concept: 'Auto Amplia — Marzo 2026', amount: '$1,420', dueDate: '2026-03-10', status: 'pagado' },
  { id: 'pay7', policyId: 'p8', clientName: 'Empresa XYZ', concept: 'RC Empresarial — Abril 2026', amount: '$28,000', dueDate: '2026-04-01', status: 'pendiente' },
  { id: 'pay8', policyId: 'p1', clientName: 'Ana López', concept: 'GMM Individual — Marzo 2026', amount: '$8,500', dueDate: '2026-03-01', status: 'pagado' },
  { id: 'pay9', policyId: 'p3', clientName: 'Roberto Sánchez', concept: 'Vida Temporal — Primer recibo', amount: '$4,200', dueDate: '2026-04-01', status: 'pendiente' },
  { id: 'pay10', policyId: 'p2', clientName: 'Ana López', concept: 'Auto Amplia — Febrero 2026', amount: '$1,025', dueDate: '2026-02-15', status: 'pagado' },
]

// ─── SINIESTROS ──────────────────────────────────────────────────────────────
export const MOCK_SINIESTROS = [
  {
    id: 's1', clientName: 'Ana López', policyId: 'p1', policyNumber: 'GNP-2025-001234',
    tipo: 'Hospitalización', descripcion: 'Cirugía de emergencia — apendicitis', fecha: '2026-03-17',
    status: 'en_proceso', monto: '$85,000', aseguradora: 'GNP',
    timeline: [
      { id: 'st1', accion: 'Reporte inicial recibido', fecha: '2026-03-17 22:10', responsable: 'Sistema' },
      { id: 'st2', accion: 'Notificación enviada a GNP', fecha: '2026-03-18 08:15', responsable: 'Carlos Mendoza' },
      { id: 'st3', accion: 'Carta aval aprobada — $85,000', fecha: '2026-03-18 10:00', responsable: 'GNP' },
    ],
  },
  {
    id: 's2', clientName: 'Laura Vega', policyId: 'p7', policyNumber: 'QUA-2026-008912',
    tipo: 'Choque vehicular', descripcion: 'Choque por alcance en Periférico, daños en defensa y cofre', fecha: '2026-02-28',
    status: 'cerrado', monto: '$32,400', aseguradora: 'Qualitas',
    timeline: [
      { id: 'st4', accion: 'Reporte de siniestro recibido', fecha: '2026-02-28 18:30', responsable: 'Sistema' },
      { id: 'st5', accion: 'Ajustador asignado — Folio QUA-2890', fecha: '2026-03-01 09:00', responsable: 'Qualitas' },
      { id: 'st6', accion: 'Dictamen emitido — Pérdida parcial', fecha: '2026-03-05 14:00', responsable: 'Qualitas' },
      { id: 'st7', accion: 'Cheque liberado — $32,400', fecha: '2026-03-10 11:00', responsable: 'Qualitas' },
      { id: 'st8', accion: 'Caso cerrado — Liquidado', fecha: '2026-03-12 10:00', responsable: 'Carlos Mendoza' },
    ],
  },
  {
    id: 's3', clientName: 'Empresa XYZ', policyId: 'p4', policyNumber: 'AXA-2025-000345',
    tipo: 'Hospitalización Colectivo', descripcion: 'Empleado: Luis Mora — colecistectomía laparoscópica', fecha: '2026-03-05',
    status: 'cerrado', monto: '$61,200', aseguradora: 'AXA',
    timeline: [
      { id: 'st9', accion: 'Notificación RH — empleado hospitalizado', fecha: '2026-03-05 08:00', responsable: 'RH Empresa XYZ' },
      { id: 'st10', accion: 'Carta aval gestionada con AXA', fecha: '2026-03-05 10:30', responsable: 'Carlos Mendoza' },
      { id: 'st11', accion: 'Alta hospitalaria — caso cerrado', fecha: '2026-03-09 16:00', responsable: 'AXA' },
    ],
  },
]

// ─── CONVERSACIONES (MENSAJERÍA) ─────────────────────────────────────────────
export const MOCK_CONVERSATIONS = [
  {
    id: 'conv1', clientName: 'Ana López', clientId: 'c1', canal: 'whatsapp', unread: 2,
    lastMessage: 'Gracias, espero su respuesta pronto.', lastTime: '2026-03-17 11:02',
    messages: [
      { id: 'm1', from: 'agent', text: 'Hola Ana, ¿cómo estás? Te escribo para confirmar el estado de tu recibo de marzo.', time: '2026-03-16 10:00' },
      { id: 'm2', from: 'client', text: 'Hola Carlos, vi que me cobraron dos veces este mes.', time: '2026-03-16 10:15' },
      { id: 'm3', from: 'agent', text: 'Ya lo revisé, es un error del sistema de GNP. Estoy gestionando la devolución.', time: '2026-03-16 10:45' },
      { id: 'm4', from: 'client', text: 'Gracias, espero su respuesta pronto.', time: '2026-03-17 11:02' },
      { id: 'm5', from: 'agent', text: 'GNP confirmó devolución en 3-5 días hábiles. Te aviso cuando esté acreditado.', time: '2026-03-17 14:30' },
    ],
  },
  {
    id: 'conv2', clientName: 'Empresa XYZ S.A.', clientId: 'c4', canal: 'email', unread: 0,
    lastMessage: 'Quedamos así entonces, hasta la próxima reunión.', lastTime: '2026-03-15 17:00',
    messages: [
      { id: 'm6', from: 'client', text: 'Carlos, necesitamos dar de alta a 3 nuevos empleados al colectivo.', time: '2026-03-12 09:30' },
      { id: 'm7', from: 'agent', text: 'Claro, necesito nombre, RFC, fecha de nacimiento y fecha de ingreso de cada uno.', time: '2026-03-12 10:00' },
      { id: 'm8', from: 'client', text: 'Te mando los datos por correo.', time: '2026-03-12 10:15' },
      { id: 'm9', from: 'agent', text: 'Recibido, ya ingresé a los 3 empleados. Confirmación adjunta.', time: '2026-03-14 12:00' },
      { id: 'm10', from: 'client', text: 'Quedamos así entonces, hasta la próxima reunión.', time: '2026-03-15 17:00' },
    ],
  },
  {
    id: 'conv3', clientName: 'Roberto Sánchez', clientId: 'c2', canal: 'whatsapp', unread: 1,
    lastMessage: '¿Cuándo me llega la póliza?', lastTime: '2026-03-17 18:45',
    messages: [
      { id: 'm11', from: 'agent', text: 'Roberto, ya terminé de armar tu expediente de GMM. ¿Tienes tu último check-up?', time: '2026-03-15 11:00' },
      { id: 'm12', from: 'client', text: 'Sí, lo tengo del año pasado, ¿sirve?', time: '2026-03-15 12:30' },
      { id: 'm13', from: 'agent', text: 'Perfecto, con eso es suficiente. La enviamos a GNP esta semana.', time: '2026-03-15 13:00' },
      { id: 'm14', from: 'client', text: '¿Cuándo me llega la póliza?', time: '2026-03-17 18:45' },
    ],
  },
  {
    id: 'conv4', clientName: 'Laura Vega', clientId: 'c3', canal: 'app', unread: 0,
    lastMessage: 'Excelente, muchas gracias por todo.', lastTime: '2026-03-12 10:30',
    messages: [
      { id: 'm15', from: 'agent', text: 'Laura, tu siniestro ya fue liquidado. Qualitas depositó $32,400.', time: '2026-03-12 09:00' },
      { id: 'm16', from: 'client', text: 'Excelente, muchas gracias por todo.', time: '2026-03-12 10:30' },
    ],
  },
  {
    id: 'conv5', clientName: 'Miguel Ángel Cruz', clientId: 'c5', canal: 'whatsapp', unread: 3,
    lastMessage: '¿Ya puedo descargar mi póliza?', lastTime: '2026-03-18 08:00',
    messages: [
      { id: 'm17', from: 'agent', text: 'Miguel, tu póliza GMM Plus ya fue emitida por GNP. Bienvenido.', time: '2026-03-17 17:00' },
      { id: 'm18', from: 'client', text: '¿Ya puedo descargar mi póliza?', time: '2026-03-18 08:00' },
    ],
  },
]

// ─── KNOWLEDGE HUB ───────────────────────────────────────────────────────────
export const MOCK_ASEGURADORAS = [
  { id: 'ins1', nombre: 'GNP Seguros', logo: 'G', color: '#1A4E8C', ramos: ['GMM', 'Vida', 'Auto', 'Daños'], docs: 14, contacto: 'gnp-soporte@gnp.com.mx', sitio: 'www.gnp.com.mx' },
  { id: 'ins2', nombre: 'AXA Seguros', logo: 'A', color: '#0066A1', ramos: ['GMM Colectivo', 'Vida Grupo', 'Daños', 'RC'], docs: 11, contacto: 'axa-agentes@axa.com.mx', sitio: 'www.axa.com.mx' },
  { id: 'ins3', nombre: 'Qualitas', logo: 'Q', color: '#C8102E', ramos: ['Auto'], docs: 8, contacto: 'agentes@qualitas.com.mx', sitio: 'www.qualitas.com.mx' },
  { id: 'ins4', nombre: 'MAPFRE', logo: 'M', color: '#B20000', ramos: ['Auto', 'Hogar', 'RC', 'Daños'], docs: 9, contacto: 'mapfre-agentes@mapfre.mx', sitio: 'www.mapfre.com.mx' },
  { id: 'ins5', nombre: 'Metlife', logo: 'ML', color: '#00A0DF', ramos: ['Vida', 'GMM'], docs: 7, contacto: 'metlife-agentes@metlife.com', sitio: 'www.metlife.com.mx' },
  { id: 'ins6', nombre: 'HDI Seguros', logo: 'H', color: '#005CA9', ramos: ['Auto', 'Daños', 'RC', 'Hogar'], docs: 6, contacto: 'hdi-agentes@hdi.com.mx', sitio: 'www.hdi.com.mx' },
]

export const MOCK_KB_DOCS = [
  { id: 'kb1', insurerId: 'ins1', nombre: 'Condiciones Generales GMM GNP 2025', tipo: 'Condiciones', ramo: 'GMM', version: '2025-v2', fecha: '2025-01-15', size: '2.4 MB' },
  { id: 'kb2', insurerId: 'ins1', nombre: 'Tabla de Deducibles GMM GNP', tipo: 'Tabla', ramo: 'GMM', version: '2025-v1', fecha: '2025-01-15', size: '340 KB' },
  { id: 'kb3', insurerId: 'ins1', nombre: 'Manual Operativo Agentes GNP 2025', tipo: 'Manual', ramo: 'Todos', version: '2025-v1', fecha: '2025-02-01', size: '5.1 MB' },
  { id: 'kb4', insurerId: 'ins2', nombre: 'Condiciones Generales GMM Colectivo AXA', tipo: 'Condiciones', ramo: 'GMM Colectivo', version: '2025-v1', fecha: '2025-03-01', size: '3.2 MB' },
  { id: 'kb5', insurerId: 'ins2', nombre: 'Guía de Altas y Bajas Colectivo AXA', tipo: 'Guía', ramo: 'GMM Colectivo', version: '2025-v2', fecha: '2025-06-01', size: '1.1 MB' },
  { id: 'kb6', insurerId: 'ins3', nombre: 'Cláusula de Cobertura Amplia Qualitas', tipo: 'Cláusula', ramo: 'Auto', version: '2026-v1', fecha: '2026-01-01', size: '890 KB' },
  { id: 'kb7', insurerId: 'ins3', nombre: 'Procedimiento de Siniestros Auto Qualitas', tipo: 'Procedimiento', ramo: 'Auto', version: '2025-v3', fecha: '2025-09-01', size: '1.5 MB' },
  { id: 'kb8', insurerId: 'ins4', nombre: 'Condiciones Generales Hogar MAPFRE', tipo: 'Condiciones', ramo: 'Hogar', version: '2025-v1', fecha: '2025-01-10', size: '2.1 MB' },
  { id: 'kb9', insurerId: 'ins5', nombre: 'Tabla de Primas Vida Temporal Metlife 2026', tipo: 'Tabla', ramo: 'Vida', version: '2026-v1', fecha: '2026-01-01', size: '540 KB' },
  { id: 'kb10', insurerId: 'ins5', nombre: 'Proceso de Expedición Vida Metlife', tipo: 'Procedimiento', ramo: 'Vida', version: '2025-v2', fecha: '2025-07-01', size: '780 KB' },
]

// ─── COMPLIANCE / BITÁCORA ────────────────────────────────────────────────────
export const MOCK_AUDIT_LOG = [
  { id: 'al1', accion: 'Login exitoso', usuario: 'Carlos Mendoza', modulo: 'Autenticación', ip: '192.168.1.10', fecha: '2026-03-19 08:02', tipo: 'acceso' },
  { id: 'al2', accion: 'Emisión de póliza GNP-2026-002100', usuario: 'Carlos Mendoza', modulo: 'Emisión', ip: '192.168.1.10', fecha: '2026-03-17 16:30', tipo: 'operacion' },
  { id: 'al3', accion: 'Descarga de documento — Constancia GNP', usuario: 'Carlos Mendoza', modulo: 'Documentos', ip: '192.168.1.10', fecha: '2026-03-17 10:15', tipo: 'documento' },
  { id: 'al4', accion: 'XORIA — consulta sobre coberturas GMM', usuario: 'Carlos Mendoza', modulo: 'IA', ip: '192.168.1.10', fecha: '2026-03-17 09:45', tipo: 'ia' },
  { id: 'al5', accion: 'Modificación de datos de cliente — Ana López', usuario: 'Carlos Mendoza', modulo: 'CRM', ip: '192.168.1.10', fecha: '2026-03-16 14:20', tipo: 'operacion' },
  { id: 'al6', accion: 'Login exitoso', usuario: 'Patricia Garza', modulo: 'Autenticación', ip: '192.168.1.20', fecha: '2026-03-16 09:00', tipo: 'acceso' },
  { id: 'al7', accion: 'Alta de usuario — Diego Pacheco', usuario: 'Patricia Garza', modulo: 'Usuarios', ip: '192.168.1.20', fecha: '2026-03-16 09:30', tipo: 'admin' },
  { id: 'al8', accion: 'XORIA — generación de propuesta comercial', usuario: 'Carlos Mendoza', modulo: 'IA', ip: '192.168.1.10', fecha: '2026-03-15 11:00', tipo: 'ia' },
  { id: 'al9', accion: 'Renovación confirmada — MAP-2024-007890', usuario: 'Carlos Mendoza', modulo: 'Renovaciones', ip: '192.168.1.10', fecha: '2026-03-14 15:00', tipo: 'operacion' },
  { id: 'al10', accion: 'Apertura de ticket T007 — Siniestro Ana López', usuario: 'Sistema', modulo: 'Tickets', ip: 'interno', fecha: '2026-03-17 22:10', tipo: 'sistema' },
]

// ─── CATÁLOGOS MAESTROS ──────────────────────────────────────────────────────
export const MOCK_RAMOS = [
  { id: 'r1', nombre: 'Gastos Médicos Mayores (GMM)', codigo: 'GMM', activo: true, aseguradoras: ['GNP', 'AXA', 'Metlife'] },
  { id: 'r2', nombre: 'Auto', codigo: 'AUTO', activo: true, aseguradoras: ['Qualitas', 'MAPFRE', 'HDI'] },
  { id: 'r3', nombre: 'Vida', codigo: 'VIDA', activo: true, aseguradoras: ['Metlife', 'GNP'] },
  { id: 'r4', nombre: 'Hogar', codigo: 'HOGAR', activo: true, aseguradoras: ['MAPFRE', 'HDI'] },
  { id: 'r5', nombre: 'Daños y Patrimoniales', codigo: 'DAÑOS', activo: true, aseguradoras: ['AXA', 'MAPFRE', 'HDI'] },
  { id: 'r6', nombre: 'Responsabilidad Civil', codigo: 'RC', activo: true, aseguradoras: ['AXA', 'MAPFRE', 'HDI'] },
  { id: 'r7', nombre: 'GMM Colectivo', codigo: 'GMM-COL', activo: true, aseguradoras: ['AXA', 'GNP'] },
  { id: 'r8', nombre: 'Transporte', codigo: 'TRANS', activo: false, aseguradoras: ['MAPFRE'] },
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

// ─── AGENDA ──────────────────────────────────────────────────────────────────
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
