# OG Image Guide

## Required File

Create an image file named `og-image.png` in this directory (`/public/`).

## Specifications

- **Dimensions:** 1200 x 630 pixels
- **Format:** PNG or JPG
- **File size:** < 1MB (ideally < 300KB)
- **Aspect ratio:** 1.91:1

## What to Include

Your OG image should contain:

1. **Logo** - Your brand logo
2. **Site Name** - "Cuentas Streaming"
3. **Tagline** - "Plataforma de Contenido y Sorteos"
4. **Visual Elements** - Icons, illustrations, or photos
5. **Brand Colors** - Consistent with your site theme

## Design Tips

### Layout
- Keep important content in the center
- Leave margins (safe zone: 1200x600px)
- Use high contrast for readability
- Avoid small text (minimum 60px font size)

### Colors
- Use your brand colors
- Ensure good contrast
- Consider dark mode users
- Test on different backgrounds

### Text
- Maximum 2-3 lines of text
- Large, bold fonts
- High contrast with background
- Avoid fancy fonts

## Tools to Create OG Image

### Free Tools
1. **Canva** - https://www.canva.com
   - Search for "Open Graph" templates
   - Customize with your branding
   - Download as PNG

2. **Figma** - https://www.figma.com
   - Create 1200x630px frame
   - Design your image
   - Export as PNG

3. **Photopea** - https://www.photopea.com
   - Free Photoshop alternative
   - Create new project (1200x630px)
   - Design and export

### Online Generators
1. **OG Image Generator** - https://og-image.vercel.app
2. **Social Image Generator** - https://www.bannerbear.com/tools/social-image-generator/
3. **Meta Tags** - https://metatags.io

## Example Design

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Logo]                                         │
│                                                 │
│         Cuentas Streaming                       │
│                                                 │
│    Plataforma de Contenido y Sorteos          │
│                                                 │
│         [Icon] [Icon] [Icon]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Testing

After creating your OG image:

1. Place it in `/public/og-image.png`
2. Deploy your site
3. Test with:
   - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Inspector](https://www.linkedin.com/post-inspector/)

## Current Status

⚠️ **Action Required:** Create and add `og-image.png` to this directory.

The site will use a default image until you add your custom OG image.

## Quick Start Template

Use this Canva template as a starting point:
1. Go to Canva
2. Search "Open Graph Image"
3. Choose a template
4. Customize with:
   - Text: "Cuentas Streaming"
   - Subtitle: "Plataforma de Contenido y Sorteos"
   - Your brand colors
5. Download as PNG (1200x630px)
6. Rename to `og-image.png`
7. Place in `/public/` directory
