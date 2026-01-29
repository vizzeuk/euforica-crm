-- =====================================================
-- SCRIPT DE CREACIÓN DE TABLAS PARA INVENTARIO Y GASTOS
-- EUFORICA CRM
-- =====================================================
-- 
-- Este script crea las tablas necesarias para el sistema de
-- inventario y gastos. Ejecutar en la SQL Editor de Supabase.
--
-- IMPORTANTE: Ejecuta este script completo en Supabase
-- =====================================================

-- =====================================================
-- TABLA: inventory_items (Inventario)
-- =====================================================
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Información del producto
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN ('decoracion', 'mobiliario', 'iluminacion', 'audio', 'catering', 'otros')),
  codigo_interno TEXT,
  
  -- Stock y disponibilidad
  cantidad_total INTEGER NOT NULL DEFAULT 0,
  cantidad_disponible INTEGER NOT NULL DEFAULT 0,
  cantidad_minima INTEGER,
  status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'en-uso', 'mantenimiento', 'baja')),
  
  -- Información financiera
  costo_unitario DECIMAL(10,2),
  precio_renta DECIMAL(10,2),
  
  -- Ubicación y seguimiento
  ubicacion TEXT,
  proveedor TEXT,
  
  -- Notas
  notas TEXT
);

-- Índices para inventory_items
CREATE INDEX idx_inventory_categoria ON inventory_items(categoria);
CREATE INDEX idx_inventory_status ON inventory_items(status);
CREATE INDEX idx_inventory_nombre ON inventory_items(nombre);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_items_updated_at
BEFORE UPDATE ON inventory_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_updated_at();

-- =====================================================
-- TABLA: expenses (Gastos)
-- =====================================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Información del gasto
  concepto TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN ('decoracion', 'mobiliario', 'iluminacion', 'audio', 'catering', 'transporte', 'personal', 'marketing', 'servicios', 'otros')),
  
  -- Monto
  monto DECIMAL(10,2) NOT NULL,
  
  -- Relación con lead/evento
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  lead_nombre TEXT,
  
  -- Proveedor y pago
  proveedor TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'pagado', 'cancelado')),
  fecha_pago TIMESTAMPTZ,
  
  -- Documentación
  factura_numero TEXT,
  metodo_pago TEXT,
  
  -- Notas
  notas TEXT
);

-- Índices para expenses
CREATE INDEX idx_expenses_categoria ON expenses(categoria);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_lead_id ON expenses(lead_id);
CREATE INDEX idx_expenses_fecha_pago ON expenses(fecha_pago);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_expenses_updated_at();

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================
-- Si decides habilitar RLS más adelante, aquí están las políticas

-- Habilitar RLS
-- ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Políticas de ejemplo (permitir todo por ahora)
-- CREATE POLICY "Permitir todo en inventory_items" ON inventory_items FOR ALL USING (true);
-- CREATE POLICY "Permitir todo en expenses" ON expenses FOR ALL USING (true);

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================
-- Descomenta para insertar datos de prueba

-- INSERT INTO inventory_items (nombre, descripcion, categoria, cantidad_total, cantidad_disponible, cantidad_minima, costo_unitario, precio_renta, ubicacion)
-- VALUES 
--   ('Sillas Tiffany Blancas', 'Sillas elegantes para eventos', 'mobiliario', 100, 100, 20, 150.00, 25.00, 'Bodega A'),
--   ('Luces LED RGB', 'Sistema de iluminación inteligente', 'iluminacion', 50, 45, 10, 800.00, 150.00, 'Bodega B'),
--   ('Mesa Rectangular 2m', 'Mesa para buffet o candy bar', 'mobiliario', 30, 28, 5, 500.00, 80.00, 'Bodega A'),
--   ('Altavoces JBL', 'Sistema de audio profesional', 'audio', 10, 8, 2, 2500.00, 400.00, 'Bodega C');

-- INSERT INTO expenses (concepto, categoria, monto, status, proveedor)
-- VALUES
--   ('Flores y Arreglos Florales', 'decoracion', 3500.00, 'pagado', 'Florería La Rosa'),
--   ('Servicio de Catering Premium', 'catering', 12000.00, 'pagado', 'Banquetes DeliciApp'),
--   ('Transporte de Mobiliario', 'transporte', 800.00, 'pendiente', 'Mudanzas Express'),
--   ('Personal de Servicio (4 personas)', 'personal', 2400.00, 'pendiente', 'Staff Pro');

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
-- 
-- SIGUIENTE PASO:
-- 1. Copia este script completo
-- 2. Ve a Supabase Dashboard > SQL Editor
-- 3. Pega y ejecuta el script
-- 4. Verifica que las tablas se crearon correctamente
-- 5. ¡El sistema de inventario y gastos estará listo!
-- =====================================================
