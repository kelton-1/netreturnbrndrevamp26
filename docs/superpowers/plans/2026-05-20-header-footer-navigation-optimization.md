# Header Footer Navigation Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current brand-revamp header, mobile navigation, and footer into a cleaner premium shopping system that helps customers quickly choose a net, package, simulator, accessory, or expert-guided path.

**Architecture:** Treat this as a design and UX refinement over the existing Focal theme, not a full rebuild. Keep global brand utilities in `assets/brand-revamp.css.liquid`, keep Liquid changes narrowly scoped to header/footer/menu snippets, and keep Shopify Navigation data decisions documented separately from code changes. Preserve the existing dark header and Shadow Green footer direction unless visual review proves a specific surface needs contrast or spacing changes.

**Tech Stack:** Shopify Liquid theme, Focal theme components, Shopify Navigation linklists, `assets/brand-revamp.css.liquid`, Shopify CLI, Playwright/browser screenshots for QA.

---

## Current State The Next Agent Should Assume

- Workspace: `/Users/kelton1/Developer/TheNetReturn/Shopify`
- Working branch appears to be `brand-revamp-2026`; do not assume the tree is clean.
- Source Shopify theme: `149365096541`, currently treated as the Brand Revamp draft theme.
- Header group has `brand-marquee`, disabled legacy `announcement-bar`, and `header`.
- Header uses `navigation_menu: main-menu-2024`; `sidebar_navigation_menu` is currently blank, so mobile inherits the desktop menu.
- Current header restyle is CSS-only except for the logo render in `sections/header.liquid`.
- Current footer group has `text-with-icons`, `brand-footer-cta`, and `footer`; `net-brand-usp` is disabled.
- Current footer is visually restyled through `assets/brand-revamp.css.liquid`, with `settings.footer_background` set to Shadow Green `#233A35`.
- Existing docs to read first:
  - `README.md`
  - `docs/setup-status.md`
  - `docs/brand-revamp-2026.md`
  - `docs/header-side-menu-optimization-audit-2026-05-19.md`
  - `docs/competitive-research/premium-dtc-ux-patterns-2026-05-13.md` if present.

## Files And Responsibilities

- `assets/brand-revamp.css.liquid`: Brand-scoped visual refinements for header, drawer, mega menu, footer CTA, footer link grid, newsletter, and trust strip. Keep Focal overrides scoped to exact sections/surfaces.
- `sections/header.liquid`: Header shell, logo rendering, mobile drawer include, utility links, stale campaign logic. Touch only when markup or accessibility requires it.
- `snippets/desktop-menu.liquid`: Desktop mega-menu structure, category columns, guided-card placement, and optional helper labels.
- `snippets/mobile-menu.liquid`: Mobile drawer structure. This is the likely place for tappable parent labels plus separate expand toggles.
- `sections/footer.liquid`: Footer block rendering. Touch only if CSS cannot solve hierarchy, logo placement, newsletter positioning, or footer CTA handoff.
- `sections/brand-footer-cta.liquid`: Above-footer advisory CTA. Keep editable in admin.
- `sections/header-group.json`: Theme-editor config for header, marquee, desktop menu, and optional mobile menu handle. Auto-generated file; edit carefully and document admin equivalents.
- `sections/footer-group.json`: Theme-editor config for footer blocks and CTA placement. Auto-generated file; edit carefully and document admin equivalents.
- `docs/brand-revamp-2026.md`: Update with completed decisions, files touched, preview screenshots, caveats.
- `docs/header-footer-navigation-handoff.md`: Create or update with admin navigation changes that cannot be represented safely in theme code.

---

## Design Direction

The current direction should become more premium, more useful, and less decorative. The header should feel like a clean buying map: compact top-level choices, obvious guided help, and a mobile drawer that gets people to product paths fast. The footer should feel like a strong closing system: confidence, expert help, key links, newsletter, social proof, and legal/utility details in a calm hierarchy.

Borrow from these patterns already documented in competitive research:

- Apple: comparison pages and nav surfaces offer "shop", "get help choosing", and "guided tour" style exits near high-intent decisions.
- GoPro: comparison and product-selection paths are specific, action-oriented, and attached to product outcomes.
- YETI: shopping language maps to customer intent and usage, not just internal product families.
- Meta: immersive product-in-use visuals and one dominant CTA are more persuasive than cluttered link stacks.
- Blue Tees: category ecosystems and "complete your gear" cross-sells can increase confidence and AOV without feeling unrelated.

