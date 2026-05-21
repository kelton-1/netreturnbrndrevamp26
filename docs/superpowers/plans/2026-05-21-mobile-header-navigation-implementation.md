# Mobile Header Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved mobile floating header island and full-screen Shopify Navigation-driven mobile menu.

**Architecture:** Keep Focal's existing `store-header`, `toggle-button`, and `mobile-navigation` custom elements. Make small Liquid changes for mobile control ordering and dynamic menu output, then put the visual system in `assets/brand-revamp.css.liquid` using the active brand tokens. Enable homepage-only transparent header behavior through `sections/header-group.json`.

**Tech Stack:** Shopify Liquid theme, Focal header/drawer components, Shopify Navigation linklists, `assets/brand-revamp.css.liquid`, Shopify CLI Theme Check, repo-local navigation validator.

---

### Task 1: Header Control Order

**Files:**
- Modify: `sections/header.liquid`

- [ ] Change the original mobile hamburger in `.header__inline-navigation` so it is only used for the desktop drawer layout.
- [ ] Add a mobile-only account/login icon before cart in `.header__secondary-links` when customer accounts are enabled.
- [ ] Add a mobile-only menu toggle after cart in `.header__secondary-links`, using `aria-controls="mobile-menu-drawer"` and the existing `header-hamburger` icon.
- [ ] Keep search in the existing mobile inline-navigation icon list so mobile visual order can become logo, open space, search, account, cart, menu.

### Task 2: Navigation-Driven Full-Screen Menu

**Files:**
- Modify: `snippets/mobile-menu.liquid`

- [ ] Replace the hardcoded primary-card and support-link markup with output from the `menu` parameter.
- [ ] Render top-level menu links as primary full-screen rows with right arrows.
- [ ] Render children in nested lists below their parent when configured in Shopify Navigation.
- [ ] Keep footer utilities for account, order status, and product support.
- [ ] Preserve Focal drawer controls: `mobile-navigation`, `drawer__overlay`, `drawer__header`, and close button with `data-action="close"`.

### Task 3: Brand-Token Styling

**Files:**
- Modify: `assets/brand-revamp.css.liquid`

- [ ] Add floating island styling for `.shopify-section-group-header-group .header` using existing brand color, font, size, letter-spacing, and motion tokens.
- [ ] Scope transparent island behavior to `.header--transparent`, allowing only the homepage hero state to be glass-like.
- [ ] Add mobile layout rules so the header controls align as logo, open space, search, account, cart, menu.
- [ ] Add full-screen dark mobile drawer rules for `#mobile-menu-drawer`, `.mobile-nav__menu-list`, `.mobile-nav__menu-link`, nested links, and footer utilities.
- [ ] Respect reduced motion by removing transform-heavy transitions under `prefers-reduced-motion`.

### Task 4: Header Group Config

**Files:**
- Modify: `sections/header-group.json`

- [ ] Enable `enable_transparent_header` so Focal's existing homepage-only transparent logic can run.
- [ ] Keep `sidebar_navigation_menu` as the production control point for final mobile menu content; leave it blank only if no dedicated Shopify Navigation handle is available in this local checkout.

### Task 5: Validator And Documentation

**Files:**
- Modify: `scripts/validate-header-footer-navigation.mjs`
- Modify: `docs/header-footer-navigation-handoff.md`
- Modify: `docs/brand-revamp-2026.md`

- [ ] Update the validator to assert the new mobile full-screen menu classes, Shopify Navigation-driven output, right-side mobile menu toggle, and homepage transparent header setting.
- [ ] Document that the mobile menu should be administered through Shopify Navigation via `sidebar_navigation_menu`.
- [ ] Document validation results and any preview caveats.

### Task 6: Verification

**Files:**
- Validate: `sections/header.liquid`
- Validate: `snippets/mobile-menu.liquid`
- Validate: `sections/header-group.json`
- Validate: `assets/brand-revamp.css.liquid`
- Run: `node scripts/validate-header-footer-navigation.mjs`
- Run: `PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check`

- [ ] Run Shopify Liquid validation against changed Liquid/config/CSS artifacts.
- [ ] Run the repo-local header/footer validator.
- [ ] Run Theme Check and separate new findings from existing baseline findings.
- [ ] Start a local Shopify preview if feasible and capture/check mobile homepage closed, mobile homepage scrolled, mobile menu open, and desktop header/mega-menu behavior.
