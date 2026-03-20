export type UnderwritingStatus =
  | 'nuevo'
  | 'en_revision'
  | 'observado'
  | 'aprobado'
  | 'rechazado'
  | 'pendiente_informacion'

export type PolicyStatus =
  | 'activa'
  | 'pendiente_pago'
  | 'cancelada'
  | 'vencida'
  | 'renovada'

export type ClaimStatus =
  | 'reportado'
  | 'ajustador_asignado'
  | 'en_camino'
  | 'en_sitio'
  | 'inspeccion_en_curso'
  | 'resolucion_preliminar'
  | 'cerrado'

export type AdjusterStatus = 'disponible' | 'en_camino' | 'en_sitio' | 'cerrando'

export interface ExecutiveKPI {
  id: string
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'neutral'
  drillPath: string
  note: string
}

export interface UnderwritingCase {
  id: string
  createdAt: string
  product: string
  ramo: string
  insuredName: string
  agentName: string
  promotoria: string
  annualPremium: number
  riskScore: number
  inconsistencies: string[]
  status: UnderwritingStatus
  documents: Array<{ name: string; status: 'ok' | 'faltante' | 'observado' }>
  observations: string[]
}

export interface PolicyRecord {
  id: string
  product: string
  ramo: string
  insuredName: string
  status: PolicyStatus
  annualPremium: number
  startDate: string
  endDate: string
  agentOrigin: string
  promotoria: string
  coverage: string
  beneficiaries: string[]
  movements: Array<{ date: string; action: string; actor: string }>
  endorsements: Array<{ id: string; type: string; date: string; impact: string }>
  documents: string[]
}

export interface BillingRecord {
  id: string
  policyId: string
  insuredName: string
  channel: 'agente' | 'promotoria' | 'digital' | 'banca'
  agentName: string
  promotoria: string
  expectedAmount: number
  paidAmount: number
  dueDate: string
  paidDate: string | null
  recurringCharge: boolean
  status: 'pagado' | 'pendiente' | 'fallido'
  followUp: 'sin_gestion' | 'en_gestion' | 'promesa_pago' | 'recuperado'
}

export interface AdjusterProfile {
  id: string
  name: string
  unitCode: string
  phone: string
  status: AdjusterStatus
  zone: string
}

export interface TrackingPoint {
  id: string
  lat: number
  lng: number
  etaMinutes: number
  status: ClaimStatus
  updateLabel: string
  updateAt: string
}

export interface ClaimCase {
  id: string
  type: string
  ramo: string
  status: ClaimStatus
  reportedAt: string
  policyId: string
  insuredName: string
  insuredPhone: string
  insuredEmail: string
  location: {
    address: string
    lat: number
    lng: number
    city: string
  }
  vehicle: {
    plate: string
    model: string
    color: string
  }
  slaMinutes: number
  elapsedMinutes: number
  adjusterId: string
  timeline: Array<{ at: string; status: ClaimStatus; note: string }>
  evidence: Array<{ id: string; name: string; uploadedAt: string; source: 'asegurado' | 'ajustador' | 'operacion' }>
  notes: string[]
  tracking: TrackingPoint[]
  agentName: string
  promotoria: string
}

export interface ChannelPerformance {
  id: string
  channelName: string
  monthlyEmission: number
  conversionRate: number
  cancellationRate: number
  lossRatio: number
  dossierQuality: number
  avgEmissionHours: number
  openClaims: number
}

export const executiveKpis: ExecutiveKPI[] = [
  {
    id: 'kpi_primas_emitidas',
    label: 'Primas emitidas del mes',
    value: '$184.6M',
    delta: '+8.4% vs febrero',
    trend: 'up',
    drillPath: '/agent/aseguradora/finanzas',
    note: 'Emision consolidada al 20 de marzo.',
  },
  {
    id: 'kpi_primas_cobradas',
    label: 'Primas cobradas',
    value: '$161.9M',
    delta: '+5.9% vs febrero',
    trend: 'up',
    drillPath: '/agent/aseguradora/billing',
    note: 'Incluye cobranza recurrente y recuperaciones.',
  },
  {
    id: 'kpi_uw_solicitudes',
    label: 'Solicitudes en suscripcion',
    value: '148',
    delta: '41 en SLA < 24h',
    trend: 'neutral',
    drillPath: '/agent/aseguradora/underwriting',
    note: 'Bandeja activa de negocio nuevo y renovaciones.',
  },
  {
    id: 'kpi_uw_tasa_aprobacion',
    label: 'Tasa de aprobacion',
    value: '73.8%',
    delta: '-1.2 pp vs febrero',
    trend: 'down',
    drillPath: '/agent/aseguradora/underwriting',
    note: 'Mayor observacion en expedientes colectivos.',
  },
  {
    id: 'kpi_tiempo_emision',
    label: 'Tiempo promedio de emision',
    value: '36h',
    delta: '-4h vs febrero',
    trend: 'up',
    drillPath: '/agent/aseguradora/underwriting',
    note: 'Desde solicitud completa hasta emision.',
  },
  {
    id: 'kpi_polizas_activas',
    label: 'Polizas activas',
    value: '52,418',
    delta: '+1,942 netas',
    trend: 'up',
    drillPath: '/agent/aseguradora/polizas',
    note: 'Vigentes con recibo al corriente o renovado.',
  },
  {
    id: 'kpi_renovaciones',
    label: 'Renovaciones proximas',
    value: '4,286',
    delta: '1,104 en 30 dias',
    trend: 'neutral',
    drillPath: '/agent/aseguradora/polizas',
    note: 'Cartera que requiere contacto preventivo.',
  },
  {
    id: 'kpi_claims_abiertos',
    label: 'Siniestros abiertos',
    value: '612',
    delta: '+34 vs febrero',
    trend: 'down',
    drillPath: '/agent/aseguradora/siniestros',
    note: 'Incluye reportados, en sitio e inspeccion.',
  },
  {
    id: 'kpi_claims_sla',
    label: 'Siniestros en SLA critico',
    value: '74',
    delta: '12% del backlog abierto',
    trend: 'down',
    drillPath: '/agent/aseguradora/siniestros',
    note: 'Casos con riesgo de incumplir tiempo objetivo.',
  },
  {
    id: 'kpi_ajustadores',
    label: 'Ajustadores activos',
    value: '93',
    delta: '68 en ruta / 19 en sitio',
    trend: 'neutral',
    drillPath: '/agent/aseguradora/siniestros',
    note: 'Disponibilidad operativa en tiempo real.',
  },
  {
    id: 'kpi_top_promotoria',
    label: 'Promotoria top del mes',
    value: 'Vidal Grupo',
    delta: '$32.4M emitidos',
    trend: 'up',
    drillPath: '/agent/aseguradora/red-agentes',
    note: 'Canal con mejor conversion y cobranza.',
  },
  {
    id: 'kpi_top_agente',
    label: 'Agente top del mes',
    value: 'Valeria Castillo',
    delta: '$4.8M emitidos',
    trend: 'up',
    drillPath: '/agent/aseguradora/red-agentes',
    note: 'Productividad superior en ramo GMM.',
  },
]

