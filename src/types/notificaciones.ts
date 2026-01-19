export interface Notificacion {
  id: number
  mensaje: string
  tipo: 'info' | 'success' | 'warning' | 'error'
  leido: boolean
  lead_nombre: string | null
  created_at: string
}

export interface NotificacionStats {
  no_leidas: number
  total: number
  warnings_no_leidas: number
  errors_no_leidas: number
}
