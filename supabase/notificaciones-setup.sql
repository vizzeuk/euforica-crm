-- ============================================
-- POLÍTICAS RLS PARA NOTIFICACIONES
-- ============================================
-- Ejecuta esto en Supabase SQL Editor

-- 1. Verificar que RLS esté habilitado
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_all_select_notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_all_insert_notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_all_update_notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_all_delete_notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "allow_anon_insert_notificaciones" ON notificaciones;

-- 3. Crear políticas nuevas (más permisivas)
CREATE POLICY "allow_all_select_notificaciones"
ON notificaciones FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_all_insert_notificaciones"
ON notificaciones FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "allow_all_update_notificaciones"
ON notificaciones FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_all_delete_notificaciones"
ON notificaciones FOR DELETE
TO authenticated
USING (true);

-- 4. También permitir operaciones anónimas (para n8n webhooks)
CREATE POLICY "allow_anon_insert_notificaciones"
ON notificaciones FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Insertar notificaciones de prueba
INSERT INTO notificaciones (mensaje, tipo, lead_nombre, leido) VALUES
  ('Sistema de notificaciones configurado correctamente', 'success', NULL, false),
  ('Tienes 3 leads pendientes de contactar', 'warning', NULL, false),
  ('Nuevo lead recibido desde el sitio web', 'info', 'María González', false);

