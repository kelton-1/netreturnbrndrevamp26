# Header And Side Menu Optimization Audit

Date: 2026-05-19  
Workspace: `/Users/kelton1/Developer/TheNetReturn/Shopify`  
Draft theme verified: `[FIX] Cart 400 - variant id disabled - 2026-05-12` / `149365096541`  
Preview used: `https://the-net-return.myshopify.com?preview_theme_id=149365096541`, redirected to `https://www.thenetreturn.com/`

## Screenshots Captured

- Desktop header, closed: `output/playwright/menu-audit-2026-05-19/desktop-header-home.png`
- Desktop Shop mega menu, popup-blocked attempt: `output/playwright/menu-audit-2026-05-19/desktop-shop-mega-menu.png`
- Desktop Shop mega menu, open: `output/playwright/menu-audit-2026-05-19/desktop-shop-mega-menu-open.png`
- Mobile header, closed: `output/playwright/menu-audit-2026-05-19/mobile-header-closed.png`
- Mobile side menu, top level: `output/playwright/menu-audit-2026-05-19/mobile-side-menu-top.png`
- Mobile side menu, Shop expanded: `output/playwright/menu-audit-2026-05-19/mobile-side-menu-shop-expanded.png`
- Mobile side menu, Shop > Nets expanded: `output/playwright/menu-audit-2026-05-19/mobile-side-menu-shop-nets-expanded.png`

## Current Structure

The header uses the `main-menu-2024` menu for desktop and falls back to the same menu for mobile because `sidebar_navigation_menu` is blank. The desktop layout is `logo_center_navigation_inline`, with text links for Search/Login/Cart instead of icons.

Evidence:

- `sections/header-group.json:84-130` configures the active `Shop` mega-menu block, logo, `main-menu-2024`, blank mobile menu override, centered navigation layout, and text-style utility links.
- `sections/header.liquid:136-154` renders desktop navigation plus mobile hamburger/search controls.
- `sections/header.liquid:375-376` renders the mobile menu from `sidebar_navigation_menu`, falling back to the desktop navigation menu.
- `snippets/desktop-menu.liquid:17-105` renders desktop parent links, mega-menu images, and category columns.
- `snippets/mobile-menu.liquid:73-115` turns any item with children into a collapsible button and then renders second/third-level links below it.

## High-Priority Findings

### P1: Marketing popups can block the desktop menu

The first attempt to hover `Shop` failed because two marketing dialogs intercepted pointer events. After closing them, the menu opened correctly.

Why this matters:

- The header is the highest-intent navigation surface on the site.
- If popups appear before a shopper can use the menu, the mega menu becomes unreliable at exactly the moment a shopper is trying to orient.

Optimization:

- Suppress popups until after a minimum dwell time or first scroll, especially on first page load.
- Prevent multiple popup layers from stacking.
- QA header hover/click behavior with marketing embeds enabled, not only in a clean session.

### P1: Mobile parent category links are not navigable

On mobile, `Shop`, `Nets`, `Packages`, `Simulation`, `Accessories`, `Football`, and `Replacement Parts` become expand buttons when they have children. For example, `Nets` expands to `Pro Series` and `Home Series`, but the shopper cannot tap `Nets` itself to reach `/collections/nets-1`.

Why this matters:

- Desktop users can click the parent category heading and land on the category page.
- Mobile users need extra taps and may never reach the strongest category landing pages.
- This is especially costly for `Nets`, `Packages`, `Simulation`, and `Accessories`, which are also the homepage's cleanest purchase paths.

Optimization options:

- Add an explicit first child under each expandable parent, such as `Shop All Nets`, `Shop All Packages`, `Shop All Simulation`, and `Shop All Accessories`.
- Better: split parent rows into a tappable label plus a separate expand control, preserving the category URL and the nested links.
- If keeping the current code, configure the mobile menu as its own shorter menu so the most important destinations are direct links.

### P1: Mobile menu needs a dedicated conversion-first structure

Because the mobile menu inherits `main-menu-2024`, mobile shoppers get the desktop information architecture compressed into accordions. Reaching a product path can take three taps: hamburger -> Shop -> Nets -> Pro Series.

Why this matters:

- Mobile shoppers benefit from direct, task-based paths.
- The site already has strong guided paths: `Compare`, `Build Your Setup`, and `Recommendations Quiz`.
- Those paths are either hidden behind accordions or represented as image cards after the category list, not as first-class mobile choices.

Recommended mobile menu order:

1. Shop Nets
2. Shop Packages
3. Shop Simulation
4. Shop Accessories
5. Compare Nets
6. Build Your Setup
7. Take The Quiz
8. Talk To An Expert / Support
9. Learn

This can be done through the `sidebar_navigation_menu` setting without forcing the desktop menu to change at the same time.

## Main Header Menu Opportunities

### The top-level desktop labels are clean, but `Explore` and `Learn` point to `#`

Desktop shows `Shop`, `Explore`, and `Learn`, which is refreshingly compact. The weakness is that `Explore` and `Learn` are dropdown triggers with `href="#"`.

