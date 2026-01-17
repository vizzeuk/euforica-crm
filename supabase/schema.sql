-- =====================================================
-- SCHEMA SQL PARA SUPABASE
-- Sistema de Gestión de Producción y CRM para Bordados
-- =====================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: clients (CRM)
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identificación única
  tax_id VARCHAR(50) UNIQUE, -- RUT/DNI/RFC (normalizado)
  
  -- Datos personales (normalizados en MAYÚSCULAS)
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) UNIQUE,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: debe tener al menos tax_id o phone
  CONSTRAINT clients_identification_check CHECK (
    tax_id IS NOT NULL OR phone IS NOT NULL
  )
);

-- Índices para búsqueda rápida
CREATE INDEX idx_clients_tax_id ON clients(tax_id);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_name ON clients(full_name);
CREATE INDEX idx_clients_email ON clients(email);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA: production_batches (lotes de producción)
-- =====================================================
CREATE TABLE IF NOT EXISTS production_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identificación del lote
  batch_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Capacidad y eficiencia
  target_capacity INTEGER NOT NULL, -- P (capacidad objetivo, ej: 100)
  actual_quantity INTEGER DEFAULT 0, -- Suma de quantities de orders
  efficiency_percentage DECIMAL(5,2) DEFAULT 0, -- (actual_quantity / target_capacity) * 100
  
  -- Fechas
  planned_date DATE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Estado
  status VARCHAR(50) DEFAULT 'planning' CHECK (
    status IN ('planning', 'ready', 'in_progress', 'completed', 'cancelled')
  ),
  
  -- Notas
  notes TEXT,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_batches_status ON production_batches(status);
CREATE INDEX idx_batches_planned_date ON production_batches(planned_date);
CREATE INDEX idx_batches_batch_number ON production_batches(batch_number);

-- Trigger para updated_at
CREATE TRIGGER update_batches_updated_at 
  BEFORE UPDATE ON production_batches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA: orders (pedidos)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  
  -- Detalles del pedido
  description TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  
  -- Fechas críticas
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline_date DATE NOT NULL,
  
  -- Estado del pedido
  status VARCHAR(50) DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_batch', 'in_production', 'completed', 'delivered', 'cancelled')
  ),
  
  -- Relación con lote de producción
  batch_id UUID REFERENCES production_batches(id) ON DELETE SET NULL,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_deadline ON orders(deadline_date);
CREATE INDEX idx_orders_batch ON orders(batch_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);

-- Trigger para updated_at
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para calcular total_amount automáticamente
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.unit_price IS NOT NULL AND NEW.quantity IS NOT NULL THEN
    NEW.total_amount = NEW.unit_price * NEW.quantity;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_order_total_trigger
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_order_total();

-- =====================================================
-- TABLA: system_settings (configuración del sistema)
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at
CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar configuraciones iniciales
INSERT INTO system_settings (key, value, description) VALUES
  ('daily_capacity', '100', 'Capacidad de producción diaria (P)'),
  ('efficiency_threshold', '80', 'Porcentaje mínimo para recomendar producción (%)'),
  ('deadline_warning_days', '3', 'Días de anticipación para alertas de fecha límite')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- VISTA: client_statistics (estadísticas de clientes)
-- =====================================================
CREATE OR REPLACE VIEW client_statistics AS
SELECT 
  c.id,
  c.full_name,
  c.tax_id,
  c.phone,
  c.email,
  COUNT(o.id)::INTEGER AS total_orders,
  COALESCE(SUM(o.total_amount), 0)::DECIMAL(10,2) AS total_spent,
  MAX(o.order_date) AS last_order_date,
  COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.quantity ELSE 0 END), 0)::INTEGER AS total_units_delivered
FROM clients c
LEFT JOIN orders o ON c.id = o.client_id
GROUP BY c.id, c.full_name, c.tax_id, c.phone, c.email;

-- =====================================================
-- VISTA: batch_summary (resumen de lotes)
-- =====================================================
CREATE OR REPLACE VIEW batch_summary AS
SELECT 
  pb.id,
  pb.batch_number,
  pb.target_capacity,
  pb.actual_quantity,
  pb.efficiency_percentage,
  pb.status,
  pb.planned_date,
  pb.started_at,
  pb.completed_at,
  COUNT(o.id)::INTEGER AS order_count,
  MIN(o.deadline_date) AS earliest_deadline,
  COALESCE(SUM(o.total_amount), 0)::DECIMAL(10,2) AS total_value
FROM production_batches pb
LEFT JOIN orders o ON pb.id = o.batch_id
GROUP BY pb.id, pb.batch_number, pb.target_capacity, pb.actual_quantity, 
         pb.efficiency_percentage, pb.status, pb.planned_date, pb.started_at, pb.completed_at;

