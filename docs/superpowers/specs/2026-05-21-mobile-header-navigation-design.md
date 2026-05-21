# Mobile Header And Full-Screen Navigation Design

Date: 2026-05-21  
Workspace: `/Users/kelton1/Developer/TheNetReturn/Shopify`  
Status: Approved concept, not implemented

## Goal

Adopt the best parts of the Allbirds and Shark/Ninja header references for The Net Return: a premium floating header island, transparent-over-hero behavior, right-hand mobile menu ergonomics, and a full-screen mobile navigation experience that still follows the current brand-revamp token system.

## Inspiration Files

Screenshots are preserved in `docs/inspiration/header-mobile-nav-2026-05-21/`:

- `allbirds-floating-header.png`
- `allbirds-fullscreen-menu.png`
- `sharkninja-transparent-mobile-header.png`
- `sharkninja-fullscreen-menu.png`

Use these as pattern references only. Do not copy brand styling, logos, exact spacing, or content hierarchy directly.

## Current Theme Context

The implementation should build on the existing Focal theme structure:

- `sections/header.liquid` controls the header shell, logo rendering, utility icons, transparent-header setting, and mobile menu include.
- `snippets/mobile-menu.liquid` controls the current mobile drawer content.
- `snippets/desktop-menu.liquid` controls desktop dropdown and mega-menu content.
- `sections/header-group.json` currently configures `main-menu-2024`, blank `sidebar_navigation_menu`, sticky header enabled, and transparent header disabled.
- `assets/brand-revamp.css.liquid` contains the active 2026 brand system and should be the primary styling surface.

The working tree already contains unrelated brand/header changes. Implementation must use narrowly scoped edits and avoid overwriting unrelated work.

## Brand System Requirements

All styling must use the current brand tokens and conventions in `assets/brand-revamp.css.liquid`.

Use these existing token families rather than ad hoc values:

- Color: `--brand-black`, `--brand-white`, `--brand-shadow`, `--brand-emerald`, `--brand-glow`, `--brand-neon`
- Typography: `--brand-font-body`, `--brand-font-heading`, `--brand-font-display`, `--brand-font-accent`, `--brand-font-nav`, `--brand-font-action`
- Sizing/letter spacing: `--brand-fs-nav`, `--brand-fs-action`, `--brand-fs-meta`, `--brand-ls-normal`, `--brand-ls-nav`, `--brand-ls-action`
- Motion: `--brand-motion-curve`, `--brand-motion-out`, `--brand-motion-in-duration`, `--brand-motion-out-duration`

The header island should feel premium and almost sharp, not pill-like. Target a small radius around `6px` if that fits the surrounding system, and avoid the very rounded Allbirds shape.

## Approved Mobile Header Direction

The mobile header order is locked:

1. Net Return logo
2. Flexible open space
3. Search
4. Login/account
5. Cart
6. Menu button on the far right

The menu button stays far right to support right-handed thumb access. The account control should be the theme's account/login icon or a clearly account-oriented icon, not a heart/favorites icon unless the store intentionally adds favorites as a separate feature.

## Mobile Header Visual Behavior

Closed state at top of homepage hero:

- The header appears as a floating island over hero media.
- The island may be transparent or glass-like while preserving text/icon contrast.
- The layout should feel closer to Shark/Ninja's transparent immersive hero, with Allbirds' floating surface discipline.

Scrolled state:

- The header island becomes solid enough for readability.
- The transition should be subtle and use existing brand motion tokens.
- Sticky behavior should reuse the existing Focal sticky-header mechanics where possible.

Transparency scope:

- Transparent island behavior is approved for the homepage hero only.
- Do not extend transparent header behavior to other hero-led templates in this implementation pass.

Non-homepage state:

- Do not force transparent behavior on every page.
- Product, collection, cart, and content pages should default to a readable solid island unless a page-specific hero supports transparency safely.

## Full-Screen Mobile Menu Direction

Opening the far-right menu should create a full-screen mobile navigation experience.

Required structure:

- Keep the header island visible at the top of the open menu.
- Replace the far-right menu icon with a close icon in the same position.
- Render the menu as a full-screen surface, not the current partial slide-in feel.
- Use a dark brand surface for the menu, drawing from `--brand-black`, `--brand-shadow`, `--brand-white`, `--brand-glow`, and `--brand-emerald`.
- Primary links should be large, high-contrast, and right-arrow oriented.
- Bottom utility links should remain available without competing with the main buying paths.

Recommended menu order:

1. Shop Nets
2. Shop Packages
3. Simulation
4. Accessories
5. Compare Nets
6. Build Your Setup
7. Talk To An Expert
8. Learn & Support

Recommended bottom utilities:

- My Account
- Order Status
- Product Support

## Desktop Header Direction

Adopt the floating island feel on desktop as a header surface refinement, but do not disrupt the current desktop navigation hierarchy until the final IA is approved.

Desktop should:

- Preserve the current desktop menu and mega-menu behavior.
- Use the island surface, sharper corners, and brand-token styling to make the header feel lighter and more premium.
- Avoid adding a full-screen desktop menu.
- Keep mega-menu changes separate from the mobile full-screen menu work unless the implementation plan explicitly includes them.

## Accessibility And Interaction Requirements

- Preserve Focal's accessible drawer/toggle mechanics where possible.
- The menu open button and close button must have clear accessible names.
- Focus should move into the full-screen menu when opened and return to the menu button when closed.
- Body scroll should be locked while the full-screen menu is open.
- Tap targets should be at least 44px tall.
- Motion must respect reduced-motion preferences.

## Implementation Boundaries

Use CSS-first changes where possible, but do not fake full-screen behavior with brittle visual hacks if the drawer markup needs a small structural adjustment.

Likely implementation files:

- Modify `assets/brand-revamp.css.liquid` for header island, transparent/solid states, mobile full-screen menu styling, and motion.
- Modify `sections/header.liquid` only if the mobile icon order, account visibility, or transparent-state hooks cannot be achieved with existing markup.
- Modify `snippets/mobile-menu.liquid` for the full-screen menu structure and utility link placement.
- Modify `sections/header-group.json` only to enable homepage transparent header behavior or set a dedicated mobile menu handle after confirming the correct theme target.
- Mobile menu content should be controlled by Shopify Navigation through `sidebar_navigation_menu`, not hardcoded as the final production source of truth.

Do not push, publish, or mutate the Shopify source theme without explicit approval.

## Validation Plan

Before claiming implementation complete, validate:

- Mobile homepage at around 390px wide: top-of-hero transparent island, scrolled solid island, menu open full-screen.
- Mobile collection/product page: readable solid island and full-screen menu.
- Desktop homepage: floating island does not break desktop nav or mega-menu hover.
- Cart count remains visible and correctly positioned.
- Account/login, search, cart, and menu controls remain tappable.
- No horizontal overflow at mobile widths.
- Theme Check does not introduce new errors in changed files.
- Existing validator `scripts/validate-header-footer-navigation.mjs` still passes or is updated deliberately if requirements change.

## Decisions Confirmed Before Implementation

- Transparent island behavior applies only to the homepage hero.
- The open full-screen mobile menu should use a dark brand surface.
- Final mobile menu content should be controlled by Shopify Navigation through `sidebar_navigation_menu`.