Why this matters:

- A shopper who clicks instead of hovers gets no meaningful destination.
- Keyboard and assistive-technology behavior is less clear than a real URL or a true button pattern.

Optimization:

- Give `Explore` a real landing destination, likely `/pages/compare`, `/pages/setups`, or a new guided hub.
- Give `Learn` a real support/education destination, likely `/pages/support` or `/pages/our-story`.
- If these are purely controls, render them as buttons with appropriate menu semantics instead of empty links.

### The Shop mega menu is strong, but its hierarchy can be sharper

The desktop `Shop` menu combines product categories with two visual guided paths: `Recommendations Quiz` and `Build Your Setup`. The current categories are solid: Nets, Packages, Simulation, Accessories, Football, Replacement Parts.

What is working:

- The menu is compact at the top level.
- Product categories match the homepage `Pick Your Lane` logic.
- The visual guided links are good conversion support for unsure shoppers.

What to optimize:

- Add a small textual grouping such as `Need help choosing?` above the quiz/setup image cards.
- Consider making `Compare Nets` visible inside `Shop`, not only in `Explore`, because compare is part of shopping for a net.
- Put direct category links and guided links into a clear order: core product paths first, guided decision aids second, support/education third.

### Some menu URLs should be normalized

The rendered menu includes same-site absolute URLs for Simulation anchors, including one suspicious path: `https://www.thenetreturn.com/collections/simulation/simulation#simulator-bays`.

Why this matters:

- Absolute same-site URLs are less portable across preview/store domains.
- The duplicated `/simulation/simulation` path looks unintended and should be checked.
- Anchor links should be consistent with the actual collection sections.

Optimization:

- Use relative URLs for same-store links where possible.
- Verify these Simulation anchor destinations:
  - `/collections/simulation#simulator-bays`
  - `/collections/simulation#simulator-packages`
  - `/collections/simulation#sim-add-ons`
  - `/collections/simulation#launch-monitors`
  - `/collections/simulation#computers-projectors`

## Side Menu Opportunities

### The drawer is visually simple, but it lacks decision support at the first level

The mobile drawer opens cleanly with `Shop`, `Explore`, and `Learn`, plus Account in the footer. It mirrors the desktop top level but misses the chance to give mobile users a shorter route.

Optimization:

- Make first-level mobile choices action-oriented rather than desktop-section-oriented.
- Add `Compare Nets`, `Build Your Setup`, and `Take The Quiz` as visible first-level rows.
- Keep `Explore` and `Learn` lower in the list or combine them into a simpler `Help & Learn` section.

### Guided image cards are useful but placed after category accordions

When `Shop` is expanded, the image cards for `Recommendations Quiz` and `Build Your Setup` appear below the category accordion list. They are visually good, but a mobile user has to open `Shop` first and then notice them below several rows.

Optimization:

- Move guided help above the nested categories on mobile, or expose those links as first-level rows.
- Use clearer labels such as `Find My Setup` and `Build A Setup` if the merchant agrees.
- Keep imagery if it helps, but do not make the images the only prominent guided-path affordance.

### Account is present, but support is not

The drawer footer includes Account, but there is no immediate `Talk to an Expert`, `Contact`, or `Support` path in the visible drawer top state.

Optimization:

- Add one high-confidence assistance link near the bottom of the mobile menu.
- Use the same support destination that appears in the footer, or the expert booking page if that is the preferred sales-assist path.

## Technical Notes

### Existing menu rendering supports a safe staged approach

Most improvements can be configuration-first:

- Set a dedicated mobile menu in `sidebar_navigation_menu`.
- Edit Shopify navigation items to add explicit `Shop All` child links.
- Normalize same-site URLs in Shopify navigation.

Code changes are only needed if we want the better mobile pattern where a parent item can both navigate and expand. That change would be localized to `snippets/mobile-menu.liquid`.

### Seasonal header highlight code still runs

`sections/header.liquid:414-428` still scans all header links for `Black Friday` and applies sale styling. It did not affect the current screenshots, but it is stale campaign logic in the global header.

Optimization:

- Remove it if no longer needed.
- Or move it behind a theme setting so it can be enabled only during a campaign window.

## Recommended Optimization Sequence

1. Configure a dedicated mobile sidebar menu with direct, conversion-first links.
2. Add `Shop All` child links under mobile expandable product groups if the drawer continues to use nested categories.
3. Normalize menu URLs, especially Simulation anchor links.
4. Rework desktop `Shop` hierarchy to include `Compare Nets` and clearer guided-help labeling.
5. Adjust popup timing/stacking rules so header interaction is not blocked.
6. Remove or setting-gate stale campaign highlight code.

## Validation Notes

- Verified the target draft via Shopify CLI theme list and the preview bar.
- Captured desktop and mobile screenshots through Playwright.
- Confirmed the desktop `Shop` mega menu opens after marketing dialogs are closed.
- Confirmed the mobile drawer opens, `Shop` expands, and nested `Nets` expands.
- Did not push or mutate the Shopify source theme.
