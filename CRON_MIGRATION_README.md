# Cron Jobs Migration - Vercel to Supabase

## Problem
Vercel's free Hobby plan only allows **1 cron job**, but this project had 2 cron jobs configured, preventing deployment.

## Solution
✅ **Removed all cron jobs from `vercel.json`** to allow free deployment
✅ **Migrated giveaways cron to Supabase pg_cron** (completely free)
⚠️ **Daily reset kept as API endpoint** (requires manual trigger or alternative automation)

---

## What Changed

### 1. Giveaways Auto-End & Cleanup (Migrated to Supabase)
- **Previous**: Vercel cron running every 5 minutes
- **Now**: Supabase pg_cron running every 5 minutes
- **Functions**: `auto_end_expired_giveaways()` and `cleanup_old_rate_limits()`
- **Status**: ✅ Fully automated, no action needed

### 2. Daily Reset Posts (Kept as API endpoint)
- **Previous**: Vercel cron running daily at midnight
- **Now**: API endpoint at `/api/cron/daily-reset-posts` (no auto-scheduling)
- **Why**: This endpoint uses TypeScript logic (`generateRecentPosts()`) that can't run directly in Supabase
- **Status**: ⚠️ Requires manual trigger or external automation

---

## How to Manually Trigger Daily Reset

You can trigger the daily reset manually using curl or any HTTP client:

```bash
curl -X GET https://your-domain.vercel.app/api/cron/daily-reset-posts \
  -H "Authorization: Bearer YOUR_SECRET_KEY"
```

Replace:
- `your-domain.vercel.app` with your actual Vercel domain
- `YOUR_SECRET_KEY` with the value from your `SECRET_KEY` environment variable

---

## Alternatives for Daily Reset Automation

Since you don't want to pay for Vercel cron, here are free alternatives:

### Option 1: GitHub Actions (Recommended)
Create `.github/workflows/daily-reset.yml`:

```yaml
name: Daily Reset Posts
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  reset:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Daily Reset
        run: |
          curl -X GET https://your-domain.vercel.app/api/cron/daily-reset-posts \
            -H "Authorization: Bearer ${{ secrets.SECRET_KEY }}"
```

Add `SECRET_KEY` to your GitHub repository secrets.

### Option 2: cron-job.org (Free Service)
1. Go to https://cron-job.org
2. Sign up for free account
3. Create a new cron job:
   - URL: `https://your-domain.vercel.app/api/cron/daily-reset-posts`
   - Schedule: Daily at midnight
   - HTTP Header: `Authorization: Bearer YOUR_SECRET_KEY`

### Option 3: EasyCron (Free Service)
1. Go to https://www.easycron.com
2. Sign up for free account (allows 1 cron job)
3. Configure the daily reset endpoint

### Option 4: Manual Trigger
Simply run the curl command above whenever you want to reset posts.

---

## Deployment Steps

1. **Push your changes** to GitHub:
   ```bash
   git add .
   git commit -m "Remove Vercel cron jobs to fix deployment"
   git push
   ```

2. **Deploy to Vercel** - Should now work without cron job errors!

3. **Apply Supabase migration**:
   ```bash
   pnpm dlx supabase db push
   ```
   Or apply manually in Supabase SQL Editor:
   - Run the migration file: `supabase/migrations/20260108_add_pg_cron_jobs.sql`

4. **Verify the giveaways cron is running**:
   ```sql
   -- Check scheduled jobs
   SELECT * FROM cron.job;

   -- Check recent job runs
   SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
   ```

5. **(Optional) Set up daily reset automation** using one of the alternatives above.

---

## Files Modified

- ✏️ `vercel.json` - Removed all cron jobs
- ➕ `supabase/migrations/20260108_add_pg_cron_jobs.sql` - New migration for pg_cron
- 📄 `CRON_MIGRATION_README.md` - This documentation

---

## Need Help?

- **Supabase pg_cron docs**: https://supabase.com/docs/guides/database/extensions/pg_cron
- **Vercel cron limits**: https://vercel.com/docs/cron-jobs/usage-and-pricing
