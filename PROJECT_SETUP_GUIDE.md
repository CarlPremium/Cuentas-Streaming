# Complete Project Setup Guide
## NextJS 14 Supabase Blog - From Zero to Running

A comprehensive guide to set up and run this NextJS 14 Supabase Blog application from scratch.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Supabase Configuration](#supabase-configuration)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Installation & Running](#installation--running)
7. [Project Structure](#project-structure)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (check version in `.nvmrc`)
- **npm** or **pnpm** (comes with Node.js)
- **Git**
- **Supabase account** (create at [supabase.com](https://supabase.com))
- **PowerShell** or **Command Prompt** (Windows)

---

## Quick Start

### 1. Clone or Verify Repository

If you haven't cloned yet:
```bash
git clone https://github.com/w3labkr/nextjs14-supabase-blog.git .
```

### 2. Install Dependencies

```bash
npm install
```

Or if using pnpm:
```bash
pnpm install
```

---

## Supabase Configuration

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name:** Your project name (e.g., "My Blog")
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free or Pro
5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning

### Step 2: Get Your Project Credentials

Once ready, go to **Project Settings** (gear icon):

#### In the "General" tab:
- **Reference ID** → This is your `NEXT_PUBLIC_SUPABASE_PROJECT_ID`

#### In the "API" tab:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 3: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **"New bucket"** or **"Create a new bucket"**

#### Configure Your Bucket:

**Bucket Name:**
- Enter: `media`
- ⚠️ Cannot be changed after creation
- Use lowercase, no spaces

**Public Bucket:**
- ✅ Check **"Public bucket"**
- Allows anyone to view images without authentication
- Perfect for blog images

**File Size Limit:**
- ✅ Check **"Restrict file size"**
- Enter: `10485760` (10MB)
- Prevents huge file uploads

**MIME Types:**
- ✅ Check **"Restrict MIME types"**
- Add these (one per line):
  ```
  image/jpeg
  image/png
  image/gif
  image/webp
  image/svg+xml
  ```

3. Click **"Create bucket"**

#### Set Up Bucket Policies:

After creating the bucket:

1. Click on your `media` bucket
2. Go to **Policies** tab
3. Click **"New Policy"**
4. Select these templates:
   - **"Allow public read access"** - Anyone can view
   - **"Allow authenticated uploads"** - Logged-in users can upload
   - **"Allow individual user access"** - Users manage their files
5. Click **"Review"** then **"Save policy"**

---

## Database Setup

### Step 1: Login to Supabase CLI

```bash
npx supabase login
```

Or with pnpm:
```bash
pnpm dlx supabase login
```

Press Enter when prompted, and authorize in your browser.

### Step 2: Initialize and Link Project

```bash
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your actual project ID (e.g., `cqlhneuersqqiwwyxufg`)

### Step 3: Run Database Seed

✅ **The seed file is already configured with:**
- Bucket: `media`
- Admin: `premiumacarl@gmail.com`

#### Important: Sign Up First!

Before running the seed, you need to create your admin account:

1. Start your dev server temporarily:
   ```bash
   npm run dev
   ```
2. Go to `http://localhost:3000`
3. Sign up with: `premiumacarl@gmail.com`
4. Use any password (you'll be admin)
5. Stop the dev server (Ctrl+C)

#### Run the Seed File:

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Open `supabase/seed.sql` in your editor
5. Copy ALL contents
6. Paste into SQL Editor
7. Click **"Run"** (or Ctrl+Enter)
8. Wait 10-30 seconds

**Option B: Via CLI**

```bash
npx supabase db reset
```

### Step 4: Verify Database Setup

In SQL Editor, run:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 13 tables: users, posts, tags, votes, favorites, etc.

```sql
-- Check your admin user
SELECT u.id, u.username, u.role, u.plan, au.email
FROM users u
JOIN auth.users au ON au.id = u.id
WHERE au.email = 'premiumacarl@gmail.com';
```

You should see:
- **role**: `superadmin`
- **plan**: `premium`

### Step 5: Generate TypeScript Types

```bash
npm run gen-types
```

This creates `types/supabase.ts` with your database schema.

---

## Environment Variables

### Step 1: Create Environment File

Copy the example file:
```bash
copy .env.example .env
```

Or manually create `.env` in the root directory.

### Step 2: Configure Variables

Edit `.env` with your values:

```env
# Application
NEXT_PUBLIC_APP_NAME=My Blog
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Application Private Keys
# Generate with PowerShell command below
SECRET_KEY=your_generated_secret_key_here

# Supabase Keys (from your dashboard)
NEXT_PUBLIC_SUPABASE_PROJECT_ID=cqlhneuersqqiwwyxufg
NEXT_PUBLIC_SUPABASE_URL=https://cqlhneuersqqiwwyxufg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=media

# Supabase Private Keys
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Generate SECRET_KEY

Run this in PowerShell:
```powershell
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new(); $bytes = New-Object byte[] 64; $rng.GetBytes($bytes); -join ($bytes | ForEach-Object { $_.ToString('x2') })
```

Copy the output and paste it as your `SECRET_KEY`.

---

## Installation & Running

### Install All Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Available Scripts

```bash
npm run dev          # Start dev server with Turbo
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run gen-types    # Generate Supabase types
npm run clean        # Clean node_modules and cache
npm run reinstall    # Clean and reinstall
```

---

## Project Structure

```
.
├── app/                        # Next.js App Router
│   ├── api/                   # API routes
│   │   ├── auth/              # Public auth endpoints
│   │   └── v1/                # Protected API endpoints
│   ├── [locale]/              # Internationalized routes
│   ├── dashboard/             # Dashboard pages
│   └── posts/                 # Blog post pages
├── components/                 # React components
│   ├── ui/                    # Shadcn UI components
│   └── ...                    # Custom components
├── config/                     # App configuration
├── context/                    # React context providers
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
│   ├── supabase/              # Supabase clients
│   └── utils/                 # Helper functions
├── public/                     # Static assets
│   ├── locales/               # i18n translations
│   └── manifest.json          # PWA manifest
├── queries/                    # SWR data fetching
├── store/                      # Redux store
├── supabase/                   # Supabase CLI files
│   └── seed.sql               # Database seed
├── types/                      # TypeScript types
│   └── supabase.ts            # Generated DB types
├── .env                        # Environment variables (create this)
├── .env.example                # Environment template
├── components.json             # Shadcn UI config
├── i18next.config.ts           # i18n configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
└── tailwind.config.ts          # Tailwind CSS config
```

---

## Troubleshooting

### Issue: "relation 'users' does not exist"

**Solution:** This was already fixed in your seed file. The tables are now dropped with `CASCADE` first.

### Issue: Environment variables not loading

**Solution:**
- Ensure `.env` is in the root directory
- Restart dev server after changing env vars
- Check for typos in variable names

### Issue: "Bucket not found"

**Solution:**
- Verify bucket name is exactly `media` in Supabase
- Check `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=media` in `.env`
- Restart dev server

### Issue: "Permission denied" when uploading

**Solution:**
- Check bucket policies are set up correctly
- Ensure user is authenticated
- Verify bucket is public for read access

### Issue: Admin role not assigned

**Solution:**
- Make sure you signed up with `premiumacarl@gmail.com` BEFORE running seed
- Re-run these SQL commands:
  ```sql
  SELECT set_user_role('superadmin', null, 'premiumacarl@gmail.com');
  SELECT set_user_plan('premium', null, 'premiumacarl@gmail.com');
  ```

### Issue: pg_cron errors

**Solution:**
- pg_cron is included in Supabase Pro plans
- Free tier: May need manual enabling in Database > Extensions
- If unavailable, comment out cron-related lines in seed.sql

### Issue: TypeScript errors after gen-types

**Solution:**
- Restart your IDE/editor
- Run: `npm run build` to check for real errors
- Verify `types/supabase.ts` was created

---

## Next Steps

### ✅ You're All Set! Now You Can:

1. **Access Your App**
   - Go to http://localhost:3000
   - Log in with `premiumacarl@gmail.com`
   - You have superadmin access!

2. **Create Your First Post**
   - Go to Dashboard
   - Click "New Post"
   - Write content with CKEditor
   - Upload images to your `media` bucket
   - Publish!

3. **Customize Your Blog**
   - Edit `config/site.ts` for site settings
   - Modify `app/[locale]/layout.tsx` for layout
   - Update `public/locales/` for translations
   - Change theme in `app/[locale]/providers.tsx`

4. **Configure Authentication**
   - Go to Supabase Dashboard > Authentication
   - Set up OAuth providers (Google, GitHub, etc.)
   - Configure email templates
   - Set redirect URLs

5. **Set Up for Production**
   - Review `docs/DEPLOYING.md`
   - Update `NEXT_PUBLIC_APP_URL` in production env
   - Configure custom domain
   - Set up Vercel/Netlify deployment

### Key Features to Explore

- ✅ **User Roles**: guest, user, admin, superadmin
- ✅ **User Plans**: free, basic, standard, premium
- ✅ **Post Status**: draft, publish, future, private, trash
- ✅ **Rich Text Editor**: CKEditor 5 with image upload
- ✅ **Tags System**: Organize posts with tags
- ✅ **Favorites**: Users can favorite posts
- ✅ **Votes**: Like/dislike system
- ✅ **Analytics**: Page view tracking
- ✅ **i18n**: Multi-language support
- ✅ **Dark Mode**: Theme switching
- ✅ **PWA**: Progressive Web App support
- ✅ **Scheduled Posts**: Auto-publish future posts

### Additional Documentation

- [INSTALLATION.md](./docs/INSTALLATION.md) - Detailed package installation
- [CONFIGURATION.md](./docs/CONFIGURATION.md) - App configuration
- [DEPLOYING.md](./docs/DEPLOYING.md) - Production deployment
- [LINTER.md](./docs/LINTER.md) - Code quality tools
- [EXAMPLES.md](./docs/EXAMPLES.md) - Code examples

### Useful SQL Queries

**Create a test post:**
```sql
INSERT INTO posts (user_id, title, slug, content, status, date)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'premiumacarl@gmail.com'),
  'Welcome to My Blog',
  'welcome-to-my-blog',
  '<p>This is my first blog post!</p>',
  'publish',
  now()
);
```

**Check post views:**
```sql
SELECT p.title, pm.meta_value as views
FROM posts p
LEFT JOIN postmeta pm ON pm.post_id = p.id AND pm.meta_key = 'views'
ORDER BY pm.meta_value::integer DESC;
```

**List all users with roles:**
```sql
SELECT u.username, u.email, u.role, u.plan, u.created_at
FROM users u
JOIN auth.users au ON au.id = u.id
ORDER BY u.created_at DESC;
```

---

## What the Database Seed Created

### Tables (13)
- `users` - User profiles with roles and plans
- `usermeta` - Custom user metadata
- `emails` - User email addresses
- `notifications` - Email preferences
- `role_permissions` - RBAC permissions
- `posts` - Blog posts
- `postmeta` - Post metadata (views, etc.)
- `tags` - Content tags
- `tagmeta` - Tag metadata
- `post_tags` - Post-tag relationships
- `votes` - Like/dislike system
- `favorites` - User favorites
- `statistics` - Analytics data

### Functions (40+)
- User management (create, delete, roles, plans)
- Post operations (CRUD, slugs, views)
- Tag management
- Vote/favorite handling
- Statistics tracking
- Search functions
- Scheduled jobs

### Security
- Row Level Security (RLS) enabled on all tables
- Public read for published content
- Authenticated write access
- Owner-only modifications
- Storage policies for file uploads

### Automated Jobs
- **Hourly**: Publish scheduled posts
- **Daily**: Clean up old logs

---

## Support & Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Community
- [GitHub Issues](https://github.com/w3labkr/nextjs14-supabase-blog/issues)
- [Supabase Discord](https://discord.supabase.com)
- [Next.js Discord](https://nextjs.org/discord)

### Need Help?
1. Check this guide first
2. Review error messages in browser console
3. Check Supabase Dashboard logs
4. Search GitHub issues
5. Ask in community Discord

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Credits

Based on:
- [shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)

---

**🎉 Congratulations! Your blog is ready to use!**

Start creating amazing content with your new Next.js 14 + Supabase blog platform.
