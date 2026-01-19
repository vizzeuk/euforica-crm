-- ============================================
-- POLÍTICAS RLS PARA TABLA LEADS
-- ============================================
-- Esto permite que el formulario público inserte leads
-- y que usuarios autenticados puedan ver/editar/eliminar

-- 1. Habilitar RLS en la tabla leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "allow_anon_insert_leads" ON leads;
DROP POLICY IF EXISTS "allow_authenticated_all_leads" ON leads;
DROP POLICY IF EXISTS "allow_public_insert_leads" ON leads;
DROP POLICY IF EXISTS "allow_all_select_leads" ON leads;
DROP POLICY IF EXISTS "allow_all_insert_leads" ON leads;
DROP POLICY IF EXISTS "allow_all_update_leads" ON leads;
DROP POLICY IF EXISTS "allow_all_delete_leads" ON leads;

-- 3. Permitir a usuarios ANÓNIMOS crear leads (formulario público)
CREATE POLICY "allow_anon_insert_leads"
ON leads FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Permitir a usuarios AUTENTICADOS ver todos los leads
CREATE POLICY "allow_authenticated_select_leads"
ON leads FOR SELECT
TO authenticated
USING (true);

-- 5. Permitir a usuarios AUTENTICADOS actualizar leads
CREATE POLICY "allow_authenticated_update_leads"
ON leads FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Permitir a usuarios AUTENTICADOS eliminar leads
CREATE POLICY "allow_authenticated_delete_leads"
ON leads FOR DELETE
TO authenticated
USING (true);

-- 7. Permitir a usuarios AUTENTICADOS insertar leads
CREATE POLICY "allow_authenticated_insert_leads"
ON leads FOR INSERT
TO authenticated
WITH CHECK (true);
