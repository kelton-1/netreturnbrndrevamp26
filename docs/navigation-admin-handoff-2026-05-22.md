# Navigation handoff — Shopify Admin changes

**Branch context:** `brand-revamp-2026`
**Created:** 2026-05-22
**Source audit:** [ux-navigation-audit-2026-05-14.md](ux-navigation-audit-2026-05-14.md), [header-side-menu-optimization-audit-2026-05-19.md](header-side-menu-optimization-audit-2026-05-19.md), [header-footer-navigation-handoff.md](header-footer-navigation-handoff.md)

The mega menu and mobile drawer pull their links from Shopify Navigation menus (Online Store → Navigation in Shopify Admin), not from theme code. The following changes can only be made there. Theme code is already correctly wired — `sections/header.liquid` reads the menu, and `sections/header-group.json` references it by handle. No theme push needed for any of these.

## Already shipped in theme code (no admin work)

- Hardcoded mega-menu category lists in `brand-category-rail.liquid`, `brand-category-mosaic.liquid`, `brand-category-accordion.liquid` already use clean `/collections/simulation` paths.
- `templates/page.faq.json` had one broken `?simulator-bays` link (query-string instead of anchor) — fixed to `#simulator-bays` in this branch.
- All four major collection pages (nets-1, packages, simulation, general-accessories) and three sub-series collections (home-series, pro-series, commercial-simulators) now ship with `brand-breadcrumb` so the back-trail is consistent everywhere.

## P0 — Mobile dedicated menu (audit grade: C → A)

**Why:** `sections/header-group.json` line 13 currently sets `"sidebar_navigation_menu": "main-menu-2024"`, the same menu desktop uses. Mobile users see a parent-child expand tree instead of conversion-first direct links.

**Action in Shopify Admin:**

1. Online Store → Navigation → Add menu
2. Title: `Mobile Drawer 2026` · Handle: `mobile-drawer-2026`
3. Add menu items in this order:

| Order | Label | URL |
|-------|-------|-----|
| 1 | Shop Nets | `/collections/nets-1` |
| 2 | Shop Packages | `/collections/packages` |
| 3 | Shop Simulation | `/collections/simulation` |
| 4 | Shop Accessories | `/collections/general-accessories` |
| 5 | Compare Nets | `/pages/compare` |
| 6 | Build Your Setup | `/pages/build-your-setup` |
| 7 | Take The Quiz | `/pages/quiz` |
| 8 | Talk To An Expert | `/pages/contact` |
| 9 | Learn & Support | `/pages/support` |

4. Save.
5. Online Store → Themes → Customize (on the source theme `149365096541`) → Header section → set "Mobile menu" to **Mobile Drawer 2026**.

## P1 — Shop All X first-children (audit issue 1)

**Why:** Mobile shoppers tapping a parent like "Nets" or "Packages" in the desktop menu currently expand its children but cannot navigate to the collection landing page itself. Adding a "Shop All …" first child solves this without restructuring the menu.

**Action in `main-menu-2024`** (the existing desktop menu):

- Under `Nets`, add first child: `Shop All Nets` → `/collections/nets-1`
- Under `Packages`, add first child: `Shop All Packages` → `/collections/packages`
- Under `Simulation`, add first child: `Shop All Simulation` → `/collections/simulation`
- Under `Accessories`, add first child: `Shop All Accessories` → `/collections/general-accessories`

## P1 — Simulation anchor links (audit issue 3)

**Why:** Audit flagged URLs like `https://www.thenetreturn.com/collections/simulation/simulation#simulator-bays` (duplicated path segment). These are inside `main-menu-2024` items pointing into `/collections/simulation` sub-sections.

**Action in `main-menu-2024`** — find any items currently linking to a Simulation sub-section. Replace with these exact paths:

| Sub-section | Correct URL |
|-------------|-------------|
| Simulator Bays | `/collections/simulation#simulator-bays` |
| Simulator Packages | `/collections/simulation#simulator-packages` |
| Launch Monitors | `/collections/simulation#launch-monitors` |
| Sim Add-Ons | `/collections/simulation#simulator-add-ons` |
| Computers & Projectors | `/collections/simulation#computers-projectors` |

These anchor IDs exist on the simulation page (verified via `templates/collection.simulation.json` custom-liquid divs). The new in-page `brand-series-rail` (this branch) uses the same five anchors as its section nav, so admin menu and on-page nav stay aligned.

## P2 — Explore / Learn category structure (audit issue 2)

**Why:** Both `Explore` and `Learn` mega-menus currently show only image cards (no category column). They feel like ad units rather than browsable structure.

**Action:** Either (a) add submenu items to the `Explore` and `Learn` items in `main-menu-2024` so the mega-menu's category column populates, or (b) accept the cards-only treatment as final and remove the empty column markup from `header.liquid` to tighten the layout. Recommendation: (a) — adds shopper utility for low effort.

Suggested Explore children: `Compare Nets`, `Build Your Setup`, `Take The Quiz`, `Setups Gallery`, `B2B Login`.
Suggested Learn children: `About Us`, `Bryson DeChambeau`, `Warranty`, `Assembly Guides`, `FAQ`, `Contact`.

## Verification checklist after admin changes

- [ ] Desktop: hover Shop → mega-menu shows category columns + cards (no change expected, already works).
- [ ] Desktop: hover Explore / Learn → category columns now populated.
- [ ] Mobile: open drawer → see the 9-item conversion-first list, no Shop/Explore/Learn parent-child expand tree.
- [ ] Mobile: each item is one tap to its destination.
- [ ] Simulation: click any sub-section link from desktop mega-menu → lands on `/collections/simulation` and scrolls to the correct anchor (no 404, no double-`/simulation/simulation`).
