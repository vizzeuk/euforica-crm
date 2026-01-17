# 🎉 EUFORICA - Command Center

> CRM personalizado para gestión de leads y eventos | Agencia de planificación de eventos

## 🚀 Descripción

**EUFORICA Command Center** es un sistema CRM diseñado específicamente para agencias de eventos. Transforma leads desde landing pages en oportunidades de negocio gestionables con un pipeline visual y alertas inteligentes.

### ✨ Características Principales

- **Pipeline Visual (Kanban)**: Arrastra y suelta leads entre estados (Nuevo → Contactado → Propuesta → Ganado/Perdido)
- **Dashboard en Tiempo Real**: KPIs financieros, tasas de conversión, alertas urgentes
- **Sistema de Alertas**: Notificaciones automáticas para leads inactivos (+5 días sin contacto)
- **Tracking Financiero**: Pipeline value, revenue ganado, valor promedio por deal
- **Dark Mode Premium**: Tema zinc-950 con acentos vibrantes y glassmorphism
- **Gestión de Eventos**: Detalles específicos (tipo de evento, asistentes, fecha)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase PostgreSQL
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Internationalization**: date-fns (español)

## 📊 Estructura de la Base de Datos

### Tabla `leads`

```sql
- id: UUID (PK)
- nombre, email, telefono, mensaje
- status: ENUM ('new', 'contacted', 'proposal', 'won', 'lost')
- priority: ENUM ('baja', 'media', 'alta')
- estimated_value, actual_value: NUMERIC
- last_contact_date, next_followup_date: TIMESTAMP
- source: TEXT (website, instagram, google, referido)
- event_type, event_date, attendees: Detalles del evento
- notes: TEXT
```

## 🔧 Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

Crea archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Ejecutar schema

1. Abre Supabase Dashboard → SQL Editor
2. Ejecuta `supabase/schema-euforica.sql`

### 4. Iniciar servidor

```bash
npm run dev
```

Visita: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 📈 Funcionalidades

### Dashboard (`/dashboard`)

- KPIs: Leads activos, Pipeline value, Tasa de conversión, Alertas urgentes
- Gráfico de torta: Distribución por estado
- Gráfico de barras: Tendencia últimos 30 días
- Métricas financieras

### Pipeline (`/dashboard/pipeline`)

- Vista Kanban con 5 columnas
- Drag & Drop para cambiar estados
- Alertas visuales para leads urgentes
- Totales por columna

### Leads (`/dashboard/leads`)

- Lista completa con búsqueda
- Detalles completos por lead

## 🚨 Sistema de Alertas

- **Urgente**: Lead nuevo sin contacto +5 días (rojo pulsante)
- **Warning**: Lead contactado sin seguimiento +7 días
- **Propuesta crítica**: Sin respuesta +3 días

## 🎯 Flujo de Trabajo

1. Lead entra (landing → n8n → Supabase) como `new`
2. Primer contacto → `contacted`
3. Enviar propuesta → `proposal`
4. Cerrar → `won` o `lost`

---

**Desarrollado con ❤️ para EUFORICA**
