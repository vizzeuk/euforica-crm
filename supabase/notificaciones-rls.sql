-- ============================================
-- EUFORICA CRM - CONFIGURAR RLS PARA NOTIFICACIONES
-- ============================================
-- Ejecuta este script en tu Supabase SQL Editor

-- Habilitar Row Level Security
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden ver notificaciones
CREATE POLICY IF NOT EXISTS "Usuarios autenticados pueden ver notificaciones"
ON notificaciones FOR SELECT
TO authenticated
USING (true);

-- Política: Solo usuarios autenticados pueden crear notificaciones
CREATE POLICY IF NOT EXISTS "Usuarios autenticados pueden crear notificaciones"
ON notificaciones FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar notificaciones
CREATE POLICY IF NOT EXISTS "Usuarios autenticados pueden actualizar notificaciones"
ON notificaciones FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar notificaciones
CREATE POLICY IF NOT EXISTS "Usuarios autenticados pueden eliminar notificaciones"
ON notificaciones FOR DELETE
TO authenticated
USING (true);

-- Insertar notificaciones de prueba
INSERT INTO notificaciones (mensaje, tipo, lead_nombre, leido) VALUES
  ('Nuevo lead desde el sitio web', 'info', 'Juan Pérez', false),
  ('Lead convertido exitosamente', 'success', 'María González', false),
  ('Lead sin actividad por 5 días', 'warning', 'Pedro Rodríguez', false)
ON CONFLICT DO NOTHING;