export const productionByRamo = [
  { ramo: 'GMM Individual', emitted: 58_400_000, collected: 51_120_000, policies: 14_220 },
  { ramo: 'GMM Colectivo', emitted: 46_800_000, collected: 42_300_000, policies: 1_206 },
  { ramo: 'Auto', emitted: 34_200_000, collected: 28_640_000, policies: 22_110 },
  { ramo: 'Vida', emitted: 28_300_000, collected: 24_910_000, policies: 11_642 },
  { ramo: 'Danos', emitted: 16_900_000, collected: 14_970_000, policies: 3_240 },
]

export const productionByChannel = [
  { channel: 'Promotorias', emitted: 82_600_000, collected: 70_120_000, conversion: 38.2 },
  { channel: 'Agentes directos', emitted: 61_300_000, collected: 57_040_000, conversion: 34.4 },
  { channel: 'Digital', emitted: 23_900_000, collected: 21_330_000, conversion: 22.6 },
  { channel: 'Banca', emitted: 16_800_000, collected: 13_450_000, conversion: 18.3 },
]

export const weeklyEmissionVsCollection = [
  { week: 'W1', emitted: 42_100_000, collected: 35_420_000 },
  { week: 'W2', emitted: 45_800_000, collected: 41_210_000 },
  { week: 'W3', emitted: 47_300_000, collected: 42_600_000 },
  { week: 'W4', emitted: 49_400_000, collected: 42_710_000 },
]

export const emissionByProduct = [
  { product: 'GMM Elite', insurer: 'GNP', issued: 1_220, emitted: 36_200_000 },
  { product: 'Auto Amplia Plus', insurer: 'GNP', issued: 5_460, emitted: 21_800_000 },
  { product: 'Vida Patrimonial', insurer: 'GNP', issued: 2_104, emitted: 18_440_000 },
  { product: 'RC Empresarial', insurer: 'GNP', issued: 420, emitted: 12_700_000 },
  { product: 'Danos Integral', insurer: 'GNP', issued: 316, emitted: 8_200_000 },
]

export const claimsSlaBoard = [
  { stage: 'Reportado', total: 144, critical: 16 },
  { stage: 'Ajustador asignado', total: 103, critical: 10 },
  { stage: 'En camino', total: 84, critical: 9 },
  { stage: 'En sitio', total: 65, critical: 13 },
  { stage: 'Inspeccion en curso', total: 132, critical: 17 },
  { stage: 'Resolucion preliminar', total: 84, critical: 9 },
]

