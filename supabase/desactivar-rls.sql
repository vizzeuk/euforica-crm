-- ============================================
-- DESACTIVAR RLS Y ELIMINAR TODAS LAS POLÍTICAS
-- ============================================
-- Esto restaura el acceso completo a las tablas

-- DESACTIVAR RLS EN TABLA LEADS
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- ELIMINAR TODAS LAS POLÍTICAS DE LEADS
DROP POLICY IF EXISTS "allow_anon_insert_leads" ON leads;
DROP POLICY IF EXISTS "allow_authenticated_all_leads" ON leads;
DROP POLICY IF EXISTS "allow_public_insert_leads" ON leads;
DROP POLICY IF EXISTS "allow_all_select_leads" ON leads;
DROP POLICY IF EXISTS "allow_all_insert_leads" ON leads;
DROP POLICY IF EXISTS "allow_all_update_leads" ON leads;
DROP POLICY IF EXISTS "allow_all_delete_leads" ON leads;
DROP POLICY IF EXISTS "allow_authenticated_select_leads" ON leads;
DROP POLICY IF EXISTS "allow_authenticated_update_leads" ON leads;
DROP POLICY IF EXISTS "allow_authenticated_delete_leads" ON leads;
DROP POLICY IF EXISTS "allow_authenticated_insert_leads" ON leads;

-- DESACTIVAR RLS EN TABLA NOTIFICACIONES
ALTER TABLE notificaciones DISABLE ROW LEVEL SECURITY;

-- ELIMINAR TODAS LAS POLÍTICAS DE NOTIFICACIONES
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_all_select_notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_all_insert_notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_all_update_notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_all_delete_notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_anon_insert_notificaciones" ON notificaciones;

-- LISTO: Ahora todas las tablas son accesibles sin restricciones
-- Tu formulario y CRM deberían funcionar normalmente
