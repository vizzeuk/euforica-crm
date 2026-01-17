-- =====================================================
-- EUFORICA CRM - SCHEMA DE BASE DE DATOS
-- =====================================================

-- Eliminar tablas antiguas si existen
DROP TABLE IF EXISTS production_batches CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP VIEW IF EXISTS client_statistics CASCADE;
DROP VIEW IF EXISTS batch_summary CASCADE;

-- =====================================================
-- TABLA: LEADS (Core del CRM)
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Información del contacto
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  mensaje TEXT,
  
  -- Gestión del lead
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal', 'won', 'lost')),
  priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta')),
  
  -- Datos financieros
  estimated_value NUMERIC(12, 2) DEFAULT 0,
  actual_value NUMERIC(12, 2),
  
  -- Tracking y seguimiento
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_followup_date TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'website', -- website, instagram, google, referido
  
  -- Notas internas
  notes TEXT,
  
  -- Datos del evento (opcional)
  event_type TEXT, -- boda, corporativo, cumpleaños, etc.
  event_date DATE,
  attendees INTEGER,
  
  -- Auditoría
  assigned_to TEXT, -- Usuario asignado
  won_at TIMESTAMP WITH TIME ZONE,
  lost_reason TEXT
);

-- Índices para performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_email ON leads(email);

-- =====================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VISTA: Estadísticas del Pipeline
-- =====================================================
CREATE OR REPLACE VIEW pipeline_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'new') AS leads_nuevos,
  COUNT(*) FILTER (WHERE status = 'contacted') AS leads_contactados,
  COUNT(*) FILTER (WHERE status = 'proposal') AS leads_propuesta,
  COUNT(*) FILTER (WHERE status = 'won') AS leads_ganados,
  COUNT(*) FILTER (WHERE status = 'lost') AS leads_perdidos,
  COUNT(*) FILTER (WHERE status NOT IN ('won', 'lost')) AS leads_activos,
  
  COALESCE(SUM(estimated_value) FILTER (WHERE status NOT IN ('won', 'lost')), 0) AS pipeline_value,
  COALESCE(SUM(actual_value) FILTER (WHERE status = 'won'), 0) AS revenue_total,
  COALESCE(AVG(actual_value) FILTER (WHERE status = 'won'), 0) AS avg_deal_size,
  
  COUNT(*) FILTER (WHERE status = 'new' AND created_at >= NOW() - INTERVAL '30 days') AS nuevos_mes_actual,
  COUNT(*) FILTER (WHERE status = 'won' AND won_at >= NOW() - INTERVAL '30 days') AS ganados_mes_actual,
  
  CASE 
    WHEN COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') > 0 
    THEN ROUND((COUNT(*) FILTER (WHERE status = 'won' AND won_at >= NOW() - INTERVAL '30 days')::NUMERIC / 
                COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::NUMERIC) * 100, 1)
    ELSE 0
  END AS conversion_rate
FROM leads;

-- =====================================================
-- VISTA: Leads con alertas de inactividad
-- =====================================================
CREATE OR REPLACE VIEW leads_with_alerts AS
SELECT 
  l.*,
  CASE 
    WHEN l.status = 'new' AND l.created_at < NOW() - INTERVAL '5 days' THEN 'urgent'
    WHEN l.status = 'contacted' AND l.last_contact_date < NOW() - INTERVAL '7 days' THEN 'warning'
    WHEN l.status = 'proposal' AND l.last_contact_date < NOW() - INTERVAL '3 days' THEN 'warning'
    ELSE 'ok'
  END AS alert_status,
  
  DATE_PART('day', NOW() - COALESCE(l.last_contact_date, l.created_at)) AS days_inactive
FROM leads l
WHERE l.status NOT IN ('won', 'lost');

-- =====================================================
-- FUNCIÓN: Obtener leads por estado (para Kanban)
-- =====================================================
CREATE OR REPLACE FUNCTION get_leads_by_status()
RETURNS TABLE (
  status TEXT,
  count BIGINT,
  total_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.status,
    COUNT(*)::BIGINT,
    COALESCE(SUM(l.estimated_value), 0)
  FROM leads l
  WHERE l.status NOT IN ('won', 'lost')
  GROUP BY l.status;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DATOS DE EJEMPLO (Opcional - eliminar en producción)
-- =====================================================
INSERT INTO leads (nombre, email, telefono, mensaje, status, priority, estimated_value, source, event_type, attendees)
VALUES 
  ('María González', 'maria@example.com', '+56912345678', 'Quiero cotizar una boda para 150 personas', 'new', 'alta', 3500000, 'website', 'boda', 150),
  ('Carlos Pérez', 'carlos@example.com', '+56987654321', 'Evento corporativo fin de año', 'contacted', 'alta', 5000000, 'google', 'corporativo', 200),
  ('Ana Silva', 'ana@example.com', '+56911112222', 'Cumpleaños 30 años', 'proposal', 'media', 1500000, 'instagram', 'cumpleaños', 80),
  ('Juan Morales', 'juan@example.com', '+56933334444', 'Evento de networking', 'won', 'media', 2000000, 'referido', 'corporativo', 100),
  ('Laura Díaz', 'laura@example.com', '+56955556666', 'Aniversario empresa', 'new', 'baja', 1000000, 'website', 'corporativo', 50);

-- =====================================================
-- RLS (Row Level Security) - Configuración básica
-- =====================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: Permitir todas las operaciones (ajustar según necesidad)
CREATE POLICY "Permitir acceso completo a leads" ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================
COMMENT ON TABLE leads IS 'Tabla principal del CRM Euforica - Gestión de leads y pipeline de ventas';
COMMENT ON COLUMN leads.status IS 'Estado del lead: new, contacted, proposal, won, lost';
COMMENT ON COLUMN leads.priority IS 'Prioridad del lead: baja, media, alta';
COMMENT ON COLUMN leads.estimated_value IS 'Valor estimado del proyecto en CLP';
COMMENT ON COLUMN leads.source IS 'Origen del lead: website, instagram, google, referido';
