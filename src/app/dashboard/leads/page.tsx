'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllLeads, updateLead, deleteLead } from '@/lib/queries-euforica'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  AlertTriangle,
  Trash2,
  Edit,
  MessageSquare
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const STATUS_CONFIG = {
  new: { label: 'Nuevo', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
  contacted: { label: 'Contactado', color: 'bg-neutral-200 text-neutral-800 border-neutral-300' },
  proposal: { label: 'Propuesta', color: 'bg-neutral-300 text-neutral-900 border-neutral-400' },
  won: { label: 'Ganado', color: 'bg-black text-white border-black' },
  lost: { label: 'Perdido', color: 'bg-neutral-400 text-neutral-900 border-neutral-500' },
}

const PRIORITY_CONFIG = {
  baja: { label: 'Baja', color: 'bg-neutral-300 text-neutral-700' },
  media: { label: 'Media', color: 'bg-neutral-500 text-white' },
  alta: { label: 'Alta', color: 'bg-black text-white' },
}

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['all-leads'],
    queryFn: getAllLeads,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leads'] })
      toast.success('Lead eliminado correctamente')
    },
    onError: () => {
      toast.error('Error al eliminar el lead')
    },
  })

  const filteredLeads = leads.filter((lead) =>
    lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.telefono?.includes(searchTerm)
  )

  const handleDelete = (id: string, nombre: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-black">¿Eliminar lead?</p>
        <p className="text-sm text-neutral-700">¿Estás seguro de eliminar a <strong>{nombre}</strong>?</p>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
            className="text-neutral-700 hover:bg-neutral-100"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              toast.dismiss(t.id)
              deleteMutation.mutate(id)
            }}
            className="bg-black text-white hover:bg-neutral-800"
          >
            Eliminar
          </Button>
        </div>
      </div>
    ), {
      duration: 10000,
      style: { minWidth: '300px' }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-black dark:text-white font-semibold">Cargando leads...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          BASE DE DATOS
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-black dark:text-white">Gestión de Leads</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-base">Administra todos tus contactos y oportunidades</p>
      </div>

      {/* Buscador */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-black dark:text-white placeholder:text-neutral-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leads */}
      <div className="grid gap-4">
        {filteredLeads.map((lead) => {
          const statusConfig = STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG]
          const priorityConfig = PRIORITY_CONFIG[lead.priority as keyof typeof PRIORITY_CONFIG]

          return (
            <Card key={lead.id} className="bg-white border-neutral-200 hover:border-neutral-300 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-black">{lead.nombre}</h3>
                      <Badge className={`${statusConfig.color} border`}>
                        {statusConfig.label}
                      </Badge>
                      <Badge className={priorityConfig.color}>
                        {priorityConfig.label}
                      </Badge>
                    </div>

                    {/* Información de contacto */}
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-700">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-neutral-500" />
                        <span>{lead.email}</span>
                      </div>
                      {lead.telefono && (
                        <a 
                          href={`https://wa.me/${lead.telefono.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-neutral-700 hover:text-green-600 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{lead.telefono}</span>
                        </a>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-neutral-500" />
                        <span>{format(new Date(lead.created_at), 'dd MMM yyyy', { locale: es })}</span>
                      </div>
                      {lead.estimated_value > 0 && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-neutral-500" />
                          <span className="font-semibold text-black">
                            ${(lead.estimated_value / 1000000).toFixed(1)}M CLP
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mensaje */}
                    {lead.mensaje && (
                      <p className="text-sm text-neutral-800 bg-neutral-100 p-3 rounded-lg">
                        {lead.mensaje}
                      </p>
                    )}

                    {/* Detalles del evento */}
                    {lead.event_type && (
                      <div className="flex items-center gap-4 text-sm text-neutral-700">
                        <span className="capitalize">
                          {lead.event_type} • {lead.attendees} personas
                        </span>
                        {lead.event_date && (
                          <span>
                            Fecha evento: {format(new Date(lead.event_date), 'dd MMM yyyy', { locale: es })}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Notas */}
                    {lead.notes && (
                      <div className="text-sm text-neutral-700">
                        <span className="font-semibold text-black">Notas:</span> {lead.notes}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-500 hover:text-black hover:bg-neutral-100"
                      onClick={() => handleDelete(lead.id, lead.nombre)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredLeads.length === 0 && (
          <Card className="bg-white border-neutral-200">
            <CardContent className="py-12 text-center">
              <p className="text-neutral-500">No se encontraron leads</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
