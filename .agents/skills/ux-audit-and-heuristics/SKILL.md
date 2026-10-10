---
name: ux-audit-and-heuristics
description: UX evaluation, usability heuristics audit, cognitive load reduction, and conversion rate optimization (CRO) for web and mobile apps. Use when conducting UX reviews, auditing interfaces against Nielsen's 10 Heuristics, optimizing form UX and error handling, reducing cognitive load, or improving onboarding and empty states.
when_to_use: "When conducting UX reviews, auditing interfaces against Nielsen's 10 Heuristics, optimizing form UX and error handling, reducing cognitive load, or improving onboarding and empty states."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# UX Audit & Usability Heuristics Framework

A comprehensive framework for evaluating and improving the user experience, ergonomics, and usability of digital products.

---

## 1. Nielsen's 10 Usability Heuristics Checklist

1. **Visibility of System Status**:
   - Provide immediate visual feedback for all user actions within 100ms.
   - Use deterministic progress bars for long processes; show skeleton screens during initial load.
2. **Match Between System and Real World**:
   - Use natural language, familiar metaphors, and conventional iconography.
   - Avoid internal system codes, jargon, or confusing technical errors.
3. **User Control and Freedom**:
   - Provide clear "emergency exits": Undo toasts, Cancel buttons, Back buttons.
   - Support `Escape` key to close modals, drawers, and popovers.
4. **Consistency and Standards**:
   - Follow established platform conventions (iOS HIG, Android Material, Web).
   - Maintain uniform wording, button styling, and layout positioning across pages.
5. **Error Prevention**:
   - Prevent errors before they happen (disable invalid options, format masks for dates/cards/phones).
   - Use confirmation dialogs only for irreversible destructive actions; offer Undo for reversible actions.
6. **Recognition Rather than Recall**:
   - Minimize memory load. Keep instructions visible or readily retrievable.
   - Show recent searches, pre-fill known values, and surface relevant contextual cues.
7. **Flexibility and Efficiency of Use**:
   - Provide keyboard shortcuts and accelerators for power users.
   - Allow custom sorting, filtering, and bulk actions on data sets.
8. **Aesthetic and Minimalist Design**:
   - Eliminate visual noise and unnecessary decorations that compete with vital information.
   - Maintain generous whitespace and high typographic hierarchy.
9. **Help Users Recognize, Diagnose, and Recover from Errors**:
   - Error messages must explain: 1) What went wrong, 2) Why, 3) Exactly how to fix it.
   - Never display raw stack traces, generic "An error occurred", or HTTP 500 codes.
10. **Help and Documentation**:
    - Contextual tooltips, inline help text, and easily searchable support documentation.

---

## 2. Form UX Best Practices

Forms are where conversions succeed or fail:
1. **Single Column Flow**: Place fields in a single vertical column for predictable scanning.
2. **Top-Aligned Labels**: Top-aligned labels enable faster scanning and better mobile layout compared to left-aligned labels.
3. **Never Rely Solely on Placeholders**: Placeholders disappear upon typing, destroying context. Use permanent labels.
4. **Inline Validation**:
   - Validate on `blur` (after user finishes typing), not on initial `focus` or aggressively on every keystroke.
   - Re-validate on change *only after* an error has been shown to confirm correction.
5. **Clear Input Types & Keyboards**:
   - `inputMode="numeric"` or `"email"` or `"tel"` on mobile devices to trigger appropriate keyboards.
   - `autocomplete` attributes (`name`, `email`, `current-password`, `one-time-code`).
6. **Submit Button Safety**:
   - Disable button and display loading spinner upon submit to prevent duplicate submissions.

---

## 3. Cognitive Psychology in UX

- **Hick's Law**: Time to make a decision increases logarithmically with the number of options. Simplify choices; break complex forms into multi-step wizards.
- **Miller's Law**: The average person can hold 7 (+/- 2) chunks of information in working memory. Group items logically.
- **Fitts's Law**: Larger and closer targets are faster to tap. Position primary actions in easily accessible zones.
- **Peak-End Rule**: People judge an experience largely based on how they felt at its peak and at its end. Celebrate completed workflows (e.g., celebratory micro-interactions, clear receipts).

---

## 4. UX Audit Report Template

When conducting an audit, structure findings into:
1. **Executive Summary**: Core UX friction points and usability grade (A / B / C / F).
2. **Critical Findings (P0 - Blocker)**: Violations causing task failure, abandonment, or loss of data.
3. **Major Findings (P1 - High Friction)**: Issues causing user confusion, hesitation, or high cognitive load.
4. **Minor Polish (P2 - Nice to Have)**: Visual hierarchy, microcopy clarity, spacing inconsistencies.
5. **Actionable Recommendations**: Concrete wireframe adjustments or code modifications.