Do not copy early blocking popups, long mobile preambles, or decorative menu content that delays shopping.

---

## Recommended Header And Navigation Shape

### Desktop Header

Keep the top level compact:

- Shop
- Compare
- Build Your Setup
- Learn
- Support

Recommended rationale:

- `Shop` remains the product-category entry.
- `Compare` should be promoted out of a vague `Explore` bucket because it is a core buying aid.
- `Build Your Setup` is a guided commerce action and deserves first-level visibility.
- `Learn` can hold education, FAQs, installation, videos, and story content.
- `Support` should cover contact, expert help, warranty, shipping, returns, and account-adjacent needs.

If the merchant wants only three top-level labels, use:

- Shop
- Compare
- Learn & Support

and keep `Build Your Setup` as a high-emphasis guided card inside `Shop`.

### Desktop Shop Mega Menu

Recommended order:

1. Core product columns: Nets, Packages, Simulation, Accessories.
2. Secondary product columns: Football, Replacement Parts.
3. Guided row/cards: Compare Nets, Take The Quiz, Build Your Setup, Talk To An Expert.

Visual direction:

- Reduce repetitive Precision+ glyph usage if every link currently has one; reserve the glyph for top-level nav, section labels, or active/hover states.
- Add hierarchy through spacing, column labels, and one helper line such as "Not sure where to start?"
- Keep cards useful and image-led, but do not let image cards overpower core product links.

### Mobile Drawer

Mobile should not mirror desktop exactly. Recommended first-level order:

1. Shop Nets
2. Shop Packages
3. Shop Simulation
4. Shop Accessories
5. Compare Nets
6. Build Your Setup
7. Take The Quiz
8. Talk To An Expert
9. Learn & Support

If using nested mobile groups, preserve tappable parent category links and put the expand chevron in a separate control. Do not make category labels expand-only.

---

## Recommended Footer Shape

The footer should be a conversion and confidence layer, not just a link dump.

Recommended order from top to bottom:

1. Compact trust strip: 3-Year Warranty, Free Shipping, Since 2009, Expert Support.
2. Advisory CTA panel: "Talk to a Net Return advisor" with one clear button.
3. Main footer:
   - Brand mark or wordmark plus one concise trust statement.
   - Shop links.
   - Compare / guided shopping links.
   - Support links.
   - Newsletter, with a benefit-specific promise.
4. Footer bottom:
   - Social.
   - Payment icons.
   - Country/language if needed.
   - Legal/copyright.

Visual direction:

- Keep Shadow Green as the anchor footer color if it still reads premium in screenshots.
- Avoid making every footer link uppercase with a glyph if it feels busy. Use mono-cap headings and simpler readable links.
- Give the newsletter its own quiet area; do not let it look like another link column.
- Consider using the staged `nr-symbol-white.png` or `nr-wordmark-white.png` directly in the footer instead of relying only on the social block image.

---

## Task 1: Refresh Evidence Before Editing

**Files:**
- Read: `README.md`
- Read: `docs/setup-status.md`
- Read: `docs/brand-revamp-2026.md`
- Read: `docs/header-side-menu-optimization-audit-2026-05-19.md`
- Read: `assets/brand-revamp.css.liquid`
- Read: `sections/header-group.json`
- Read: `sections/footer-group.json`

- [ ] Check current git state so unrelated work is not overwritten.
- [ ] Start a local Shopify preview with `PATH=/Users/kelton1/.local/bin:$PATH npm run theme:dev`.
- [ ] Capture desktop screenshots at 1440px wide:
  - Home top header closed.
  - Shop mega menu open.
  - Footer top/trust strip/CTA.
  - Footer lower link/newsletter/social area.
- [ ] Capture mobile screenshots around 390px wide:
  - Header closed.
  - Mobile drawer top state.
  - Shop expanded.
  - Footer top/trust strip/CTA.
  - Footer lower link/newsletter/social area.
- [ ] Save screenshots under `output/playwright/header-footer-optimization-2026-05-20/`.
- [ ] Write a quick visual diagnosis in `docs/header-footer-navigation-handoff.md` with three lists: keep, fix, decide.

Expected outcome: the next edit pass is based on the actual current rendered theme, not memory of prior screenshots.

## Task 2: Gather Focused Inspiration

