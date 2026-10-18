---
name: ui-ux-pro-max
description: "AI-powered UI/UX design intelligence with 79 UI styles, 192 color palettes, 74 font pairings, 119 UX guidelines, 25 chart types, and automated design system generator across 22 tech stacks."
when_to_use: "When designing, building, reviewing, or fixing interfaces, choosing UI styles, color palettes, font pairings, chart types, accessible components, or generating complete design systems."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 2.15.0
---

# UI/UX Pro Max - Design Intelligence

AI-powered design intelligence providing local, searchable databases of 79 UI styles (50 active), 192 product color palettes and reasoning profiles, 74 typography pairings, 119 UX guidelines, 105 curated icons, 17 GSAP presets, 25 chart types, and 22 technology stacks.

---

## 1. When to Use

Use this skill whenever you need to:
- **Generate a Design System**: Create a complete design tokens sheet (style, palette, typography, layout, effects, anti-patterns, and pre-delivery checklist) for a new app or page.
- **Select Colors & Palettes**: Look up accessible, domain-specific color palettes (primary, secondary, accent, card, border, muted) with CSS variable names.
- **Choose Typography**: Find Google Fonts pairings with tested mood, readability, and ready-to-use `@import` snippets.
- **Select UI Styles**: Explore 79 distinct visual styles (Minimalism, Bento Grid, Neumorphism, Cyberpunk, Soft UI, Glassmorphism, Brutalism, Flat Design, etc.).
- **Choose Charts & Visualizations**: Select appropriate chart types for data dashboards (Bar, Line, Donut, Heatmap, Treemap, Sankey) and recommended libraries (Recharts, Chart.js, D3).
- **Audit UX & Accessibility**: Check against 119 UX guidelines, WCAG 2.1 AA/AAA contrast ratios, touch target sizes (min 44x44px), and keyboard focus navigation.
- **Stack-Specific Guidance**: Look up best practices across 22 stacks (`html-tailwind`, `react`, `nextjs`, `vue`, `flutter`, `swiftui`, `react-native`, `shadcn`, etc.).

---

## 2. CLI Search Commands

All search operations run via the local Python search tool (standard library only, zero dependencies):

```bash
# 1. Generate full Design System for a product or concept:
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<product or requirement>" --design-system

# 2. Domain-specific search:
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max_results>]

# 3. Stack-specific guidelines search:
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
```

### Supported Search Domains (`--domain`):
| Domain | Description | Example Query |
| :--- | :--- | :--- |
| `product` | Product type recommendations & requirements | `python3 ... "saas" --domain product` |
| `style` | Visual styles, keywords, CSS properties | `python3 ... "cyberpunk" --domain style` |
| `color` | Color palettes with contrast and CSS tokens | `python3 ... "fintech" --domain color` |
| `typography` | Font pairings + Google Fonts import link | `python3 ... "luxury" --domain typography` |
| `landing` | Landing page section structure & CTA strategy | `python3 ... "developer tool" --domain landing` |
| `chart` | Chart types, use cases, library suggestions | `python3 ... "distribution" --domain chart` |
| `ux` | 119 UX guidelines, best practices, anti-patterns | `python3 ... "touch target" --domain ux` |
| `icons` | Curated icon recommendations (Lucide, Heroicons) | `python3 ... "user profile" --domain icons` |
| `react` | React & Next.js UI performance rules | `python3 ... "rerender" --domain react` |
| `web` | App interface & responsive guidelines | `python3 ... "bottom nav" --domain web` |
| `gsap` | Animation presets by intensity tier | `python3 ... "stagger" --domain gsap` |

### Design Dials (with `--design-system`):
```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --variance <1-10> --motion <1-10> --density <1-10>
```
- `--variance`: Biases style selection (1 = minimal/safe, 10 = bold/asymmetric).
- `--motion`: Attaches matching animation snippets (1 = subtle hover, 10 = immersive GSAP).
- `--density`: Overrides spacing tokens (1 = airy/marketing, 10 = dense/dashboard).

---

## 3. Core UX Rules & Pre-Delivery Checklist

Before completing any frontend or UI task, verify:
1. **No Emojis as Icons**: Always use SVG icons (Lucide, Heroicons, Phosphor) instead of raw unicode emojis.
2. **Interactive Elements**: All clickable items have `cursor: pointer`, explicit hover states, and clear focus-visible rings.
3. **Contrast & Legibility**: Minimum 4.5:1 text-to-background contrast for normal text; 3:1 for large text.
4. **Touch Ergonomics**: Minimum tap target size of 44x44px with at least 8px spacing on mobile/touch interfaces.
5. **Accessibility (a11y)**: Respect `prefers-reduced-motion`, label icon-only buttons with `aria-label`, preserve logical heading hierarchy (H1 -> H2 -> H3).
6. **Responsive Layouts**: Test breakpoints at 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide).
