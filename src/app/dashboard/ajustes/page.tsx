'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLead } from '@/lib/queries-euforica'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Settings } from 'lucide-react'
import type { CreateLeadData } from '@/types/euforica'

export default function AjustesPage() {
  const queryClient = useQueryClient()
  const [isAddingLead, setIsAddingLead] = useState(false)

  const [formData, setFormData] = useState<CreateLeadData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    priority: 'media',
    estimated_value: 0,
    source: 'website',
    event_type: '',
    attendees: 0,
  })

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leads'] })
      queryClient.invalidateQueries({ queryKey: ['leads-by-status'] })
      queryClient.invalidateQueries({ queryKey: ['pipeline-stats'] })
      
      // Reset form
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
        priority: 'media',
        estimated_value: 0,
        source: 'website',
        event_type: '',
        attendees: 0,
      })
      
      alert('Lead creado exitosamente!')
      setIsAddingLead(false)
    },
    onError: (error) => {
      alert('Error al crear lead: ' + error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.email) {
      alert('Nombre y email son obligatorios')
      return
    }

    createMutation.mutate(formData)
  }

  const handleInputChange = (field: keyof CreateLeadData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          CONFIGURACIÓN
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-black dark:text-white">Ajustes</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-base">Configuración del sistema y gestión manual de leads</p>
      </div>

      {/* Card de Agregar Lead Manualmente */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-black dark:text-white" />
              <CardTitle className="text-black dark:text-white font-bold">Agregar Lead Manualmente</CardTitle>
            </div>
            <Button
              onClick={() => setIsAddingLead(!isAddingLead)}
              variant="outline"
              className="border-neutral-300 dark:border-neutral-700 text-black dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {isAddingLead ? 'Cancelar' : 'Nuevo Lead'}
            </Button>
          </div>
        </CardHeader>
        
        {isAddingLead && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Información Básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-neutral-900 font-semibold">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="bg-neutral-50 border-neutral-300 text-black focus:border-black"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-900 font-semibold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-neutral-50 border-neutral-300 text-black focus:border-black"
                    placeholder="juan@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-neutral-900 font-semibold">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="bg-neutral-50 border-neutral-300 text-black focus:border-black"
                    placeholder="+56912345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source" className="text-neutral-900 font-semibold">Origen</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleInputChange('source', value)}
                  >
                    <SelectTrigger className="bg-neutral-50 border-neutral-300 text-black focus:border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-300">
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="referido">Referido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Prioridad y Valor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-neutral-900 font-semibold">Prioridad</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className="bg-neutral-50 border-neutral-300 text-black focus:border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-300">
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_value" className="text-neutral-900 font-semibold">Valor Estimado (CLP)</Label>
                  <Input
                    id="estimated_value"
                    type="number"
                    value={formData.estimated_value}
                    onChange={(e) => handleInputChange('estimated_value', parseFloat(e.target.value) || 0)}
                    className="bg-neutral-50 border-neutral-300 text-black focus:border-black"
                    placeholder="1500000"
                  />
                </div>
              </div>

              {/* Detalles del Evento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_type" className="text-neutral-900 font-semibold">Tipo de Evento</Label>
                  <Input
                    id="event_type"
                    value={formData.event_type}
                    onChange={(e) => handleInputChange('event_type', e.target.value)}
                    className="bg-neutral-50 border-neutral-300 text-black focus:border-black"
                    placeholder="Boda, Cumpleaños, Corporativo..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendees" className="text-neutral-900 font-semibold">Asistentes</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={formData.attendees}
                    onChange={(e) => handleInputChange('attendees', parseInt(e.target.value) || 0)}
                    className="bg-neutral-50 border-neutral-300 text-black focus:border-black"
                    placeholder="150"
                  />
                </div>
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <Label htmlFor="mensaje" className="text-neutral-900 font-semibold">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={(e) => handleInputChange('mensaje', e.target.value)}
                  className="bg-neutral-50 border-neutral-300 text-black focus:border-black min-h-[100px]"
                  placeholder="Describe los detalles del evento..."
                />
              </div>

              {/* Botón Submit */}
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-black hover:bg-neutral-800 text-white font-semibold"
              >
                {createMutation.isPending ? 'Creando...' : 'Crear Lead'}
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Información del Sistema */}
      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-neutral-500" />
            <CardTitle className="text-black font-bold">Información del Sistema</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-neutral-700">
            <div className="flex justify-between py-2 border-b border-neutral-200">
              <span>Sistema</span>
              <span className="text-black font-semibold">EUFORICA Command Center</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-200">
              <span>Versión</span>
              <span className="text-black font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-200">
              <span>Base de Datos</span>
              <span className="text-black font-semibold">● Conectado</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Alertas de Inactividad</span>
              <span className="text-black font-semibold">Activo (5 días para nuevos)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
