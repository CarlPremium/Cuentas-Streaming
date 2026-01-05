----------------------------------------------------------------
--                                                            --
--           PERFORMANCE OPTIMIZATION MIGRATION               --
--           Run this after existing migrations               --
--                                                            --
----------------------------------------------------------------

-- 1. ADD MISSING INDEXES FOR PERFORMANCE

-- Giveaway listing with filters (composite index)
CREATE INDEX IF NOT EXISTS idx_giveaways_list_optimized 
ON giveaways(status, is_featured, is_banned, deleted_at, created_at DESC)
WHERE deleted_at IS NULL;

-- Giveaway date range queries
CREATE INDEX IF NOT EXISTS idx_giveaways_date_range 
ON giveaways(start_date, end_date) 
WHERE deleted_at IS NULL AND is_banned = FALSE AND status IN ('active', 'running');

-- Participant lookups by giveaway (covering index)
CREATE INDEX IF NOT EXISTS idx_participants_lookup 
ON giveaway_participants(giveaway_id, created_at DESC)
INCLUDE (user_id, guest_id, telegram_handle);

-- Participant counting (optimized)
CREATE INDEX IF NOT EXISTS idx_participants_count 
ON giveaway_participants(giveaway_id) 
INCLUDE (id);

-- Winner selection optimization (weighted random)
CREATE INDEX IF NOT EXISTS idx_participants_winner_selection 
ON giveaway_participants(giveaway_id, weight, id)
WHERE giveaway_id IS NOT NULL;

-- Rate limit cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limits_cleanup 
ON rate_limits(created_at) 
WHERE created_at < NOW() - INTERVAL '24 hours';

-- Rate limit active blocks
CREATE INDEX IF NOT EXISTS idx_rate_limits_active_blocks 
ON rate_limits(is_blocked, blocked_until) 
WHERE is_blocked = TRUE AND blocked_until > NOW();

-- Verification attempts analysis
CREATE INDEX IF NOT EXISTS idx_verification_attempts_analysis 
ON verification_attempts(giveaway_id, success, created_at DESC)
WHERE giveaway_id IS NOT NULL;

-- Verification attempts by IP (security monitoring)
CREATE INDEX IF NOT EXISTS idx_verification_attempts_ip_recent 
ON verification_attempts(ip_address, created_at DESC)
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Products listing (store)
CREATE INDEX IF NOT EXISTS idx_products_list 
ON products(category, is_active, is_featured, sort_order)
WHERE deleted_at IS NULL AND is_active = TRUE;

-- Products search by slug
CREATE INDEX IF NOT EXISTS idx_products_slug_active 
ON products(slug) 
WHERE deleted_at IS NULL AND is_active = TRUE;

-- Orders by status and date
CREATE INDEX IF NOT EXISTS idx_orders_status_date 
ON orders(status, payment_status, created_at DESC);

-- Orders by customer
CREATE INDEX IF NOT EXISTS idx_orders_customer 
ON orders(customer_email, created_at DESC);

----------------------------------------------------------------

-- 2. OPTIMIZE WINNER SELECTION FUNCTION

CREATE OR REPLACE FUNCTION select_giveaway_winner(p_giveaway_id BIGINT)
RETURNS JSON
SECURITY DEFINER SET search_path = public
AS $
DECLARE
  v_giveaway RECORD;
  v_winner RECORD;
  v_total_weight BIGINT;
  v_random_weight BIGINT;