**Files:**
- Modify: `docs/header-footer-navigation-handoff.md`
- Optional read: `docs/competitive-research/premium-dtc-ux-patterns-2026-05-13.md`

- [ ] Pull 4-6 current inspiration examples for header/mega-menu/mobile drawer/footer patterns. Prioritize Apple, YETI, GoPro, premium golf/simulator retailers, and one clean DTC equipment brand.
- [ ] Do not copy brand styling directly. Extract patterns only:
  - Menu hierarchy.
  - Guided-help placement.
  - Mobile drawer order.
  - Footer trust/CTA/link/newsletter hierarchy.
  - Popup behavior around nav.
- [ ] Add a short "What to borrow" section to `docs/header-footer-navigation-handoff.md`.
- [ ] Add a short "What to avoid" section, especially for popups blocking navigation and overdecorated link lists.

Expected outcome: inspiration is translated into decisions for TheNetReturn, not collected as a mood board without action.

## Task 3: Decide Navigation Information Architecture

**Files:**
- Modify: `docs/header-footer-navigation-handoff.md`
- Potential admin/config: Shopify Navigation menus
- Potential modify: `sections/header-group.json`

- [ ] Confirm whether the top-level desktop nav should be five-item (`Shop`, `Compare`, `Build Your Setup`, `Learn`, `Support`) or compact three-item (`Shop`, `Compare`, `Learn & Support`).
- [ ] Define the `Shop` mega-menu order exactly:
  - Nets
  - Packages
  - Simulation
  - Accessories
  - Football
  - Replacement Parts
  - Compare Nets
  - Take The Quiz
  - Build Your Setup
  - Talk To An Expert
- [ ] Define a dedicated mobile menu order:
  - Shop Nets
  - Shop Packages
  - Shop Simulation
  - Shop Accessories
  - Compare Nets
  - Build Your Setup
  - Take The Quiz
  - Talk To An Expert
  - Learn & Support
- [ ] Normalize same-site absolute links to relative links where Shopify Navigation allows it.
- [ ] Verify and fix suspicious Simulation anchors called out in the audit:
  - `/collections/simulation#simulator-bays`
  - `/collections/simulation#simulator-packages`
  - `/collections/simulation#sim-add-ons`
  - `/collections/simulation#launch-monitors`
  - `/collections/simulation#computers-projectors`
- [ ] Document every Shopify Admin navigation change in the handoff doc because menu linklists are store data, not normal theme code.

Expected outcome: the next code pass is not polishing around a weak menu structure.

## Task 4: Improve Mobile Drawer Behavior

**Files:**
- Modify: `snippets/mobile-menu.liquid`
- Modify: `assets/brand-revamp.css.liquid`
- Optional modify: `sections/header-group.json`

- [ ] If a dedicated `sidebar_navigation_menu` is configured and contains mostly direct links, keep Liquid changes minimal.
- [ ] If nested mobile groups remain, update parent rows so the label is a real link when `link.url` is not `#`, with a separate icon button to expand children.
- [ ] Keep `#` parent items as non-navigating labels/buttons.
- [ ] Make guided actions visible before deep category accordions when `Shop` is expanded.
- [ ] Rebalance mobile visual style:
  - Larger touch targets.
  - Clear active/expanded states.
  - Fewer decorative glyphs inside dense nested lists.
  - Strong contrast on chevrons and close/search/account controls.
- [ ] Validate with keyboard, touch/click, and screen-reader-friendly labels.

Expected outcome: mobile shoppers can reach primary buying paths in one tap and can still expand submenus without losing parent category links.

## Task 5: Refine Desktop Header And Mega Menu

**Files:**
- Modify: `snippets/desktop-menu.liquid`
- Modify: `assets/brand-revamp.css.liquid`
- Optional modify: `sections/header.liquid`
- Optional modify: `sections/header-group.json`

- [ ] Make the mega menu hierarchy feel deliberate:
  - Product categories first.
  - Guided shopping second.
  - Support/education only where relevant.
- [ ] Replace vague helper copy with one concise decision-support label such as "Not sure where to start?"
- [ ] Promote `Compare Nets` if the agreed IA keeps it inside `Shop`.
- [ ] Tune spacing, typography, and hover states so the menu feels premium rather than busy.
- [ ] Reconsider utility links:
  - If `show_icons` remains false, text links must be compact and polished.
  - If icons are enabled, confirm Search, Account, and Cart remain clear on desktop and mobile.
