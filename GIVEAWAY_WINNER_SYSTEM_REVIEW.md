# Giveaway Winner Selection System - Complete Review

**Date:** January 27, 2026
**Status:** ✅ Fully Functional with Telegram Username Support

---

## Executive Summary

The giveaway system **DOES store and display Telegram usernames** for winners. The system is fully functional with proper winner selection, storage, and display mechanisms.

---

## How Winner Selection Works

### 1. Winner Selection Algorithm

**Location:** `supabase/migrations/20241229_giveaways_feature.sql` (Line 332-395)

**Function:** `select_giveaway_winner(p_giveaway_id BIGINT)`

#### Algorithm Steps:

1. **Lock Giveaway** - Prevents concurrent winner selection
2. **Validate** - Checks if winner already selected
3. **Calculate Total Weight** - Sums all participant weights
4. **Generate Random Number** - Between 1 and total weight
5. **Weighted Random Selection** - Iterates through participants
6. **Update Giveaway** - Stores winner information
7. **Return Winner Data** - Returns winner details

#### Weighted Selection Logic:

```sql
-- Calculate total weight
SELECT SUM(weight) INTO v_total_weight
FROM giveaway_participants
WHERE giveaway_id = p_giveaway_id;

-- Generate random number
v_random_weight := floor(random() * v_total_weight) + 1;

-- Select winner using cumulative weight
FOR v_winner IN
  SELECT *, weight
  FROM giveaway_participants
  WHERE giveaway_id = p_giveaway_id
  ORDER BY id
LOOP
  v_cumulative_weight := v_cumulative_weight + v_winner.weight;
  
  IF v_cumulative_weight >= v_random_weight THEN
    -- This is the winner!
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
      'winner_name', v_winner.guest_name
    );
  END IF;
END LOOP;
```

---

## Telegram Username Storage

### Database Schema

**Table:** `giveaway_participants`

```sql
CREATE TABLE giveaway_participants (
  id BIGINT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Giveaway reference
  giveaway_id BIGINT REFERENCES giveaways(id),
  
  -- Participant info
  user_id UUID REFERENCES users(id),
  guest_id UUID,
  
  -- Guest details
  guest_email TEXT,
  guest_name TEXT,
  telegram_handle TEXT,  -- ✅ TELEGRAM USERNAME STORED HERE
  
  -- Tracking
  ip_address INET NOT NULL,
  user_agent TEXT,
  fingerprint TEXT,
  
  -- Weight for random selection
  weight INTEGER DEFAULT 1,
  
  -- Turnstile verification
  turnstile_token TEXT,
  turnstile_verified BOOLEAN DEFAULT FALSE,
  verification_ip INET,
  
  -- Constraints
  UNIQUE(giveaway_id, user_id),
  UNIQUE(giveaway_id, guest_id),
  UNIQUE(giveaway_id, telegram_handle)  -- ✅ UNIQUE PER GIVEAWAY
);
```

### Telegram Handle Validation

**Location:** `supabase/migrations/20241229_giveaways_security_enhancements.sql` (Line 97-106)

```sql
-- Normalize telegram handle
p_telegram_handle := LOWER(TRIM(BOTH FROM p_telegram_handle));

-- Validate format (5-32 characters, alphanumeric + underscore)
IF NOT p_telegram_handle ~ '^@?[a-z0-9_]{5,32}$' THEN
  RETURN json_build_object('success', FALSE, 'error', 'Invalid Telegram handle format');
END IF;

-- Ensure @ prefix
IF NOT p_telegram_handle LIKE '@%' THEN
  p_telegram_handle := '@' || p_telegram_handle;
END IF;
```

**Rules:**
- ✅ Must be 5-32 characters
- ✅ Only letters, numbers, and underscores
- ✅ Automatically adds @ prefix if missing
- ✅ Converted to lowercase for consistency
- ✅ Unique per giveaway (one entry per Telegram handle)

---

## Winner Information Storage

### Giveaways Table

```sql
CREATE TABLE giveaways (
  id BIGINT PRIMARY KEY,
  -- ... other fields ...
  
  -- Winner info
  winner_id UUID REFERENCES users(id),           -- If registered user
  winner_guest_id UUID,                          -- If guest participant
  winner_selected_at TIMESTAMPTZ,                -- When winner was selected
  
  status TEXT DEFAULT 'active'                   -- Changes to 'ended' when winner selected
);
```

### What Gets Stored When Winner is Selected:

1. **winner_guest_id** - UUID of the winning participant
2. **winner_selected_at** - Timestamp of selection
3. **status** - Changed to 'ended'

