'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getAllExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense,
  markExpenseAsPaid,
  getExpenseStats,
  calculateEventProfit
} from '@/lib/queries-gastos'
import { getAllLeads } from '@/lib/queries-euforica'
import type { Expense, CreateExpenseData, ExpenseCategory, ExpenseStatus } from '@/types/euforica'
import { DollarSign, Plus, Pencil, Trash2, CheckCircle, TrendingDown, Calendar, Tag, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function GastosPage() {
  const queryClient = useQueryClient()
  const [editando, setEditando] = useState<Expense | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroLead, setFiltroLead] = useState<string>('todos')

  // Queries
  const { data: gastos = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: getAllExpenses
  })

  const { data: stats } = useQuery({
    queryKey: ['expense-stats'],
    queryFn: getExpenseStats
  })

  const { data: leads = [] } = useQuery({
    queryKey: ['leads-for-expenses'],
    queryFn: getAllLeads
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      toast.success('Gasto registrado exitosamente')
      setMostrarFormulario(false)
    },
    onError: () => {
      toast.error('Error al registrar gasto')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      toast.success('Gasto actualizado')
      setEditando(null)
    },
    onError: () => {
      toast.error('Error al actualizar gasto')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      toast.success('Gasto eliminado')
    },
    onError: () => {
      toast.error('Error al eliminar gasto')
    }
  })

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markExpenseAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      toast.success('Gasto marcado como pagado')
    },
    onError: () => {
      toast.error('Error al marcar como pagado')
    }
  })

  // Filtrar gastos
  const gastosFiltrados = gastos.filter(gasto => {
    if (filtroCategoria !== 'todas' && gasto.categoria !== filtroCategoria) return false
    if (filtroStatus !== 'todos' && gasto.status !== filtroStatus) return false
    if (filtroLead !== 'todos' && gasto.lead_id !== filtroLead) return false
    return true
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const data: CreateExpenseData = {
      concepto: formData.get('concepto') as string,
      descripcion: formData.get('descripcion') as string || undefined,
      categoria: formData.get('categoria') as ExpenseCategory,
      monto: parseFloat(formData.get('monto') as string),
      lead_id: formData.get('lead_id') as string || undefined,
      proveedor: formData.get('proveedor') as string || undefined,
      status: formData.get('status') as ExpenseStatus,
      fecha_pago: formData.get('fecha_pago') as string || undefined,
      factura_numero: formData.get('factura_numero') as string || undefined,
      metodo_pago: formData.get('metodo_pago') as string || undefined,
      notas: formData.get('notas') as string || undefined,
    }

    if (editando) {
      updateMutation.mutate({ id: editando.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-neutral-600">Cargando gastos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-black dark:text-white">
            Gastos
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Registra y gestiona los gastos de tus servicios
          </p>
        </div>
        <button
          onClick={() => {
            setEditando(null)
            setMostrarFormulario(!mostrarFormulario)
          }}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 font-medium"
        >
          <Plus className="h-5 w-5" />
          Registrar Gasto
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <DollarSign className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Total Gastos</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">
                  ${stats.total_gastos.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <TrendingDown className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Pendientes</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">
                  ${stats.gastos_pendientes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <CheckCircle className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Pagados</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">
                  ${stats.gastos_pagados.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Calendar className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Este Mes</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">
                  ${stats.gastos_mes_actual.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gastos por Categoría */}
      {stats && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <h2 className="font-serif text-2xl font-light text-black dark:text-white mb-4">Gastos por Categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.por_categoria).map(([categoria, monto]) => (
              monto > 0 && (
                <div key={categoria} className="text-center">
                  <div className="text-lg font-serif font-light text-black dark:text-white">
                    ${monto.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600 capitalize">
                    {categoria}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <h2 className="font-serif text-3xl font-light text-black dark:text-white mb-6">
            {editando ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Concepto *
                </label>
                <input
                  type="text"
                  name="concepto"
                  required
                  defaultValue={editando?.concepto}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Monto *
                </label>
                <input
                  type="number"
                  name="monto"
                  required
                  step="0.01"
                  min="0"
                  defaultValue={editando?.monto}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Categoría *
                </label>
                <select
                  name="categoria"
                  required
                  defaultValue={editando?.categoria}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                >
                  <option value="decoracion">Decoración</option>
                  <option value="mobiliario">Mobiliario</option>
                  <option value="iluminacion">Iluminación</option>
                  <option value="audio">Audio</option>
                  <option value="catering">Catering</option>
                  <option value="transporte">Transporte</option>
                  <option value="personal">Personal</option>
                  <option value="marketing">Marketing</option>
                  <option value="servicios">Servicios</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  defaultValue={editando?.status || 'pendiente'}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Relacionado con Evento/Lead
                </label>
                <select
                  name="lead_id"
                  defaultValue={editando?.lead_id || ''}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                >
                  <option value="">Sin relacionar</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.nombre} - {lead.event_type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Proveedor
                </label>
                <input
                  type="text"
                  name="proveedor"
                  defaultValue={editando?.proveedor}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Fecha de Pago
                </label>
                <input
                  type="date"
                  name="fecha_pago"
                  defaultValue={editando?.fecha_pago?.split('T')[0]}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Número de Factura
                </label>
                <input
                  type="text"
                  name="factura_numero"
                  defaultValue={editando?.factura_numero}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Método de Pago
                </label>
                <input
                  type="text"
                  name="metodo_pago"
                  defaultValue={editando?.metodo_pago}
                  placeholder="Transferencia, Efectivo, etc."
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                rows={2}
                defaultValue={editando?.descripcion}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Notas
              </label>
              <textarea
                name="notas"
                rows={2}
                defaultValue={editando?.notas}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              >
                {editando ? 'Actualizar' : 'Registrar'} Gasto
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false)
                  setEditando(null)
                }}
                className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 text-black dark:text-white"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Categoría
          </label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
          >
            <option value="todas">Todas</option>
            <option value="decoracion">Decoración</option>
            <option value="mobiliario">Mobiliario</option>
            <option value="iluminacion">Iluminación</option>
            <option value="audio">Audio</option>
            <option value="catering">Catering</option>
            <option value="transporte">Transporte</option>
            <option value="personal">Personal</option>
            <option value="marketing">Marketing</option>
            <option value="servicios">Servicios</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Estado
          </label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Evento/Lead
          </label>
          <select
            value={filtroLead}
            onChange={(e) => setFiltroLead(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
          >
            <option value="todos">Todos</option>
            {leads.map(lead => (
              <option key={lead.id} value={lead.id}>
                {lead.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Gastos */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Concepto
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Categoría
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Evento/Lead
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Monto
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Estado
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Fecha
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {gastosFiltrados.map((gasto) => (
                <tr key={gasto.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{gasto.concepto}</div>
                      {gasto.proveedor && (
                        <div className="text-sm text-neutral-500">
                          Proveedor: {gasto.proveedor}
                        </div>
                      )}
                      {gasto.factura_numero && (
                        <div className="flex items-center gap-1 text-sm text-neutral-500 mt-1">
                          <FileText className="h-3 w-3" />
                          Factura #{gasto.factura_numero}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Tag className="h-3 w-3" />
                      {gasto.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {gasto.lead_nombre ? (
                      <div className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">{gasto.lead_nombre}</div>
                    ) : (
                      <span className="text-sm text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-red-600">
                      -${gasto.monto.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      gasto.status === 'pagado' ? 'bg-green-100 text-green-800' :
                      gasto.status === 'pendiente' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {gasto.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {format(new Date(gasto.created_at), 'dd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {gasto.status === 'pendiente' && (
                        <button
                          onClick={() => markPaidMutation.mutate(gasto.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Marcar como pagado"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditando(gasto)
                          setMostrarFormulario(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(gasto.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {gastosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No hay gastos registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}



