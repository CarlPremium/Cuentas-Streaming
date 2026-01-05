# CKEditor Styles Guide

## Overview
The blog post page now fully supports all CKEditor custom styles with enhanced modern styling that matches the new blog design.

## Supported CKEditor Styles

### 1. **Custom Heading Styles**

#### Article Category
```html
<h3 class="category">TECHNOLOGY</h3>
```
- Uppercase text with letter spacing
- Muted color
- Perfect for post categories

#### Document Title
```html
<h2 class="document-title">Main Article Title</h2>
```
- Large, bold title (3rem)
- No border decoration
- Uses Oswald font

#### Document Subtitle
```html
<h3 class="document-subtitle">A compelling subtitle</h3>
```
- Smaller than title
- Muted color
- Great for subheadings

### 2. **Special Paragraph Styles**

#### Info Box
```html
<p class="info-box">Important information here!</p>
```
- Highlighted box with corner decorations
- Primary color theme
- Perfect for callouts and important notes

### 3. **Blockquote Styles**

#### Standard Blockquote
```html
<blockquote>
  <p>A meaningful quote</p>
</blockquote>
```
- Left accent border
- Italic text
- Muted background

#### Side Quote
```html
<blockquote class="side-quote">
  <p>A floating quote</p>
  <p>- Author Name</p>
</blockquote>
```
- Floats to the right
- Large decorative quotation mark
- Perfect for pull quotes

### 4. **Code Blocks**

#### Standard Code
```html
<pre><code>const hello = "world";</code></pre>
```
- Muted background
- Syntax highlighting support
- Rounded corners

#### Fancy Code (Dark)
```html
<pre class="fancy-code fancy-code-dark">
  <code>const hello = "world";</code>
</pre>
```
- Dark theme (#272822)
- macOS-style window controls
- Professional appearance

#### Fancy Code (Bright)
```html
<pre class="fancy-code fancy-code-bright">
  <code>const hello = "world";</code>
</pre>
```
- Light theme
- macOS-style window controls
- Clean appearance

### 5. **Text Decorations**

#### Marker (Highlight)
```html
<span class="marker">highlighted text</span>
```
- Yellow/primary color background
- Perfect for emphasis

#### Spoiler
```html
<span class="spoiler">hidden content</span>
```
- Black background initially
- Reveals on hover
- Great for spoilers

### 6. **Standard Elements**

All standard HTML elements are beautifully styled:

- **Headings** (h1-h6): Proper hierarchy with accent colors
- **Paragraphs**: Justified text with good spacing
- **Links**: Primary color with smooth hover effects
- **Images**: Rounded corners, shadows, hover zoom
- **Lists**: Colored markers, proper spacing
- **Tables**: Striped rows, hover effects
- **Horizontal Rules**: Gradient lines

## How to Use in Editor

1. **Access Styles**: Click the "Style" dropdown in the editor toolbar
2. **Select Style**: Choose from predefined styles:
   - Article category
   - Title
   - Subtitle
   - Info box
   - Side quote
   - Marker
   - Spoiler
   - Code (dark)
   - Code (bright)

3. **Apply**: Select text/element and click the style

## Database Storage

All styles are stored as HTML in the database:
- **Field**: `posts.content` (text)
- **Format**: HTML with class names
- **Example**:
```html
<h3 class="category">TECHNOLOGY</h3>
<h2 class="document-title">Amazing Article</h2>
<p>Regular paragraph content...</p>
<p class="info-box">Important note!</p>
```

## Display on Post Page

The post page automatically applies all styles:

1. **CSS Import**: `ckeditor5.css` + `blog-post.css`
2. **Class**: `.ck-content` wrapper
3. **Rendering**: HTML content with preserved classes
4. **Styling**: All custom styles are theme-aware

## Theme Compatibility

All styles use CSS variables for theme support:
- `--primary` - Main brand color
- `--foreground` - Text color
- `--background` - Background color
- `--muted` - Subtle backgrounds
- `--border` - Divider lines

This ensures styles work in both light and dark modes!

## Responsive Behavior

All styles are fully responsive:
- **Mobile**: Adjusted font sizes, full-width side quotes
- **Tablet**: Optimized spacing
- **Desktop**: Full styling with all effects

## Best Practices

### For Content Creators

1. **Use Headings Properly**: Follow hierarchy (h2 → h3 → h4)
2. **Info Boxes**: Use sparingly for important callouts
3. **Side Quotes**: Great for testimonials or key points
4. **Code Blocks**: Use fancy code for better presentation
5. **Images**: Add alt text and captions

### For Developers

1. **Don't Override**: Styles are scoped to `.ck-content`
2. **Theme Variables**: Use CSS variables for consistency
3. **Test Responsive**: Check all breakpoints
4. **Preserve Classes**: Don't strip HTML classes from content

## Examples

### Article with All Styles

```html
<h3 class="category">TECHNOLOGY</h3>
<h2 class="document-title">The Future of Web Development</h2>
<h3 class="document-subtitle">How modern tools are changing the game</h3>

<p>Regular paragraph with <span class="marker">highlighted text</span>.</p>

<p class="info-box">
  Important: This article contains cutting-edge information!
</p>

<blockquote class="side-quote">
  <p>The web is evolving faster than ever</p>
  <p>- Industry Expert</p>
</blockquote>

<h2>Main Section</h2>
<p>Content here...</p>

<pre class="fancy-code fancy-code-dark">
  <code>const future = await buildAmazingThings();</code>
</pre>
```

## Troubleshooting

**Styles not showing?**
- Verify `ckeditor5.css` is imported
- Check `blog-post.css` is loaded
- Ensure `.ck-content` class is on wrapper

**Colors look wrong?**
- Check theme CSS variables
- Verify dark/light mode settings

**Responsive issues?**
- Test on actual devices
- Check browser dev tools
- Verify viewport meta tag

## Future Enhancements

Potential additions:
- [ ] More color schemes for info boxes
- [ ] Additional code block themes
- [ ] Custom table styles
- [ ] Gallery layouts
- [ ] Video embed styling
- [ ] Social media embeds
- [ ] Interactive elements

## Summary

✅ All CKEditor styles fully supported
✅ Theme-aware with CSS variables
✅ Fully responsive design
✅ Enhanced with modern effects
✅ Database stores HTML with classes
✅ Post page renders perfectly
✅ No data migration needed

Your content will look amazing! 🎨
