# Thai Dessert Site -- Design System

> **Theme:** Green-White Thai Modern | **Style:** Apple Liquid Glass UI | **Audience:** Gen Z

---

## 1. Color Palette

### Primary Greens (Thai-Inspired Natural Greens)

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary | Pandan Green | `#2D8F5E` | Main brand, headings, nav active state |
| Primary Dark | Deep Bai Toey | `#1A6B42` | Hover states, footer, dark accents |
| Primary Light | Young Coconut | `#5ABD8C` | Secondary buttons, highlights, tags |
| Accent Bright | Lime Splash | `#34D399` | CTA hover glow, success states, micro-interactions |

### Whites & Neutrals

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Background | Coconut Milk | `#F7FBF8` | Page background |
| Surface White | Sticky Rice | `#FFFFFF` | Card surfaces, content areas |
| Muted Text | Sesame | `#5B6B62` | Captions, secondary text |
| Body Text | Dark Taro | `#1A2E23` | Body copy, paragraphs |
| Heading Text | Night Market | `#0F1F17` | H1-H3 headings |

### Glass Tints

| Role | Value | Usage |
|------|-------|-------|
| Glass White | `rgba(255, 255, 255, 0.55)` | Card backgrounds |
| Glass Green | `rgba(45, 143, 94, 0.08)` | Hero overlay, section tints |
| Glass Border | `rgba(255, 255, 255, 0.35)` | Card borders |
| Glass Shadow | `rgba(45, 143, 94, 0.10)` | Elevated card shadows |

### Accent Colors

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Warm Accent | Mango Gold | `#F0A500` | Price tags, star ratings, CTA secondary |
| Pink Accent | Sala Syrup | `#E8668B` | Badges, "popular" labels, playful highlights |
| Cream Accent | Kanom Chan | `#FFF8E7` | Alternating section backgrounds |

---

## 2. Typography

### Font Pairing

| Role | Font | Weight | Fallback |
|------|------|--------|----------|
| Thai Heading (Display) | **Noto Sans Thai** | 700 (Bold) | `sans-serif` |
| Thai Body | **Noto Sans Thai** | 300, 400, 500 | `sans-serif` |
| English Heading | **Outfit** | 600, 700 | `sans-serif` |
| English Body | **Nunito Sans** | 300, 400, 500, 600 | `sans-serif` |

**Why this pairing:** Noto Sans Thai is the most refined Thai web font with excellent readability. Outfit adds geometric modern character for English headings. Nunito Sans is rounded and friendly for body text -- matching the Gen Z playful vibe without being childish.

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;700&family=Outfit:wght@400;500;600;700&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&display=swap');
```

### Type Scale

| Element | Mobile | Desktop | Weight | Line Height |
|---------|--------|---------|--------|-------------|
| H1 (Hero) | 36px / 2.25rem | 64px / 4rem | 700 | 1.1 |
| H2 (Section) | 28px / 1.75rem | 44px / 2.75rem | 700 | 1.2 |
| H3 (Card Title) | 20px / 1.25rem | 24px / 1.5rem | 600 | 1.3 |
| H4 (Subsection) | 18px / 1.125rem | 20px / 1.25rem | 600 | 1.4 |
| Body Large | 17px / 1.0625rem | 18px / 1.125rem | 400 | 1.6 |
| Body | 16px / 1rem | 16px / 1rem | 400 | 1.6 |
| Caption | 13px / 0.8125rem | 14px / 0.875rem | 400 | 1.5 |
| Price Tag | 20px / 1.25rem | 24px / 1.5rem | 700 | 1.2 |
| Nav Link | 15px / 0.9375rem | 16px / 1rem | 500 | 1.0 |

---

## 3. Glass Effect CSS

### Base Glass Mixin (Card)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(45, 143, 94, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
```

### Hero Overlay

```css
.glass-hero-overlay {
  background: rgba(255, 255, 255, 0.30);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 32px;
  box-shadow:
    0 12px 48px rgba(45, 143, 94, 0.12),
    inset 0 2px 0 rgba(255, 255, 255, 0.5);
}
```

### Navigation Bar

```css
.glass-nav {
  background: rgba(255, 255, 255, 0.60);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.30);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}
```

### CTA Button (Glass Green)

```css
.glass-cta {
  background: rgba(45, 143, 94, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(90, 189, 140, 0.4);
  border-radius: 16px;
  box-shadow:
    0 4px 16px rgba(45, 143, 94, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  padding: 14px 32px;
  font-weight: 600;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-cta:hover {
  background: rgba(45, 143, 94, 0.95);
  box-shadow:
    0 8px 24px rgba(45, 143, 94, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}
```

### CTA Button Secondary (Glass White)