export const underwritingCases: UnderwritingCase[] = [
  {
    id: 'UW-2026-1041',
    createdAt: '2026-03-20 08:15',
    product: 'GMM Elite',
    ramo: 'GMM Individual',
    insuredName: 'Carlos Mendez Ruiz',
    agentName: 'Valeria Castillo',
    promotoria: 'Promotoria Vidal Grupo',
    annualPremium: 103_200,
    riskScore: 82,
    inconsistencies: [],
    status: 'nuevo',
    documents: [
      { name: 'Solicitud firmada', status: 'ok' },
      { name: 'Cuestionario medico', status: 'ok' },
      { name: 'Identificacion oficial', status: 'ok' },
      { name: 'Comprobante fiscal', status: 'ok' },
    ],
    observations: ['Cliente con continuidad de cobertura 4 anos.'],
  },
  {
    id: 'UW-2026-1038',
    createdAt: '2026-03-20 07:50',
    product: 'Vida Patrimonial',
    ramo: 'Vida',
    insuredName: 'Sofia Torres Garcia',
    agentName: 'Luis Ramirez',
    promotoria: 'Promotoria Vidal Grupo',
    annualPremium: 74_400,
    riskScore: 54,
    inconsistencies: ['Diferencia en ingreso declarado vs estado de cuenta'],
    status: 'en_revision',
    documents: [
      { name: 'Solicitud firmada', status: 'ok' },
      { name: 'Declaracion de salud', status: 'ok' },
      { name: 'Comprobante fiscal', status: 'observado' },
      { name: 'Estado de cuenta', status: 'ok' },
    ],
    observations: ['Requiere validacion fiscal antes de dictamen final.'],
  },
  {
    id: 'UW-2026-1034',
    createdAt: '2026-03-19 22:11',
    product: 'Auto Amplia Plus',
    ramo: 'Auto',
    insuredName: 'Grupo Comercial del Norte',
    agentName: 'Diego Pacheco',
    promotoria: 'Seguros Premier Norte',
    annualPremium: 1_248_000,
    riskScore: 68,
    inconsistencies: ['VIN de 3 unidades no coincide con factura'],
    status: 'observado',
    documents: [
      { name: 'Listado de unidades', status: 'ok' },
      { name: 'Facturas', status: 'observado' },
      { name: 'Carta de siniestralidad', status: 'ok' },
      { name: 'Documentacion conductor', status: 'faltante' },
    ],
    observations: ['Pendiente documentacion de 9 conductores.'],
  },
  {
    id: 'UW-2026-1029',
    createdAt: '2026-03-19 18:30',
    product: 'GMM Colectivo 100+',
    ramo: 'GMM Colectivo',
    insuredName: 'Constructora Omega',
    agentName: 'Ana Dominguez',
    promotoria: 'Alianza Seguros GDL',
    annualPremium: 2_980_000,
    riskScore: 76,
    inconsistencies: [],
    status: 'aprobado',
    documents: [
      { name: 'Relacion de asegurados', status: 'ok' },
      { name: 'Caratula fiscal', status: 'ok' },
      { name: 'Siniestralidad historica', status: 'ok' },
      { name: 'Carta de aceptacion', status: 'ok' },
    ],
    observations: ['Aprobado con deducible ajustado por siniestralidad historica.'],
  },
  {
    id: 'UW-2026-1023',
    createdAt: '2026-03-19 15:10',
    product: 'Vida Patrimonial',
    ramo: 'Vida',
    insuredName: 'Ruben Zepeda',
    agentName: 'Hector Rios',
    promotoria: 'Grupo Asegurador Sur',
    annualPremium: 89_500,
    riskScore: 39,
    inconsistencies: ['Antecedente medico no declarado en solicitud'],
    status: 'rechazado',
    documents: [
      { name: 'Solicitud firmada', status: 'ok' },
      { name: 'Declaracion de salud', status: 'observado' },
      { name: 'Laboratorios', status: 'ok' },
      { name: 'Identificacion oficial', status: 'ok' },
    ],
    observations: ['Rechazo por omision de informacion material.'],
  },
  {
    id: 'UW-2026-1018',
    createdAt: '2026-03-19 11:05',
    product: 'Danos Integral PyME',
    ramo: 'Danos',
    insuredName: 'Textiles Prisma SA de CV',
    agentName: 'Sofia Mendoza',
    promotoria: 'Seguros Premier Norte',
    annualPremium: 320_800,
    riskScore: 63,
    inconsistencies: ['Valor declarado de inventario no soportado'],
    status: 'pendiente_informacion',
    documents: [
      { name: 'Solicitud firmada', status: 'ok' },
      { name: 'Avaluo inventario', status: 'faltante' },
      { name: 'Planos de seguridad', status: 'ok' },
      { name: 'Comprobante domicilio', status: 'ok' },
    ],
    observations: ['Solicitado avaluo actualizado por corredor externo.'],
  },
]

