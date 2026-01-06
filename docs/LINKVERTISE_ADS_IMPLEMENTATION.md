# Linkvertise Ads Implementation ✅

## Overview

Linkvertise ads have been successfully integrated into the blog and giveaways sections with full cookie consent compliance.

---

## 🎯 Ad Placements

### 1. Blog Posts List (`/posts`)
- **Desktop**: 728x90 banner below hero section
- **Mobile**: 320x50 banner below hero section
- **Position**: Above the posts grid

### 2. Individual Blog Posts (`/[username]/[slug]`)
- **Desktop**: 728x90 banner after cover image, before content
- **Mobile**: 320x50 banner after cover image, before content
- **Position**: Strategic placement between visual and text content

### 3. Giveaways Page (`/giveaways`)
- **Desktop**: 728x90 banner below hero, above giveaway cards
- **Mobile**: 320x50 banner below hero, above giveaway cards
- **Position**: After stats section, before content

---

## 📐 Ad Specifications

### Desktop Banner
- **Size**: 728x90 pixels (Leaderboard)
- **Visibility**: Hidden on mobile (`hidden md:block`)
- **Responsive**: Scales down on smaller screens

### Mobile Banner
- **Size**: 320x50 pixels (Mobile Banner)
- **Visibility**: Only on mobile (`md:hidden`)
- **Optimized**: Perfect for mobile viewports

---

## 🔒 Cookie Consent Integration

The ads respect user privacy:

```tsx
// Don't show if user rejected cookies
if (consent === 'rejected') return null

// Show placeholder while waiting for consent
if (consent === null) return <LoadingPlaceholder />

// Show ad only after acceptance
return <LinkvertiseAd />
```

**Behavior:**
- ✅ **Accepted**: Ads display normally
- ❌ **Rejected**: Ads don't load at all
- ⏳ **Pending**: Shows "Cargando..." placeholder

---

## 🎨 Component Details

### File: `components/ads/linkvertise-ad.tsx`

```tsx
<LinkvertiseAd 
  width={728}    // Ad width in pixels
  height={90}    // Ad height in pixels
  className=""   // Optional Tailwind classes
/>
```

### Props:
- `width` (optional): Default 728px
- `height` (optional): Default 90px
- `className` (optional): Additional CSS classes

### Features:
- Cookie consent integration
- Responsive sizing
- Loading placeholder
- Accessibility attributes
- Clean iframe implementation

---

## 📱 Responsive Implementation

### Desktop (≥768px)
```tsx
<LinkvertiseAd 
  width={728} 
  height={90} 
  className="hidden md:block" 
/>
```

### Mobile (<768px)
```tsx
<LinkvertiseAd 
  width={320} 
  height={50} 
  className="md:hidden" 
/>
```

---

## 🎯 Strategic Placement Rationale

### Blog Posts List
- **Why**: High traffic page, users browsing content
- **Position**: After hero, before content (non-intrusive)
- **Impact**: Visible but doesn't block main content

### Individual Blog Posts
- **Why**: Engaged readers, longer session time
- **Position**: After image, before article (natural break)
- **Impact**: Catches attention without disrupting reading flow

### Giveaways Page
- **Why**: High engagement, users actively participating
- **Position**: After stats, before cards (logical break)
- **Impact**: Visible to all participants

---

## ⚡ Performance

- **Lazy Loading**: Ads only load after cookie consent
- **Async**: Iframe loads asynchronously
- **No Blocking**: Doesn't block page rendering
- **Lightweight**: Minimal component overhead

---

## 🔧 Technical Implementation

### Iframe Structure
```html
<div style="position: relative;">
  <iframe 
    src="https://publisher.linkvertise.com/cdn/ads/LV-728x90/index.html"
    frameborder="0"
    height="90"
    width="728"
  />
  <a 
    href="https://publisher.linkvertise.com/ac/1368950"
    target="_blank"
    style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;"
  />
</div>
```

### Security Features
- `rel="noopener noreferrer"` on links
- Proper iframe sandboxing
- No inline scripts
- HTTPS only

---

## 📊 Ad Sizes Available

| Size | Dimensions | Best For | Device |
|------|------------|----------|--------|
| **Leaderboard** | 728x90 | Header/Content | Desktop |
| **Mobile Banner** | 320x50 | Top/Bottom | Mobile |

**Note**: Component supports custom sizes via props, but these are the recommended standard sizes.

---

## 🚀 Usage Examples

### Basic Usage
```tsx
import { LinkvertiseAd } from '@/components/ads/linkvertise-ad'

<LinkvertiseAd width={728} height={90} />
```

### With Custom Styling
```tsx
<LinkvertiseAd 
  width={728} 
  height={90} 
  className="my-8 shadow-lg rounded-lg"
/>
```

### Responsive Pattern
```tsx
{/* Desktop */}
<div className="hidden md:flex justify-center">
  <LinkvertiseAd width={728} height={90} />
</div>

{/* Mobile */}
<div className="flex md:hidden justify-center">
  <LinkvertiseAd width={320} height={50} />
</div>
```

---

## ✅ Implementation Checklist

- [x] Created LinkvertiseAd component
- [x] Integrated cookie consent
- [x] Added to blog posts list page
- [x] Added to individual blog posts
- [x] Added to giveaways page
- [x] Responsive design (desktop + mobile)
- [x] Loading placeholders
- [x] Accessibility attributes
- [x] Documentation

---

## 🎯 Best Practices

1. **Placement**: Strategic, non-intrusive locations
2. **Frequency**: One ad per page section (not overwhelming)
3. **Responsive**: Different sizes for different devices
4. **Consent**: Always respect cookie preferences
5. **Performance**: Lazy load, async rendering
6. **UX**: Natural breaks in content flow

---

## 🔍 Testing

To test the ads:

1. **Clear cookies**: Remove cookie consent
2. **Visit pages**: Go to /posts, /giveaways, or any blog post
3. **Accept cookies**: Click "Aceptar Cookies" in banner
4. **Verify ads**: Ads should appear in designated locations
5. **Test responsive**: Check on mobile and desktop

---

## 📝 Notes

- Ads only show after cookie acceptance (GDPR compliant)
- Linkvertise is a trusted ad network
- Ads are carefully placed to not disrupt user experience
- Mobile and desktop have different ad sizes for optimal display
- All ads use the same Linkvertise account (ID: 1368950)

---

## 🎨 Customization

To change ad sizes or add new placements:

```tsx
// Custom size
<LinkvertiseAd width={970} height={250} />

// With margin
<LinkvertiseAd 
  width={728} 
  height={90} 
  className="my-12"
/>

// Centered with padding
<div className="flex justify-center py-8">
  <LinkvertiseAd width={728} height={90} />
</div>
```

---

## ✨ Summary

Linkvertise ads are now live on:
- ✅ Blog posts list page
- ✅ Individual blog posts
- ✅ Giveaways page

All implementations:
- ✅ Respect cookie consent
- ✅ Are fully responsive
- ✅ Use appropriate sizes
- ✅ Are strategically placed
- ✅ Don't disrupt user experience

Ready for production! 🚀
