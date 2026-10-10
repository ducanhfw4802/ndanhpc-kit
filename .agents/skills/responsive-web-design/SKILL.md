---
name: responsive-web-design
description: Modern responsive web design, fluid typography, container queries, and cross-device layout strategies. Use when building adaptive web layouts across mobile, tablet, laptop, and ultra-wide screens, implementing fluid typography and spacing with clamp(), designing responsive navigation, or eliminating layout shifts (CLS).
when_to_use: "When building adaptive web layouts across mobile, tablet, laptop, and ultra-wide screens, implementing fluid typography and spacing with clamp(), designing responsive navigation, or eliminating layout shifts (CLS)."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# Modern Responsive Web Design & Layout Engineering

Build high-performance, fluid, and robust responsive interfaces that adapt smoothly from 320px mobile viewports up to 4K desktop monitors.

---

## 1. Modern Layout Engines

### A. Intrinsic Responsive Grids (No Breakpoints Needed)
Instead of hardcoded media query breakpoints for cards, use intrinsic CSS Grid:
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}
```

### B. Container Queries (`@container`)
Base component styles on the size of their parent container rather than the global viewport width:
```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 500px) {
  .card {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
```

### C. Subgrid for Aligned Cards
Keep card headers, bodies, and footers aligned across unequal text lengths:
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-template-rows: auto 1fr auto;
}
.card {
  grid-row: span 3;
  display: grid;
  grid-template-rows: subgrid;
}
```

---

## 2. Fluid Typography & Spacing (`clamp()`)

Avoid sudden jumps between viewport sizes. Use mathematical fluid interpolation:
```css
:root {
  /* Fluid Body: 16px at 375px up to 18px at 1440px */
  --font-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  
  /* Fluid H1: 32px at 375px up to 56px at 1440px */
  --font-h1: clamp(2rem, 1.4rem + 2.5vw, 3.5rem);
  
  /* Fluid Spacing */
  --space-page-x: clamp(1rem, 4vw, 4rem);
  --space-section-y: clamp(2.5rem, 6vw, 6rem);
}
```

---

## 3. Standard Breakpoint Strategy (Mobile-First)

Always design and code **Mobile-First** (`min-width` media queries):
- **Base (Default)**: `< 640px` (Mobile portrait & landscape)
- **sm**: `>= 640px` (Small tablets, large phones)
- **md**: `>= 768px` (Tablets portrait)
- **lg**: `>= 1024px` (Tablets landscape, small laptops)
- **xl**: `>= 1280px` (Desktop / Laptop monitors)
- **2xl**: `>= 1536px` (Wide screens)

---

## 4. Responsive UI Patterns

### A. Navigation
- **Mobile (< 768px)**: Sticky bottom navigation or top app bar with accessible slide-over sheet / drawer. Focus trap inside drawer when open; close on Escape key.
- **Desktop (>= 768px)**: Horizontal navigation with dropdowns, search bar, and primary actions.

### B. Data Tables & Grids
- Plain HTML `<table>` elements break on mobile.
- Use one of three mobile table patterns:
  1. **Horizontal Scroll with Fade Indicators**: Keep tabular structure, scroll horizontally with shadow cues.
  2. **Card Stacking**: Transform table rows into discrete cards on mobile via CSS grid/flex.
  3. **Priority Columns**: Show only critical columns (e.g. Name, Status, Action) on mobile; hide secondary columns behind an expandable row details drawer.

### C. Images & Media (Zero CLS)
- Always provide explicit `width`, `height`, or `aspect-ratio` to reserve layout space and eliminate Cumulative Layout Shift (CLS).
- Use `<picture>` and `srcset` for serving responsive image resolutions.
