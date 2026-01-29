'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, BarChart3, Settings, Bell, Zap, LogOut, Calendar, Menu, X, Package, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { getNotificacionesStats } from '@/lib/queries-notificaciones'
import NotificacionesPanel from '@/components/NotificacionesPanel'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Pipeline', href: '/dashboard/pipeline', icon: BarChart3 },
  { name: 'Eventos', href: '/dashboard/eventos', icon: Calendar },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Inventario', href: '/dashboard/inventario', icon: Package },
  { name: 'Gastos', href: '/dashboard/gastos', icon: DollarSign },
  { name: 'Ajustes', href: '/dashboard/ajustes', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [loggingOut, setLoggingOut] = useState(false)
  const [notificacionesOpen, setNotificacionesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Query para stats de notificaciones
  const { data: stats } = useQuery({
    queryKey: ['notificaciones-stats'],
    queryFn: getNotificacionesStats,
    refetchInterval: 30000, // Refrescar cada 30 segundos
  })

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#000',
            border: '1px solid #e5e5e5',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#000',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Header minimalista */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800">
        <div className="px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Botón de menú móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <h1 className="font-serif text-2xl font-light tracking-tight text-black dark:text-white">
                EUFORICA
                <span className="ml-3 text-xs font-sans uppercase tracking-[0.3em] text-neutral-500">CRM</span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Admin</span>
              <button 
                onClick={() => setNotificacionesOpen(!notificacionesOpen)}
                className="relative p-2 text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300"
              >
                <Bell className="h-5 w-5" />
                {stats && stats.no_leidas > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs flex items-center justify-center font-bold">
                    {stats.no_leidas > 9 ? '9+' : stats.no_leidas}
                  </span>
                )}
              </button>
              <button 
                onClick={handleLogout}
                disabled={loggingOut}
                className="p-2 text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300 disabled:opacity-50"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-4rem)]">
          <nav className="p-6 space-y-1">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6 px-3">
              Menú
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300',
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Sidebar Mobile (Overlay) */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <aside className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 shadow-xl">
              <nav className="p-6 space-y-1">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6 px-3">
                  Menú
                </div>
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300',
                        isActive
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                          : 'text-neutral-700 hover:text-black hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-12 bg-neutral-50 dark:bg-neutral-950">
          {children}
        </main>
      </div>

      {/* Panel de Notificaciones */}
      <NotificacionesPanel 
        isOpen={notificacionesOpen}
        onClose={() => setNotificacionesOpen(false)}
      />
    </div>
  )
}
