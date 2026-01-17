/**
 * Configuración global optimizada para TanStack Query
 * Mejora el rendimiento reduciendo re-fetching innecesario
 */

export const queryConfig = {
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos" (5 minutos)
      staleTime: 5 * 60 * 1000,
      
      // Tiempo que los datos se mantienen en caché (10 minutos)
      gcTime: 10 * 60 * 1000,
      
      // No refetch cuando el usuario vuelve a la ventana
      refetchOnWindowFocus: false,
      
      // No refetch cuando se reconecta
      refetchOnReconnect: false,
      
      // Reintentos en caso de error
      retry: 1,
      
      // Tiempo de reintento
      retryDelay: 1000,
    },
  },
}
