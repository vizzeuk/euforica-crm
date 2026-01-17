'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllLeadsByStatus, updateLeadStatus } from '@/lib/queries-euforica'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  DollarSign,
  AlertCircle,
  Calendar,
  Phone,
  Mail
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const COLUMNS = [
  { 
    status: 'new', 
    title: 'Nuevos', 
    color: 'neutral',
    bgGradient: 'from-neutral-100 to-neutral-50',
    borderColor: 'border-neutral-300'
  },
  { 
    status: 'contacted', 
    title: 'Contactados', 
    color: 'neutral',
    bgGradient: 'from-neutral-200 to-neutral-100',
    borderColor: 'border-neutral-400'
  },
  { 
    status: 'proposal', 
    title: 'Propuestas', 
    color: 'neutral',
    bgGradient: 'from-neutral-300 to-neutral-200',
    borderColor: 'border-neutral-500'
  },
  { 
    status: 'won', 
    title: 'Ganados', 
    color: 'neutral',
    bgGradient: 'from-neutral-800 to-neutral-700',
    borderColor: 'border-neutral-600'
  },
  { 
    status: 'lost', 
    title: 'Perdidos', 
    color: 'neutral',
    bgGradient: 'from-neutral-400 to-neutral-300',
    borderColor: 'border-neutral-500'
  },
]

const PRIORITY_CONFIG = {
  baja: { label: 'Baja', color: 'bg-neutral-300 text-neutral-700' },
  media: { label: 'Media', color: 'bg-neutral-500 text-white' },
  alta: { label: 'Alta', color: 'bg-black text-white' },
}

export default function PipelinePage() {
  const queryClient = useQueryClient()
  const [draggedLead, setDraggedLead] = useState<any>(null)

  const { data: leadsByStatus = {}, isLoading } = useQuery({
    queryKey: ['leads-by-status'],
    queryFn: getAllLeadsByStatus,
    staleTime: 3 * 60 * 1000, // 3 minutos
    refetchOnWindowFocus: false
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateLeadStatus(id, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads-by-status'] })
      queryClient.invalidateQueries({ queryKey: ['pipeline-stats'] })
      queryClient.invalidateQueries({ queryKey: ['leads-distribution'] })
    },
  })

  const handleDragStart = (lead: any) => {
    setDraggedLead(lead)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (newStatus: string) => {
    if (draggedLead && draggedLead.status !== newStatus) {
      updateStatusMutation.mutate({
        id: draggedLead.id,
        status: newStatus,
      })
    }
    setDraggedLead(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-black dark:text-white font-semibold">Cargando pipeline...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          KANBAN BOARD
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-black dark:text-white">Pipeline Visual</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-base">Gestiona el estado de tus leads arrastrando las tarjetas</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((column) => {
          const leads = leadsByStatus[column.status] || []
          const totalValue = leads.reduce((sum: number, lead: any) => sum + (lead.estimated_value || 0), 0)
          const isWonColumn = column.status === 'won'

          return (
            <div
              key={column.status}
              className={`rounded-lg bg-gradient-to-b ${column.bgGradient} border ${column.borderColor} p-4 min-h-[600px] ${isWonColumn ? 'dark:bg-gradient-to-b dark:from-neutral-900 dark:to-neutral-800' : ''}`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.status)}
            >
              {/* Header de columna */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold flex items-center gap-2 ${isWonColumn ? 'text-white' : 'text-black dark:text-white'}`}>
                    <Users className="h-4 w-4" />
                    {column.title}
                  </h3>
                  <Badge className={isWonColumn ? "bg-white text-black" : "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black"}>
                    {leads.length}
                  </Badge>
                </div>
                {totalValue > 0 && (
                  <div className={`text-xs font-medium flex items-center gap-1 ${isWonColumn ? 'text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    <DollarSign className="h-3 w-3" />
                    ${(totalValue / 1000000).toFixed(1)}M
                  </div>
                )}
              </div>

              {/* Lista de leads */}
              <div className="space-y-3">
                {leads.map((lead: any) => {
                  const priorityConfig = PRIORITY_CONFIG[lead.priority as keyof typeof PRIORITY_CONFIG]
                  const daysInactive = lead.last_contact_date 
                    ? Math.floor((Date.now() - new Date(lead.last_contact_date).getTime()) / (1000 * 60 * 60 * 24))
                    : Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
                  
                  const isUrgent = column.status === 'new' && daysInactive >= 5

                  return (
                    <Card
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                      className={`
                        bg-zinc-900 border-zinc-800 cursor-grab active:cursor-grabbing
                        hover:border-${column.color}-500/50 transition-all
                        ${isUrgent ? 'border-red-500/50 animate-pulse' : ''}
                      `}
                    >
                      <CardContent className="p-4 space-y-3">
                        {/* Header */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-white text-sm line-clamp-1">
                              {lead.nombre}
                            </h4>
                            {isUrgent && (
                              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                            )}
                          </div>
                          <Badge className={`${priorityConfig.color} text-xs`}>
                            {priorityConfig.label}
                          </Badge>
                        </div>

                        {/* Contacto */}
                        <div className="space-y-1 text-xs text-zinc-400">
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          {lead.telefono && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              <span>{lead.telefono}</span>
                            </div>
                          )}
                        </div>

                        {/* Valor */}
                        {lead.estimated_value > 0 && (
                          <div className="flex items-center gap-2 text-sm font-semibold text-green-400">
                            <DollarSign className="h-4 w-4" />
                            ${(lead.estimated_value / 1000).toFixed(0)}K
                          </div>
                        )}

                        {/* Evento */}
                        {lead.event_type && (
                          <div className="text-xs text-zinc-500 space-y-1">
                            <div className="capitalize">
                              {lead.event_type} • {lead.attendees} personas
                            </div>
                            {lead.event_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(lead.event_date), 'dd MMM', { locale: es })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Alerta de inactividad */}
                        {daysInactive > 0 && column.status !== 'won' && column.status !== 'lost' && (
                          <div className={`text-xs ${isUrgent ? 'text-red-400 font-semibold' : 'text-zinc-500'}`}>
                            {daysInactive} día{daysInactive !== 1 ? 's' : ''} sin contacto
                          </div>
                        )}

                        {/* Fecha de creación */}
                        <div className="text-xs text-zinc-600 pt-2 border-t border-zinc-800">
                          {format(new Date(lead.created_at), 'dd MMM yyyy', { locale: es })}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {leads.length === 0 && (
                  <div className="text-center text-zinc-600 text-sm py-8">
                    Sin leads
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Información de ayuda */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="py-4">
          <p className="text-sm text-zinc-400 text-center">
            💡 <span className="font-semibold">Tip:</span> Arrastra las tarjetas entre columnas para cambiar el estado de los leads
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
