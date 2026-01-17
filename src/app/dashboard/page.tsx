'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  getPipelineStats, 
  getLeadsDistribution,
  getLeadsTrend,
  getLeadsWithAlerts
} from '@/lib/queries-euforica'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Users, DollarSign, TrendingUp, AlertCircle, Zap } from 'lucide-react'
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

const STATUS_COLORS = {
  new: '#171717',      // Negro suave
  contacted: '#404040', // Gris oscuro
  proposal: '#737373',  // Gris medio
  won: '#a3a3a3',      // Gris claro
  lost: '#d4d4d4',     // Gris muy claro
}

const STATUS_LABELS = {
  new: 'Nuevos',
  contacted: 'Contactados',
  proposal: 'Propuestas',
  won: 'Ganados',
  lost: 'Perdidos',
}

export default function DashboardPage() {
  const { data: stats } = useQuery({ 
    queryKey: ['pipeline-stats'], 
    queryFn: getPipelineStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false
  })
  
  const { data: distribution = [] } = useQuery({ 
    queryKey: ['leads-distribution'], 
    queryFn: getLeadsDistribution,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })

  const { data: trend = [] } = useQuery({ 
    queryKey: ['leads-trend'], 
    queryFn: getLeadsTrend,
    staleTime: 10 * 60 * 1000, // 10 minutos (cambia poco)
    refetchOnWindowFocus: false
  })

  const { data: alerts = [] } = useQuery({ 
    queryKey: ['leads-alerts'], 
    queryFn: getLeadsWithAlerts,
    staleTime: 2 * 60 * 1000, // 2 minutos (más crítico)
    refetchOnWindowFocus: false
  })

  const chartData = distribution.map((item) => ({
    name: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS],
    value: item.count,
    status: item.status,
  }))

  const trendData = trend.map((item) => ({
    date: format(new Date(item.date), 'd MMM', { locale: es }),
    leads: item.count,
  }))

  const urgentAlerts = alerts.filter(a => a.alert_status === 'urgent').length

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          PANEL DE CONTROL
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-black dark:text-white">
          Dashboard
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
          Visión general de tu pipeline de leads y métricas de rendimiento
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Leads Activos</CardTitle>
            <Users className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-black dark:text-white">{stats?.leads_activos || 0}</div>
            <p className="text-xs text-neutral-500 mt-1.5 font-medium">
              {stats?.leads_nuevos || 0} nuevos este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-black dark:text-white">
              ${((stats?.pipeline_value || 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-neutral-500 mt-1.5 font-medium">en oportunidades activas</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-black dark:text-white">
              {stats?.conversion_rate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-neutral-500 mt-1.5 font-medium">
              {stats?.leads_ganados || 0} leads ganados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Alertas</CardTitle>
            <AlertCircle className={urgentAlerts > 0 ? "h-4 w-4 text-black dark:text-white" : "h-4 w-4 text-neutral-400"} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold tracking-tight ${urgentAlerts > 0 ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
              {urgentAlerts}
            </div>
            <p className="text-xs text-neutral-500 mt-1.5 font-medium">leads sin contacto +5 días</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <CardTitle className="font-serif text-2xl font-light tracking-tight text-black dark:text-white">Distribución de Leads</CardTitle>
            <p className="text-sm text-neutral-500 mt-1">Por estado en el pipeline</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.status}`} 
                      fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#a3a3a3'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    color: '#000'
                  }} 
                />
                <Legend 
                  wrapperStyle={{ color: '#737373' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <CardTitle className="font-serif text-2xl font-light tracking-tight text-black dark:text-white">Tendencia de Leads</CardTitle>
            <p className="text-sm text-neutral-500 mt-1">Últimos 30 días</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="date" 
                  stroke="#737373"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#737373"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    color: '#000'
                  }} 
                />
                <Bar dataKey="leads" fill="#171717" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Stats */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <CardTitle className="font-serif text-2xl font-light tracking-tight text-black dark:text-white">Métricas Financieras</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Revenue Ganado</p>
              <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
                ${((stats?.revenue_total || 0) / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="p-5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Valor Promedio</p>
              <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
                ${((stats?.avg_deal_size || 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="p-5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Leads Perdidos</p>
              <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
                {stats?.leads_perdidos || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