export const policyRecords: PolicyRecord[] = [
  {
    id: 'GNP-GMM-2026-01842',
    product: 'GMM Elite',
    ramo: 'GMM Individual',
    insuredName: 'Carlos Mendez Ruiz',
    status: 'activa',
    annualPremium: 103_200,
    startDate: '2026-02-01',
    endDate: '2027-02-01',
    agentOrigin: 'Valeria Castillo',
    promotoria: 'Promotoria Vidal Grupo',
    coverage: '$8,000,000 suma asegurada',
    beneficiaries: ['Laura Mendez', 'Daniel Mendez'],
    movements: [
      { date: '2026-02-01', action: 'Emision inicial', actor: 'Mesa emision GNP' },
      { date: '2026-02-02', action: 'Activacion cobranza recurrente', actor: 'Billing Ops' },
      { date: '2026-03-10', action: 'Endoso beneficiario', actor: 'Servicio polizas' },
    ],
    endorsements: [{ id: 'END-8821', type: 'Cambio de beneficiario', date: '2026-03-10', impact: 'Sin impacto en prima' }],
    documents: ['Caratula.pdf', 'Condiciones_generales.pdf', 'Recibo_202603.pdf'],
  },
  {
    id: 'GNP-AUTO-2025-9942',
    product: 'Auto Amplia Plus',
    ramo: 'Auto',
    insuredName: 'Grupo Comercial del Norte',
    status: 'pendiente_pago',
    annualPremium: 1_248_000,
    startDate: '2025-08-01',
    endDate: '2026-08-01',
    agentOrigin: 'Diego Pacheco',
    promotoria: 'Seguros Premier Norte',
    coverage: '120 unidades flotilla',
    beneficiaries: ['Grupo Comercial del Norte SA de CV'],
    movements: [
      { date: '2025-08-01', action: 'Emision inicial flotilla', actor: 'Mesa emision GNP' },
      { date: '2026-03-02', action: 'Recibo vencido', actor: 'Billing Ops' },
    ],
    endorsements: [
      { id: 'END-8520', type: 'Alta de 8 unidades', date: '2026-01-12', impact: '+$84,000 anual' },
      { id: 'END-8601', type: 'Baja de 2 unidades', date: '2026-02-18', impact: '-$14,500 anual' },
    ],
    documents: ['Caratula_flotilla.pdf', 'Listado_unidades.xlsx', 'Aviso_cobranza.pdf'],
  },
  {
    id: 'GNP-VIDA-2024-7712',
    product: 'Vida Patrimonial',
    ramo: 'Vida',
    insuredName: 'Ruben Zepeda',
    status: 'cancelada',
    annualPremium: 89_500,
    startDate: '2024-05-01',
    endDate: '2025-05-01',
    agentOrigin: 'Hector Rios',
    promotoria: 'Grupo Asegurador Sur',
    coverage: '$2,500,000 suma asegurada',
    beneficiaries: ['Andrea Zepeda'],
    movements: [
      { date: '2024-05-01', action: 'Emision inicial', actor: 'Mesa emision GNP' },
      { date: '2025-01-20', action: 'Siniestralidad no declarada detectada', actor: 'Compliance' },
      { date: '2025-01-25', action: 'Cancelacion por declaracion inexacta', actor: 'Servicio polizas' },
    ],
    endorsements: [],
    documents: ['Aviso_cancelacion.pdf', 'Carta_rescision.pdf'],
  },
  {
    id: 'GNP-DANOS-2023-4031',
    product: 'Danos Integral PyME',
    ramo: 'Danos',
    insuredName: 'Textiles Prisma SA de CV',
    status: 'vencida',
    annualPremium: 320_800,
    startDate: '2023-11-10',
    endDate: '2024-11-10',
    agentOrigin: 'Sofia Mendoza',
    promotoria: 'Seguros Premier Norte',
    coverage: '$18,000,000 bienes e inventario',
    beneficiaries: ['Textiles Prisma SA de CV'],
    movements: [
      { date: '2023-11-10', action: 'Emision inicial', actor: 'Mesa emision GNP' },
      { date: '2024-10-25', action: 'Aviso de renovacion', actor: 'Renovaciones' },
      { date: '2024-11-11', action: 'Vencimiento sin renovacion', actor: 'Billing Ops' },
    ],
    endorsements: [{ id: 'END-7314', type: 'Actualizacion de suma asegurada', date: '2024-06-02', impact: '+$42,000 anual' }],
    documents: ['Caratula_2023.pdf', 'Aviso_renovacion_2024.pdf'],
  },
  {
    id: 'GNP-GMM-2025-5412',
    product: 'GMM Colectivo 100+',
    ramo: 'GMM Colectivo',
    insuredName: 'Constructora Omega',
    status: 'renovada',
    annualPremium: 2_980_000,
    startDate: '2025-03-15',
    endDate: '2026-03-15',
    agentOrigin: 'Ana Dominguez',
    promotoria: 'Alianza Seguros GDL',
    coverage: '430 colaboradores activos',
    beneficiaries: ['Constructora Omega SA de CV'],
    movements: [
      { date: '2025-03-15', action: 'Emision inicial', actor: 'Mesa emision GNP' },
      { date: '2026-02-28', action: 'Negociacion de renovacion', actor: 'Renovaciones' },
      { date: '2026-03-12', action: 'Renovacion emitida', actor: 'Mesa emision GNP' },
    ],
    endorsements: [
      { id: 'END-9142', type: 'Alta de 26 colaboradores', date: '2025-10-04', impact: '+$145,000 anual' },
      { id: 'END-9391', type: 'Cambio deducible colectivo', date: '2026-03-12', impact: 'Mejora de siniestralidad' },
    ],
    documents: ['Caratula_2025.pdf', 'Renovacion_2026.pdf', 'Listado_colaboradores.csv'],
  },
]