-- =====================================================
-- FUNCIÓN: update_batch_metrics (actualizar métricas del lote)
-- =====================================================
CREATE OR REPLACE FUNCTION update_batch_metrics()
RETURNS TRIGGER AS $$
DECLARE
  v_batch_id UUID;
  v_total_quantity INTEGER;
  v_target_capacity INTEGER;
  v_efficiency DECIMAL(5,2);
BEGIN
  -- Determinar el batch_id a actualizar
  IF TG_OP = 'DELETE' THEN
    v_batch_id := OLD.batch_id;
  ELSE
    v_batch_id := NEW.batch_id;
  END IF;
  
  -- Si no hay batch_id, salir
  IF v_batch_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Calcular totales
  SELECT 
    COALESCE(SUM(quantity), 0),
    target_capacity
  INTO 
    v_total_quantity,
    v_target_capacity
  FROM orders o
  JOIN production_batches pb ON pb.id = v_batch_id
  WHERE o.batch_id = v_batch_id
  GROUP BY pb.target_capacity;
  
  -- Si no hay target_capacity, obtenerlo
  IF v_target_capacity IS NULL THEN
    SELECT target_capacity INTO v_target_capacity
    FROM production_batches
    WHERE id = v_batch_id;
  END IF;
  
  -- Calcular eficiencia
  IF v_target_capacity > 0 THEN
    v_efficiency := (v_total_quantity::DECIMAL / v_target_capacity) * 100;
  ELSE
    v_efficiency := 0;
  END IF;
  
  -- Actualizar batch
  UPDATE production_batches
  SET 
    actual_quantity = COALESCE(v_total_quantity, 0),
    efficiency_percentage = v_efficiency,
    updated_at = NOW()
  WHERE id = v_batch_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger para actualizar métricas del batch cuando cambian orders
CREATE TRIGGER update_batch_metrics_on_order_change
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_batch_metrics();

-- =====================================================
-- FUNCIÓN: get_pending_orders_summary
-- =====================================================
CREATE OR REPLACE FUNCTION get_pending_orders_summary()
RETURNS TABLE (
  total_pending INTEGER,
  total_quantity INTEGER,
  earliest_deadline DATE,
  urgent_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER,
    COALESCE(SUM(quantity), 0)::INTEGER,
    MIN(deadline_date),
    COUNT(CASE 
      WHEN deadline_date <= CURRENT_DATE + INTERVAL '3 days' 
      THEN 1 
    END)::INTEGER
  FROM orders
  WHERE status = 'pending';
END;
$$ language 'plpgsql';

-- =====================================================
-- POLÍTICAS RLS (Row Level Security) - Opcional
-- =====================================================
-- Si vas a usar autenticación con Supabase, descomenta esto:

-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Public access to clients" ON clients FOR ALL USING (true);
-- CREATE POLICY "Public access to orders" ON orders FOR ALL USING (true);
-- CREATE POLICY "Public access to batches" ON production_batches FOR ALL USING (true);
-- CREATE POLICY "Public access to settings" ON system_settings FOR ALL USING (true);

-- =====================================================
-- DATOS DE PRUEBA (Opcional)
-- =====================================================
-- Cliente de ejemplo
INSERT INTO clients (tax_id, full_name, email, phone) VALUES
  ('12345678-9', 'JUAN PÉREZ GONZÁLEZ', 'juan.perez@email.com', '+56912345678'),
  ('98765432-1', 'MARÍA LÓPEZ SILVA', 'maria.lopez@email.com', '+56987654321'),
  ('11223344-5', 'CARLOS RODRÍGUEZ MUÑOZ', 'carlos.rodriguez@email.com', '+56911223344')
ON CONFLICT (tax_id) DO NOTHING;

-- Batch de ejemplo
INSERT INTO production_batches (batch_number, target_capacity, status) VALUES
  ('LOTE-2025-001', 100, 'planning')
ON CONFLICT (batch_number) DO NOTHING;

-- Pedidos de ejemplo
DO $$
DECLARE
  v_client_id UUID;
  v_batch_id UUID;
BEGIN
  SELECT id INTO v_client_id FROM clients WHERE tax_id = '12345678-9';
  SELECT id INTO v_batch_id FROM production_batches WHERE batch_number = 'LOTE-2025-001';
  
  IF v_client_id IS NOT NULL THEN
    INSERT INTO orders (client_id, description, quantity, unit_price, deadline_date, status) VALUES
      (v_client_id, 'Bordado logo empresa en camisetas', 50, 5.99, CURRENT_DATE + 7, 'pending'),
      (v_client_id, 'Bordado nombres en uniformes', 30, 3.50, CURRENT_DATE + 10, 'pending')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================