```css
.glass-cta-secondary {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(45, 143, 94, 0.25);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  color: #2D8F5E;
  padding: 14px 32px;
  font-weight: 600;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Tailwind Utility Classes (for implementation)

```js
// tailwind.config.js extend
{
  backdropBlur: {
    'glass': '20px',
    'glass-heavy': '40px',
    'glass-light': '12px',
  },
  borderRadius: {
    'glass': '24px',
    'glass-lg': '32px',
    'glass-btn': '16px',
    'glass-nav': '20px',
  },
  boxShadow: {
    'glass': '0 8px 32px rgba(45, 143, 94, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
    'glass-hover': '0 12px 40px rgba(45, 143, 94, 0.14), inset 0 1px 0 rgba(255,255,255,0.6)',
    'glass-hero': '0 12px 48px rgba(45, 143, 94, 0.12), inset 0 2px 0 rgba(255,255,255,0.5)',
  }
}
```

---

## 4. Component Specs

### 4.1 Navigation (Floating Glass Nav)

- **Position:** Fixed, floating with `top: 16px; left: 16px; right: 16px`
- **Style:** `glass-nav` effect
- **Content:** Logo (left) + Nav links (center) + CTA button (right)
- **Mobile:** Hamburger menu icon, slide-out glass panel from right
- **Z-index:** 50
- **Height:** 60px desktop / 52px mobile

### 4.2 Hero Section

- **Layout:** Full viewport height (`100vh`), centered content
- **Background:** Soft gradient -- `linear-gradient(135deg, #F7FBF8 0%, #E8F5EC 40%, #D1FAE5 100%)` with subtle organic blob shapes (CSS or SVG) floating in background
- **Content Container:** `glass-hero-overlay` containing:
  - Thai heading: Playful, large (H1)
  - English subheading below (Body Large)
  - Two CTA buttons side by side (Call + Website)
- **Decorative:** 2-3 soft green gradient blobs (absolute positioned, `filter: blur(80px)`) creating organic depth
- **Scroll indicator:** Small bouncing chevron at bottom

### 4.3 Menu / Gallery Section

- **Layout:** CSS Grid -- 2 columns on mobile, 3 columns on desktop
- **Gap:** 20px mobile / 28px desktop
- **Card:** `glass-card` effect containing:
  - Image: `border-radius: 16px`, top of card, `aspect-ratio: 4/3`, `object-fit: cover`
  - Name (Thai): H3, `font-weight: 600`
  - Short description: Caption size, muted text, 2 lines max
  - Price: `Price Tag` style, `color: #2D8F5E`, bold, aligned bottom-right
  - Optional "Popular" badge: `background: #E8668B`, white text, small pill shape
- **Padding inside card:** 16px mobile / 20px desktop
- **Max container width:** 1200px, centered

### 4.4 About Section

- **Layout:** Split -- image left (45%) + text right (55%) on desktop; stacked on mobile (image on top)
- **Background:** `#FFF8E7` (Kanom Chan cream) for visual separation
- **Image:** Rounded corners (24px), could show shop interior or chef
- **Text side:** H2 heading + body paragraphs, casual Thai tone
- **Accent:** A thin decorative line or small Thai pattern motif as separator
- **Padding:** 80px vertical desktop / 48px vertical mobile

### 4.5 CTA Section

- **Layout:** Centered, single column
- **Background:** Soft green gradient tint or `glass-hero-overlay` on gradient
- **Content:**
  - Catchy Thai heading (H2)
  - Short subtitle
  - Two buttons side by side:
    - **Call button:** `glass-cta` (primary green) with phone icon (Lucide `Phone`)
    - **Website button:** `glass-cta-secondary` (white glass) with external link icon (Lucide `ExternalLink`)
- **Button spacing:** 16px gap between buttons
- **Section padding:** 80px vertical desktop / 48px mobile

### 4.6 Footer

- **Style:** Minimal, dark green background (`#1A2E23`)
- **Content:** Logo + one-liner tagline, social links (icon-only), copyright
- **Layout:** Single row on desktop, stacked on mobile
- **Text color:** `rgba(255, 255, 255, 0.7)` for secondary, white for logo
- **Padding:** 40px vertical
- **Icons:** Lucide icons for social (Instagram, Facebook, Line)

---

## 5. Animation Ideas

### Scroll Reveal (All Sections)

```css
/* Elements start hidden and slide up on scroll */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Use `IntersectionObserver` to trigger `.visible` class. Stagger children with `transition-delay: 100ms` increments for cards.

### Glass Card Hover

```css
.glass-card {
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}
.glass-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 16px 48px rgba(45, 143, 94, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}
```

### Floating Background Blobs (Hero)

```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.05); }
  66% { transform: translate(-15px, 15px) scale(0.95); }
}
```

Use 2-3 blobs with different sizes, colors (`#5ABD8C`, `#34D399`, `#E8F5EC`), and `animation-delay` offsets.

### Nav Scroll Effect

Navbar becomes slightly more opaque and gains a stronger shadow as user scrolls:

```css
.glass-nav.scrolled {
  background: rgba(255, 255, 255, 0.80);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
}
```

### Button Press Feedback

