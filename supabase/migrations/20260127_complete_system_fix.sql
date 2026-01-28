----------------------------------------------------------------
--                                                            --
--        COMPLETE SYSTEM FIX - All-in-One Migration          --
--                                                            --
--  This migration consolidates all fixes and improvements    --
--  Run this ONCE on a fresh database or after resetting      --
--                                                            --
----------------------------------------------------------------

----------------------------------------------------------------
-- 1. GIVEAWAY SYSTEM FIXES
----------------------------------------------------------------

-- Add telegram_handle column to giveaway_participants if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'giveaway_participants' 
    AND column_name = 'telegram_handle'
  ) THEN
    ALTER TABLE giveaway_participants 
    ADD COLUMN telegram_handle TEXT;
    
    COMMENT ON COLUMN giveaway_participants.telegram_handle IS 'Telegram handle of participant (e.g., @username)';
  END IF;
END $$;

-- Add winner columns to giveaways table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'giveaways' 
    AND column_name = 'winner_telegram_handle'
  ) THEN
    ALTER TABLE giveaways 
    ADD COLUMN winner_telegram_handle TEXT;
    
    COMMENT ON COLUMN giveaways.winner_telegram_handle IS 'Telegram handle of the winner';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'giveaways' 
    AND column_name = 'winner_name'
  ) THEN
    ALTER TABLE giveaways 
    ADD COLUMN winner_name TEXT;
    
    COMMENT ON COLUMN giveaways.winner_name IS 'Name of the winner';
  END IF;
END $$;

----------------------------------------------------------------
-- 2. GIVEAWAY FUNCTIONS - Complete Rewrite
----------------------------------------------------------------

-- Function: Select Winner (with telegram handle and auto-complete)
CREATE OR REPLACE FUNCTION select_giveaway_winner(p_giveaway_id BIGINT)
RETURNS JSON
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_giveaway RECORD;
  v_winner RECORD;
  v_total_weight BIGINT;
  v_random_weight BIGINT;
  v_cumulative_weight BIGINT := 0;
BEGIN
  -- Get giveaway
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
  
  -- Calculate total weight
  SELECT SUM(weight) INTO v_total_weight
  FROM giveaway_participants
  WHERE giveaway_id = p_giveaway_id;
  
  IF v_total_weight IS NULL OR v_total_weight = 0 THEN
    RETURN json_build_object('success', FALSE, 'error', 'No participants');
  END IF;
  
  -- Generate random number
  v_random_weight := floor(random() * v_total_weight) + 1;
  
  -- Select winner using weighted random
  FOR v_winner IN
    SELECT *, weight
    FROM giveaway_participants
    WHERE giveaway_id = p_giveaway_id
    ORDER BY id
  LOOP
    v_cumulative_weight := v_cumulative_weight + v_winner.weight;
    
    IF v_cumulative_weight >= v_random_weight THEN
      -- Update giveaway: mark as ended, set end_date to now, store winner details
      UPDATE giveaways
      SET 
        winner_id = v_winner.user_id,
        winner_guest_id = v_winner.guest_id,
        winner_telegram_handle = v_winner.telegram_handle,
        winner_name = v_winner.guest_name,
        winner_selected_at = NOW(),
        status = 'ended',
        end_date = NOW() -- Prevent negative days display
      WHERE id = p_giveaway_id;
      
      -- Return winner details
      RETURN json_build_object(
        'success', TRUE,
        'winner_id', v_winner.user_id,
        'winner_guest_id', v_winner.guest_id,
        'winner_email', v_winner.guest_email,
        'winner_name', v_winner.guest_name,
        'telegram_handle', v_winner.telegram_handle
      );
    END IF;
  END LOOP;
  
  RETURN json_build_object('success', FALSE, 'error', 'Failed to select winner');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION select_giveaway_winner IS 'Selects random winner, marks giveaway as ended immediately, stores winner details';

