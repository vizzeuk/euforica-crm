// =====================================================
// EUFORICA CRM - TIPOS TYPESCRIPT
// =====================================================

export type LeadStatus = 'new' | 'contacted' | 'proposal' | 'won' | 'lost'
export type LeadPriority = 'baja' | 'media' | 'alta'
export type LeadSource = 'website' | 'instagram' | 'google' | 'referido'
export type AlertStatus = 'ok' | 'warning' | 'urgent'

export interface Lead {
  id: string
  created_at: string
  updated_at: string
  
  // Información del contacto
  nombre: string
  email: string
  telefono?: string
  mensaje?: string
  
  // Gestión del lead
  status: LeadStatus
  priority: LeadPriority
  
  // Datos financieros
  estimated_value: number
  actual_value?: number
  
  // Tracking
  last_contact_date?: string
  next_followup_date?: string
  source: LeadSource
  
  // Notas internas
  notes?: string
  
  // Datos del evento
  event_type?: string
  event_date?: string
  attendees?: number
  
  // Auditoría
  assigned_to?: string
  won_at?: string
  lost_reason?: string
}

export interface LeadWithAlert extends Lead {
  alert_status: AlertStatus
  days_inactive: number
}

export interface PipelineStats {
  leads_nuevos: number
  leads_contactados: number
  leads_propuesta: number
  leads_ganados: number
  leads_perdidos: number
  leads_activos: number
  pipeline_value: number
  revenue_total: number
  avg_deal_size: number
  nuevos_mes_actual: number
  ganados_mes_actual: number
  conversion_rate: number
}

export interface LeadsByStatus {
  status: LeadStatus
  count: number
  total_value: number
}

export interface CreateLeadData {
  nombre: string
  email: string
  telefono?: string
  mensaje?: string
  status?: LeadStatus
  priority?: LeadPriority
  estimated_value?: number
  source?: LeadSource
  event_type?: string
  event_date?: string
  attendees?: number
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  notes?: string
  last_contact_date?: string
  next_followup_date?: string
  assigned_to?: string
  actual_value?: number
  won_at?: string
  lost_reason?: string
}

// =====================================================
// TIPOS DE INVENTARIO
// =====================================================

export type InventoryCategory = 'decoracion' | 'mobiliario' | 'iluminacion' | 'audio' | 'catering' | 'otros'
export type InventoryStatus = 'disponible' | 'en-uso' | 'mantenimiento' | 'baja'

export interface InventoryItem {
  id: string
  created_at: string
  updated_at: string
  
  // Información del producto
  nombre: string
  descripcion?: string
  categoria: InventoryCategory
  codigo_interno?: string
  
  // Stock y disponibilidad
  cantidad_total: number
  cantidad_disponible: number
  cantidad_minima?: number
  status: InventoryStatus
  
  // Información financiera
  costo_unitario?: number
  precio_renta?: number
  
  // Ubicación y seguimiento
  ubicacion?: string
  proveedor?: string
  
  // Notas
  notas?: string
}

export interface CreateInventoryData {
  nombre: string
  descripcion?: string
  categoria: InventoryCategory
  codigo_interno?: string
  cantidad_total: number
  cantidad_disponible?: number
  cantidad_minima?: number
  status?: InventoryStatus
  costo_unitario?: number
  precio_renta?: number
  ubicacion?: string
  proveedor?: string
  notas?: string
}

export interface UpdateInventoryData extends Partial<CreateInventoryData> {}

// =====================================================
// TIPOS DE GASTOS
// =====================================================

export type ExpenseCategory = 'decoracion' | 'mobiliario' | 'iluminacion' | 'audio' | 'catering' | 'transporte' | 'personal' | 'marketing' | 'servicios' | 'otros'
export type ExpenseStatus = 'pendiente' | 'pagado' | 'cancelado'

export interface Expense {
  id: string
  created_at: string
  updated_at: string
  
  // Información del gasto
  concepto: string
  descripcion?: string
  categoria: ExpenseCategory
  
  // Monto
  monto: number
  
  // Relación con lead/evento
  lead_id?: string
  lead_nombre?: string
  
  // Proveedor y pago
  proveedor?: string
  status: ExpenseStatus
  fecha_pago?: string
  
  // Documentación
  factura_numero?: string
  metodo_pago?: string
  
  // Notas
  notas?: string
}

export interface CreateExpenseData {
  concepto: string
  descripcion?: string
  categoria: ExpenseCategory
  monto: number
  lead_id?: string
  proveedor?: string
  status?: ExpenseStatus
  fecha_pago?: string
  factura_numero?: string
  metodo_pago?: string
  notas?: string
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {}

// Stats para gastos
export interface ExpenseStats {
  total_gastos: number
  gastos_pendientes: number
  gastos_pagados: number
  gastos_mes_actual: number
  por_categoria: Record<ExpenseCategory, number>
}
