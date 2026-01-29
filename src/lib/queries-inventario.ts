import { supabase } from '@/lib/supabase/client'
import type { InventoryItem, CreateInventoryData, UpdateInventoryData, InventoryStatus } from '@/types/euforica'

// =====================================================
// QUERIES DE INVENTARIO
// =====================================================

/**
 * Obtiene todos los items de inventario
 */
export async function getAllInventoryItems(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('nombre', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Obtiene items por categoría
 */
export async function getInventoryByCategory(categoria: string): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('categoria', categoria)
    .order('nombre', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Obtiene items con stock bajo (cantidad <= cantidad_minima)
 */
export async function getLowStockItems(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('cantidad_disponible', { ascending: true })

  if (error) throw error
  
  // Filtrar en el cliente los items con stock bajo
  const lowStock = (data || []).filter(item => 
    item.cantidad_minima && item.cantidad_disponible <= item.cantidad_minima
  )
  
  return lowStock
}

/**
 * Obtiene un item por ID
 */
export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Crea un nuevo item de inventario
 */
export async function createInventoryItem(itemData: CreateInventoryData): Promise<InventoryItem> {
  // Si no se especifica cantidad_disponible, usar cantidad_total
  const dataToInsert = {
    ...itemData,
    cantidad_disponible: itemData.cantidad_disponible ?? itemData.cantidad_total,
    status: itemData.status || 'disponible'
  }

  const { data, error } = await supabase
    .from('inventory_items')
    .insert([dataToInsert as any])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Actualiza un item de inventario
 */
export async function updateInventoryItem(id: string, updates: UpdateInventoryData): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory_items')
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
 * Elimina un item de inventario
 */
export async function deleteInventoryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Actualiza la cantidad disponible de un item
 */
export async function updateInventoryQuantity(
  id: string, 
  cantidadDisponible: number
): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory_items')
    .update({
      cantidad_disponible: cantidadDisponible,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Obtiene estadísticas de inventario
 */
export async function getInventoryStats() {
  const items = await getAllInventoryItems()
  
  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => 
    sum + (item.costo_unitario || 0) * item.cantidad_total, 0
  )
  const itemsDisponibles = items.filter(i => i.status === 'disponible').length
  const itemsEnUso = items.filter(i => i.status === 'en-uso').length
  const itemsStockBajo = items.filter(i => 
    i.cantidad_minima && i.cantidad_disponible <= i.cantidad_minima
  ).length

  return {
    total_items: totalItems,
    valor_total: totalValue,
    items_disponibles: itemsDisponibles,
    items_en_uso: itemsEnUso,
    items_stock_bajo: itemsStockBajo
  }
}