```css
.glass-cta:active {
  transform: translateY(0px) scale(0.98);
  transition-duration: 100ms;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Mobile Responsive Strategy

### Breakpoints (Mobile-First)

| Breakpoint | Name | Target |
|------------|------|--------|
| Default | Mobile | 0 - 639px |
| `640px` | sm | Large phones |
| `768px` | md | Tablets |
| `1024px` | lg | Laptops |
| `1280px` | xl | Desktops |

### Layout Changes by Section

| Section | Mobile (< 768px) | Desktop (>= 1024px) |
|---------|-------------------|----------------------|
| Nav | Hamburger menu, full-width glass panel | Horizontal links + CTA button |
| Hero | Full-screen, text + buttons stacked vertically | Same but larger type, buttons side by side |
| Menu Grid | 2 columns, smaller cards | 3 columns, 28px gap |
| About | Stacked (image top, text bottom) | Split 45/55 side by side |
| CTA | Buttons stacked vertically, full-width | Buttons inline, centered |
| Footer | Stacked, centered text | Single row, spaced apart |

### Key Mobile Rules

- **Minimum touch target:** 44x44px for all interactive elements
- **Body font:** Never below 16px (prevents iOS zoom on input focus)
- **Container padding:** 20px horizontal on mobile, 32px on tablet, auto-centered on desktop
- **Max content width:** 1200px
- **Images:** `srcset` with responsive sizes, lazy loading via `loading="lazy"`
- **No horizontal scroll:** All containers use `max-width: 100%` and `overflow-x: hidden`

### Viewport Meta

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

---

## 7. Thai Modern Gen Z Notes

### What Makes It Feel "Thai Modern"

- **Color language:** Natural greens inspired by pandan leaf, banana leaf, young coconut -- not neon or forest. These are colors you see at a Thai market, not a tech company.
- **Typography warmth:** Noto Sans Thai is clean but still distinctly Thai. Paired with rounded English fonts (Outfit + Nunito Sans), it feels native, not translated.
- **Organic shapes:** Rounded corners (24px+), blob shapes, soft gradients. Thai aesthetics favor curves over hard edges.
- **Warm neutrals:** Cream (`#FFF8E7`) backgrounds reference traditional Thai dessert colors (kanom chan, thong yip).

### What Makes Gen Z Engage

- **Glass UI = premium feel:** Gen Z grew up with iOS. Frosted glass = modern, high quality, not "template website."
- **Playful but not childish:** Large bold headings, rounded shapes, soft colors. Fun without being cartoon-ish.
- **Casual Thai copy tone:** Use spoken Thai style, not formal. Example: "หวาน ละมุน ถูกใจ" not "ขนมไทยรสชาติดี" -- conversational, relatable. Short punchy lines.
- **Speed and smoothness:** Smooth scroll reveals and hover effects signal quality. Janky = amateur.
- **Mobile-native feel:** The site should feel like an app. Floating nav, rounded cards, smooth transitions.
- **Visual-first:** Large food images, minimal text blocks. Gen Z scans, they don't read essays.
- **Social proof friendly:** Make it screenshot-worthy. The glass cards with food photos are inherently shareable.
- **Tap-friendly:** Big buttons, clear CTAs. "โทรเลย" (Call now) and "ดูเมนู" (See menu) -- direct, no friction.

### Copy Tone Guidelines

- Keep it short and punchy
- Thai casual register, like talking to a friend
- OK to mix Thai and English naturally (e.g., "ขนมไทย premium")
- Avoid corporate-speak or overly formal language
- Use line breaks for rhythm, not long paragraphs

### Anti-Patterns to Avoid

- No emojis as UI icons (use Lucide SVG icons)
- No stock photo vibes -- use real food photography or illustrated style
- No parallax scrolling (feels dated, hurts performance)
- No auto-playing video or music
- No text over busy images without glass overlay for contrast
- No rainbow gradients or neon colors -- stay in the green/white/cream palette

---

## 8. Icon System

**Library:** Lucide Icons (https://lucide.dev)

| Use | Icon Name |
|-----|-----------|
| Phone CTA | `Phone` |
| Website CTA | `ExternalLink` |
| Menu/Hamburger | `Menu` |
| Close | `X` |
| Instagram | `Instagram` |
| Facebook | `Facebook` |
| Scroll down | `ChevronDown` |
| Popular badge | `Star` |
| Location | `MapPin` |

**Size:** 20px for inline, 24px for buttons, 20px for nav.

---

## 9. Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Background blobs | 0 | Decorative floating elements |
| Content | 10 | Cards, sections, text |
| Elevated cards | 20 | Hovered cards |
| Mobile menu overlay | 40 | Backdrop behind mobile nav |
| Navigation | 50 | Floating glass nav |

---

## 10. Performance Notes

- Use `will-change: transform` only on elements that animate
- `backdrop-filter` is GPU-accelerated but limit to visible cards (use `IntersectionObserver` to toggle)
- Images: WebP format, lazy loaded, with `aspect-ratio` set to prevent layout shift
- Fonts: `display=swap` in Google Fonts URL for fast text rendering
- Target: Lighthouse Performance > 90 on mobile
