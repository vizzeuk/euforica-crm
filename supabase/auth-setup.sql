-- ============================================
-- EUFORICA CRM - AUTENTICACIÓN
-- ============================================
-- Este script configura la autenticación para el sistema
-- Ejecutar en Supabase SQL Editor

-- 1. Habilitar Row Level Security en la tabla leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Política: Solo usuarios autenticados pueden ver leads
CREATE POLICY "Usuarios autenticados pueden ver leads"
ON leads FOR SELECT
TO authenticated
USING (true);

-- 3. Política: Solo usuarios autenticados pueden crear leads
CREATE POLICY "Usuarios autenticados pueden crear leads"
ON leads FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Política: Solo usuarios autenticados pueden actualizar leads
CREATE POLICY "Usuarios autenticados pueden actualizar leads"
ON leads FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Política: Solo usuarios autenticados pueden eliminar leads
CREATE POLICY "Usuarios autenticados pueden eliminar leads"
ON leads FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- CREAR USUARIOS DEL EQUIPO
-- ============================================
-- Estos usuarios se crearán desde la interfaz de Supabase o mediante código
-- Ir a Authentication > Users > Add User en Supabase Dashboard

-- INSTRUCCIONES:
-- 1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
-- 2. Click en "Authentication" en el menú lateral
-- 3. Click en "Users" 
-- 4. Click en "Add User"
-- 5. Ingresa el email y contraseña de cada miembro del equipo
-- 6. Click en "Create User"
-- 7. El usuario podrá iniciar sesión con esas credenciales

-- NOTA: Las contraseñas deben tener al menos 6 caracteres
