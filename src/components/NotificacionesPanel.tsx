'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getNotificacionesNoLeidas, 
  marcarNotificacionLeida,
  marcarTodasLeidas,
  eliminarNotificacion 
} from '@/lib/queries-notificaciones'
import type { Notificacion } from '@/types/notificaciones'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Check, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface NotificacionesPanelProps {
  isOpen: boolean
  onClose: () => void
}

const ICON_MAP = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

const COLOR_MAP = {
  info: 'text-neutral-600',
  success: 'text-black',
  warning: 'text-neutral-700',
  error: 'text-neutral-900',
}

const BG_MAP = {
  info: 'bg-neutral-100',
  success: 'bg-neutral-100',
  warning: 'bg-neutral-200',
  error: 'bg-neutral-300',
}

export default function NotificacionesPanel({ isOpen, onClose }: NotificacionesPanelProps) {
  const queryClient = useQueryClient()

  const { data: notificaciones = [], isLoading, error } = useQuery<Notificacion[], Error>({
    queryKey: ['notificaciones-no-leidas'],
    queryFn: getNotificacionesNoLeidas,
    refetchInterval: 30000, // Refrescar cada 30 segundos
    enabled: isOpen,
  })

  // Mostrar error si existe
  if (error) {
    console.error('❌ Error al cargar notificaciones:', error)
    toast.error(`Error: ${error.message || 'No se pudieron cargar las notificaciones'}`)
  }

  const marcarLeidaMutation = useMutation({
    mutationFn: marcarNotificacionLeida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones-no-leidas'] })
      queryClient.invalidateQueries({ queryKey: ['notificaciones-stats'] })
    },
  })

  const marcarTodasLeidasMutation = useMutation({
    mutationFn: marcarTodasLeidas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones-no-leidas'] })
      queryClient.invalidateQueries({ queryKey: ['notificaciones-stats'] })
      toast.success('Todas las notificaciones marcadas como leídas')
    },
  })

  const eliminarMutation = useMutation({
    mutationFn: eliminarNotificacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones-no-leidas'] })
      queryClient.invalidateQueries({ queryKey: ['notificaciones-stats'] })
    },
  })

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-16 bottom-0 w-full md:w-96 bg-white border-l border-neutral-200 z-50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-2xl font-light text-black">
                Notificaciones
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-neutral-500 hover:text-black hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {notificaciones.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => marcarTodasLeidasMutation.mutate()}
                disabled={marcarTodasLeidasMutation.isPending}
                className="w-full border-neutral-300 text-black hover:bg-neutral-100"
              >
                <Check className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading && (
              <div className="text-center py-12 text-neutral-500">
                Cargando notificaciones...
              </div>
            )}

            {!isLoading && notificaciones.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                <p className="text-neutral-500 font-semibold">
                  No tienes notificaciones
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  Estás al día con todo
                </p>
              </div>
            )}

            {notificaciones.map((notif: Notificacion) => {
              const Icon = ICON_MAP[notif.tipo]
              const colorClass = COLOR_MAP[notif.tipo]
              const bgClass = BG_MAP[notif.tipo]

              return (
                <Card
                  key={notif.id}
                  className="p-3 bg-white border-neutral-200 hover:border-neutral-300 transition-all"
                >
                  <div className="flex gap-3">
                    <div className={`${bgClass} p-2 rounded-lg h-fit`}>
                      <Icon className={`h-4 w-4 ${colorClass}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-900 font-medium mb-1">
                        {notif.mensaje}
                      </p>
                      {notif.lead_nombre && (
                        <p className="text-xs text-neutral-600 mb-2">
                          Lead: <strong>{notif.lead_nombre}</strong>
                        </p>
                      )}
                      <p className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(notif.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-neutral-500 hover:text-black hover:bg-neutral-100"
                        onClick={() => marcarLeidaMutation.mutate(notif.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-neutral-500 hover:text-black hover:bg-neutral-100"
                        onClick={() => eliminarMutation.mutate(notif.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