- [ ] Remove or setting-gate stale header campaign behavior in `sections/header.liquid` if any `Black Friday`, `BFCM`, `bfcm-menu-highlight`, or `bf-sale-link` code still exists.

Expected outcome: desktop navigation feels like a premium product finder, not a themed list of links.

## Task 6: Refine Footer Content And Hierarchy

**Files:**
- Modify: `sections/footer-group.json`
- Modify: `sections/footer.liquid` only if markup is needed.
- Modify: `sections/brand-footer-cta.liquid` only if CTA structure needs adjustment.
- Modify: `assets/brand-revamp.css.liquid`

- [ ] Confirm whether `text-with-icons` should remain above the CTA. If it remains, restyle it so it belongs visually with the brand footer instead of looking like old Focal content.
- [ ] Keep the advisory CTA panel, but make sure it does not feel like a disconnected billboard.
- [ ] Reorganize footer blocks around shopper intent:
  - Shop
  - Compare & Guides
  - Support
  - Company or Learn
  - Newsletter
- [ ] Improve newsletter copy from generic "latest news and exclusive deals" to a more useful promise, such as setup tips, buying guides, product updates, and occasional offers.
- [ ] Add a dedicated footer brand mark or wordmark if visual review shows the current social block logo feels accidental.
- [ ] Reduce footer link decoration if the repeated glyphs make the footer noisy. Prefer mono headings, readable body links, and precise hover states.
- [ ] Keep legal/payment/localization utilities visible but visually subordinate.

Expected outcome: the footer closes the shopping journey with confidence, help, and clean next steps.

## Task 7: Popup And Overlay Interaction Check

**Files:**
- Modify only after identifying the popup source; likely app embeds, theme settings, or app-specific snippets rather than header/footer code.
- Document: `docs/header-footer-navigation-handoff.md`

- [ ] Test desktop Shop hover/click with marketing popups enabled.
- [ ] Test mobile drawer open with popups enabled.
- [ ] If popups block navigation, identify the source app/embed and document the recommended admin setting:
  - Delay until after first scroll or 8-12 seconds.
  - Prevent multiple popups from stacking.
  - Suppress on first page interaction with header/menu.
- [ ] Do not hard-code popup suppression into the header unless the source app cannot be configured safely.

Expected outcome: the header remains usable in real storefront conditions, not only clean preview sessions.

## Task 8: Validation And Handoff

**Files:**
- Modify: `docs/brand-revamp-2026.md`
- Modify: `docs/header-footer-navigation-handoff.md`
- Optional create: `docs/header-footer-navigation-qa-2026-05-20.md`

- [ ] Run `PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check` and record whether failures are pre-existing or new.
- [ ] Capture final desktop and mobile screenshots for:
  - Header closed.
  - Shop mega menu open.
  - Mobile drawer top.
  - Mobile drawer guided/shop state.
  - Footer full desktop.
  - Footer full mobile.
- [ ] Check for horizontal overflow on mobile.
- [ ] Confirm all primary nav links resolve to real destinations.
- [ ] Confirm parent category labels remain navigable on mobile if nested menus remain.
- [ ] Confirm CTA links:
  - Compare Nets.
  - Build Your Setup.
  - Take The Quiz.
  - Talk To An Expert / Contact.
  - Footer Book a Call.
- [ ] Update `docs/brand-revamp-2026.md` with files touched, screenshots, QA notes, and caveats.
- [ ] Commit in focused slices:
  - `docs: add header footer optimization handoff`
  - `feat(nav): refine header and mobile menu hierarchy`
  - `feat(footer): refine footer hierarchy and styling`
  - `docs: record header footer QA`

Expected outcome: the next handoff is clear, visual, and reproducible.

---

## Guardrails

- Do not run `shopify theme push` or publish commands unless the user explicitly approves.
- Treat `sections/header-group.json` and `sections/footer-group.json` as admin-generated config files; edit carefully and document equivalent admin changes.
- Do not revert unrelated dirty files.
- Keep home page and product page work out of scope unless a header/footer dependency requires a tiny scoped adjustment.
- Keep component overrides scoped. Broad `.drawer` or `.footer` changes can affect search, cart, filters, product help, and other Focal components.
- Preserve mobile parent-category navigation. A category label with a real URL should not become expand-only.
- Stop QA after representative checks if Shopify preview begins showing bot/challenge behavior or rate limiting.
