---
name: design-system
description: Generate an AI-powered design system specification (style, color palette, typography, layout, anti-patterns, and pre-delivery checklist) using UI/UX Pro Max intelligence.
version: 1.0.0
requires_agents: ui-ux-designer
requires_skills: ui-ux-pro-max, ui-ux-design-system, design-spec
artifact_outputs: DESIGN.md, design-system-spec
---

# /design-system - Design System Intelligence Generator

Generate a tailored, production-ready Design System specification for any web, mobile, or desktop application using UI/UX Pro Max reasoning engine.

---

## Usage

```bash
/design-system <app-type-or-description> [options]
```

### Options
- `--variance <1-10>`: Biases style selection (1 = minimal/classic, 10 = bold/asymmetric)
- `--motion <1-10>`: Motion intensity (1 = subtle hover, 10 = complex GSAP transitions)
- `--density <1-10>`: Spacing density (1 = spacious/marketing, 10 = dense/dashboard)
- `--domain <domain>`: Query a specific domain (`color`, `style`, `typography`, `chart`, `ux`, `icons`)
- `--stack <stack>`: Target tech stack (`html-tailwind`, `react`, `nextjs`, `vue`, `flutter`, `swiftui`, `react-native`, `shadcn`)

---

## Workflow Steps

1. **Analyze Requirements**: Extract domain, product purpose, target audience, and preferred visual mood.
2. **Execute UI/UX Pro Max Engine**:
   Run the local CLI engine:
   ```bash
   python3 .agents/skills/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --design-system
   ```
3. **Formulate DESIGN.md**:
   Output a standardized `DESIGN.md` artifact with:
   - **Visual Style & Pattern**: Layout architecture, hero structure, and emotional tone.
   - **Color Palette & CSS Variables**: Primary, secondary, accent, card, muted, border, and destructive tokens.
   - **Typography & Font Pairings**: Heading & body fonts with Google Fonts import URLs.
   - **Component & Motion Specs**: Hover durations, micro-interactions, and accessibility contracts.
   - **Anti-Patterns & Pre-Delivery Checklist**: Pitfalls to avoid and verification checkboxes before handover.
