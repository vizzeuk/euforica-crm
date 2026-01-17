# 🚀 Instrucciones de Despliegue - EUFORICA CRM

## Pasos para completar la migración

### 1. ✅ Actualizar Base de Datos (CRÍTICO)

**Debes ejecutar el schema en tu Supabase ahora:**

1. Abre tu dashboard de Supabase: https://ltudraljyyzbtexwcrfu.supabase.co/project/_/sql
2. Crea un nuevo query
3. Copia y pega TODO el contenido de `supabase/schema-euforica.sql`
4. Haz clic en "Run" (▶️)
5. Verifica que aparezca "Success" sin errores

**Esto hará:**

- ❌ Eliminar tablas antiguas (production_batches, orders, clients, system_settings)
- ✅ Crear tabla `leads` con todos los campos necesarios
- ✅ Crear vistas `pipeline_stats` y `leads_with_alerts`
- ✅ Insertar 5 leads de ejemplo para probar

### 2. 🔧 Verificar Configuración

Tu archivo `.env.local` ya está configurado correctamente:

```
NEXT_PUBLIC_SUPABASE_URL=https://ltudraljyyzbtexwcrfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. 🎨 Instalar Dependencias (si no están instaladas)

```bash
npm install
```

### 4. 🚀 Iniciar Aplicación

```bash
npm run dev
```

Abre: http://localhost:3000/dashboard

### 5. 🎯 Verificar Funcionalidad

**Dashboard debe mostrar:**

- ✅ 5 leads activos (de los datos de ejemplo)
- ✅ Pipeline value: ~13M CLP
- ✅ Tasa de conversión calculada
- ✅ 1 alerta urgente (María González lleva 0 días)
- ✅ Gráfico de torta con distribución
- ✅ Gráfico de barras con tendencia

**Pipeline debe mostrar:**

- ✅ Vista Kanban con 5 columnas
- ✅ Arrastrar leads entre columnas funciona
- ✅ Colores diferentes por estado
- ✅ Contador de leads y valor total por columna

**Leads debe mostrar:**

- ✅ Lista de 5 leads con toda su información
- ✅ Búsqueda por nombre/email/teléfono
- ✅ Badges de estado y prioridad

## 📝 Datos de Ejemplo Insertados

| Nombre         | Estado    | Valor | Evento                     |
| -------------- | --------- | ----- | -------------------------- |
| María González | new       | $3.5M | Boda (150 personas)        |
| Carlos Pérez   | contacted | $5.0M | Corporativo (200 personas) |
| Ana Silva      | proposal  | $1.5M | Cumpleaños (80 personas)   |
| Juan Morales   | won       | $2.0M | Corporativo (100 personas) |
| Laura Díaz     | new       | $1.0M | Corporativo (50 personas)  |

## 🎨 Cambios Visuales Implementados

### Antes (Sistema de Bordados)

- ❌ Tema gris claro (slate-50, slate-100)
- ❌ Menú: Dashboard, Pedidos, Ver Pedidos, Clientes, Reportes, Ajustes
- ❌ KPIs: Pedidos Pendientes, En Producción, Capacidad Diaria
- ❌ Algoritmo de optimización de lotes

### Después (EUFORICA CRM)

- ✅ Dark mode (zinc-950 background)
- ✅ Menú: Dashboard, Pipeline, Leads, Ajustes
- ✅ KPIs: Leads Activos, Pipeline Value, Conversión, Alertas
- ✅ Sistema de alertas de inactividad
- ✅ Glassmorphism effects
- ✅ Colores vibrantes (purple, green, amber)

## 🔄 Integración con n8n (Próximo Paso)

Para conectar tu landing page con este CRM:

```javascript
// En n8n, crea un workflow:
// 1. Webhook Trigger (recibe formulario)
// 2. HTTP Request Node (POST a Supabase)

POST https://ltudraljyyzbtexwcrfu.supabase.co/rest/v1/leads
Headers:
  apikey: TU_ANON_KEY
  Content-Type: application/json
Body:
  {
    "nombre": "{{$json.nombre}}",
    "email": "{{$json.email}}",
    "telefono": "{{$json.telefono}}",
    "mensaje": "{{$json.mensaje}}",
    "status": "new",
    "priority": "media",
    "estimated_value": 0,
    "source": "website"
  }
```

## ⚠️ Solución de Problemas

### Error: "relation leads does not exist"

- **Solución**: No ejecutaste el schema. Ve a paso 1.

### Error: "Failed to fetch"

- **Solución**: Verifica `.env.local` tiene las credenciales correctas de Supabase

### Página en blanco / No muestra datos

- **Solución**: Abre DevTools (F12) → Console, revisa errores

### Los leads no se arrastran en Pipeline

- **Solución**: Verifica que la función `updateLeadStatus` esté funcionando (revisa Console)

## 🎊 ¡Listo!

Tu sistema EUFORICA Command Center está completo. Ahora tienes:

- ✅ Dashboard profesional con KPIs en tiempo real
- ✅ Pipeline Kanban para gestión visual
- ✅ Sistema de alertas automático
- ✅ Tracking financiero completo
- ✅ Dark mode con diseño premium

**¡Disfruta gestionando tus eventos! 🎉**
