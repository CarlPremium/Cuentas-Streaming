# Linkvertise Ads - Quick Reference

## ✅ Implementation Complete

Linkvertise ads are now integrated with cookie consent on blog and giveaways pages.

---

## 📍 Where Ads Appear

### 1. `/posts` - Blog Posts List
```
┌─────────────────────────────┐
│         Hero Section        │
├─────────────────────────────┤
│      [728x90 AD HERE]       │  ← Desktop
│      [320x50 AD HERE]       │  ← Mobile
├─────────────────────────────┤
│     Blog Posts Grid         │
│  ┌────┐ ┌────┐ ┌────┐      │
│  │Post│ │Post│ │Post│      │
│  └────┘ └────┘ └────┘      │
└─────────────────────────────┘
```

### 2. `/[username]/[slug]` - Individual Blog Post
```
┌─────────────────────────────┐
│      Post Title & Meta      │
├─────────────────────────────┤
│      Cover Image            │
├─────────────────────────────┤
│      [728x90 AD HERE]       │  ← Desktop
│      [320x50 AD HERE]       │  ← Mobile
├─────────────────────────────┤
│      Article Content        │
│      Lorem ipsum dolor...   │
│                             │
└─────────────────────────────┘
```

### 3. `/giveaways` - Giveaways Page
```
┌─────────────────────────────┐
│      Hero + Stats           │
├─────────────────────────────┤
│      [728x90 AD HERE]       │  ← Desktop
│      [320x50 AD HERE]       │  ← Mobile
├─────────────────────────────┤
│    Giveaway Cards Grid      │
│  ┌────┐ ┌────┐ ┌────┐      │
│  │Card│ │Card│ │Card│      │
│  └────┘ └────┘ └────┘      │
└─────────────────────────────┘
```

---

## 🎯 Ad Sizes

| Device | Size | Dimensions |
|--------|------|------------|
| 💻 Desktop | Leaderboard | 728 x 90 px |
| 📱 Mobile | Mobile Banner | 320 x 50 px |

---

## 🔒 Cookie Consent Flow

```
User visits page
      ↓
Cookie banner appears
      ↓
   User choice?
      ↓
  ┌───┴───┐
  ↓       ↓
Accept  Reject
  ↓       ↓
Show    Hide
Ads     Ads
```

---

## 💻 Component Usage

```tsx
import { LinkvertiseAd } from '@/components/ads/linkvertise-ad'

// Desktop
<LinkvertiseAd width={728} height={90} className="hidden md:block" />

// Mobile
<LinkvertiseAd width={320} height={50} className="md:hidden" />
```

---

## 📊 Current Implementation

| Page | Location | Desktop | Mobile |
|------|----------|---------|--------|
| `/posts` | Below hero | 728x90 | 320x50 |
| `/[username]/[slug]` | After cover | 728x90 | 320x50 |
| `/giveaways` | Below stats | 728x90 | 320x50 |

---

## ✨ Features

- ✅ Cookie consent integration
- ✅ Responsive (desktop + mobile)
- ✅ Loading placeholders
- ✅ Non-intrusive placement
- ✅ GDPR compliant
- ✅ Performance optimized

---

## 🚀 Testing

1. Clear browser cookies
2. Visit `/posts`, `/giveaways`, or any blog post
3. Accept cookies in banner
4. Ads should appear

---

## 📝 Files Modified

- ✅ `components/ads/linkvertise-ad.tsx` (new)
- ✅ `app/posts/page.tsx` (added ad)
- ✅ `app/giveaways/page.tsx` (added ad)
- ✅ `app/[username]/[slug]/page.tsx` (added ad)
- ✅ `app/layout.tsx` (removed old PopAds)

---

## 🎨 Styling

Ads are centered with proper spacing:
- Desktop: `my-8` (margin top/bottom)
- Mobile: `my-6` (slightly less margin)
- Responsive: `hidden md:block` / `md:hidden`

---

Ready to monetize! 🎉
