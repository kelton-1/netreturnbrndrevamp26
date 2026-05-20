# Brand Revamp 2026 — progress log

Working doc for the COO-driven brand redesign. Branch: `brand-revamp-2026`. Theme: `149365096541` (renamed to "Brand Revamp" in admin).

## Decisions on the table (locked)

- **Fonts**: deferred. Theme keeps current Inter until licensed Crystal (NewGlyph) and Miracle Mono (Keith Zo) are purchased. Brand CSS uses `font-stretch` axis so Crystal swap-in later requires no markup changes.
- **Logo**: keep current header PNG until new wordmark SVGs are delivered. `UPDATED .../LOGOS/` is empty in the toolkit.
- **Theme workflow**: working in-place on `149365096541` (not a duplicate). Backups handled by Shopify admin.
- **Photo source of truth**: `UPDATED .../PHOTOGRAPHY/PHOTOGRAPHY/` (31 selects). Mapping below.
- **Copy**: mockup headlines are real and ship as-is.

## Photo mapping

| Surface | Photo | Notes |
|---|---|---|
| Hero "Train With Intent." | `PHOTOGRAPHY SELECTS-14.png` | Male swing action, NET RETURN backdrop |
| Bryson feature panel | `PHOTOGRAPHY SELECTS-18.png` (or #17 swing alt) | Clean portrait for outlined-stroke "BRYSON" overlay |
| NETS+ card | #29 or #30 | Outdoor net install |
| PACKAGES+ card | #07 | Backyard patio package |
| SIMULATION+ card | #08 (or #28 in-use) | Indoor sim |
| ACCESSORIES+ card | #34 | Net mesh detail (no hat shot in toolkit) |
| PRO SERIES feature | #13 or #21 | Studio portrait, arms crossed |

Original photos are 3–19 MB PNGs. Web-optimized JPGs (max 1920px wide, q≈80) get staged in `assets/` per surface as each section is built.

## Color tokens (Phase 1 — done, commit `172351d`)

Active in `config/settings_data.json` `current` block. Brand hexes:

- Emerald `#009C43` (primary CTA, brand identifier)
- Shadow `#233A35` (anchor / dark surface)
- Glow `#A5E6C6` (soft surface / marquee bar)
- Neon `#68FD00` (small accent — secondary product label)
- Black `#000000`, White `#FFFFFF`

What changed: every Focal-stock surface (header, footer, primary button, accent, checkout) now uses the brand palette. What did **not** change: hardcoded greens in legacy campaign sections (`spring-2026`, `bfcm-landing`, `holiday-vm`, `cro-collection-grid`, etc.) — deferred to Phase 4 since they need real redesign, not a hex swap.

## Foundation CSS (Phase 2 — done, commit `7b8ca91`)

New file `assets/brand-revamp.css.liquid`, brand-prefixed only, registered globally in `layout/theme.liquid`.

Utilities provided:

- `.brand-surface` + `--shadow|emerald|glow|white|pattern` modifiers
- `.brand-container`, `.brand-section[--tight]`
- `.brand-eyebrow`, `.brand-body`
- `.brand-headline` + `__em` modifier (mixed-weight); `--display` for oversized; `--stroke` for outlined display type
- `.brand-btn` + `--primary|outline|ghost-dark`
- `.brand-marquee` + `__track`/`__item`
- `.brand-plus` (CSS-masked Precision+ inline glyph)

Asset library staged in `assets/`:

- `precision-plus-{white,black,shadow-green}.svg`
- `pattern-grid-{black,shadow-green,glow-green}.svg` (1920×1080 source)
- `pattern-grid-tile-{white,black}.svg` (80×80 repeatable tile)

## In-flight / queued

Track via TaskList. Current queue:

- #4 Marquee announcement bar
- #5 Header rebuild
- #6 Footer rebuild
- #7 Hero immersive
- #8 Category grid
- #9 Feature display-stroke section

Each section gets a subsection appended below as it lands, with the file paths touched + a preview screenshot reference.

---

## #4 — Brand marquee (done)

**Files**

- `sections/brand-marquee.liquid` — new section. Blocks-based (1 block per message, up to 12). Schema settings: scroll duration, accessible label. Preset comes with 4 default messages.
- `sections/header-group.json` — added `brand-marquee` to the group's `sections` map and prepended to `order` so it sits above the existing `announcement-bar` and `header`.

**Behavior**

- Glow Green `#A5E6C6` bar pinned above the header on every page (via header section group).
- Items duplicated in markup for a seamless `translateX(-50%)` loop; `prefers-reduced-motion` disables the animation and centers the text.
- Each item is separated by a Precision+ glyph (`.brand-plus`, CSS-masked SVG).
- Items can optionally link to a URL (hover gets a subtle underline).

**Preview**

- Self-contained desktop + mobile previews in `/tmp/component-previews/marquee-{desktop,mobile}.png`.
- Live in dev preview at http://127.0.0.1:9292/ (Shopify edge bot-challenges headless browsers, so manual verification in your real Chrome is the easiest way to see it animate).

**Caveats / follow-ups**

- The legacy Focal `announcement-bar` is left in the header group with `"disabled": true` so it stays hidden but isn't deleted (fallback per user request).
- Default messages are approved: shipping / warranty / Bryson / 30-day trial.

---

## Logo assets staged

Resized from the agency-approved local PNGs (`Logos/NR Full {White,Black}.png` 11813×3812 RGBA) into web-optimized variants:

- `assets/nr-wordmark-white.png` — 1200×387 (~34 KB)
- `assets/nr-wordmark-black.png` — 1200×387 (~37 KB)
- `assets/nr-symbol-white.png` — 600×686 (~43 KB)
- `assets/nr-symbol-black.png` — 600×686 (~45 KB)

The header uses the white wordmark; black + symbol variants are pre-staged for footer, favicon, and any light-surface contexts. New logos from the agency (when the empty `UPDATED .../LOGOS/` folder gets filled) can drop in by overwriting these same filenames — no markup changes required.

---

## #5 — Header rebuild (done)

**Files**

- `assets/brand-revamp.css.liquid` — appended a "Header restyle" CSS block. Targets Focal's existing `.header__*`, `.nav-dropdown__*`, `.drawer`, `.mobile-nav__*` classes. No HTML refactor — just visual overrides.
- `sections/header.liquid` — replaced the logo render block. Now serves `nr-wordmark-white.png` from theme assets unconditionally (header is dark by design, white wordmark always applies). Removed the `transparent_logo` conditional and shop-name text fallback — both now obsolete.

**Behavior**

- Pure black header surface, white text, 1px bottom hairline.
- Top-level nav links: uppercase, condensed feel (`font-stretch: 80%` engages variable-font axis when present), each prefixed with an Emerald Precision+ glyph that rotates 90° on hover (turns Neon).
- Icons (search/account/cart) white; Emerald on hover. Cart count badge in Emerald.
- Locale/country popover buttons match the dark canvas with muted white.
- Dropdown menus and Focal's mega-menu adopt the dark surface.
- Mobile drawer: dark canvas, items larger and uppercase with Precision+ prefix, subtle hairline dividers.

**Preview**

- Self-contained: `/tmp/component-previews/header-{desktop,mobile}.png`.
- Live: http://127.0.0.1:9292/ — verified the white wordmark asset is serving from Shopify CDN.

**Caveats / follow-ups**

- Logo `src` is now hardcoded to the staged asset. If we want merchant-editable logo swap later (e.g. seasonal mark), reintroduce the `section.settings.logo` reference behind a "use brand revamp logo" toggle in the section schema. Defer.
- Approved white wordmark works for the dark header. When we get to surfaces that need the black wordmark (e.g. white-card areas, email templates, certain promo sections), the asset is already staged as `nr-wordmark-black.png`.
- Transparent-header variant is forced to black via `.header--transparent { background: ... !important }` — no longer supports image overlay heroes with a see-through nav. If the hero design requires a transparent header, we'll need to revisit.

---

## #6 — Footer rebuild (done)

**Files**

- `sections/brand-footer-cta.liquid` — new section. Shadow Green panel with grid pattern overlay, centered heading + body + Emerald "Book a call" CTA. Editable from admin (heading, body, CTA text, CTA link).
- `sections/footer-group.json` — registered `brand-footer-cta` and prepended it in `order` so it sits between the existing `text-with-icons` section and the main `footer`.
- `config/settings_data.json` — `footer_background` changed from Black `#000000` to Shadow Green `#233A35` per the brand color combos page (Shadow Green is the anchor for surfaces; Black is reserved for the header).
- `assets/brand-revamp.css.liquid` — added a Footer CTA section block and a Footer restyle block. Targets Focal's existing `.footer`, `.footer__inner`, `.linklist__item`, `.footer__follow-*`, `.footer__aside` classes.

**Behavior**

- Above the footer: Shadow Green CTA panel with subtle grid pattern overlay, centered "Talk to a Net Return advisor" heading, body copy, Emerald CTA button.
- Footer surface: Shadow Green via tokens (consistent with the CTA panel above for a single visual block).
- Block headings (Shop, Explore, etc.) restyled to mono-cap eyebrows.
- Link list items: condensed uppercase with Emerald Precision+ glyph prefix; hover turns text and glyph to Neon Green.
- Newsletter input: borderless except for a bottom rule, Emerald focus underline.
- Social icons + payment methods row inherit white with subtle opacity.
- Footer aside (copyright + locale selector): mono-cap, hairline divider, lower opacity.

**Preview**

- `/tmp/component-previews/footer-{desktop,mobile}.png`.
- Live: http://127.0.0.1:9292/ — synced and serving on the dev theme.

**Caveats / follow-ups**

- `cta_link` setting doesn't carry a default URL — Shopify schema rejects literal string defaults for `url` settings. Merchant sets the link in admin; preset ships unlinked. The default text "Book a call now" still applies via section settings.
- Monogram-only logo replacing the wordmark in the footer (per mockup) — not yet done. The footer block currently relies on Focal's social_media block to render `TNR-Symbol-FullColor-Light.png`. We can add a dedicated monogram block above the link grid in a follow-up.
- The existing `net-brand-usp` and `text-with-icons` sections at the top of the footer group are unchanged — their visual is still old-Focal-green per Phase 4 deferral (legacy campaign sections list).
