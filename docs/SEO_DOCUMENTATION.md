# SEO Documentation - Complete Guide

Complete guide for SEO, social media optimization, and analytics tracking for Cuentas Streaming blog platform.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Overview](#overview)
3. [Pages with SEO](#pages-with-seo)
4. [How Blog Post SEO Works](#how-blog-post-seo-works)
5. [Social Media Previews](#social-media-previews)
6. [Tracking & Analytics](#tracking--analytics)
7. [Setup Instructions](#setup-instructions)
8. [Testing & Validation](#testing--validation)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 5-Minute Setup

**Step 1: Add Environment Variables**
```env
# Required
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional (recommended for tracking)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```

**Step 2: Create OG Image**
1. Create 1200x630px image with your branding
2. Save as `/public/og-image.png`

**Step 3: Deploy & Test**
1. Deploy to production
2. Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
3. Done! ✅

---

## Overview

### What's Included

Your blog platform has **enterprise-level SEO** with:

✅ **Complete meta tags** on all public pages
✅ **Open Graph tags** for Facebook, LinkedIn, WhatsApp, Telegram
✅ **Twitter Cards** for Twitter/X
✅ **JSON-LD structured data** for Google rich snippets
✅ **Facebook Pixel** integration (ready to activate)
✅ **Google Analytics** integration (ready to activate)
✅ **Google Tag Manager** integration (ready to activate)
✅ **Automatic sitemap** generation
✅ **Robots.txt** configuration
✅ **Mobile-optimized** metadata

### Coverage Statistics

| Category | Count | With SEO | Coverage |
|----------|-------|----------|----------|
| Public Pages | 8 | 8 | 100% ✅ |
| Private Pages | 16+ | 0 | Correct ✅ |
| Blog Posts | ∞ | ∞ | 100% ✅ |
| User Profiles | ∞ | ∞ | 100% ✅ |

---

## Pages with SEO

### Public Pages (SEO Enabled)

#### 1. Home Page `/`
**Metadata:**
- Title: "Inicio | Cuentas Streaming"
- Description: "Plataforma de contenido y sorteos..."
- Keywords: blog, contenido, sorteos, giveaways
- JSON-LD: Website schema

#### 2. Posts List `/posts`
**Dynamic Metadata:**
- Default: "Todas las Publicaciones | Cuentas Streaming"
- With tag: "Publicaciones con #javascript | Cuentas Streaming"
- With search: "Búsqueda: tutorial | Cuentas Streaming"

#### 3. Search Page `/search`
**Dynamic Metadata:**
- Default: "Buscar | Cuentas Streaming"
- With query: "Resultados de búsqueda: react | Cuentas Streaming"

#### 4. User Profile `/{username}`
**Dynamic Metadata:**
- Title: "{Full Name} | Cuentas Streaming"
- Description: User bio
- Image: User avatar
- JSON-LD: Person schema

#### 5. Blog Post `/{username}/{slug}`
**Dynamic Metadata:**
- Title: "{Post Title} | Cuentas Streaming"
- Description: Post description
- Keywords: Post keywords
- Image: Post thumbnail
- JSON-LD: BlogPosting schema
- Article metadata: Author, published date, modified date

#### 6. User Favorites `/{username}/favorites`
**Dynamic Metadata:**
- Title: "{username} Favorites | Cuentas Streaming"
- Description: User bio

#### 7. Privacy Policy `/policy/privacy`
**Static Metadata:**
- Title: "Política de Privacidad | Cuentas Streaming"
- Description: Privacy policy description

#### 8. Terms & Conditions `/policy/terms`
**Static Metadata:**
- Title: "Términos y Condiciones | Cuentas Streaming"
- Description: Terms description

### Private Pages (No SEO - Correct)

These pages should NOT be indexed:
- `/auth/*` - Authentication pages
- `/dashboard/*` - User dashboard
- `/api/*` - API routes

---

## How Blog Post SEO Works

### Step-by-Step Flow

**1. User Creates Blog Post:**
```
Title: "10 Tips para Crear Contenido Viral"
Description: "Descubre las estrategias probadas..."
Keywords: "contenido viral, redes sociales, marketing"
Thumbnail: viral-content.jpg (1200x630px)
```

**2. System Generates Metadata:**
```html
<title>10 Tips para Crear Contenido Viral | Cuentas Streaming</title>
<meta name="description" content="Descubre las estrategias probadas...">
<meta name="keywords" content="contenido viral, redes sociales, marketing">
<meta property="og:title" content="10 Tips para Crear Contenido Viral">
<meta property="og:description" content="Descubre las estrategias probadas...">
<meta property="og:image" content="https://yourdomain.com/uploads/viral-content.jpg">
<meta property="og:url" content="https://yourdomain.com/username/post-slug">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "10 Tips para Crear Contenido Viral",
  "author": {"@type": "Person", "name": "username"},
  "datePublished": "2024-12-27"
}
</script>
```

**3. What Gets Extracted:**

| Field | Used For | Example |
|-------|----------|---------|
| `title` | All meta tags | "10 Tips para Crear Contenido Viral" |
| `description` | Meta description, OG description | "Descubre las estrategias probadas..." |
| `keywords` | Meta keywords, JSON-LD | "contenido viral, redes sociales..." |
| `thumbnail_url` | OG image, Twitter image | "https://yourdomain.com/uploads/image.jpg" |
| `slug` | URL generation | "10-tips-para-crear-contenido-viral" |
| `date` | Published time | "2024-12-27T10:30:00Z" |
| `author.username` | Author attribution | "johndoe" |

**4. Fallbacks:**
- No thumbnail → Uses `/og-image.png`
- No description → Uses site description
- No keywords → Still works (optional)

---

## Social Media Previews

### Facebook / LinkedIn / WhatsApp / Telegram

When someone shares your link:

```
┌─────────────────────────────────────┐
│  [Image: 1200x630px]                │
├─────────────────────────────────────┤
│  Cuentas Streaming                  │
│  Post Title Here                    │
│  Post description appears here...   │
│  yourdomain.com                     │
└─────────────────────────────────────┘
```

**What They Read:**
- `og:title` - Post title
- `og:description` - Post description
- `og:image` - Thumbnail image
- `og:url` - Post URL
- `og:type` - "article"
- `og:site_name` - "Cuentas Streaming"

### Twitter / X

```
┌─────────────────────────────────────┐
│  [Large Image Card]                 │
├─────────────────────────────────────┤
│  Post Title Here                    │
│  Post description appears here...   │
│  yourdomain.com                     │
└─────────────────────────────────────┘
```

**What They Read:**
- `twitter:card` - "summary_large_image"
- `twitter:title` - Post title
- `twitter:description` - Post description
- `twitter:image` - Thumbnail image

### Discord

```
┌─────────────────────────────────────┐
│  Cuentas Streaming                  │
│  Post Title Here                    │
│  Post description appears here...   │
│  [Embedded Image]                   │
└─────────────────────────────────────┘
```

### Google Search Results

**Regular Result:**
```
Post Title | Cuentas Streaming
https://yourdomain.com/username/post-slug
Post description appears here with relevant keywords...
```

**Rich Result (with structured data):**
```
┌─────────────────────────────────────┐
│  📄 Article                         │
│  Post Title | Cuentas Streaming    │
│  By username · Dec 27, 2024        │
│  Post description appears here...   │
│  https://yourdomain.com/...         │
│  [Thumbnail]                        │
└─────────────────────────────────────┘
```

---

## Tracking & Analytics

### Facebook Pixel

**Setup:**
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create pixel and copy ID
3. Add to environment: `NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_id`

**What Gets Tracked:**
- Page views
- User sessions
- Navigation patterns
- Custom events (can be added)

**Verify:**
- Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- Visit your site
- Should show "Pixel found" with PageView event

### Google Analytics

**Setup:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create GA4 property and copy Measurement ID
3. Add to environment: `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX`

**What Gets Tracked:**
- Page views
- User demographics
- Traffic sources
- Session duration
- Bounce rate

**Verify:**
- Go to Google Analytics → Realtime
- Visit your site
- Should see active users

### Google Tag Manager

**Setup:**
1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Create container and copy Container ID
3. Add to environment: `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX`

**Benefits:**
- Manage all tracking codes in one place
- Add/remove tags without code changes
- Advanced event tracking

---

## Setup Instructions

### Environment Variables

Add to your `.env` file and deployment platform:

```env
# Required
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Cuentas Streaming

# Optional - Tracking
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```

### OG Image Creation

**Specifications:**
- Dimensions: 1200 x 630 pixels
- Format: PNG or JPG
- File size: < 1MB (ideally < 300KB)
- Location: `/public/og-image.png`

**What to Include:**
1. Your logo
2. Site name: "Cuentas Streaming"
3. Tagline: "Plataforma de Contenido y Sorteos"
4. Brand colors
5. Visual elements

**Tools:**
- [Canva](https://www.canva.com) - Free templates
- [Figma](https://www.figma.com) - Design tool
- [OG Image Generator](https://og-image.vercel.app) - Automated

### Update Twitter Handle

Edit `lib/seo/metadata.ts`:
```typescript
// Line 95-96
creator: '@your_twitter_handle',
site: '@your_twitter_handle',
```

### Update Robots.txt

Edit `public/robots.txt`:
```txt
# Change this line to your actual domain
Sitemap: https://yourdomain.com/sitemap.xml
```

---

## Testing & Validation

### Facebook Sharing Debugger

1. Go to [Facebook Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your URL
3. Click "Scrape Again" to refresh cache
4. Check for errors

### Twitter Card Validator

1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your URL
3. Preview how it looks

### LinkedIn Post Inspector

1. Go to [LinkedIn Inspector](https://www.linkedin.com/post-inspector/)
2. Enter your URL
3. Check preview

### Google Rich Results Test

1. Go to [Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your URL
3. Check structured data

### Lighthouse SEO Audit

```bash
# Run in Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "SEO" category
4. Click "Analyze page load"
```

**Target Score:** 90+

---

## Best Practices

### Title Tags

✅ **Good:**
```
"Cómo crear contenido viral | Cuentas Streaming"
```

❌ **Bad:**
```
"Post | Blog"
```

**Rules:**
- 50-60 characters
- Include keywords
- Unique per page
- Brand at the end

### Meta Descriptions

✅ **Good:**
```
"Aprende a crear contenido viral con estos 10 consejos probados. Aumenta tu alcance y engagement en redes sociales."
```

❌ **Bad:**
```
"Blog post about content"
```

**Rules:**
- 150-160 characters
- Include call-to-action
- Unique per page
- Natural language

### Keywords

✅ **Good:**
```
"contenido viral, redes sociales, marketing digital, engagement, alcance"
```

❌ **Bad:**
```
"viral, social, marketing"
```

**Rules:**
- 5-10 keywords
- Relevant to content
- Natural phrases
- Long-tail keywords

### Images

**Requirements:**
- Minimum: 1200x630px
- Format: JPG or PNG (WebP for better performance)
- Size: < 1MB (recommended < 200KB)
- Alt text: Descriptive
- File name: SEO-friendly (e.g., `contenido-viral-tips.jpg`)

### URLs

✅ **Good:**
```
/username/como-crear-contenido-viral
```

❌ **Bad:**
```
/username/post?id=123&ref=abc
```

**Rules:**
- Lowercase
- Hyphens (not underscores)
- Descriptive
- Short

### Content Optimization

**For Best SEO:**
1. Write 500+ word posts
2. Use headings (H2, H3)
3. Add images with alt text
4. Include internal links (2-5 per post)
5. Update content regularly
6. Use keywords naturally
7. Add meta description
8. Optimize images

---

## Troubleshooting

### Problem: Social media shows old image

**Solution:**
1. Go to [Facebook Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your post URL
3. Click "Scrape Again"
4. Cache cleared!

### Problem: No preview appears

**Possible causes:**
- Post is not published (still draft)
- Thumbnail URL is not accessible
- Image size is too small (< 200x200px)
- Using HTTP instead of HTTPS

**Solution:**
- Verify post is published
- Check thumbnail URL is accessible
- Ensure image is > 200x200px
- Use HTTPS

### Problem: Wrong title/description

**Solution:**
- Edit post in dashboard
- Update title/description
- Save changes
- Clear social media cache

### Problem: Tracking not working

**Solution:**
- Verify tracking IDs are set in environment variables
- Check browser console for errors
- Verify scripts are loading
- Test with browser extensions (Facebook Pixel Helper, etc.)

---

## Checklist

### Before Launch

- [ ] Set `NEXT_PUBLIC_APP_URL` in production
- [ ] Add tracking IDs (optional but recommended)
- [ ] Create OG image (1200x630px)
- [ ] Update Twitter handle in code
- [ ] Update robots.txt sitemap URL
- [ ] Test all social media previews
- [ ] Verify structured data
- [ ] Run Lighthouse audit (score 90+)

### After Launch

- [ ] Submit sitemap to Google Search Console
- [ ] Verify Facebook Pixel is firing
- [ ] Check Google Analytics data
- [ ] Test social sharing on all platforms
- [ ] Monitor analytics for first week
- [ ] Optimize based on data

---

## Key Metrics to Track

### Traffic
- Page views
- Unique visitors
- Bounce rate
- Session duration

### Engagement
- Comments
- Shares
- Favorites
- Time on page

### Conversions
- Signups
- Post creations
- Giveaway participations

### SEO
- Organic traffic
- Keyword rankings
- Backlinks
- Domain authority

---

## Summary

### What's Automatic

For every blog post:
1. ✅ Meta tags generated automatically
2. ✅ Open Graph tags created
3. ✅ Twitter Cards configured
4. ✅ JSON-LD structured data added
5. ✅ Sitemap updated
6. ✅ Social media previews work
7. ✅ Google can index
8. ✅ Analytics track visits

### What You Control

1. 📝 Post title (affects all metadata)
2. 📝 Post description (affects all previews)
3. 🖼️ Thumbnail image (affects all social media)
4. 🏷️ Keywords (affects SEO)
5. 📊 Tracking IDs (affects analytics)

### What You Don't Need to Worry About

- ❌ Meta tag creation
- ❌ Open Graph setup
- ❌ Twitter Card configuration
- ❌ Structured data coding
- ❌ Sitemap management
- ❌ Social media integration

**Everything just works!** 🚀

---

## Resources

### Documentation
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google SEO Guide](https://developers.google.com/search/docs)
- [Facebook Pixel Docs](https://developers.facebook.com/docs/meta-pixel)
- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)

### Tools
- [Schema.org](https://schema.org) - Structured data reference
- [Open Graph Protocol](https://ogp.me) - OG tags reference
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

### Validation Tools
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Inspector](https://www.linkedin.com/post-inspector/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev)

---

**Last Updated:** December 2024
**Version:** 1.0
**Status:** Production Ready ✅
