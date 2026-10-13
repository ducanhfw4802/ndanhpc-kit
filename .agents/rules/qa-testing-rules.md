---
name: qa-testing-rules
version: 1.0.0
priority: P1
trigger: model_decision
description: Strict guidelines for QA testing, manual test case design, locator strategy, smart waits, Playwright/Selenium/Appium automation, and API verification.
---

# QA Testing & Automation Rules - NDANHPC Kit

> Mandatory standards for all QA, Manual Testing, and Automation Testing activities.

---

## 🖥️ Browser Execution & UI Debugging Rules

1. **Desktop Viewport Mandatory:** All UI debugging must execute with desktop viewport: **`1920x1080`**.
2. **Headed Mode First:** UI debugging must run in **headed mode** (real visible browser). Headless mode is only permitted after UI tests pass stably.
3. **Debugging Order (Playwright / Browser MCP):**
   ```
   navigate -> resize(1920x1080) -> wait_for(page_load) -> snapshot -> interact -> screenshot(on_fail)
   ```
4. **Never Guess Locators:** Inspect live DOM/HTML on the actual browser. Guessing selectors or blindly copying stale selectors without verification is forbidden.
5. **Smart Snapshots & Screenshots:** Use `snapshot` to inspect DOM; capture `screenshot` strictly upon assertion failure or major milestone.

---

## ⚡ Smart Waits Strategy (Zero Hard Sleep)

* **FORBIDDEN:** `Thread.sleep`, `waitForTimeout`, fixed sleep delays.
* **MANDATORY:** Smart waits and auto-waiting:
  * **Playwright:** `expect().toBeVisible()`, `expect().toBeEnabled()`, Locator auto-waiting.
  * **Selenium:** `WebDriverWait` + `ExpectedConditions`.
  * **Appium:** `WebDriverWait` + mobile expected conditions.

---

## 🎯 Locator Hierarchy

Priority order when selecting element locators:
1. **User-facing semantic:** `getByRole()`, `getByLabel()`, `getByPlaceholderText()`
2. **Stable Test Attributes:** `data-testid`, `data-test`, `data-qa`
3. **Visible text content:** `getByText()` (exact when possible)
4. **Resilient CSS / Relative XPath:** Semantic class combinations (avoid fragile dynamic hash IDs like `div_234`).

---

## 🎲 Test Data Strategy

* All unique fields (Email, Username, Code/ID) **must use dynamic random data**.
* Random data must be **traceable** (e.g. `test_login_1712049200@auto.test`).
* Never reuse hardcoded credentials or customer data across test suites.

---

## 🏗️ Architecture & Page Object Model (POM)

* Strict separation between **Page Objects** (selectors & interactions), **Test Suites** (flow execution & assertions), and **Utils / Test Data**.
* Locators must reside inside Page classes, never written inline inside test specifications.

---

## ✅ Definition of Done (DoD)

Test automation is completed only when:
- [ ] Tests **PASS stably at least 2 consecutive times** on real UI.
- [ ] Debug logs, commented code, and temporary prints are purged.
- [ ] Assertions have crystal clear failure messages.
- [ ] Configuration files contain no real plain-text secrets.
