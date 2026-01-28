# Setup and Deployment Guide

Complete guide for installation, configuration, and deployment of the Cuentas Streaming platform.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase project
- Git repository

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Run development server
pnpm dev
```

---

## Environment Configuration

### Required Variables

```env
# Application
NEXT_PUBLIC_APP_NAME=Cuentas Streaming
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Security Keys
SECRET_KEY=<openssl rand -hex 64>
CRON_SECRET=<openssl rand -base64 32>

# Supabase
NEXT_PUBLIC_SUPABASE_PROJECT_ID=xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=avatars
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# SMTP (for magic links)
SMTP_SENDER_EMAIL=noreply@yourdomain.com
SMTP_SENDER_NAME=Your App
SMTP_BREVO_USER=xxx
SMTP_BREVO_PASS=xxx

# Optional - Analytics
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

### Generate Security Keys

```bash
# Windows PowerShell
-join ((0..63) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })

# Linux/Mac
openssl rand -hex 64    # SECRET_KEY
openssl rand -base64 32 # CRON_SECRET
```

---

## Database Setup

### Run Migrations

```bash
# Using Supabase CLI
pnpm dlx supabase db push

# Or manually in Supabase SQL Editor
# Run: supabase/migrations/20241231_store_system.sql
```

### Seed Data (Optional)

```bash
# Seed categories
psql -h <db-host> -U postgres -f supabase/seed-categories.sql

# Seed products
psql -h <db-host> -U postgres -f supabase/seed-store-products.sql
```

---

## Package Installation

### Core Dependencies

```bash
# Next.js
npx create-next-app@latest . --typescript

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Tailwind CSS
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Shadcn UI
npx shadcn-ui@latest init
npm install next-themes lucide-react @radix-ui/react-icons

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers zod-i18n-map

# State Management
npm install @reduxjs/toolkit react-redux redux-persist

# Data Fetching
npm install swr

# Internationalization
npm install react-i18next i18next i18next-http-backend

# Utilities
npm install dayjs slugify jsonwebtoken @types/jsonwebtoken
npm install nodemailer @types/nodemailer

# CKEditor
npm install ckeditor5 @ckeditor/ckeditor5-react
```

---

## Configuration Files

### next.config.js

```javascript
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['lucide-react'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}
```

### Linting

```bash
# Install ESLint & Prettier
npm install --save-dev eslint prettier
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-prettier eslint-config-prettier

# Run linter
npx eslint --fix ./{app,components,config,context,hooks,lib,queries,store,types}

# Format code
npx prettier --write "./{app,components}/**/*.{ts,tsx}"
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Environment Variables in Vercel:**
- Go to Settings → Environment Variables
- Add all variables from `.env`
- Redeploy after adding variables

### Cron Jobs (Supabase pg_cron)

Giveaways auto-end runs every 5 minutes via Supabase pg_cron:

```sql
-- Check scheduled jobs
SELECT * FROM cron.job;

-- Check recent runs
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

**Note:** Vercel cron jobs removed to support free tier. Daily reset requires manual trigger or GitHub Actions.

---

## Production Checklist

### Before Deploy

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Generate security keys
- [ ] Configure SMTP for emails
- [ ] Test build: `pnpm build`
- [ ] Type check: `pnpm tsc --noEmit`
- [ ] Update legal pages (Terms & Privacy)
- [ ] Create OG image (1200x630px)

### After Deploy

- [ ] Verify homepage loads
- [ ] Test authentication flow
- [ ] Check admin dashboard access
- [ ] Submit sitemap to Google Search Console
- [ ] Configure analytics (optional)
- [ ] Set up error monitoring
- [ ] Test all major features

---

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

### Database Connection Issues

```sql
-- Check RLS policies
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';

-- Verify user role
SELECT email, role FROM users WHERE email = 'your@email.com';
```

### Environment Variables Not Loading

- Restart dev server after changing `.env`
- Verify file is named exactly `.env`
- Check for typos in variable names
- Ensure variables start with `NEXT_PUBLIC_` for client-side access

---

## Performance Optimization

### Enable ISR (Incremental Static Regeneration)

```typescript
// app/posts/page.tsx
export const revalidate = 1800 // 30 minutes

// app/[username]/[slug]/page.tsx
export const revalidate = 7200 // 2 hours
```

### Image Optimization

```typescript
import Image from 'next/image'

<Image
  src={post.thumbnail_url}
  alt={post.title}
  width={800}
  height={600}
  loading="lazy"
/>
```

---

## Security Best Practices

### Implemented Protections

- ✅ CSRF protection on all mutations
- ✅ Rate limiting (10-30 req/hour)
- ✅ Input validation with Zod
- ✅ SQL injection prevention
- ✅ Role-based access control
- ✅ Request size limits
- ✅ Secure session management

### Rate Limits

| Endpoint | Max Requests | Window |
|----------|-------------|--------|
| Create Product | 10 | 1 hour |
| Update Product | 20 | 1 hour |
| Join Giveaway | 10 | 1 hour |
| Magic Link | 3 | 1 hour |

---

## Monitoring & Analytics

### Microsoft Clarity (Recommended)

1. Go to [clarity.microsoft.com](https://clarity.microsoft.com/)
2. Create project and copy ID
3. Add to `.env`: `NEXT_PUBLIC_CLARITY_PROJECT_ID=xxx`
4. Restart server

**Features:**
- Session recordings
- Heatmaps
- Rage click detection
- 100% free

---

## Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Vercel Deployment](https://vercel.com/docs)

---

**Status:** Production Ready ✅
