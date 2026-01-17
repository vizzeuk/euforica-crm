# 🚀 Configuración de Supabase para EUFORICA

## Paso 1: Obtener Credenciales

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto nuevo
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** (ejemplo: https://xxxxx.supabase.co)
   - **anon public key** (empieza con eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)

## Paso 2: Ejecutar el Schema SQL

1. En tu dashboard de Supabase, ve a **SQL Editor** (icono de base de datos en el menú izquierdo)
2. Click en **+ New query**
3. Copia TODO el contenido del archivo `supabase/schema-euforica.sql`
4. Pégalo en el editor
5. Click en **Run** (▶️ botón verde en la esquina inferior derecha)
6. Verifica que aparezca "Success. No rows returned" o similar

## Paso 3: Verificar Tablas Creadas

En el menú izquierdo, ve a **Table Editor** y deberías ver:

- ✅ `leads` - Tabla principal con todos los leads
- ✅ Views: `pipeline_stats`, `leads_with_alerts`

## Paso 4: Actualizar Credenciales en el Proyecto

Una vez que tengas las credenciales, las actualizaré en tu archivo `.env.local`

## ¿Qué hace el Schema?

El archivo `schema-euforica.sql` contiene:

### Tabla `leads`

- **Información del contacto**: nombre, email, teléfono, mensaje
- **Gestión del lead**: status (new/contacted/proposal/won/lost), priority (baja/media/alta)
- **Datos financieros**: estimated_value, actual_value
- **Tracking**: last_contact_date, next_followup_date, source
- **Datos del evento**: event_type, event_date, attendees, notes

### Vistas Automáticas

- **`pipeline_stats`**: Estadísticas agregadas (conversión, revenue, etc.)
- **`leads_with_alerts`**: Leads con cálculo de alertas de inactividad

### Funciones

- **`get_leads_by_status()`**: Agrupa leads por estado para Kanban
- **`update_updated_at_column()`**: Trigger automático para updated_at

### Datos de Ejemplo

5 leads de prueba para que puedas empezar a probar:

- María González - Boda $3.5M
- Carlos Pérez - Corporativo $5M
- Ana Silva - Cumpleaños $1.5M
- Juan Morales - Corporativo $2M (Ganado)
- Laura Díaz - Corporativo $1M

### Row Level Security (RLS)

Configurado con política permisiva para desarrollo. En producción deberás ajustarlo.

---

**Una vez que me proporciones las credenciales, actualizaré automáticamente tu `.env.local` y podrás empezar a usar el CRM! 🎉**
