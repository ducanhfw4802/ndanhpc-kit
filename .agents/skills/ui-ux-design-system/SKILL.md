---
name: ui-ux-design-system
description: Design system architecture, design tokens, and scalable UI component libraries for web and mobile. Use when architecting design systems, creating design tokens (colors, typography, spacing, shadows, radius), establishing component hierarchies (Atomic Design), defining multi-state component contracts (hover, active, focus-visible, disabled, loading, empty, error), or configuring multi-theme/dark mode systems.
when_to_use: "When architecting design systems, creating design tokens (colors, typography, spacing, shadows, radius), establishing component hierarchies (Atomic Design), defining multi-state component contracts (hover, active, focus-visible, disabled, loading, empty, error), or configuring multi-theme/dark mode systems."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# UI/UX Design System & Token Architecture

This skill guides the design, structure, and implementation of production-grade design systems and component libraries across web and mobile applications.

---

## 1. Core Principles

1. **Tokens Over Hardcoded Values**: Never hardcode colors, spacing, font sizes, or border radii directly in components. Every visual property maps to a semantic token.
2. **Atomic Design Hierarchy**:
   - **Atoms**: Raw primitives (Button, Input, Badge, Icon, Avatar, Label).
   - **Molecules**: Combinations of atoms (SearchInput with Icon + ClearButton, FormField with Label + Input + ErrorText).
   - **Organisms**: Distinct functional sections (Navbar, CardGrid, ModalDialog, Sidebar, Table).
   - **Templates / Layouts**: Page-level wireframes, shells, and grid definitions.
   - **Pages**: Live views populated with actual data.
3. **Semantic Tokens Over Raw Scales**:
   - Primitive scale: `colors.blue.500 = #3b82f6`
   - Semantic token: `colors.primary = colors.blue.500`
   - Component token: `button.primary.bg = colors.primary`
   *This ensures effortless theming (Light / Dark / High Contrast) without touching component markup.*

---

## 2. Design Token Specification

### A. Color Palette & Theming (CSS Variables & Tailwind)
```css
:root {
  /* Surface Tokens */
  --bg-canvas: #f8fafc;
  --bg-surface: #ffffff;
  --bg-subtle: #f1f5f9;
  --bg-muted: #e2e8f0;
  
  /* Text & Foreground */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;
  
  /* Brand & Action */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-active: #1e40af;
  --color-primary-contrast: #ffffff;
  
  /* Feedback & Semantics */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #0284c7;
  
  /* Borders & Dividers */
  --border-subtle: #e2e8f0;
  --border-strong: #cbd5e1;
  --border-focus: #2563eb;
  
  /* Elevation & Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

[data-theme="dark"] {
  --bg-canvas: #090d16;
  --bg-surface: #111827;
  --bg-subtle: #1f2937;
  --bg-muted: #374151;
  
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --text-inverse: #0f172a;
  
  --color-primary: #3b82f6;
  --color-primary-hover: #60a5fa;
  --color-primary-active: #2563eb;
  
  --border-subtle: #1f2937;
  --border-strong: #374151;
  --border-focus: #60a5fa;
}
```

### B. Typography Scale (8pt Baseline Grid)
- **Display**: 3rem - 3.75rem (48px - 60px) | Line-height: 1.1 | Bold / ExtraBold
- **Heading 1**: 2.25rem (36px) | Line-height: 1.2 | Bold
- **Heading 2**: 1.75rem (28px) | Line-height: 1.25 | SemiBold
- **Heading 3**: 1.25rem (20px) | Line-height: 1.3 | SemiBold
- **Body Large**: 1.125rem (18px) | Line-height: 1.5 | Regular
- **Body Default**: 1rem (16px) | Line-height: 1.5 | Regular / Medium
- **Body Small**: 0.875rem (14px) | Line-height: 1.4 | Regular / Medium
- **Caption / Metadata**: 0.75rem (12px) | Line-height: 1.3 | Medium / SemiBold *(Never go below 12px)*

### C. Spacing & Sizing Scale
Use an 8px grid system with a 4px half-step:
- `4px` (0.25rem, xs)
- `8px` (0.5rem, sm)
- `12px` (0.75rem, md)
- `16px` (1rem, lg - base spacing)
- `24px` (1.5rem, xl)
- `32px` (2rem, 2xl)
- `48px` (3rem, 3xl)
- `64px` (4rem, 4xl)

---

## 3. Component State Matrix

Every interactive component MUST explicitly handle all standard states:
1. **Default / Idle**: Resting state with appropriate contrast.
2. **Hover**: Visual elevation or subtle color shift (desktop).
3. **Active / Pressed**: Depressed scale (`active:scale-[0.98]`) or darkened fill.
4. **Focus-Visible**: Distinct high-contrast outline (`outline-2 outline-offset-2 outline-primary`) for keyboard accessibility.
5. **Disabled**: Reduced opacity (30-50%), `cursor-not-allowed`, `pointer-events-none`, `aria-disabled="true"`.
6. **Loading / Pending**: Spinner or skeleton, interactive inputs disabled to prevent double-submits.
7. **Empty State**: Friendly illustration or icon, helpful title, explanatory copy, and clear primary CTA.
8. **Error State**: Non-color indicator (icon + text), descriptive error message, `aria-invalid="true"`.

---

## 4. Design-to-Code Workflow

1. **Extract Specs**: When reviewing designs from Figma (via Figma MCP `figma_mcp` or images), extract:
   - Layout mode (Auto Layout direction, padding, gap).
   - Component variants and properties.
   - Text styles and color variables.
2. **Define Interface / Prop Types**:
   - `variant`: `'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'`
   - `size`: `'sm' | 'md' | 'lg'`
   - `isLoading`: `boolean`
   - `isDisabled`: `boolean`
   - `icon`: `ReactNode` or Icon component
3. **Implement with CVA (Class Variance Authority) or Tailwind**:
   Group classes cleanly into base, variants, and compound variants.
4. **Verify Accessibility & Ergonomics**:
   - Touch targets >= 44x44px.
   - Contrast ratio >= 4.5:1.
   - Fully keyboard navigable.
