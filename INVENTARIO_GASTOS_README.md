# Sistema de Inventario y Gastos - EUFORICA CRM

## 📋 Resumen de Implementación

Se han creado dos nuevos módulos completos para el CRM EUFORICA:

### 1️⃣ **Sistema de Inventario**
Gestión completa de productos y materiales para eventos.

**Características:**
- ✅ CRUD completo de items (Crear, Leer, Actualizar, Eliminar)
- ✅ Categorías: Decoración, Mobiliario, Iluminación, Audio, Catering, Otros
- ✅ Control de stock (cantidad total, disponible, mínima)
- ✅ Estados: Disponible, En uso, Mantenimiento, Baja
- ✅ Alertas de stock bajo automáticas
- ✅ Precios: Costo unitario y precio de renta
- ✅ Tracking: Ubicación, proveedor, código interno
- ✅ Filtros por categoría y estado
- ✅ Dashboard con estadísticas en tiempo real

**Archivos creados:**
- `src/types/euforica.ts` - Tipos TypeScript (InventoryItem, InventoryCategory, InventoryStatus)
- `src/lib/queries-inventario.ts` - Queries de Supabase con funciones CRUD
- `src/app/dashboard/inventario/page.tsx` - Interfaz completa con tabla y formulario

### 2️⃣ **Sistema de Gastos**
Registro y seguimiento de gastos relacionados con servicios y eventos.

**Características:**
- ✅ CRUD completo de gastos
- ✅ Categorías: Decoración, Mobiliario, Iluminación, Audio, Catering, Transporte, Personal, Marketing, Servicios, Otros
- ✅ Relación con Leads/Eventos (vinculación automática)
- ✅ Estados: Pendiente, Pagado, Cancelado
- ✅ Marcar como pagado con un click
- ✅ Tracking de facturas y métodos de pago
- ✅ Cálculo de margen de ganancia por evento
- ✅ Estadísticas por categoría y período
- ✅ Filtros múltiples (categoría, estado, evento)

**Archivos creados:**
- `src/types/euforica.ts` - Tipos TypeScript (Expense, ExpenseCategory, ExpenseStats)
- `src/lib/queries-gastos.ts` - Queries de Supabase con función de cálculo de profit
- `src/app/dashboard/gastos/page.tsx` - Interfaz completa con tabla y formulario

### 3️⃣ **Navegación Actualizada**
Se agregaron dos nuevas opciones al menú del dashboard:
- 📦 **Inventario** - Icono: Package
- 💰 **Gastos** - Icono: DollarSign

**Archivo modificado:**
- `src/app/dashboard/layout.tsx` - Navegación con iconos de lucide-react

---

## 🗄️ Base de Datos

### Script SQL Generado
**Archivo:** `supabase/crear-tablas-inventario-gastos.sql`

**Tablas creadas:**
1. **inventory_items**
   - Campos: nombre, descripción, categoría, stock, precios, ubicación, proveedor
   - Índices en: categoría, status, nombre
   - Trigger para updated_at automático

2. **expenses**
   - Campos: concepto, categoría, monto, lead_id, proveedor, status, factura
   - Índices en: categoría, status, lead_id, fecha_pago, created_at
   - Foreign key a tabla `leads`
   - Trigger para updated_at automático

**Características del script:**
- ✅ Constraints para validación de datos
- ✅ Valores por defecto
- ✅ Timestamps automáticos
- ✅ Índices para performance
- ✅ Datos de ejemplo (comentados, opcionales)
- ✅ Políticas RLS preparadas (deshabilitadas por defecto)

---

## 🚀 Próximos Pasos

### 1. Crear las tablas en Supabase
```bash
# Opción 1: Desde Supabase Dashboard
# 1. Ve a: https://app.supabase.com
# 2. Selecciona tu proyecto
# 3. Ve a SQL Editor
# 4. Abre: supabase/crear-tablas-inventario-gastos.sql
# 5. Copia y pega el contenido
# 6. Ejecuta el script

# Opción 2: Desde terminal (si tienes Supabase CLI)
supabase db push
```

### 2. Verificar compilación
```bash
npm run build
```

### 3. Probar localmente
```bash
npm run dev
# Navega a: http://localhost:3000/dashboard/inventario
# Navega a: http://localhost:3000/dashboard/gastos
```

### 4. Desplegar a Vercel
```bash
git add .
git commit -m "Add inventory and expenses management system"
git push
# Vercel desplegará automáticamente
```

---

## 🎨 Diseño y UX

**Características visuales:**
- ✨ Responsive design (mobile-first)
- ✨ Cards de estadísticas con iconos
- ✨ Alertas visuales para stock bajo
- ✨ Estados con badges de colores
- ✨ Tablas con hover effects
- ✨ Formularios inline con validación
- ✨ Filtros dinámicos
- ✨ Toasts para feedback

**Paleta de colores:**
- Verde: Items disponibles / Gastos pagados
- Naranja: Items en uso / Gastos pendientes
- Rojo: Stock bajo / Gastos totales
- Azul: Categorías / Información general

---

## 📊 Funcionalidades Destacadas

### Inventario
1. **Alertas de Stock Bajo**: Banner rojo cuando items ≤ cantidad mínima
2. **Cálculo de Valor Total**: Suma automática de costo_unitario × cantidad_total
3. **Estados Visuales**: Badges de color según disponibilidad
4. **Edición Inline**: Click en lápiz para editar directamente

### Gastos
1. **Vinculación con Eventos**: Dropdown con todos los leads para relacionar gastos
2. **Marcar Pagado**: Click en ✓ para cambiar estado a pagado
3. **Cálculo de Profit**: Función `calculateEventProfit()` para margen de ganancia
4. **Filtro por Evento**: Ver todos los gastos de un evento específico
5. **Stats por Categoría**: Grid con total de gastos por categoría

---

## 🔧 Personalización Futura

### Ideas para mejorar:
- [ ] Importar/Exportar inventario desde Excel
- [ ] Historial de movimientos de stock
- [ ] Códigos QR para items de inventario
- [ ] Dashboard de rentabilidad por evento
- [ ] Gráficos de gastos mensuales
- [ ] Recordatorios de pagos pendientes
- [ ] Upload de facturas/comprobantes
- [ ] Integración con proveedores (API)
- [ ] Alertas por email/WhatsApp para stock bajo
- [ ] Reportes PDF de gastos por evento

---

## 📝 Notas Técnicas

**Dependencias utilizadas:**
- TanStack Query (react-query) - Cache y sincronización
- date-fns - Formateo de fechas
- lucide-react - Iconos
- react-hot-toast - Notificaciones
- Supabase Client - Database queries

**Patrones implementados:**
- Optimistic updates con invalidación de cache
- Formularios controlados con FormData
- Filtros client-side (sin re-fetch)
- Mutations con callbacks de éxito/error
- Stats calculadas en queries separadas

---

¡El sistema está listo para usar! Solo falta ejecutar el script SQL en Supabase y empezar a registrar tu inventario y gastos. 🎉
