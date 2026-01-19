'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, DollarSign, Users, MapPin, Edit2, Save, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Lead } from '@/types/euforica'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface EventoEditando {
  id: string
  event_date: string
  actual_value: number
}

export default function EventosPage() {
  const queryClient = useQueryClient()
  const [editando, setEditando] = useState<EventoEditando | null>(null)

  // Obtener leads ganados (eventos confirmados)
  const { data: eventos = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['eventos-ganados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'won')
        .order('event_date', { ascending: true })

      if (error) throw error
      return data || []
    },
    refetchInterval: 30000,
  })

  // Mutation para actualizar fecha y ganancia
  const actualizarEventoMutation = useMutation({
    mutationFn: async (evento: EventoEditando) => {
      const { error } = await supabase
        .from('leads')
        .update({
          event_date: evento.event_date,
          actual_value: evento.actual_value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', evento.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos-ganados'] })
      toast.success('Evento actualizado correctamente')
      setEditando(null)
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  const handleGuardar = () => {
    if (editando) {
      // Validar que la fecha no esté ocupada por otro evento
      if (editando.event_date) {
        const fechaOcupada = eventos.find(
          (e) => e.event_date === editando.event_date && e.id !== editando.id
        )
        
        if (fechaOcupada) {
          toast.error(
            `La fecha ${format(parseISO(editando.event_date), "d 'de' MMMM, yyyy", { locale: es })} ya está ocupada por el evento de ${fechaOcupada.nombre}`,
            { duration: 5000 }
          )
          return
        }
      }
      
      actualizarEventoMutation.mutate(editando)
    }
  }

  const handleCancelar = () => {
    setEditando(null)
  }

  const iniciarEdicion = (lead: Lead) => {
    setEditando({
      id: lead.id,
      event_date: lead.event_date || '',
      actual_value: lead.actual_value || lead.estimated_value || 0,
    })
  }

  const eventosConFecha = eventos.filter(e => e.event_date)
  const eventosSinFecha = eventos.filter(e => !e.event_date)
  const gananciaTotal = eventos.reduce((sum, e) => sum + (e.actual_value || e.estimated_value || 0), 0)

  return (
    <div className="p-6 lg:p-12 space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          CALENDARIO
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-black dark:text-white">Eventos Confirmados</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-base">Gestiona los eventos de leads ganados e intégralos con Google Calendar</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventos.length}</div>
            <p className="text-xs text-neutral-500">
              {eventosConFecha.length} con fecha programada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Total</CardTitle>
            <DollarSign className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${gananciaTotal.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500">
              De todos los eventos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes de Fecha</CardTitle>
            <Users className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventosSinFecha.length}</div>
            <p className="text-xs text-neutral-500">
              Eventos sin fecha asignada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Eventos con Fecha */}
      {eventosConFecha.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            Calendario de Eventos
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {eventosConFecha.map((evento) => {
              const estaEditando = editando?.id === evento.id
              const fechaEvento = evento.event_date ? parseISO(evento.event_date) : null

              return (
                <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-black dark:text-white">
                            {evento.nombre}
                          </h3>
                          {evento.event_type && (
                            <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                              {evento.event_type}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Fecha del Evento */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-neutral-600">
                              <Calendar className="h-4 w-4" />
                              Fecha del Evento
                            </Label>
                            {estaEditando ? (
                              <Input
                                type="date"
                                value={editando.event_date}
                                onChange={(e) =>
                                  setEditando({ ...editando, event_date: e.target.value })
                                }
                                className="w-full"
                              />
                            ) : (
                              <p className="text-lg font-semibold">
                                {fechaEvento
                                  ? format(fechaEvento, "d 'de' MMMM, yyyy", { locale: es })
                                  : 'Sin fecha asignada'}
                              </p>
                            )}
                          </div>

                          {/* Ganancia Total */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-neutral-600">
                              <DollarSign className="h-4 w-4" />
                              Ganancia Total
                            </Label>
                            {estaEditando ? (
                              <Input
                                type="number"
                                value={editando.actual_value}
                                onChange={(e) =>
                                  setEditando({
                                    ...editando,
                                    actual_value: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full"
                                placeholder="0"
                              />
                            ) : (
                              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                ${(evento.actual_value || evento.estimated_value || 0).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Info adicional */}
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {evento.email && (
                            <span className="flex items-center gap-1">
                              {evento.email}
                            </span>
                          )}
                          {evento.telefono && (
                            <span className="flex items-center gap-1">
                              {evento.telefono}
                            </span>
                          )}
                          {evento.attendees && (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {evento.attendees} personas
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex gap-2 ml-4">
                        {estaEditando ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleGuardar}
                              disabled={actualizarEventoMutation.isPending}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelar}
                              disabled={actualizarEventoMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => iniciarEdicion(evento)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Eventos sin Fecha */}
      {eventosSinFecha.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            Pendientes de Programar
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {eventosSinFecha.map((evento) => {
              const estaEditando = editando?.id === evento.id

              return (
                <Card key={evento.id} className="border-dashed">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                          {evento.nombre}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-neutral-600">
                              <Calendar className="h-4 w-4" />
                              Asignar Fecha del Evento
                            </Label>
                            {estaEditando ? (
                              <Input
                                type="date"
                                value={editando.event_date}
                                onChange={(e) =>
                                  setEditando({ ...editando, event_date: e.target.value })
                                }
                                className="w-full"
                              />
                            ) : (
                              <p className="text-sm text-neutral-500">Sin fecha asignada</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-neutral-600">
                              <DollarSign className="h-4 w-4" />
                              Ganancia Estimada
                            </Label>
                            {estaEditando ? (
                              <Input
                                type="number"
                                value={editando.actual_value}
                                onChange={(e) =>
                                  setEditando({
                                    ...editando,
                                    actual_value: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full"
                              />
                            ) : (
                              <p className="text-lg font-semibold">
                                ${(evento.estimated_value || 0).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {estaEditando ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleGuardar}
                              disabled={actualizarEventoMutation.isPending}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelar}
                              disabled={actualizarEventoMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => iniciarEdicion(evento)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {eventos.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-neutral-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay eventos confirmados</h3>
            <p className="text-neutral-600 text-center max-w-md">
              Los leads con status &quot;Ganado&quot; aparecerán aquí automáticamente. 
              Podrás asignarles fecha de evento y ganancia total.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Nota de Integración */}
      <Card className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Integración con Google Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Los eventos con fecha asignada se pueden sincronizar automáticamente con Google Calendar 
            a través de n8n. La fecha del evento bloqueará ese día en el calendario para evitar 
            sobrecargas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
