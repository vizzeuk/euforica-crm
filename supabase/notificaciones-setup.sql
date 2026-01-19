-- ============================================
-- EUFORICA CRM - SISTEMA DE NOTIFICACIONES
-- ============================================
-- Tabla para notificaciones del sistema

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('info', 'success', 'warning', 'error')),
  leido BOOLEAN DEFAULT FALSE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX idx_notificaciones_created_at ON notificaciones(created_at DESC);
CREATE INDEX idx_notificaciones_lead_id ON notificaciones(lead_id);

-- Habilitar Row Level Security
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden ver notificaciones
CREATE POLICY "Usuarios autenticados pueden ver notificaciones"
ON notificaciones FOR SELECT
TO authenticated
USING (true);

-- Política: Solo usuarios autenticados pueden crear notificaciones
CREATE POLICY "Usuarios autenticados pueden crear notificaciones"
ON notificaciones FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar notificaciones
CREATE POLICY "Usuarios autenticados pueden actualizar notificaciones"
ON notificaciones FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar notificaciones
CREATE POLICY "Usuarios autenticados pueden eliminar notificaciones"
ON notificaciones FOR DELETE
TO authenticated
USING (true);

-- Función para crear notificaciones automáticas cuando un lead lleva mucho tiempo sin actualizar
CREATE OR REPLACE FUNCTION crear_notificacion_lead_inactivo()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el lead tiene más de 5 días sin actualizar y está en estado 'new' o 'contacted'
  IF (NEW.status IN ('new', 'contacted')) AND 
     (NOW() - NEW.updated_at > INTERVAL '5 days') THEN
    INSERT INTO notificaciones (titulo, mensaje, tipo, lead_id)
    VALUES (
      'Lead Inactivo',
      'El lead "' || NEW.nombre || '" lleva más de 5 días sin actividad',
      'warning',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear notificación automática
CREATE TRIGGER trigger_notificacion_lead_inactivo
AFTER UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION crear_notificacion_lead_inactivo();

-- Insertar notificaciones de ejemplo para prueba
INSERT INTO notificaciones (titulo, mensaje, tipo, lead_id) VALUES
  ('Nuevo Lead Recibido', 'Se ha recibido un nuevo lead desde el sitio web', 'info', NULL),
  ('Lead Convertido', 'El lead "María González" ha sido convertido a cliente', 'success', NULL),
  ('Seguimiento Pendiente', 'Tienes 3 leads pendientes de contactar hoy', 'warning', NULL);

-- Vista para contar notificaciones no leídas
CREATE OR REPLACE VIEW notificaciones_stats AS
SELECT 
  COUNT(*) FILTER (WHERE NOT leido) as no_leidas,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE tipo = 'warning' AND NOT leido) as warnings_no_leidas,
  COUNT(*) FILTER (WHERE tipo = 'error' AND NOT leido) as errors_no_leidas
FROM notificaciones;

COMMENT ON TABLE notificaciones IS 'Notificaciones del sistema para alertar sobre eventos importantes';
