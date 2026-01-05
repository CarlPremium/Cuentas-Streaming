# Cuentas Streaming - Complete Implementation Guide

**Project:** Next.js Streaming Accounts Platform
**Last Updated:** 2026-01-02
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Store System Setup](#store-system-setup)
3. [Giveaways System](#giveaways-system)
4. [Security Features](#security-features)
5. [Admin Dashboard](#admin-dashboard)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase project created
- Git repository set up

### Installation

```bash
# Clone and install
cd "C:\Users\Dell\Desktop\Cursor Projects\next-js-cuentas-streaming\Cuentas-Streaming"
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
pnpm dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🛍️ Store System Setup

### Step 1: Run Database Migration

**Using Supabase Dashboard:**
1. Go to https://app.supabase.com
2. Open SQL Editor
3. Run this file: `supabase/migrations/20241231_store_system.sql`
4. Wait for success ✅

**Using CLI:**
```bash
supabase db push
```

### Step 2: Seed Products (Optional)

Run this file in SQL Editor: `supabase/seed-store-products.sql`

This creates 11 sample products:
- Netflix Premium ($4.99)
- Spotify Premium ($2.99)
- Disney+ Premium ($3.99)
- And 8 more...

### Step 3: Configure Settings

```sql
UPDATE store_settings
SET
  telegram_handle = '@hyrecrpyto',
  store_name = 'Cuentas Premium Store',
  binance_enabled = true,
  paypal_enabled = true
WHERE id = 1;
```

### Step 4: Access Admin Dashboard

**URL:** `/dashboard/admin/store`

**Features:**
- ✅ Create/Edit/Delete products
- ✅ Manage categories
- ✅ Toggle product status
- ✅ Telegram integration
- ✅ Price management

**Access:** Admin or SuperAdmin role only

---

## 🎁 Giveaways System

### Database Tables
- `giveaways` - Main giveaway data
- `giveaway_participants` - Participant tracking with Telegram handles
- `rate_limits` - Abuse prevention
- `verification_attempts` - Turnstile tracking

### Features
- ✅ Telegram handle validation
- ✅ IP-based rate limiting (10 req/hour)
- ✅ Fingerprint tracking
- ✅ Turnstile verification
- ✅ Weighted random selection
- ✅ Admin management

### Admin Access
**URL:** `/dashboard/admin/giveaways`

---

## 🔐 Security Features

### Authentication & Authorization
- **Supabase Auth** - User authentication
- **Row Level Security (RLS)** - Database-level security
- **Role-based Access** - Admin/SuperAdmin/User roles
- **Server-side Verification** - All admin routes protected

### API Security
- **CSRF Protection** - Token-based validation
- **Rate Limiting** - 10-30 requests/hour per action
- **Input Validation** - Zod schemas on all inputs
- **Request Size Limits** - 100-500KB max
- **SQL Injection Prevention** - Parameterized queries only

### Rate Limiting Details

| Endpoint | Max Requests | Window | Block Duration |
|----------|-------------|--------|----------------|
| Create Product | 10 | 1 hour | 1 hour |
| Update Product | 20 | 1 hour | 1 hour |
| Delete Product | 10 | 1 hour | 1 hour |
| Join Giveaway | 10 | 1 hour | 1 hour |
| Store Settings | 3 | 1 hour | 2 hours |

---

## 👨‍💼 Admin Dashboard

### Navigation Structure

```
/dashboard
├── /posts - Blog management
├── /settings - User settings
└── /admin (Admin/SuperAdmin only)
    ├── /store - Store management ⭐ NEW
    ├── /giveaways - Giveaways management
    └── /page - Admin overview
```

### Store Management Features

**Product Management:**
- Create products with full details
- Edit existing products
- Soft delete (preserves data)
- Toggle Active/Featured/Popular
- Category assignment
- Price & discount management
- Feature list management
- Stock tracking

**Order Management** (Coming Soon):
- View all orders
- Update order status
- Mark as delivered
- Customer information

**Store Settings:**
- Telegram configuration
- Payment method toggles
- Store branding
- Notification preferences

---

## 🔌 API Reference

### Public Endpoints

#### GET `/api/v1/products`
List all active products.

**Query Parameters:**
- `category` - Filter by category
- `is_featured` - Show only featured (true/false)
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20)
- `sort` - Sort field (default: sort_order)
- `order` - asc/desc (default: asc)

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 11,
    "total_pages": 1
  }
}
```

#### GET `/api/v1/products/[id]`
Get single product details.

#### GET `/api/v1/categories`
List all product categories.

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Streaming",
      "slug": "streaming",
      "icon": "Tv",
      "color": "#8B5CF6"
    }
  ]
}
```

### Admin Endpoints (Requires Auth + Admin Role)

#### POST `/api/v1/products`
Create new product.

**Headers:**
```
Content-Type: application/json
Cookie: (session cookie)
```

**Body:**
```json
{
  "name": "Netflix Premium",
  "slug": "netflix-premium",
  "description": "Full access to 4K content",
  "price": 4.99,
  "original_price": 15.99,
  "category": "Streaming",
  "duration": "1 Mes",
  "image_url": "https://...",
  "features": ["4K Ultra HD", "4 Screens"],
  "is_active": true,
  "is_featured": false,
  "is_popular": true
}
```

#### PATCH `/api/v1/products/[id]`
Update product (partial update supported).

#### DELETE `/api/v1/products/[id]`
Soft delete product (sets `deleted_at`).

---

## 🐛 Troubleshooting

### Common Issues

#### "Failed to fetch products"
**Cause:** Database connection or RLS policy issue

**Solution:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'products';

-- Should return rowsecurity = true

-- Check policies exist
SELECT * FROM pg_policies WHERE tablename = 'products';
```

#### "Forbidden. Admin access required"
**Cause:** User role is not admin/superadmin

**Solution:**
```sql
-- Check your role
SELECT email, role FROM users WHERE email = 'your@email.com';

-- Update to admin
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

#### "CSRF token validation failed"
**Cause:** Missing or invalid CSRF token

**Solution:**
- Clear browser cookies
- Ensure `credentials: 'include'` in fetch requests
- Check CSRF middleware is enabled

#### "Too many requests"
**Cause:** Rate limit exceeded

**Solution:**
```sql
-- Check rate limits
SELECT * FROM rate_limits WHERE identifier LIKE '%your_ip%';

-- Clear if needed (CAUTION)
DELETE FROM rate_limits WHERE identifier = 'your_ip_address';
```

#### SQL Migration Error: "syntax error at or near $"
**Cause:** Wrong delimiter in function

**Solution:** Already fixed! Use `$$` instead of `$` for function delimiters.

---

## 📊 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  duration TEXT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  stock_quantity INTEGER,
  unlimited_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_telegram TEXT,
  product_id BIGINT REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'pending',
  delivery_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Store Settings Table
```sql
CREATE TABLE store_settings (
  id BIGINT PRIMARY KEY,
  telegram_handle TEXT NOT NULL,
  binance_enabled BOOLEAN DEFAULT TRUE,
  paypal_enabled BOOLEAN DEFAULT TRUE,
  store_name TEXT DEFAULT 'Tienda',
  maintenance_mode BOOLEAN DEFAULT FALSE
);
```

---

## 🎨 Frontend Pages to Build (Optional)

The backend is complete. You can now build:

### 1. Public Store Page (`/store`)
- Product grid with filters
- Category navigation
- Search functionality
- Product cards with "Buy" button

### 2. Product Detail Page (`/store/[slug]`)
- Large product image
- Full description & features
- Price with discount display
- "Buy via Telegram" button

### 3. Customer Order Tracking
- Order history
- Order status
- Delivery tracking

---

## 📚 Additional Documentation

### In `/docs` folder:
- `BLOG_FEATURES_SUMMARY.md` - Blog system documentation
- `SEO_DOCUMENTATION.md` - SEO implementation guide
- `COOKIE_AND_EXIT_INTENT_IMPLEMENTATION.md` - Cookie banner & popups
- `LEGAL_COMPLIANCE_IMPLEMENTATION.md` - Privacy policy & terms

### Root Files:
- `README.md` - Project overview
- `STORE_NEXT_STEPS.md` - Detailed store implementation steps
- `STORE_INTEGRATION_FINAL_AUDIT.md` - Security audit report

---

## ✅ Production Checklist

Before deploying to production:

### Database
- [ ] Run all migrations successfully
- [ ] Verify RLS policies active
- [ ] Seed initial data (optional)
- [ ] Set up automated backups

### Configuration
- [ ] Update Telegram handle
- [ ] Configure payment methods
- [ ] Set environment variables
- [ ] Update store settings

### Security
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up error monitoring (Sentry)
- [ ] Review rate limits

### Testing
- [ ] Test admin dashboard access
- [ ] Test product CRUD operations
- [ ] Test API endpoints
- [ ] Test Telegram integration
- [ ] Test rate limiting

### Deployment
- [ ] Build succeeds locally
- [ ] All tests pass
- [ ] Deploy to staging first
- [ ] Verify production database
- [ ] Monitor logs for errors

---

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Vercel

Go to Vercel Dashboard → Project Settings → Environment Variables

Add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

---

## 📞 Support

For issues or questions:
1. Check this documentation first
2. Review error logs in Supabase Dashboard
3. Check browser console for client-side errors
4. Review Vercel deployment logs

---

**Implementation Complete!** 🎉

Your store system is production-ready with:
- ✅ Secure admin dashboard
- ✅ Protected API endpoints
- ✅ Database with RLS policies
- ✅ Rate limiting & CSRF protection
- ✅ Telegram integration
- ✅ Sample products ready

**Next:** Run the SQL migrations and start using `/dashboard/admin/store`!