export const billingRecords: BillingRecord[] = [
  {
    id: 'COB-2026-8081',
    policyId: 'GNP-GMM-2026-01842',
    insuredName: 'Carlos Mendez Ruiz',
    channel: 'agente',
    agentName: 'Valeria Castillo',
    promotoria: 'Promotoria Vidal Grupo',
    expectedAmount: 8_600,
    paidAmount: 8_600,
    dueDate: '2026-03-05',
    paidDate: '2026-03-04',
    recurringCharge: true,
    status: 'pagado',
    followUp: 'recuperado',
  },
  {
    id: 'COB-2026-8082',
    policyId: 'GNP-AUTO-2025-9942',
    insuredName: 'Grupo Comercial del Norte',
    channel: 'promotoria',
    agentName: 'Diego Pacheco',
    promotoria: 'Seguros Premier Norte',
    expectedAmount: 102_200,
    paidAmount: 0,
    dueDate: '2026-03-02',
    paidDate: null,
    recurringCharge: true,
    status: 'fallido',
    followUp: 'en_gestion',
  },
  {
    id: 'COB-2026-8083',
    policyId: 'GNP-GMM-2025-5412',
    insuredName: 'Constructora Omega',
    channel: 'promotoria',
    agentName: 'Ana Dominguez',
    promotoria: 'Alianza Seguros GDL',
    expectedAmount: 248_300,
    paidAmount: 248_300,
    dueDate: '2026-03-01',
    paidDate: '2026-03-01',
    recurringCharge: true,
    status: 'pagado',
    followUp: 'recuperado',
  },
  {
    id: 'COB-2026-8084',
    policyId: 'GNP-DANOS-2023-4031',
    insuredName: 'Textiles Prisma SA de CV',
    channel: 'banca',
    agentName: 'Sofia Mendoza',
    promotoria: 'Seguros Premier Norte',
    expectedAmount: 26_700,
    paidAmount: 0,
    dueDate: '2026-02-27',
    paidDate: null,
    recurringCharge: false,
    status: 'pendiente',
    followUp: 'promesa_pago',
  },
  {
    id: 'COB-2026-8085',
    policyId: 'GNP-VIDA-2026-1121',
    insuredName: 'Julia Arriaga',
    channel: 'digital',
    agentName: 'Sin agente',
    promotoria: 'Canal digital',
    expectedAmount: 4_900,
    paidAmount: 4_900,
    dueDate: '2026-03-12',
    paidDate: '2026-03-12',
    recurringCharge: true,
    status: 'pagado',
    followUp: 'recuperado',
  },
  {
    id: 'COB-2026-8086',
    policyId: 'GNP-AUTO-2026-2201',
    insuredName: 'Oscar Lemus',
    channel: 'agente',
    agentName: 'Javier Morales',
    promotoria: 'Alianza Seguros GDL',
    expectedAmount: 2_800,
    paidAmount: 0,
    dueDate: '2026-03-19',
    paidDate: null,
    recurringCharge: true,
    status: 'pendiente',
    followUp: 'sin_gestion',
  },
]

export const adjusters: AdjusterProfile[] = [
  { id: 'AJ-019', name: 'Miguel Herrera', unitCode: 'AJ-019', phone: '55-1904-2201', status: 'en_camino', zone: 'CDMX poniente' },
  { id: 'AJ-044', name: 'Paola Quiroz', unitCode: 'AJ-044', phone: '81-1023-4402', status: 'en_sitio', zone: 'Monterrey centro' },
  { id: 'AJ-071', name: 'Eduardo Tapia', unitCode: 'AJ-071', phone: '33-9044-1187', status: 'disponible', zone: 'Guadalajara norte' },
]

