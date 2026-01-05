# Category Setup Guide

## Problem
The category dropdown shows "No categories available" because the `product_categories` table is empty.

## Solution

You now have **2 options**:

### Option 1: Use Hardcoded Categories (IMMEDIATE - Already Working!)
✅ **The dropdown now has hardcoded fallback categories**, so you can **create products immediately** without any database setup.

**Available categories:**
- Streaming
- Música
- Gaming
- Productividad
- Educación
- Software
- Cloud Storage
- VPN

**Note:** These categories will work for creating products, but they won't appear in the public store filter unless you also add them to the database.

---

### Option 2: Seed Categories to Database (RECOMMENDED)

#### Method A: Using Supabase Dashboard (Easiest)
1. Go to your Supabase project dashboard
2. Click on **SQL Editor**
3. Copy and paste the contents of `supabase/seed-categories.sql`
4. Click **Run**

#### Method B: Using Supabase CLI
```bash
cd supabase
supabase db push
```

#### Method C: Run Migration Manually
If you haven't run the store migration yet:
```bash
# Execute the full store migration
psql -h <your-db-host> -U postgres -d postgres -f supabase/migrations/20241231_store_system.sql

# OR just seed categories
psql -h <your-db-host> -U postgres -d postgres -f supabase/seed-categories.sql
```

---

## Verify Categories Are Loaded

1. Go to your Supabase dashboard
2. Navigate to **Table Editor** → `product_categories`
3. You should see 8 categories

OR

Test the API endpoint:
```bash
curl http://localhost:3000/api/v1/categories
```

---

## How It Works Now

The store management component (`app/dashboard/admin/store/components/store-management.tsx`) now:

1. **Starts with hardcoded fallback categories** (lines 72-82)
2. **Attempts to fetch from database** (line 132-143)
3. **Uses database categories if available**, otherwise keeps the fallback
4. **Always has categories available** - no more empty dropdown!

This means the system works immediately, and you can optionally seed the database later for the full feature set.

---

## Future: Add Custom Categories

If you want to add more categories in the future:

### Via Database:
```sql
INSERT INTO product_categories (name, slug, description, icon, color, sort_order)
VALUES ('Category Name', 'category-slug', 'Description', 'IconName', '#HexColor', 9);
```

### Update Hardcoded Fallback:
Edit `app/dashboard/admin/store/components/store-management.tsx` line 73-82 to add your category.