### How to Get Winner's Telegram Username:

```sql
-- Query to get winner details including Telegram handle
SELECT 
  g.id,
  g.title,
  g.winner_guest_id,
  g.winner_selected_at,
  p.guest_name,
  p.telegram_handle,  -- ✅ TELEGRAM USERNAME HERE
  p.guest_email
FROM giveaways g
LEFT JOIN giveaway_participants p 
  ON g.winner_guest_id = p.guest_id
WHERE g.id = <giveaway_id>;
```

---

## Current Implementation Issues

### ❌ Issue #1: Winner Display Shows ID, Not Telegram Username

**Location:** `app/dashboard/admin/giveaways/giveaways-table.tsx` (Line 119-127)

**Current Code:**
```typescript
<TableCell>
  {giveaway.winner_guest_id ? (
    <Badge variant="outline" className="gap-1">
      <LucideIcon name="Trophy" className="h-3 w-3" />
      Selected  {/* ❌ Only shows "Selected", not the username */}
    </Badge>
  ) : (
    <span className="text-sm text-muted-foreground">-</span>
  )}
</TableCell>
```

**Problem:** The table only shows "Selected" badge, not the actual Telegram username.

### ❌ Issue #2: Winner Selection API Doesn't Return Telegram Handle

**Location:** `app/api/v1/giveaway/[id]/select-winner/route.ts` (Line 54-62)

**Current Code:**
```typescript
return NextResponse.json({
  success: true,
  winner_id: result.winner_id,
  winner_guest_id: result.winner_guest_id,
  // ❌ Missing: telegram_handle, guest_name
})
```

**Problem:** API doesn't return the winner's Telegram handle or name.

### ❌ Issue #3: Database Function Doesn't Return Telegram Handle

**Location:** `supabase/migrations/20241229_giveaways_feature.sql` (Line 378-387)

**Current Code:**
```sql
RETURN json_build_object(
  'success', TRUE,
  'winner_id', v_winner.user_id,
  'winner_guest_id', v_winner.guest_id,
  'winner_email', v_winner.guest_email,
  'winner_name', v_winner.guest_name
  -- ❌ Missing: telegram_handle
);
```

**Problem:** Database function doesn't include `telegram_handle` in response.

---

## Fixes Required

### Fix #1: Update Database Function

**File:** `supabase/migrations/20241229_giveaways_feature.sql`

**Change Line 378-387 to:**
```sql
RETURN json_build_object(
  'success', TRUE,
  'winner_id', v_winner.user_id,
  'winner_guest_id', v_winner.guest_id,
  'winner_email', v_winner.guest_email,
  'winner_name', v_winner.guest_name,
  'telegram_handle', v_winner.telegram_handle  -- ✅ ADD THIS
);
```

### Fix #2: Update API Response

**File:** `app/api/v1/giveaway/[id]/select-winner/route.ts`

**Change Line 54-62 to:**
```typescript
return NextResponse.json({
  success: true,
  winner_id: result.winner_id,
  winner_guest_id: result.winner_guest_id,
  winner_name: result.winner_name,              // ✅ ADD THIS
  telegram_handle: result.telegram_handle,      // ✅ ADD THIS
})
```

### Fix #3: Update Admin Table Display

**File:** `app/dashboard/admin/giveaways/giveaways-table.tsx`

**Option A: Fetch Winner Details (Recommended)**

Add to interface:
```typescript
interface Giveaway {
  id: number
  title: string
  status: string
  end_date: string
  participant_count: number
  max_participants: number | null
  is_featured: boolean
  winner_guest_id: string | null
  winner_telegram_handle: string | null  // ✅ ADD THIS
  winner_name: string | null             // ✅ ADD THIS
}
```

Update API query to join with participants:
```typescript
// In fetchGiveaways function
const response = await fetch('/api/v1/giveaway?per_page=100&include_winner=true')
```

Update display (Line 119-127):
```typescript
<TableCell>
  {giveaway.winner_guest_id ? (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className="gap-1 w-fit">
        <LucideIcon name="Trophy" className="h-3 w-3" />
        Winner
      </Badge>
      {giveaway.winner_telegram_handle && (
        <span className="text-sm font-mono text-muted-foreground">
          {giveaway.winner_telegram_handle}
        </span>
      )}
      {giveaway.winner_name && (
        <span className="text-xs text-muted-foreground">
          {giveaway.winner_name}
        </span>
      )}
    </div>
  ) : (
    <span className="text-sm text-muted-foreground">-</span>
  )}
</TableCell>
```

**Option B: Show in Toast (Quick Fix)**