export const claimsCases: ClaimCase[] = [
  {
    id: 'SIN-2026-0452',
    type: 'Choque con lesionados',
    ramo: 'Auto',
    status: 'en_camino',
    reportedAt: '2026-03-20 07:58',
    policyId: 'GNP-AUTO-2025-9942',
    insuredName: 'Grupo Comercial del Norte',
    insuredPhone: '81-5552-7701',
    insuredEmail: 'flotilla.norte@demo.mx',
    location: {
      address: 'Av. Insurgentes Sur 1450, Col. Del Valle, CDMX',
      lat: 19.3741,
      lng: -99.1786,
      city: 'CDMX',
    },
    vehicle: {
      plate: 'NTR-482-A',
      model: 'Nissan NP300 2024',
      color: 'Blanco',
    },
    slaMinutes: 75,
    elapsedMinutes: 44,
    adjusterId: 'AJ-019',
    timeline: [
      { at: '2026-03-20 07:58', status: 'reportado', note: 'Siniestro reportado por operador de flotilla.' },
      { at: '2026-03-20 08:03', status: 'ajustador_asignado', note: 'Asignado AJ-019 Miguel Herrera.' },
      { at: '2026-03-20 08:08', status: 'en_camino', note: 'Ajustador en ruta desde base Narvarte.' },
    ],
    evidence: [
      { id: 'EV-5501', name: 'Foto_front_01.jpg', uploadedAt: '2026-03-20 08:01', source: 'asegurado' },
      { id: 'EV-5502', name: 'Foto_lateral_02.jpg', uploadedAt: '2026-03-20 08:02', source: 'asegurado' },
    ],
    notes: ['Transito en zona alta. Se sugiere ruta alternativa por Eje 5 Sur.'],
    tracking: [
      { id: 'P1', lat: 19.3958, lng: -99.1679, etaMinutes: 31, status: 'ajustador_asignado', updateLabel: 'Ajustador asignado', updateAt: '08:03' },
      { id: 'P2', lat: 19.3912, lng: -99.1701, etaMinutes: 27, status: 'en_camino', updateLabel: 'Salida de base', updateAt: '08:08' },
      { id: 'P3', lat: 19.3869, lng: -99.1722, etaMinutes: 21, status: 'en_camino', updateLabel: 'Cruce con Viaducto', updateAt: '08:13' },
      { id: 'P4', lat: 19.3818, lng: -99.1749, etaMinutes: 14, status: 'en_camino', updateLabel: 'Transito moderado', updateAt: '08:19' },
      { id: 'P5', lat: 19.3772, lng: -99.1772, etaMinutes: 7, status: 'en_camino', updateLabel: 'A 1.2 km del siniestro', updateAt: '08:26' },
      { id: 'P6', lat: 19.3741, lng: -99.1786, etaMinutes: 0, status: 'en_sitio', updateLabel: 'Ajustador en sitio', updateAt: '08:33' },
    ],
    agentName: 'Diego Pacheco',
    promotoria: 'Seguros Premier Norte',
  },
  {
    id: 'SIN-2026-0448',
    type: 'Robo parcial',
    ramo: 'Auto',
    status: 'inspeccion_en_curso',
    reportedAt: '2026-03-20 06:50',
    policyId: 'GNP-AUTO-2026-2201',
    insuredName: 'Oscar Lemus',
    insuredPhone: '33-2331-4432',
    insuredEmail: 'oscar.lemus@demo.mx',
    location: {
      address: 'Av. Vallarta 2412, Guadalajara, Jalisco',
      lat: 20.6767,
      lng: -103.3903,
      city: 'Guadalajara',
    },
    vehicle: {
      plate: 'JAL-994-C',
      model: 'Mazda 3 2022',
      color: 'Gris',
    },
    slaMinutes: 90,
    elapsedMinutes: 78,
    adjusterId: 'AJ-071',
    timeline: [
      { at: '2026-03-20 06:50', status: 'reportado', note: 'Reporte por app movil del asegurado.' },
      { at: '2026-03-20 06:56', status: 'ajustador_asignado', note: 'Asignado AJ-071 Eduardo Tapia.' },
      { at: '2026-03-20 07:04', status: 'en_camino', note: 'Salida de ajustador en unidad 071.' },
      { at: '2026-03-20 07:31', status: 'en_sitio', note: 'Arribo a ubicacion reportada.' },
      { at: '2026-03-20 07:35', status: 'inspeccion_en_curso', note: 'Levantamiento de evidencias y entrevista.' },
    ],
    evidence: [
      { id: 'EV-5410', name: 'Video_calle.mp4', uploadedAt: '2026-03-20 06:52', source: 'asegurado' },
      { id: 'EV-5411', name: 'Acta_MP.pdf', uploadedAt: '2026-03-20 07:11', source: 'operacion' },
      { id: 'EV-5412', name: 'Dictamen_preliminar.pdf', uploadedAt: '2026-03-20 07:49', source: 'ajustador' },
    ],
    notes: ['SLA en riesgo por congestion vial en zona poniente.'],
    tracking: [
      { id: 'P1', lat: 20.6902, lng: -103.4021, etaMinutes: 42, status: 'ajustador_asignado', updateLabel: 'Ajustador asignado', updateAt: '06:56' },
      { id: 'P2', lat: 20.6874, lng: -103.3984, etaMinutes: 31, status: 'en_camino', updateLabel: 'Ingreso a Av. Mexico', updateAt: '07:06' },
      { id: 'P3', lat: 20.6841, lng: -103.3955, etaMinutes: 22, status: 'en_camino', updateLabel: 'Transito alto', updateAt: '07:14' },
      { id: 'P4', lat: 20.6808, lng: -103.3926, etaMinutes: 12, status: 'en_camino', updateLabel: 'Desvio recomendado', updateAt: '07:22' },
      { id: 'P5', lat: 20.6781, lng: -103.3911, etaMinutes: 4, status: 'en_camino', updateLabel: 'A 300m del punto', updateAt: '07:28' },
      { id: 'P6', lat: 20.6767, lng: -103.3903, etaMinutes: 0, status: 'en_sitio', updateLabel: 'Ajustador en sitio', updateAt: '07:31' },
    ],
    agentName: 'Javier Morales',
    promotoria: 'Alianza Seguros GDL',
  },
  {
    id: 'SIN-2026-0439',
    type: 'Danos materiales por inundacion',
    ramo: 'Danos',
    status: 'resolucion_preliminar',
    reportedAt: '2026-03-19 18:12',
    policyId: 'GNP-DANOS-2025-6110',
    insuredName: 'Textiles Prisma SA de CV',
    insuredPhone: '81-9876-4401',
    insuredEmail: 'operaciones@textilesprisma.mx',
    location: {
      address: 'Parque Industrial Mitras, Monterrey, Nuevo Leon',
      lat: 25.7212,
      lng: -100.3574,
      city: 'Monterrey',
    },
    vehicle: {
      plate: 'EMP-220-1',
      model: 'N/A',
      color: 'N/A',
    },
    slaMinutes: 240,
    elapsedMinutes: 210,
    adjusterId: 'AJ-044',
    timeline: [
      { at: '2026-03-19 18:12', status: 'reportado', note: 'Reporte de danos en inventario por filtracion.' },
      { at: '2026-03-19 18:20', status: 'ajustador_asignado', note: 'Asignada AJ-044 Paola Quiroz.' },
      { at: '2026-03-19 18:48', status: 'en_sitio', note: 'Ajustador en sitio para levantamiento.' },
      { at: '2026-03-19 19:05', status: 'inspeccion_en_curso', note: 'Inspeccion de danos y evidencias fotograficas.' },
      { at: '2026-03-19 21:30', status: 'resolucion_preliminar', note: 'Reserva preliminar de $1.8M emitida.' },
    ],
    evidence: [
      { id: 'EV-5201', name: 'Inventario_afectado.xlsx', uploadedAt: '2026-03-19 18:40', source: 'asegurado' },
      { id: 'EV-5202', name: 'Reporte_ajustador.pdf', uploadedAt: '2026-03-19 21:28', source: 'ajustador' },
    ],
    notes: ['Esperando validacion final de coberturas por mesa tecnica.'],
    tracking: [
      { id: 'P1', lat: 25.7314, lng: -100.3682, etaMinutes: 25, status: 'ajustador_asignado', updateLabel: 'Asignacion emitida', updateAt: '18:20' },
      { id: 'P2', lat: 25.7279, lng: -100.3645, etaMinutes: 14, status: 'en_camino', updateLabel: 'Ruta por Gonzalitos', updateAt: '18:28' },
      { id: 'P3', lat: 25.7248, lng: -100.3609, etaMinutes: 6, status: 'en_camino', updateLabel: 'A 1.0 km del sitio', updateAt: '18:38' },
      { id: 'P4', lat: 25.7229, lng: -100.3587, etaMinutes: 2, status: 'en_camino', updateLabel: 'Ingreso a parque industrial', updateAt: '18:45' },
      { id: 'P5', lat: 25.7212, lng: -100.3574, etaMinutes: 0, status: 'en_sitio', updateLabel: 'Ajustador en sitio', updateAt: '18:48' },
    ],
    agentName: 'Sofia Mendoza',
    promotoria: 'Seguros Premier Norte',
  },
  {
    id: 'SIN-2026-0426',
    type: 'Colision sin lesionados',
    ramo: 'Auto',
    status: 'cerrado',
    reportedAt: '2026-03-18 14:02',
    policyId: 'GNP-AUTO-2024-7772',
    insuredName: 'Patricia Leal',
    insuredPhone: '999-112-3301',
    insuredEmail: 'patricia.leal@demo.mx',
    location: {
      address: 'Periferico Norte 92, Merida, Yucatan',
      lat: 20.9991,
      lng: -89.6244,
      city: 'Merida',
    },
    vehicle: {
      plate: 'YUC-832-B',
      model: 'Kia Rio 2023',
      color: 'Rojo',
    },
    slaMinutes: 80,
    elapsedMinutes: 63,
    adjusterId: 'AJ-019',
    timeline: [
      { at: '2026-03-18 14:02', status: 'reportado', note: 'Cliente reporta impacto por alcance.' },
      { at: '2026-03-18 14:08', status: 'ajustador_asignado', note: 'Ajustador asignado y notificado.' },
      { at: '2026-03-18 14:32', status: 'en_sitio', note: 'Levantamiento en sitio y evidencia completada.' },
      { at: '2026-03-18 14:58', status: 'resolucion_preliminar', note: 'Responsabilidad definida al tercero.' },
      { at: '2026-03-18 15:05', status: 'cerrado', note: 'Caso cerrado con convenio firmado.' },
    ],
    evidence: [
      { id: 'EV-5010', name: 'Convenio_firmado.pdf', uploadedAt: '2026-03-18 15:03', source: 'ajustador' },
    ],
    notes: ['Sin impacto en SLA. Cliente calificacion 5/5.'],
    tracking: [
      { id: 'P1', lat: 21.0077, lng: -89.6338, etaMinutes: 20, status: 'ajustador_asignado', updateLabel: 'Asignacion', updateAt: '14:08' },
      { id: 'P2', lat: 21.0046, lng: -89.6302, etaMinutes: 12, status: 'en_camino', updateLabel: 'Ruta principal', updateAt: '14:15' },
      { id: 'P3', lat: 21.0018, lng: -89.6267, etaMinutes: 4, status: 'en_camino', updateLabel: 'A 500m del evento', updateAt: '14:24' },
      { id: 'P4', lat: 20.9991, lng: -89.6244, etaMinutes: 0, status: 'en_sitio', updateLabel: 'Arribo', updateAt: '14:32' },
    ],
    agentName: 'Hector Rios',
    promotoria: 'Grupo Asegurador Sur',
  },
]

