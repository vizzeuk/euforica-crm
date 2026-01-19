import { supabase } from '@/lib/supabase/client'
import type { Notificacion, NotificacionStats } from '@/types/notificaciones'

/**
 * Obtiene todas las notificaciones
 */
export async function getAllNotificaciones(): Promise<Notificacion[]> {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene notificaciones no leídas
 */
export async function getNotificacionesNoLeidas(): Promise<Notificacion[]> {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('leido', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Obtiene estadísticas de notificaciones
 */
export async function getNotificacionesStats(): Promise<NotificacionStats> {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')

  if (error) throw error
  
  const stats = {
    no_leidas: data?.filter(n => !n.leido).length || 0,
    total: data?.length || 0,
    warnings_no_leidas: data?.filter(n => !n.leido && n.tipo === 'warning').length || 0,
    errors_no_leidas: data?.filter(n => !n.leido && n.tipo === 'error').length || 0,
  }
  
  return stats
}

/**
 * Marca una notificación como leída
 */
export async function marcarNotificacionLeida(id: number): Promise<void> {
  const { error } = await supabase
    .from('notificaciones')
    .update({ leido: true })
    .eq('id', id)

  if (error) throw error
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function marcarTodasLeidas(): Promise<void> {
  const { error } = await supabase
    .from('notificaciones')
    .update({ leido: true })
    .eq('leido', false)

  if (error) throw error
}

/**
 * Elimina una notificación
 */
export async function eliminarNotificacion(id: number): Promise<void> {
  const { error } = await supabase
    .from('notificaciones')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Crea una notificación manualmente (para n8n)
 */
export async function crearNotificacion(
  mensaje: string,
  tipo: 'info' | 'success' | 'warning' | 'error',
  lead_nombre?: string
): Promise<Notificacion> {
  const { data, error } = await supabase
    .from('notificaciones')
    .insert([{ mensaje, tipo, lead_nombre: lead_nombre || null, leido: false } as any])
    .select()
    .single()

  if (error) throw error
  return data as Notificacion
}
