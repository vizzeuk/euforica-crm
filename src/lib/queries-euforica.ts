import { supabase } from '@/lib/supabase/client'
import type { Lead, LeadWithAlert, PipelineStats, LeadsByStatus, CreateLeadData, UpdateLeadData, LeadStatus } from '@/types/euforica'

// =====================================================
// QUERIES DE LEADS
// =====================================================

/**
 * Obtiene todos los leads
 */
export async function getAllLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene leads con alertas de inactividad
 */
export async function getLeadsWithAlerts(): Promise<LeadWithAlert[]> {
  const { data, error } = await supabase
    .from('leads_with_alerts')
    .select('*')
    .order('priority', { ascending: false })
    .order('days_inactive', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene leads por estado (para Kanban)
 */
export async function getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', status)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene TODOS los leads agrupados por estado (para Pipeline Kanban)
 */
export async function getAllLeadsByStatus(): Promise<Record<string, Lead[]>> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  
  // Agrupar por estado
  const grouped: Record<string, Lead[]> = {
    new: [],
    contacted: [],
    proposal: [],
    won: [],
    lost: [],
  }

  data?.forEach((lead: Lead) => {
    if (grouped[lead.status]) {
      grouped[lead.status].push(lead)
    }
  })

  return grouped
}

/**
 * Obtiene un lead por ID
 */
export async function getLeadById(id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Crea un nuevo lead
 */
export async function createLead(leadData: CreateLeadData): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData as any])
    .select()
    .single()

  if (error) throw error
  return data as Lead
}

/**
 * Actualiza un lead
 */
export async function updateLead(id: string, updates: UpdateLeadData): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Cambia el estado de un lead
 */
export async function updateLeadStatus(id: string, status: LeadStatus, additionalData?: Partial<UpdateLeadData>): Promise<Lead> {
  const updates: UpdateLeadData = {
    status,
    ...additionalData,
  }

  // Si el lead se gana, marcar fecha
  if (status === 'won') {
    updates.won_at = new Date().toISOString()
  }

  return updateLead(id, updates)
}

/**
 * Elimina un lead
 */
export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// =====================================================
// ESTADÍSTICAS Y ANALYTICS
// =====================================================

/**
 * Obtiene estadísticas del pipeline
 */
export async function getPipelineStats(): Promise<PipelineStats> {
  const { data, error } = await supabase
    .from('pipeline_stats')
    .select('*')
    .single()

  if (error) throw error
  return data
}

/**
 * Obtiene distribución de leads por estado
 */
export async function getLeadsDistribution(): Promise<LeadsByStatus[]> {
  const { data, error } = await supabase
    .rpc('get_leads_by_status')

  if (error) throw error
  return data || []
}

/**
 * Obtiene leads del mes actual
 */
export async function getLeadsThisMonth(): Promise<Lead[]> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .gte('created_at', startOfMonth.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene leads ganados del mes
 */
export async function getWonLeadsThisMonth(): Promise<Lead[]> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'won')
    .gte('won_at', startOfMonth.toISOString())
    .order('won_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene tendencia de leads (últimos 30 días)
 */
export async function getLeadsTrend(): Promise<{ date: string; count: number }[]> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from('leads')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  if (error) throw error

  // Agrupar por día
  const grouped = (data || []).reduce((acc: Record<string, number>, lead) => {
    const date = new Date(lead.created_at).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}
