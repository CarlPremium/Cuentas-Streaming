----------------------------------------------------------------
--                                                            --
--                   Add pg_cron Jobs                         --
--                                                            --
----------------------------------------------------------------
-- This migration adds cron jobs to replace Vercel cron jobs
-- which are limited to 1 on the free tier.
----------------------------------------------------------------

-- Schedule giveaways cron job (runs every 5 minutes)
-- This replaces the Vercel cron: /api/cron/giveaways
SELECT cron.schedule(
  'giveaways-auto-end-and-cleanup',
  '*/5 * * * *',  -- Every 5 minutes
  $$
    SELECT auto_end_expired_giveaways();
    SELECT cleanup_old_rate_limits();
  $$
);

----------------------------------------------------------------
-- NOTES:
----------------------------------------------------------------
-- 1. The daily-reset-posts cron has NOT been migrated because it
--    requires TypeScript logic (generateRecentPosts function).
--    To trigger it manually, call: /api/cron/daily-reset-posts
--    with the proper Authorization header.
--
-- 2. To view scheduled jobs: SELECT * FROM cron.job;
--
-- 3. To view job run history:
--    SELECT * FROM cron.job_run_details ORDER BY start_time DESC;
--
-- 4. To unschedule this job if needed:
--    SELECT cron.unschedule('giveaways-auto-end-and-cleanup');
----------------------------------------------------------------
