# 🔍 Diagnóstico: Notificaciones no aparecen en el CRM

## ❌ Problema

Las notificaciones se marcan en Supabase pero no se reflejan en el CRM.

## ✅ Pasos para solucionarlo

### 1. VERIFICAR POLÍTICAS RLS EN SUPABASE

Ve a tu proyecto de Supabase → **SQL Editor** y ejecuta el contenido del archivo:

```
supabase/notificaciones-setup.sql
```

Este archivo hace lo siguiente:

- ✅ Habilita RLS en la tabla `notificaciones`
- ✅ Elimina políticas antiguas que puedan estar bloqueando
- ✅ Crea políticas nuevas más permisivas para usuarios autenticados
- ✅ Permite inserciones desde n8n (anónimas)
- ✅ Inserta 3 notificaciones de prueba

**IMPORTANTE:** Después de ejecutar el SQL, las notificaciones de prueba deberían aparecer automáticamente en el CRM.

---

### 2. VERIFICAR ERRORES EN EL NAVEGADOR

1. Abre el CRM en Chrome/Edge
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**
4. Haz clic en el ícono de la campana 🔔
5. Busca errores en rojo

**Errores comunes:**

```
❌ 401 Unauthorized → El token de autenticación no se está enviando
❌ 403 Forbidden → Las políticas RLS están bloqueando
❌ 404 Not Found → La URL de Supabase está mal configurada
```

---

### 3. VERIFICAR VARIABLES DE ENTORNO EN VERCEL

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**

Verifica que estén configuradas:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
```

Si las modificaste, debes:

1. Ir a **Deployments**
2. Hacer clic en los 3 puntos del último deployment
3. Seleccionar **Redeploy**

---

### 4. VERIFICAR QUE HAY DATOS EN SUPABASE

Ve a Supabase → **Table Editor** → **notificaciones**

Deberías ver notificaciones con:

- ✅ `leido = false`
- ✅ `mensaje` con texto
- ✅ `tipo` = 'info', 'success', 'warning' o 'error'
- ✅ `created_at` reciente

Si la tabla está vacía, inserta una manualmente:

```sql
INSERT INTO notificaciones (mensaje, tipo, lead_nombre, leido) VALUES
  ('Prueba desde Supabase', 'info', NULL, false);
```

---

### 5. FORZAR RECARGA EN EL CRM

1. En el CRM, haz clic en el ícono de la campana 🔔
2. Espera 30 segundos (el sistema consulta cada 30s)
3. Si no aparece, presiona **Ctrl + Shift + R** (hard refresh)

---

## 🧪 PRUEBA RÁPIDA

Ejecuta esto en el **SQL Editor de Supabase**:

```sql
-- Ver todas las notificaciones
SELECT * FROM notificaciones ORDER BY created_at DESC LIMIT 10;

-- Ver políticas RLS activas
SELECT * FROM pg_policies WHERE tablename = 'notificaciones';

-- Ver si RLS está habilitado
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'notificaciones';
```

**Resultado esperado:**

- `rowsecurity = true` (RLS habilitado)
- Al menos 4 políticas activas (SELECT, INSERT, UPDATE, DELETE)
- Al menos 1 notificación con `leido = false`

---

## 🐞 Si aún no funciona

1. Verifica que estés **logueado en el CRM** (las notificaciones solo se muestran a usuarios autenticados)
2. Abre la pestaña **Network** en DevTools
3. Filtra por "notificaciones"
4. Haz clic en la campana
5. Mira la respuesta del servidor → debería devolver un array con notificaciones

Si ves `[]` (array vacío), el problema son las políticas RLS.

---

## 📧 Enviar información para ayuda

Si después de seguir todos los pasos no funciona, envía:

1. Captura de pantalla de las políticas RLS en Supabase
2. Captura de la consola del navegador (errores en rojo)
3. Captura de la pestaña Network mostrando la request a Supabase
4. Resultado del query SQL de prueba

---

## ✅ Checklist de verificación

- [ ] RLS está habilitado en la tabla notificaciones
- [ ] Hay al menos 4 políticas RLS (SELECT, INSERT, UPDATE, DELETE)
- [ ] Hay notificaciones con leido = false en Supabase
- [ ] Las variables de entorno están configuradas en Vercel
- [ ] No hay errores 401/403 en la consola del navegador
- [ ] Estoy logueado en el CRM
- [ ] Esperé al menos 30 segundos después de crear una notificación
- [ ] Hice hard refresh (Ctrl + Shift + R)
