---
name: mobile-app-ui-ux
description: Mobile UX/UI design patterns, touch interaction ergonomics, and platform conventions for iOS and Android apps (React Native, Flutter, Swift, Kotlin). Use when designing mobile app interfaces, optimizing thumb zone navigation, handling safe areas (notch, dynamic island, home bar), designing bottom sheets and gesture flows, or auditing mobile touch targets and 60fps performance.
when_to_use: "When designing mobile app interfaces, optimizing thumb zone navigation, handling safe areas (notch, dynamic island, home bar), designing bottom sheets and gesture flows, or auditing mobile touch targets and 60fps performance."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# Mobile App UI/UX Design & Architecture

Designing for mobile requires understanding physical device ergonomics, touch constraints, platform guidelines (Apple Human Interface Guidelines & Google Material Design 3), and reactive touch feedback.

---

## 1. Physical Ergonomics & The Thumb Zone

Mobile users primarily interact with one hand (67-75% of one-handed thumb use):
1. **Natural Zone (Bottom & Middle-Center)**: Place primary actions here (Primary CTA, Tab Bar, Bottom Sheets, Search Bar in modern apps).
2. **Stretch Zone (Middle-Top & Opposite Sides)**: Secondary navigation, filtering chips, cards.
3. **Hard-to-Reach Zone (Top Left & Top Right)**: Infrequent actions, settings, profile avatars, read-only headers. Avoid placing critical, frequent primary actions at the top corners.

### Minimum Touch Targets
- **iOS (HIG)**: Minimum **44 x 44 pt** bounding box.
- **Android (Material 3)**: Minimum **48 x 48 dp** bounding box.
- *Visual element may be 24px (e.g. an icon), but its hit slop / clickable padding must expand to >= 44x44px.*

---

## 2. Navigation Architecture

### A. Bottom Navigation Bar
- Limit to **3 to 5 destinations** maximum.
- Always include active state indicators (color change + icon fill change + label).
- Ensure labels are concise (1-2 words), never truncate labels.
- Persist state across tab switches.

### B. Modals & Bottom Sheets
- Prefer **Bottom Sheets** over centered desktop-style modals.
- Drag handle / scrim dismiss gestures must be smooth and intuitive.
- Provide sticky actions at the bottom of the sheet above the home bar.
- Support half-expanded and fully-expanded detents.

### C. Gestures & Transitions
- **Swipe-to-back**: Never break native back swipe behavior.
- **Pull-to-refresh**: Provide immediate spinner feedback; never trigger unintentionally during fast scrolling.
- **Swipe actions on lists**: Reveal edit/delete with clear icons and color coding; provide undo toasts for destructive actions.

---

## 3. Safe Area & Edge-to-Edge Handling

All modern mobile devices have physical cutouts and system gesture areas:
- **Top Insets**: Status bar, notch, camera hole-punch, Dynamic Island.
- **Bottom Insets**: iOS Home Indicator bar, Android gesture navigation pill.
- **Keyboard Avoidance**: When virtual keyboard appears, inputs must scroll smoothly into view without hiding submit buttons.
- In **Flutter**: Wrap root screens with `SafeArea` or handle `MediaQuery.of(context).padding`.
- In **React Native**: Use `react-native-safe-area-context` (`useSafeAreaInsets()`).

---

## 4. Perceived Performance & Micro-Interactions

1. **Skeleton Loading**: Always use skeleton screens mirroring the real layout rather than generic fullscreen spinners.
2. **Optimistic Updates**: Update the UI immediately upon user action (e.g. like, save, toggle), then sync with the API in the background with rollback if it fails.
3. **Haptic Feedback**:
   - `selection` for picking dates/pickers.
   - `impactLight` for tab clicks / toggle switches.
   - `notificationSuccess` on transaction or completed flow.
   - `notificationError` on invalid input or failure.
4. **Fluid Motion (60 / 120 FPS)**:
   - Use hardware-accelerated transforms (`transform`, `opacity`).
   - Avoid animating layout triggers (`width`, `height`, `margin`, `top`).

---

## 5. Mobile UI Audit Checklist

Before releasing any mobile interface, verify:
- [ ] Are all touch targets >= 44x44pt (iOS) or 48x48dp (Android)?
- [ ] Does the UI render correctly on narrow screens (360px - 390px) without horizontal scrolling?
- [ ] Is dynamic text scaling respected (does layout survive 1.5x / 2.0x system text size without overlapping)?
- [ ] Are input forms responsive to virtual keyboards (no inputs hidden behind keyboard)?
- [ ] Are both Light and Dark mode contrast ratios compliant (>= 4.5:1)?
- [ ] Are destructive actions confirmed or undoable?
