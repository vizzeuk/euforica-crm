'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, BarChart3, Settings, Bell, Zap, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Pipeline', href: '/dashboard/pipeline', icon: BarChart3 },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Ajustes', href: '/dashboard/ajustes', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header minimalista */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800">
        <div className="px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-light tracking-tight text-black dark:text-white">
                EUFORICA
                <span className="ml-3 text-xs font-sans uppercase tracking-[0.3em] text-neutral-500">CRM</span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Admin</span>
              <button className="relative p-2 text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-black dark:bg-white rounded-full"></span>
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
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-4rem)]">
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

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-12 bg-neutral-50 dark:bg-neutral-950">
          {children}
        </main>
      </div>
    </div>
  )
}