-- Function: Join Giveaway (with telegram handle support)
CREATE OR REPLACE FUNCTION join_giveaway(
  p_giveaway_id BIGINT,
  p_user_id UUID DEFAULT NULL,
  p_guest_id UUID DEFAULT NULL,
  p_guest_email TEXT DEFAULT NULL,
  p_guest_name TEXT DEFAULT NULL,
  p_telegram_handle TEXT DEFAULT NULL,
  p_ip_address INET,
  p_user_agent TEXT DEFAULT NULL,
  p_fingerprint TEXT DEFAULT NULL
)
RETURNS JSON
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_giveaway RECORD;
  v_identifier TEXT;
  v_weight INTEGER;
  v_participant_count INTEGER;
  v_ip_count INTEGER;
BEGIN
  -- Get giveaway details
  SELECT * INTO v_giveaway
  FROM giveaways
  WHERE id = p_giveaway_id
  AND deleted_at IS NULL
  FOR UPDATE;
  
  -- Validation checks
  IF NOT FOUND THEN
    RETURN json_build_object('success', FALSE, 'error', 'Giveaway not found');
  END IF;
  
  IF v_giveaway.status != 'active' THEN
    RETURN json_build_object('success', FALSE, 'error', 'Giveaway is not active');
  END IF;
  
  IF v_giveaway.end_date < NOW() THEN
    RETURN json_build_object('success', FALSE, 'error', 'Giveaway has ended');
  END IF;
  
  IF NOT v_giveaway.allow_guests AND p_user_id IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Guests are not allowed');
  END IF;
  
  -- Check max participants
  IF v_giveaway.max_participants IS NOT NULL THEN
    SELECT COUNT(*) INTO v_participant_count
    FROM giveaway_participants
    WHERE giveaway_id = p_giveaway_id;
    
    IF v_participant_count >= v_giveaway.max_participants THEN
      RETURN json_build_object('success', FALSE, 'error', 'Giveaway is full');
    END IF;
  END IF;
  
  -- Rate limiting
  v_identifier := COALESCE(p_user_id::TEXT, p_ip_address::TEXT);
  IF NOT check_rate_limit(v_identifier, 'giveaway_join', 20, 60) THEN
    RETURN json_build_object('success', FALSE, 'error', 'Too many attempts. Please try again later.');
  END IF;
  
  -- Check IP abuse (max 5 entries per IP per giveaway)
  SELECT COUNT(*) INTO v_ip_count
  FROM giveaway_participants
  WHERE giveaway_id = p_giveaway_id AND ip_address = p_ip_address;
  
  IF v_ip_count >= 5 THEN
    RETURN json_build_object('success', FALSE, 'error', 'Maximum entries reached from this IP');
  END IF;
  
  -- Determine weight
  IF p_user_id IS NOT NULL THEN
    SELECT CASE 
      WHEN plan = 'premium' THEN 3
      ELSE 2
    END INTO v_weight
    FROM users WHERE id = p_user_id;
  ELSE
    v_weight := 1;
  END IF;
  
  -- Insert participant with telegram_handle
  INSERT INTO giveaway_participants (
    giveaway_id, user_id, guest_id, guest_email, guest_name, telegram_handle,
    ip_address, user_agent, fingerprint, weight
  ) VALUES (
    p_giveaway_id, p_user_id, p_guest_id, p_guest_email, p_guest_name, p_telegram_handle,
    p_ip_address, p_user_agent, p_fingerprint, v_weight
  );
  
  RETURN json_build_object('success', TRUE, 'weight', v_weight);
  
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object('success', FALSE, 'error', 'Already participated');
  WHEN OTHERS THEN
    RETURN json_build_object('success', FALSE, 'error', 'An error occurred');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION join_giveaway IS 'Allows users/guests to join giveaway with Telegram handle';

-- Function: Auto-end expired giveaways
CREATE OR REPLACE FUNCTION auto_end_expired_giveaways()
RETURNS VOID
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE giveaways
  SET status = 'ended'
  WHERE status = 'active'
  AND end_date < NOW()
  AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_end_expired_giveaways IS 'Automatically marks expired giveaways as ended';