export const promotoriaPerformance: ChannelPerformance[] = [
  {
    id: 'CH-01',
    channelName: 'Promotoria Vidal Grupo',
    monthlyEmission: 32_400_000,
    conversionRate: 41.2,
    cancellationRate: 3.8,
    lossRatio: 47.0,
    dossierQuality: 92,
    avgEmissionHours: 29,
    openClaims: 96,
  },
  {
    id: 'CH-02',
    channelName: 'Seguros Premier Norte',
    monthlyEmission: 28_100_000,
    conversionRate: 38.4,
    cancellationRate: 4.6,
    lossRatio: 52.1,
    dossierQuality: 88,
    avgEmissionHours: 34,
    openClaims: 121,
  },
  {
    id: 'CH-03',
    channelName: 'Alianza Seguros GDL',
    monthlyEmission: 19_700_000,
    conversionRate: 33.1,
    cancellationRate: 6.2,
    lossRatio: 58.8,
    dossierQuality: 83,
    avgEmissionHours: 43,
    openClaims: 104,
  },
  {
    id: 'CH-04',
    channelName: 'Grupo Asegurador Sur',
    monthlyEmission: 11_900_000,
    conversionRate: 29.7,
    cancellationRate: 7.1,
    lossRatio: 61.5,
    dossierQuality: 79,
    avgEmissionHours: 48,
    openClaims: 52,
  },
]

