// Tipos base del sistema
export type UserRole = 'admin' | 'agent' | 'broker' | 'emission' | 'finance' | 'service' | 'compliance' | 'client'

export interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  agency?: string
}

export interface Policy {
  id: string
  clientName: string
  type: string
  insurer: string
  premium: string
  coverage?: string
  status: 'activa' | 'vigente' | 'vencida' | 'cancelada' | 'pendiente'
  startDate: string
  endDate: string
  policyNumber: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  stage: PipelineStage
  ramo: string
  product?: string
  value?: string
  score: number
  assignedTo: string
  createdAt: string
  lastContact: string
}

export type PipelineStage =
  | 'nuevo'
  | 'contactado'
  | 'perfilamiento'
  | 'expediente'
  | 'cotizacion'
  | 'negociacion'
  | 'aceptacion'
  | 'emision'
  | 'entregado'

export interface KPI {
  id: string
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  period: string
  icon: string
}

export interface Ticket {
  id: string
  clientName: string
  subject: string
  status: 'abierto' | 'en_proceso' | 'cerrado'
  priority: 'alta' | 'media' | 'baja'
  createdAt: string
}

export interface Payment {
  id: string
  policyId: string
  clientName: string
  concept: string
  amount: string
  dueDate: string
  status: 'pagado' | 'pendiente' | 'vencido'
}

export interface AgendaItem {
  id: string
  time: string
  title: string
  type: 'call' | 'meeting' | 'followup' | 'task' | 'llamada' | 'reunion' | 'seguimiento' | 'expediente'
  client?: string
}

export interface ChartDataPoint {
  month: string
  primas: number
  leads?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
