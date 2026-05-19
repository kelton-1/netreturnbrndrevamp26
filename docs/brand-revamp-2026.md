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

- The existing Focal `announcement-bar` section is still in the group but its blocks are all `disabled`. We can either delete it entirely or leave it as a fallback — defer the call until visual review.
- Default messages are placeholder marketing copy; merchant should edit in admin (Theme editor → Header → Brand marquee → blocks).