BEGIN
  -- Get giveaway with lock
  SELECT * INTO v_giveaway
  FROM giveaways
  WHERE id = p_giveaway_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', FALSE, 'error', 'Giveaway not found');
  END IF;
  
  IF v_giveaway.winner_id IS NOT NULL OR v_giveaway.winner_guest_id IS NOT NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Winner already selected');
  END IF;
  
  -- Calculate total weight (optimized with index)
  SELECT SUM(weight) INTO v_total_weight
  FROM giveaway_participants
  WHERE giveaway_id = p_giveaway_id;
  
  IF v_total_weight IS NULL OR v_total_weight = 0 THEN
    RETURN json_build_object('success', FALSE, 'error', 'No participants');
  END IF;
  
  -- Generate random number
  v_random_weight := floor(random() * v_total_weight) + 1;
  
  -- OPTIMIZED: Use window function instead of cursor loop
  -- This is much faster for large participant lists
  SELECT * INTO v_winner
  FROM (
    SELECT *,
      SUM(weight) OVER (ORDER BY id) as cumulative_weight
    FROM giveaway_participants
    WHERE giveaway_id = p_giveaway_id
  ) sub
  WHERE cumulative_weight >= v_random_weight
  ORDER BY cumulative_weight
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', FALSE, 'error', 'Failed to select winner');
  END IF;
  
  -- Update giveaway with winner
  UPDATE giveaways
  SET 
    winner_id = v_winner.user_id,
    winner_guest_id = v_winner.guest_id,
    winner_selected_at = NOW(),
    status = 'ended'
  WHERE id = p_giveaway_id;
  
  RETURN json_build_object(
    'success', TRUE,
    'winner_id', v_winner.user_id,
    'winner_guest_id', v_winner.guest_id,
    'winner_email', v_winner.guest_email,
    'winner_name', v_winner.guest_name,
    'telegram_handle', v_winner.telegram_handle
  );
END;
$ LANGUAGE plpgsql;

----------------------------------------------------------------

-- 3. CREATE VIEW FOR PUBLIC GIVEAWAY STATS

-- This prevents exposing sensitive participant data
CREATE OR REPLACE VIEW public_giveaway_stats AS
SELECT 
  giveaway_id,
  COUNT(*) as participant_count,
  MAX(created_at) as last_entry_at,
  MIN(created_at) as first_entry_at
FROM giveaway_participants
GROUP BY giveaway_id;

-- Grant access to view
GRANT SELECT ON public_giveaway_stats TO anon, authenticated;

COMMENT ON VIEW public_giveaway_stats IS 'Public view of giveaway statistics without exposing participant details';

----------------------------------------------------------------

-- 4. OPTIMIZE RATE LIMIT FUNCTION

CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_attempts INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
SECURITY DEFINER SET search_path = public
AS $
DECLARE
  v_record RECORD;
  v_window_start TIMESTAMPTZ;
BEGIN
  v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get or create rate limit record with UPSERT for better concurrency
  INSERT INTO rate_limits (identifier, action, attempts, window_start)
  VALUES (p_identifier, p_action, 1, NOW())
  ON CONFLICT (identifier, action) DO UPDATE
  SET 
    attempts = CASE 
      WHEN rate_limits.window_start < v_window_start THEN 1
      ELSE rate_limits.attempts + 1
    END,
    window_start = CASE 
      WHEN rate_limits.window_start < v_window_start THEN NOW()
      ELSE rate_limits.window_start
    END,
    is_blocked = CASE
      WHEN rate_limits.window_start >= v_window_start 
        AND rate_limits.attempts + 1 > p_max_attempts THEN TRUE
      WHEN rate_limits.blocked_until < NOW() THEN FALSE
      ELSE rate_limits.is_blocked
    END,
    blocked_until = CASE
      WHEN rate_limits.window_start >= v_window_start 
        AND rate_limits.attempts + 1 > p_max_attempts THEN NOW() + INTERVAL '1 hour'
      WHEN rate_limits.blocked_until < NOW() THEN NULL
      ELSE rate_limits.blocked_until
    END
  RETURNING * INTO v_record;
  
  -- Check if blocked
  IF v_record.is_blocked AND v_record.blocked_until > NOW() THEN
    RETURN FALSE;
  END IF;
  
  -- Check if limit exceeded
  IF v_record.attempts > p_max_attempts THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$ LANGUAGE plpgsql;

----------------------------------------------------------------

-- 5. ADD FUNCTION TO GET GIVEAWAY WITH STATS (OPTIMIZED)

CREATE OR REPLACE FUNCTION get_giveaway_with_stats(p_giveaway_id BIGINT)
RETURNS JSON
SECURITY DEFINER SET search_path = public
AS $
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'id', g.id,
    'title', g.title,
    'slug', g.slug,
    'description', g.description,
    'thumbnail_url', g.thumbnail_url,
    'start_date', g.start_date,
    'end_date', g.end_date,
    'status', g.status,
    'max_participants', g.max_participants,
    'is_featured', g.is_featured,
    'created_at', g.created_at,
    'participant_count', COALESCE(s.participant_count, 0),
    'last_entry_at', s.last_entry_at,
    'user', json_build_object(
      'username', u.username,
      'full_name', u.full_name,
      'avatar_url', u.avatar_url
    )
  ) INTO v_result
  FROM giveaways g
  LEFT JOIN public_giveaway_stats s ON s.giveaway_id = g.id
  LEFT JOIN users u ON u.id = g.user_id
  WHERE g.id = p_giveaway_id
    AND g.deleted_at IS NULL
    AND g.is_banned = FALSE;
  
  RETURN v_result;
