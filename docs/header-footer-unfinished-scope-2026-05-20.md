# Header/Footer Unfinished Scope Check

Date: 2026-05-20  
Workspace: `/Users/kelton1/Developer/TheNetReturn/Shopify`

## Summary

The header has visual brand improvements, but the fuller approved header/footer navigation concept is not complete in this checkout. The most important unfinished pieces are the conversion-first mobile menu, the final navigation information architecture, stale campaign cleanup, footer hierarchy polish, popup QA, and the missing handoff/QA documentation.

The current git tree was clean at the time of this investigation.

Implementation update: a follow-up code pass on 2026-05-20 addressed the theme-side items called out below and created `docs/header-footer-navigation-handoff.md`. Treat this file as the original gap check and use the handoff doc for the current implementation/admin boundary.

## Unfinished Documentation

- `docs/superpowers/plans/2026-05-20-header-footer-navigation-optimization.md` is still the active header/footer implementation plan. Its checkboxes remain unchecked, including evidence capture, IA decisions, mobile drawer behavior, desktop mega-menu hierarchy, footer hierarchy, popup checks, and final QA.
- The plan expects `docs/header-footer-navigation-handoff.md`, but that file does not exist yet.
- The older side-menu plan expects `docs/header-side-menu-admin-config-2026-05-19.md`, but that file does not exist yet.
- The older side-menu audit does not include its planned `Implementation Handoff` or `Implementation QA Checkpoint` sections.
- No `output/playwright/header-footer-optimization-2026-05-20/` or `output/playwright/menu-optimization-qa-2026-05-19/` evidence artifacts were found in this checkout.

## Missing From The Approved Concept

### 1. Dedicated Mobile Menu

The header group still has `sidebar_navigation_menu` set to blank, so the mobile drawer falls back to `main-menu-2024`. This means mobile still mirrors the desktop navigation instead of using the approved conversion-first order:

1. Shop Nets
2. Shop Packages
3. Shop Simulation
4. Shop Accessories
5. Compare Nets
6. Build Your Setup
7. Take The Quiz
8. Talk To An Expert
9. Learn & Support

Recommended next action: create/configure the dedicated Shopify Navigation menu and set it as the header `Mobile menu`, then document the admin change.

### 2. Mobile Parent Links And Guided Actions

`snippets/mobile-menu.liquid` still renders parent rows with children as single expand buttons. Parent category labels are not separate links, and guided image cards still render after category accordions.

Recommended next action: either configure the dedicated mobile menu as mostly direct links or update the drawer markup so parent labels remain tappable while a separate control expands children.

### 3. Desktop IA And Mega Menu Hierarchy

The approved direction promotes `Compare`, `Build Your Setup`, and guided shopping more explicitly. The current repo still has the older concept split: desktop uses `main-menu-2024`, the mega-menu image cards include `Recommendations Quiz` and `Build Your Setup`, and there is no visible `Need help choosing?` / decision-support label in `snippets/desktop-menu.liquid`.

Recommended next action: decide the final desktop IA, then update Shopify Navigation and/or the mega-menu snippet so `Compare Nets`, quiz/setup, and expert help have the intended priority.

### 4. Stale Campaign Header Code

`sections/header.liquid` still contains the sitewide BFCM/Black Friday menu highlight CSS and script. The 2026-05-20 plan explicitly calls this out for removal or setting-gating if present.

Recommended next action: remove or setting-gate the stale campaign behavior as part of the header cleanup pass.

### 5. Footer Hierarchy

The advisory CTA exists and the footer is visually restyled, but the approved footer shape is not fully done. The current footer group has `text-with-icons` disabled, the link blocks still map to `shop`, `explore`, and `learn`, the newsletter copy is still generic, and the monogram/wordmark placement remains a documented follow-up in `docs/brand-revamp-2026.md`.

Recommended next action: reorganize footer blocks around shopper intent (`Shop`, `Compare & Guides`, `Support`, `Company/Learn`, `Newsletter`), improve newsletter copy, and decide whether a dedicated brand mark should be added above the link grid.

### 6. Popup And Overlay QA

The side-menu audit found marketing popups could block desktop menu interaction, and the header/footer plan asks for popup checks with marketing embeds enabled. No final popup QA artifact was found.

Recommended next action: run a focused browser QA pass with popups enabled and document whether admin timing/stacking changes are needed.

## Suggested Execution Order

1. Create `docs/header-footer-navigation-handoff.md` with keep/fix/decide, final IA, and admin/menu instructions.
2. Implement or configure the dedicated conversion-first mobile menu.
3. Update mobile drawer behavior only if nested mobile groups remain.
4. Remove or setting-gate stale BFCM header logic.
5. Refine desktop mega-menu hierarchy and guided-shopping labels.
6. Refine footer block hierarchy and newsletter/brand-mark treatment.
7. Run Theme Check and browser QA with screenshots for desktop header, mega menu, mobile drawer, and footer.
8. Update `docs/brand-revamp-2026.md` with the completed decisions, screenshots, QA notes, and caveats.
