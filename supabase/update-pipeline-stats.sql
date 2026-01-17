-- Actualización rápida de la vista pipeline_stats
-- Ejecuta esto en tu SQL Editor de Supabase

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