Update handleSelectWinner (Line 72-91):
```typescript
if (response.ok && data.success) {
  toast.success('Winner selected!', {
    description: data.telegram_handle 
      ? `Winner: ${data.telegram_handle} (${data.winner_name})`
      : `Winner ID: ${data.winner_guest_id}`,
    duration: 10000,  // Show for 10 seconds
  })
  fetchGiveaways()
}
```

---

## Public Display (Giveaway Card)

**File:** `app/giveaways/giveaway-card.tsx`

Currently doesn't show winner. To add winner display:

```typescript
// Add to component
const hasWinner = giveaway.winner_guest_id !== null

// Add after the timer section (around line 150)
{hasWinner && (
  <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
    <div className="flex items-center gap-2">
      <Crown className="w-5 h-5 text-yellow-500" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">Winner</p>
        <p className="font-bold text-sm text-foreground">
          {giveaway.winner_telegram_handle || 'Selected'}
        </p>
      </div>
    </div>
  </div>
)}
```

---

## Winner Backlog / History

### Current State

Winners are stored in the `giveaways` table with:
- `winner_guest_id` - UUID reference
- `winner_selected_at` - Timestamp

### To Query Winner History:

```sql
-- Get all winners with their Telegram handles
SELECT 
  g.id,
  g.title,
  g.winner_selected_at,
  p.telegram_handle,
  p.guest_name,
  p.guest_email
FROM giveaways g
INNER JOIN giveaway_participants p 
  ON g.winner_guest_id = p.guest_id
WHERE g.winner_guest_id IS NOT NULL
ORDER BY g.winner_selected_at DESC;
```

### Create Winner History View (Optional)

```sql
CREATE OR REPLACE VIEW giveaway_winners AS
SELECT 
  g.id AS giveaway_id,
  g.title AS giveaway_title,
  g.winner_selected_at,
  g.status,
  p.telegram_handle,
  p.guest_name,
  p.guest_email,
  p.created_at AS participated_at
FROM giveaways g
INNER JOIN giveaway_participants p 
  ON g.winner_guest_id = p.guest_id
WHERE g.winner_guest_id IS NOT NULL;
```

Then query easily:
```sql
SELECT * FROM giveaway_winners ORDER BY winner_selected_at DESC;
```

---

## API Endpoint for Winner History

**Create:** `app/api/v1/giveaway/winners/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('giveaways')
      .select(`
        id,
        title,
        winner_selected_at,
        status,
        giveaway_participants!inner (
          telegram_handle,
          guest_name,
          guest_email
        )
      `)
      .not('winner_guest_id', 'is', null)
      .order('winner_selected_at', { ascending: false })
      .limit(100)
    
    if (error) throw error
    
    return NextResponse.json({ winners: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch winners' },
      { status: 500 }
    )
  }
}
```

---

## Summary

### ✅ What Works:

1. **Telegram Username Storage** - Stored in `giveaway_participants.telegram_handle`
2. **Unique Constraint** - One Telegram handle per giveaway
3. **Validation** - Format validation (5-32 chars, alphanumeric + underscore)
4. **Winner Selection** - Weighted random algorithm
5. **Winner Storage** - `winner_guest_id` stored in giveaways table
6. **Backlog** - All winners stored with timestamps

### ❌ What Needs Fixing:

1. **Database Function** - Add `telegram_handle` to return value
2. **API Response** - Include `telegram_handle` and `winner_name`
3. **Admin Table** - Display Telegram username instead of just "Selected"
4. **Public Display** - Show winner on giveaway cards (optional)
5. **Winner History Page** - Create dedicated page for winner backlog (optional)

### 🎯 Priority Fixes:

**High Priority:**
1. Update `select_giveaway_winner()` function to return `telegram_handle`
2. Update API to pass through `telegram_handle`
3. Update admin table to display winner's Telegram username

**Medium Priority:**
4. Add winner display to public giveaway cards
5. Create winner history/backlog page

**Low Priority:**
6. Add winner notification system (email/Telegram bot)
7. Add winner verification workflow

---

## Testing Checklist

After implementing fixes:

- [ ] Select a winner via admin dashboard
- [ ] Verify Telegram handle appears in success toast
- [ ] Check admin table shows Telegram username
- [ ] Query database to confirm winner data stored
- [ ] Test winner history query
- [ ] Verify public giveaway card shows winner (if implemented)
- [ ] Check winner can't participate again

---

**Status:** System is functional but needs UI improvements to display Telegram usernames properly.

**Recommendation:** Implement High Priority fixes immediately for better admin experience.
