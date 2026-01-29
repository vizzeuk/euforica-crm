import { supabase } from '@/lib/supabase/client'
import type { Expense, CreateExpenseData, UpdateExpenseData, ExpenseStats, ExpenseCategory } from '@/types/euforica'

// =====================================================
// QUERIES DE GASTOS
// =====================================================

/**
 * Obtiene todos los gastos
 */
export async function getAllExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene gastos por lead/evento
 */
export async function getExpensesByLead(leadId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene gastos por categoría
 */
export async function getExpensesByCategory(categoria: ExpenseCategory): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('categoria', categoria)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene gastos por estado
 */
export async function getExpensesByStatus(status: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene un gasto por ID
 */
export async function getExpenseById(id: string): Promise<Expense | null> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Crea un nuevo gasto
 */
export async function createExpense(expenseData: CreateExpenseData): Promise<Expense> {
  // Si hay lead_id, obtener el nombre del lead
  let leadNombre = null
  if (expenseData.lead_id) {
    const { data: lead } = await supabase
      .from('leads')
      .select('nombre')
      .eq('id', expenseData.lead_id)
      .single()
    
    leadNombre = lead?.nombre
  }

  const dataToInsert = {
    ...expenseData,
    lead_nombre: leadNombre,
    status: expenseData.status || 'pendiente'
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([dataToInsert as any])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Actualiza un gasto
 */
export async function updateExpense(id: string, updates: UpdateExpenseData): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Elimina un gasto
 */
export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Marca un gasto como pagado
 */
export async function markExpenseAsPaid(id: string, fechaPago?: string): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update({
      status: 'pagado',
      fecha_pago: fechaPago || new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Obtiene estadísticas de gastos
 */
export async function getExpenseStats(): Promise<ExpenseStats> {
  const expenses = await getAllExpenses()
  
  const now = new Date()
  const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  
  const totalGastos = expenses.reduce((sum, e) => sum + e.monto, 0)
  const gastosPendientes = expenses
    .filter(e => e.status === 'pendiente')
    .reduce((sum, e) => sum + e.monto, 0)
  const gastosPagados = expenses
    .filter(e => e.status === 'pagado')
    .reduce((sum, e) => sum + e.monto, 0)
  const gastosMesActual = expenses
    .filter(e => e.created_at >= primerDiaMes)
    .reduce((sum, e) => sum + e.monto, 0)
  
  // Gastos por categoría
  const porCategoria: Record<ExpenseCategory, number> = {
    decoracion: 0,
    mobiliario: 0,
    iluminacion: 0,
    audio: 0,
    catering: 0,
    transporte: 0,
    personal: 0,
    marketing: 0,
    servicios: 0,
    otros: 0
  }
  
  expenses.forEach(expense => {
    porCategoria[expense.categoria] += expense.monto
  })
  
  return {
    total_gastos: totalGastos,
    gastos_pendientes: gastosPendientes,
    gastos_pagados: gastosPagados,
    gastos_mes_actual: gastosMesActual,
    por_categoria: porCategoria
  }
}

/**
 * Calcula el margen de ganancia para un evento
 */
export async function calculateEventProfit(leadId: string): Promise<{
  ingresos: number
  gastos: number
  ganancia: number
  margen_porcentaje: number
}> {
  // Obtener el lead para sacar el valor real
  const { data: lead } = await supabase
    .from('leads')
    .select('actual_value, estimated_value')
    .eq('id', leadId)
    .single()
  
  const ingresos = lead?.actual_value || lead?.estimated_value || 0
  
  // Obtener todos los gastos del evento
  const gastos = await getExpensesByLead(leadId)
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)
  
  const ganancia = ingresos - totalGastos
  const margenPorcentaje = ingresos > 0 ? (ganancia / ingresos) * 100 : 0
  
  return {
    ingresos,
    gastos: totalGastos,
    ganancia,
    margen_porcentaje: margenPorcentaje
  }
}