END;
$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION get_giveaway_with_stats TO anon, authenticated;

----------------------------------------------------------------

-- 6. CONFIGURE AUTO-VACUUM FOR HIGH-TRAFFIC TABLES

-- More aggressive auto-vacuum for frequently updated tables
ALTER TABLE rate_limits SET (
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_scale_factor = 0.02,
  autovacuum_vacuum_cost_delay = 10
);

ALTER TABLE giveaway_participants SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE verification_attempts SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

----------------------------------------------------------------

-- 7. UPDATE TABLE STATISTICS

-- Collect statistics for query planner
ANALYZE giveaways;
ANALYZE giveaway_participants;
ANALYZE rate_limits;
ANALYZE verification_attempts;
ANALYZE products;
ANALYZE orders;
ANALYZE abuse_reports;

----------------------------------------------------------------

-- 8. ADD MATERIALIZED VIEW FOR DASHBOARD STATS (OPTIONAL)

-- Useful for admin dashboard to avoid expensive queries
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM giveaways WHERE deleted_at IS NULL) as total_giveaways,
  (SELECT COUNT(*) FROM giveaways WHERE status IN ('active', 'running') AND deleted_at IS NULL) as active_giveaways,
  (SELECT COUNT(*) FROM giveaway_participants) as total_participants,
  (SELECT COUNT(DISTINCT giveaway_id) FROM giveaway_participants) as giveaways_with_participants,
  (SELECT COUNT(*) FROM products WHERE deleted_at IS NULL AND is_active = TRUE) as active_products,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
  NOW() as last_updated;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_updated 
ON dashboard_stats(last_updated);

-- Grant access
GRANT SELECT ON dashboard_stats TO authenticated;

-- Function to refresh stats (call from cron or admin action)
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS VOID
SECURITY DEFINER SET search_path = public
AS $
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
END;
$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION refresh_dashboard_stats TO authenticated;

----------------------------------------------------------------

-- 9. ADD PARTITIONING FOR VERIFICATION ATTEMPTS (OPTIONAL)

-- If you expect high volume, partition by month
-- This is optional and can be added later if needed

-- Example (commented out, enable if needed):
/*
-- Convert to partitioned table
CREATE TABLE verification_attempts_new (
  LIKE verification_attempts INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create partitions for current and next months
CREATE TABLE verification_attempts_2024_12 
  PARTITION OF verification_attempts_new
  FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE verification_attempts_2025_01 
  PARTITION OF verification_attempts_new
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Migrate data (do this during low traffic)
-- INSERT INTO verification_attempts_new SELECT * FROM verification_attempts;

-- Swap tables (requires downtime)
-- ALTER TABLE verification_attempts RENAME TO verification_attempts_old;
-- ALTER TABLE verification_attempts_new RENAME TO verification_attempts;
*/

----------------------------------------------------------------

-- 10. ADD MONITORING QUERIES

-- Create view for slow queries monitoring
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- queries taking more than 100ms
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Note: Requires pg_stat_statements extension
-- Enable with: CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

----------------------------------------------------------------

-- 11. ADD HELPFUL COMMENTS

COMMENT ON INDEX idx_giveaways_list_optimized IS 'Optimized composite index for giveaway listing queries';
COMMENT ON INDEX idx_participants_winner_selection IS 'Optimized index for weighted random winner selection';
COMMENT ON INDEX idx_rate_limits_cleanup IS 'Index for efficient rate limit cleanup';
COMMENT ON FUNCTION get_giveaway_with_stats IS 'Optimized function to get giveaway with participant stats';
COMMENT ON VIEW public_giveaway_stats IS 'Public aggregated stats without exposing participant details';

----------------------------------------------------------------

-- 12. VERIFY INDEXES

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

----------------------------------------------------------------

SELECT '✅ Performance optimization migration complete!' as status;
SELECT 'Run ANALYZE on all tables to update statistics' as recommendation;
SELECT 'Monitor query performance with pg_stat_statements' as next_step;

