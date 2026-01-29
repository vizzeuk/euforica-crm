'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getAllInventoryItems, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  getInventoryStats 
} from '@/lib/queries-inventario'
import type { InventoryItem, CreateInventoryData, InventoryCategory, InventoryStatus } from '@/types/euforica'
import { Package, Plus, Pencil, Trash2, AlertTriangle, Box, DollarSign, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function InventarioPage() {
  const queryClient = useQueryClient()
  const [editando, setEditando] = useState<InventoryItem | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')

  // Queries
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: getAllInventoryItems
  })

  const { data: stats } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: getInventoryStats
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] })
      toast.success('Item agregado exitosamente')
      setMostrarFormulario(false)
    },
    onError: () => {
      toast.error('Error al agregar item')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] })
      toast.success('Item actualizado')
      setEditando(null)
    },
    onError: () => {
      toast.error('Error al actualizar item')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] })
      toast.success('Item eliminado')
    },
    onError: () => {
      toast.error('Error al eliminar item')
    }
  })

  // Filtrar items
  const itemsFiltrados = items.filter(item => {
    if (filtroCategoria !== 'todas' && item.categoria !== filtroCategoria) return false
    if (filtroStatus !== 'todos' && item.status !== filtroStatus) return false
    return true
  })

  // Items con stock bajo
  const itemsStockBajo = items.filter(item => 
    item.cantidad_minima && item.cantidad_disponible <= item.cantidad_minima
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const data: CreateInventoryData = {
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string || undefined,
      categoria: formData.get('categoria') as InventoryCategory,
      codigo_interno: formData.get('codigo_interno') as string || undefined,
      cantidad_total: parseInt(formData.get('cantidad_total') as string),
      cantidad_disponible: parseInt(formData.get('cantidad_disponible') as string) || undefined,
      cantidad_minima: parseInt(formData.get('cantidad_minima') as string) || undefined,
      status: formData.get('status') as InventoryStatus,
      costo_unitario: parseFloat(formData.get('costo_unitario') as string) || undefined,
      precio_renta: parseFloat(formData.get('precio_renta') as string) || undefined,
      ubicacion: formData.get('ubicacion') as string || undefined,
      proveedor: formData.get('proveedor') as string || undefined,
      notas: formData.get('notas') as string || undefined,
    }

    if (editando) {
      updateMutation.mutate({ id: editando.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este item?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-neutral-600">Cargando inventario...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-black dark:text-white">
            Inventario
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Gestiona tus productos y materiales
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
          Agregar Item
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Package className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Total Items</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">{stats.total_items}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <DollarSign className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Valor Total</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">
                  ${stats.valor_total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Box className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Disponibles</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">{stats.items_disponibles}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Package className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">En Uso</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">{stats.items_en_uso}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <AlertTriangle className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Stock Bajo</p>
                <p className="text-2xl font-serif font-light text-black dark:text-white">{stats.items_stock_bajo}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alertas de Stock Bajo */}
      {itemsStockBajo.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">
              Alerta: {itemsStockBajo.length} items con stock bajo
            </h3>
          </div>
          <div className="text-sm text-red-700">
            {itemsStockBajo.map(item => (
              <div key={item.id}>
                • {item.nombre} - Disponible: {item.cantidad_disponible} (Mínimo: {item.cantidad_minima})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <h2 className="font-serif text-3xl font-light text-black dark:text-white mb-6">
            {editando ? 'Editar Item' : 'Nuevo Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  defaultValue={editando?.nombre}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Código Interno
                </label>
                <input
                  type="text"
                  name="codigo_interno"
                  defaultValue={editando?.codigo_interno}
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
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  defaultValue={editando?.status || 'disponible'}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                >
                  <option value="disponible">Disponible</option>
                  <option value="en-uso">En Uso</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Cantidad Total *
                </label>
                <input
                  type="number"
                  name="cantidad_total"
                  required
                  min="0"
                  defaultValue={editando?.cantidad_total}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Cantidad Disponible
                </label>
                <input
                  type="number"
                  name="cantidad_disponible"
                  min="0"
                  defaultValue={editando?.cantidad_disponible}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Cantidad Mínima
                </label>
                <input
                  type="number"
                  name="cantidad_minima"
                  min="0"
                  defaultValue={editando?.cantidad_minima}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Costo Unitario
                </label>
                <input
                  type="number"
                  name="costo_unitario"
                  step="0.01"
                  min="0"
                  defaultValue={editando?.costo_unitario}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Precio de Renta
                </label>
                <input
                  type="number"
                  name="precio_renta"
                  step="0.01"
                  min="0"
                  defaultValue={editando?.precio_renta}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  defaultValue={editando?.ubicacion}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
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
                {editando ? 'Actualizar' : 'Crear'} Item
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
            <option value="disponible">Disponible</option>
            <option value="en-uso">En Uso</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Lista de Items */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Producto
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Categoría
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Estado
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Costo
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Renta
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {itemsFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{item.nombre}</div>
                      {item.codigo_interno && (
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">#{item.codigo_interno}</div>
                      )}
                      {item.ubicacion && (
                        <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          <MapPin className="h-3 w-3" />
                          {item.ubicacion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {item.cantidad_disponible} / {item.cantidad_total}
                    </div>
                    {item.cantidad_minima && item.cantidad_disponible <= item.cantidad_minima && (
                      <div className="flex items-center justify-center gap-1 text-xs text-red-600 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        Stock bajo
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'disponible' ? 'bg-green-100 text-green-800' :
                      item.status === 'en-uso' ? 'bg-orange-100 text-orange-800' :
                      item.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-neutral-900 dark:text-neutral-100">
                    {item.costo_unitario ? `$${item.costo_unitario.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-neutral-900 dark:text-neutral-100">
                    {item.precio_renta ? `$${item.precio_renta.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditando(item)
                          setMostrarFormulario(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

        {itemsFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No hay items en el inventario</p>
          </div>
        )}
      </div>
    </div>
  )
}