-- Function: Cleanup old rate limits
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS VOID
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours'
  AND is_blocked = FALSE;
  
  -- Unblock expired blocks
  UPDATE rate_limits
  SET is_blocked = FALSE, blocked_until = NULL
  WHERE is_blocked = TRUE
  AND blocked_until < NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_rate_limits IS 'Cleans up old rate limit records and unblocks expired blocks';

----------------------------------------------------------------
-- 3. PERMISSIONS
----------------------------------------------------------------

GRANT EXECUTE ON FUNCTION select_giveaway_winner TO authenticated;
GRANT EXECUTE ON FUNCTION join_giveaway TO authenticated, anon;
GRANT EXECUTE ON FUNCTION auto_end_expired_giveaways TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_rate_limits TO authenticated;

----------------------------------------------------------------
-- 4. PG_CRON JOBS (if pg_cron extension is enabled)
----------------------------------------------------------------

-- Check if pg_cron is available and schedule jobs
DO $$
BEGIN
  -- Check if cron schema exists
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'cron') THEN
    
    -- Unschedule existing job if it exists
    PERFORM cron.unschedule('giveaways-auto-end-and-cleanup')
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'giveaways-auto-end-and-cleanup');
    
    -- Schedule new job (runs every 5 minutes)
    PERFORM cron.schedule(
      'giveaways-auto-end-and-cleanup',
      '*/5 * * * *',
      $$
        SELECT auto_end_expired_giveaways();
        SELECT cleanup_old_rate_limits();
      $$
    );
    
    RAISE NOTICE 'pg_cron job scheduled successfully';
  ELSE
    RAISE NOTICE 'pg_cron extension not available - skipping cron job setup';
  END IF;
END $$;

----------------------------------------------------------------
-- 5. FIX PERMALINKS (if needed)
----------------------------------------------------------------

-- Update localhost permalinks to production URL
DO $$
DECLARE
  production_url TEXT := 'https://www.cuentasgiveaway.fun';
  updated_count INTEGER;
BEGIN
  -- Update posts with localhost permalinks
  UPDATE posts
  SET permalink = REPLACE(permalink, 'http://localhost:3000', production_url)
  WHERE permalink LIKE 'http://localhost:3000%';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  IF updated_count > 0 THEN
    RAISE NOTICE 'Updated % permalinks from localhost to production', updated_count;
  ELSE
    RAISE NOTICE 'No localhost permalinks found to update';
  END IF;
END $$;

----------------------------------------------------------------
-- 6. VERIFICATION QUERIES
----------------------------------------------------------------

-- Verify giveaway columns exist
DO $$
BEGIN
  RAISE NOTICE 'Verifying giveaway system...';
  
  -- Check telegram_handle column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'giveaway_participants' 
    AND column_name = 'telegram_handle'
  ) THEN
    RAISE NOTICE '✓ giveaway_participants.telegram_handle exists';
  ELSE
    RAISE WARNING '✗ giveaway_participants.telegram_handle missing';
  END IF;
  
  -- Check winner columns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'giveaways' 
    AND column_name = 'winner_telegram_handle'
  ) THEN
    RAISE NOTICE '✓ giveaways.winner_telegram_handle exists';
  ELSE
    RAISE WARNING '✗ giveaways.winner_telegram_handle missing';
  END IF;
  
  -- Check functions
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'select_giveaway_winner'
  ) THEN
    RAISE NOTICE '✓ select_giveaway_winner function exists';
  ELSE
    RAISE WARNING '✗ select_giveaway_winner function missing';
  END IF;
  
  RAISE NOTICE 'Verification complete!';
END $$;

----------------------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------------------
-- 
-- This migration includes:
-- ✓ Giveaway telegram handle support
-- ✓ Winner selection with auto-completion
-- ✓ Auto-end expired giveaways
-- ✓ Rate limit cleanup
-- ✓ pg_cron job scheduling (if available)
-- ✓ Permalink fixes
-- ✓ Verification checks
--
-- To verify cron jobs: SELECT * FROM cron.job;
-- To view job history: SELECT * FROM cron.job_run_details ORDER BY start_time DESC;
--
----------------------------------------------------------------