export const agentPerformance = [
  {
    id: 'AG-001',
    name: 'Valeria Castillo',
    promotoria: 'Promotoria Vidal Grupo',
    monthlyEmission: 4_820_000,
    conversionRate: 46.1,
    cancellations: 2.3,
    claimsRatio: 38.0,
    dossierQuality: 95,
    avgEmissionHours: 25,
  },
  {
    id: 'AG-002',
    name: 'Diego Pacheco',
    promotoria: 'Seguros Premier Norte',
    monthlyEmission: 4_120_000,
    conversionRate: 42.4,
    cancellations: 3.9,
    claimsRatio: 49.2,
    dossierQuality: 90,
    avgEmissionHours: 31,
  },
  {
    id: 'AG-003',
    name: 'Ana Dominguez',
    promotoria: 'Alianza Seguros GDL',
    monthlyEmission: 3_740_000,
    conversionRate: 35.6,
    cancellations: 5.4,
    claimsRatio: 53.8,
    dossierQuality: 86,
    avgEmissionHours: 37,
  },
  {
    id: 'AG-004',
    name: 'Hector Rios',
    promotoria: 'Grupo Asegurador Sur',
    monthlyEmission: 2_410_000,
    conversionRate: 31.8,
    cancellations: 6.1,
    claimsRatio: 60.5,
    dossierQuality: 81,
    avgEmissionHours: 45,
  },
]

export const monthlyFinance = [
  { month: 'Oct-25', emitted: 156_200_000, collected: 142_800_000, pending: 13_400_000, forecast: 149_000_000 },
  { month: 'Nov-25', emitted: 160_900_000, collected: 146_100_000, pending: 14_800_000, forecast: 152_300_000 },
  { month: 'Dic-25', emitted: 171_400_000, collected: 154_900_000, pending: 16_500_000, forecast: 159_100_000 },
  { month: 'Ene-26', emitted: 174_300_000, collected: 156_200_000, pending: 18_100_000, forecast: 162_400_000 },
  { month: 'Feb-26', emitted: 170_200_000, collected: 153_000_000, pending: 17_200_000, forecast: 160_900_000 },
  { month: 'Mar-26', emitted: 184_600_000, collected: 161_900_000, pending: 22_700_000, forecast: 169_500_000 },
]

export const profitabilityByRamo = [
  { ramo: 'GMM Individual', margin: 18.4, lossRatio: 45.2 },
  { ramo: 'GMM Colectivo', margin: 13.8, lossRatio: 58.7 },
  { ramo: 'Auto', margin: 11.5, lossRatio: 63.9 },
  { ramo: 'Vida', margin: 21.1, lossRatio: 39.8 },
  { ramo: 'Danos', margin: 16.9, lossRatio: 52.4 },
]

export const concentrationByChannel = [
  { channel: 'Promotorias', share: 44.7 },
  { channel: 'Agentes directos', share: 33.2 },
  { channel: 'Digital', share: 12.9 },
  { channel: 'Banca', share: 9.2 },
]

export const reportsCatalog = [
  { id: 'RP-01', name: 'Produccion por ramo', group: 'Produccion', rows: 5 },
  { id: 'RP-02', name: 'Produccion por promotoria', group: 'Produccion', rows: 4 },
  { id: 'RP-03', name: 'Produccion por agente', group: 'Produccion', rows: 4 },
  { id: 'RP-04', name: 'Underwriting', group: 'Suscripcion', rows: 6 },
  { id: 'RP-05', name: 'Polizas', group: 'Administracion', rows: 5 },
  { id: 'RP-06', name: 'Cobranza', group: 'Billing', rows: 6 },
  { id: 'RP-07', name: 'Siniestros', group: 'Claims', rows: 4 },
  { id: 'RP-08', name: 'SLA de ajustadores', group: 'Claims', rows: 4 },
  { id: 'RP-09', name: 'Renovaciones', group: 'Administracion', rows: 5 },
  { id: 'RP-10', name: 'Cancelaciones', group: 'Administracion', rows: 4 },
]

export const xoriaCorporatePrompts = [
  'Muestrame siniestros abiertos con SLA critico',
  'Que promotoria trae mayor emision este mes',
  'Resumeme la poliza GNP-GMM-2026-01842',
  'Que ajustadores siguen en camino',
  'Exporta cobranza pendiente de la semana',
  'Explica por que cayo la cobranza en banca',
]

export const claimsStatusLabel: Record<ClaimStatus, string> = {
  reportado: 'Reportado',
  ajustador_asignado: 'Ajustador asignado',
  en_camino: 'En camino',
  en_sitio: 'En sitio',
  inspeccion_en_curso: 'Inspeccion en curso',
  resolucion_preliminar: 'Resolucion preliminar',
  cerrado: 'Cerrado',
}

export const underwritingStatusLabel: Record<UnderwritingStatus, string> = {
  nuevo: 'Nuevo',
  en_revision: 'En revision',
  observado: 'Observado',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  pendiente_informacion: 'Pendiente informacion',
}

export const policyStatusLabel: Record<PolicyStatus, string> = {
  activa: 'Activa',
  pendiente_pago: 'Pendiente pago',
  cancelada: 'Cancelada',
  vencida: 'Vencida',
  renovada: 'Renovada',
}

export function formatCurrencyMXN(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function claimById(claimId: string) {
  return claimsCases.find((claim) => claim.id === claimId)
}

export function adjusterById(adjusterId: string) {
  return adjusters.find((adjuster) => adjuster.id === adjusterId)
}
