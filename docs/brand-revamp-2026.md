# Brand Revamp 2026 — progress log

Working doc for the COO-driven brand redesign. Branch: `brand-revamp-2026`. Theme: `149365096541` (renamed to "Brand Revamp" in admin).

## Decisions on the table (locked)

- **Fonts**: delivered and staged. Crystal powers body copy and standard headings; Crystal Ultra Condensed SemiBold is reserved for oversized/display headline moments; Miracle Mono Regular powers small copy and accents such as nav, eyebrows, meta, marquee, and buttons. A focused web subset is staged in theme assets rather than uploading the full Crystal source family.
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
- `brand-crystal-{light,regular,semibold,ultra-condensed-semibold}.ttf`
- `brand-miracle-mono-regular.otf`

## In-flight / queued

Track via TaskList. Current queue:

- ~~#4 Marquee announcement bar~~ (done)
- ~~#5 Header rebuild~~ (done)
- ~~#6 Footer rebuild~~ (done)
- ~~#7 Hero immersive~~ (done)
- ~~#8 Category grid~~ (done)
- ~~#9 Product story / Don't Settle~~ (done)
- ~~#10 Bryson feature panel~~ (done)
- #11 PRO SERIES studio feature (photo #13 or #21) — next

Each section gets a subsection appended below as it lands, with the file paths touched + a preview screenshot reference.

---

## Homepage logic cleanup

**Date:** 2026-05-20

**Files**

- `assets/brand-revamp.css.liquid`
- `sections/brand-proof-system.liquid`
- `templates/index.json`

**Changes**

- Disabled the legacy "Simulation" image-overlay section because Simulation is now covered in the new four-card category grid.
- Disabled the legacy "Trusted by the Pros" Bryson image/text block because the new `brand-bryson-feature` section now owns that message with the updated "Shop Bryson's setup" CTA.
- Disabled the old Bryson/Vimeo video section that previously followed "Trusted by the Pros"; the homepage now has the new `brand-film` section for motion and the new Bryson feature for ambassador proof.
- Added `sections/brand-proof-system.liquid`, a new brand-system proof module, and placed it after Best Sellers.
- Disabled the duplicate lower category grid (`tnr_collection_list_VRWxpC`) because the new `brand-category-grid` owns category orientation.
- Disabled the legacy 3D logo spin video (`video_49RaHd`) because the new `brand-film` owns the homepage motion moment.
- Disabled the old Pro/Sim tab block, the icon strip, and the Instant Return/Quick Assembly tab block because the new proof module consolidates those jobs into one intentional section.

**Rationale**

The new homepage opening sequence should read as one intentional brand story: hero, category orientation, problem/solution, brand film, Bryson proof. Leaving the older Simulation and Bryson modules active created duplicate jobs lower on the page and made the experience feel like two homepages stitched together.

The proof sequence was also fragmented across several older modules. The new `brand-proof-system` keeps the strongest claims -- instant return, fast assembly, indoor/outdoor flexibility, and warranty -- but presents them as one premium engineering story instead of separate stock-theme bands.

**Next cleanup candidates**

- `rich_text_tkbxXR` has good intent but should become a stronger guided-shopping CTA rather than a quiet generic quiz block.
- `image_with_text_overlay_YtBHJk` still sends shoppers to Build Your Setup, but its old overlay style should eventually be replaced by an interactive decision strip.

---

## Homepage testimonial wall

**Date:** 2026-05-20

**Files**

- `sections/brand-testimonial-wall.liquid`
- `assets/brand-revamp.css.liquid`
- `templates/index.json`

**Changes**

- Added a new `brand-testimonial-wall` homepage section to replace the generic Loox carousel presentation.
- Disabled the Loox app carousel section (`17139716501e2e2a7b`) but left its configuration parked in `templates/index.json` so it can be restored or referenced.
- Seeded the wall with four editable testimonial blocks, each supporting quote, author, customer context, product/setup, rating label, and optional image or fallback theme asset.
- Styled the section as a Shadow Green patterned editorial proof wall with one oversized featured quote and three supporting cards.

**Rationale**

The homepage now needs social proof that matches the brand system instead of dropping into a generic app carousel. The new wall keeps reviews prominent, more premium, and more scannable while still allowing the team to replace seeded excerpts/images with exact approved review copy from Loox or customer submissions.

**Follow-ups**

- Replace seeded review excerpts with exact approved review copy from Loox/admin if the team wants verbatim customer quotes.
- Add stronger customer setup imagery as real review media becomes available.
- Consider adding a small "from X reviews" aggregate metric once the source of truth is confirmed.

---

## Header/footer navigation completion

**Date:** 2026-05-20

**Files**

- `snippets/mobile-menu.liquid`
- `snippets/desktop-menu.liquid`
- `sections/header.liquid`
- `sections/header-group.json`
- `sections/footer-group.json`
- `assets/brand-revamp.css.liquid`
- `docs/header-footer-navigation-handoff.md`
- `scripts/validate-header-footer-navigation.mjs`

**Changes**

- Added a conversion-first quick-link stack at the top of the mobile drawer so mobile shoppers can jump directly to Nets, Packages, Simulation, Accessories, Compare, Build Your Setup, Quiz, expert help, and support.
- Updated nested mobile drawer rows so parent labels with real URLs remain tappable while a separate button expands child links.
- Moved mobile guided image cards above deep category accordions and added a concise `Not sure where to start?` helper label.
- Added the same decision-support label above desktop mega-menu image cards.
- Added brand mega-menu blocks for desktop `Explore` and `Learn` so they share the same hover layout as `Shop`, using unused setup/story/player imagery.
- Kept mobile responsive by limiting image-heavy mega-menu cards to `Shop`; `Explore` and `Learn` render as lighter accordion navigation on mobile.
- Removed stale sitewide BFCM/Black Friday header highlight CSS and JavaScript from `sections/header.liquid`.
- Re-enabled the footer trust strip, renamed customer-service copy to Expert Support, improved newsletter copy, and kept the existing footer linklists tied to the store's current `shop`, `explore`, and `learn` menus.
- Created `docs/header-footer-navigation-handoff.md` to separate code changes from Shopify Admin navigation decisions.

**Validation**

- Static validator: `node scripts/validate-header-footer-navigation.mjs`
- Shopify Liquid validator: `node .agents/skills/shopify-liquid/scripts/validate.mjs --theme-path /Users/kelton1/Developer/TheNetReturn/Shopify --files sections/header-group.json,snippets/mobile-menu.liquid,snippets/desktop-menu.liquid`
- Theme syntax: `PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check`
- Theme Check remained on the known baseline shape: `372 files inspected`, `161 total offenses`, `1 error`, `160 warnings`. The single error is still the existing `layout/theme.liquid` `ContentForHeaderModification`.
- Changed-file Theme Check review found only the existing `OrphanedSnippet` warnings for `snippets/mobile-menu.liquid` and `snippets/desktop-menu.liquid`; no errors in the changed header/footer files.
- Preview QA artifacts:
  - `output/playwright/header-footer-optimization-2026-05-20/desktop-header-footer.png`
  - `output/playwright/header-footer-optimization-2026-05-20/mobile-verification-blocked.png`
  - `output/playwright/header-nav-mega-2026-05-20/mobile-verification-blocked.png`

**Caveats / follow-ups**

- The final dedicated Shopify Navigation menu still belongs in Admin. The theme now provides the approved conversion-first quick links even while `sidebar_navigation_menu` remains blank.
- Footer columns still use the existing store menus (`shop`, `explore`, `learn`) because no repo-visible dedicated Support or Compare footer menu handle exists.
- Full Theme Check still exits on the known baseline `layout/theme.liquid` `ContentForHeaderModification` error.
- Popup timing/stacking, desktop `Explore`/`Learn` hover screenshots, and mobile drawer visuals must be confirmed with marketing embeds enabled in a real storefront session. Automated preview was blocked first by an unrelated dirty `templates/index.json` section-count issue, then by Shopify's connection-verification screen after running the preview with that homepage file ignored.

---

## Brand fonts staged

**Date:** 2026-05-20

**Files**

- `assets/brand-crystal-light.ttf`
- `assets/brand-crystal-regular.ttf`
- `assets/brand-crystal-semibold.ttf`
- `assets/brand-crystal-ultra-condensed-semibold.ttf`
- `assets/brand-miracle-mono-regular.otf`
- `assets/brand-revamp.css.liquid`

**Behavior**

- `@font-face` declarations live in the global brand revamp CSS, using Shopify `asset_url` references.
- `--brand-font-body` maps to Crystal Light/Regular/SemiBold and feeds Focal's `--text-font-family`, so standard body copy inherits Crystal.
- `--brand-font-heading` maps to Crystal SemiBold and feeds Focal's `--heading-font-family`, so ordinary section/product headings use the standard-width family.
- `--brand-font-display` maps to Crystal Ultra Condensed SemiBold and is reserved for `.brand-headline`, `.brand-headline--display`, `.heading--large`, `.h1`, and the footer CTA heading.
- `--brand-font-accent` / `--brand-font-mono` map to Miracle Mono Regular and drive small copy and accents: `.brand-eyebrow`, marquee, buttons, header nav, mobile nav, dropdown links, product micro-labels, footer block headings, footer links, and footer meta text.
- The source toolkit includes more Crystal files, and older staged copies still exist in `assets/` from the first pass. The active token layer references only the 2026 brand-guide subset listed above.

**Licensing note**

- The files were provided by the team for company use. I did not find or verify a separate license document inside the zip files, so keep the original source/package/license context available outside the theme repo.

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
- Top-level nav links: uppercase Miracle Mono accents, each prefixed with an Emerald Precision+ glyph that rotates 90° on hover (turns Neon).
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
- Link list items: uppercase Miracle Mono accents with Emerald Precision+ glyph prefix; hover turns text and glyph to Neon Green.
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

---

## Audit cleanup after footer pass (done)

**Date:** 2026-05-20
**Base commit:** `a0e25b5 feat(brand): footer rebuild + Book a Call CTA panel`

**Files**

- `assets/brand-revamp.css.liquid`
- `sections/brand-marquee.liquid`
- `layout/theme.liquid`
- `package.json`
- `CLAUDE.md`

**Why this cleanup happened**

This pass came from a review of the header/marquee/footer revamp after the footer commit landed. The goal was not to redesign Opus's work, but to remove systematic risks before more brand sections depend on the same foundation layer.

**Changes**

- Patterned brand surfaces no longer override their own base color with `background-color: inherit`. The footer CTA uses `brand-surface--shadow brand-surface--pattern`, so the pattern now layers over Shadow Green instead of accidentally inheriting a parent background.
- Marquee spacing moved from the outer track gap to each repeated item. Because the marquee animates exactly `translateX(-50%)`, both repeated groups need equal measured widths to avoid a small loop jump.
- The duplicated marquee group remains visually available for the seamless loop, but its links are now `tabindex="-1"` and its clone markup does not repeat `block.shopify_attributes`. This prevents keyboard users and the theme editor from encountering duplicate block controls.
- Header/dropdown/mega-menu dark styling is now scoped to the header group. The mobile drawer dark styling is scoped to `#mobile-menu-drawer`, so Focal's product help, size chart, store availability, cart/search, and collection filter drawers do not inherit the mobile menu look by accident.
- Brand CSS now uses Shopify's `stylesheet_tag: preload: true` form instead of a manual stylesheet preload link.
- Removed the `theme:push:revamp` npm script. Pushing to source theme `149365096541` is a real store mutation and should stay explicit in-session, not a convenient default script.

**Coordination note for Opus/Claude**

If you continue the brand revamp, preserve this scoping posture: brand utilities can stay global when they are opt-in (`.brand-*`), but Focal component overrides should be tied to the exact section/surface being redesigned. In particular, do not reintroduce broad `.drawer` styling unless you intentionally want every drawer type to change and have preview-QA'd filters, mini-cart/search, product help, size chart, and store availability.

---

## #7 — Hero immersive (done)

**Files**

- `sections/brand-hero.liquid` — new full-bleed homepage hero section with default Train With Intent copy, default staged desktop/mobile imagery, editable CTA settings, and a merchant image override path.
- `assets/brand-revamp.css.liquid` — added the shared hero presentation rules so the revamp keeps one brand CSS layer rather than section-local style blocks.
- `templates/index.json` — registered `brand_hero_train_with_intent` as the first homepage section and disabled the legacy slideshow as a fallback backup.
- `assets/brand-hero-train-with-intent-desktop.jpg`
- `assets/brand-hero-train-with-intent-mobile.jpg`

**Behavior**

- The first viewport now leads with the new full-bleed dark hero, "Train With Intent.", `Shop nets`, and `Build your setup`.
- The legacy slideshow is still present in the template data, but disabled, so it can be restored from the theme editor if the team wants to compare.
- The section defaults to optimized local JPGs created from the approved photography mapping, while still allowing merchant-picked images in the Shopify editor.

**Preview**

- `theme:dev` started successfully at `http://127.0.0.1:9292/` and synced to development theme `149375975517`.
- Browser QA confirmed the hero rendered with heading `Train With Intent.`, the desktop image loaded from Shopify CDN, and both CTAs resolved to `/collections/nets-1` and `/pages/build-your-setup`.
- Direct preview fetch confirmed `brand_hero_train_with_intent` is the first homepage section and the staged desktop/mobile hero assets are being served.
- Repeated browser reloads can still trip Shopify/Cloudflare "Verifying your connection..." on the local preview; use direct DOM checks or a normal authenticated browser tab after the first successful load.

---

## #8 — Category grid (done)

**Files**

- `sections/brand-category-grid.liquid` — new homepage section. Block-based (1 block per card, up to 6, default 4). Per-card settings: image picker, label, link, CTA text, and a `default_image_filename` fallback that points to a theme asset when the merchant clears the picker. Section settings: eyebrow, heading, columns (2-4).
- `assets/brand-category-revamp.css.liquid` block in `assets/brand-revamp.css.liquid` (`.brand-category-grid*` and `.brand-category-card*` rules). Aspect 3:4 cards, Shadow-Green base, bottom-up emerald-tinted scrim that deepens to black, Crystal Ultra Condensed label, Precision+ glyph prefix that turns Glow on hover, Miracle Mono "Shop X →" CTA with arrow nudge on hover, 4 / 2 / 1 column responsive breakpoints (≥1000 / ≥541 / mobile).
- `assets/brand-category-{nets,packages,simulation,accessories}.jpg` — web-optimized JPGs sourced from PHOTOGRAPHY SELECTS-29 (nets), -07 (backyard patio), -08 (sim setup), -34 (mesh detail) per the toolkit mapping.
- `templates/index.json` — registered `brand_category_grid_main` directly under the hero, with all four cards pre-configured to Nets / Packages / Simulation / Accessories collections.

**Behavior**

- Photo-led category nav under the hero — "Shop the system" eyebrow + "Built for every part of the work." heading.
- Each card defaults to its staged theme-asset JPG via `default_image_filename`, while still letting the merchant override per-card from the editor.
- Hover scales the image 4%, lifts the Precision+ glyph from Emerald to Glow, and slides the `→` arrow.
- Visited / focus rings use the brand outline-button treatment.

**Preview**

- Verified at 1440×900 (desktop): 4 cards × 321px each, computed `grid-template-columns` matches the breakpoint table.
- Verified at 375×812 (mobile): cards stack to single column, header logo serves `nr-wordmark-white.png`.
- DOM checks confirmed all four cards render the Precision+ glyph and the mono CTAs link correctly.

**Caveats / follow-ups**

- The grid sits over a Shadow-Green band; the section below it (currently the disabled `slideshow` / `trust_bar` legacy blocks) does not yet provide the contrasting white surface the mockup shows beneath. That handoff lands with the next section (#9 product story).
- "Accessories" defaults to PHOTOGRAPHY SELECTS-34 (net mesh detail) — there is no hat / accessory product shot in the toolkit; revisit when the next photoshoot lands.

---

## #9 — Product story / "Don't Settle" band (done)

**Files**

- `sections/brand-product-story.liquid` — new homepage editorial section with editable headline lines, body, CTA, image picker, and fallback asset filename.
- `assets/brand-revamp.css.liquid` — added the white Precision+ product-story layout, display headline treatment, product-image framing, and responsive stack.
- `templates/index.json` — inserted `brand_product_story_dont_settle` directly after the category grid and disabled the legacy `trust_bar_DdPqga` so the top of the homepage flows from custom hero → custom categories → custom product story.

**Behavior**

- White Precision+ field with oversized Emerald display type: `Don't / Settle / For less`.
- `For less` uses the brand guide's outlined display treatment rather than another filled line.
- Product image is pulled from the existing Shopify image `1400x1400-pro.png` and can be replaced from the theme editor.
- CTA defaults to `See the difference` and links to `/pages/compare`.

**Preview**

- Verified at 1440×900: section background `rgb(255,255,255)` ✓; heading renders Crystal Ultra Condensed at 144px in Emerald `rgb(0,156,67)` ✓; outlined `For less` line uses `webkitTextStroke: 1.5px rgba(0,156,67,.42)` with transparent fill ✓; CTA renders Emerald primary button ✓; product image loads from Shopify CDN.
- Verified at 375×812: copy and media columns stack to single column.

**Design note**

This section is intentionally closer to the user's reference than the older Focal sections below it: fewer boxes, a stronger editorial composition, true white surface, product as the hero object, and one clear Emerald action.

---

## #10 — Bryson feature panel (done)

**Files**

- `sections/brand-bryson-feature.liquid` — new full-bleed dark feature panel. Schema settings: desktop + mobile image pickers (with theme-asset fallbacks), image position (right / left / full-bleed), overlay darkness, outlined display word, eyebrow, tagline, body, CTA.
- `assets/brand-revamp.css.liquid` — new "Bryson feature panel" block. Reuses the product story's brand-guide outline display treatment (transparent fill + text-stroke) but on a dark canvas, so the stroke is white at 55% opacity instead of Emerald. Layered z-indexes: photo (z0) → black gradient overlay scoped per image position (z1) → outlined display word (z2) → copy column (z3).
- `assets/brand-bryson-portrait-{desktop,mobile}.jpg` — web-optimized JPGs (2400px / 1200px wide, q≈80) generated from PHOTOGRAPHY SELECTS-18 (Bryson DeChambeau portrait, driver in hand, NET RETURN backdrop) via `sips`.
- `templates/index.json` — registered `brand_bryson_feature` after `brand_product_story_dont_settle` and before the legacy slideshow / trust bar.

**Behavior**

- Photo sits full-bleed; copy column constrained to the left half on desktop, with a directional gradient overlay that darkens the copy-side edge and lifts the photo-side edge.
- "BRYSON" renders as oversized Crystal Ultra Condensed at `clamp(120px, 22vw, 360px)` desktop / `clamp(96px, 32vw, 220px)` mobile, transparent fill, white text-stroke. Positioned center-vertical on desktop; pinned 38% from bottom on mobile so the swing-frame stays readable.
- Eyebrow OFFICIAL AMBASSADOR (mono caps) + tagline "Trained on a Net Return." (Crystal Ultra Condensed display) + body + Emerald CTA "Shop Bryson's setup" linked to `/collections/best-sellers`.
- Image-position select also supports `left` (mirrored gradient) and `full` (centered copy, vertical gradient, equal-margin layout) so the same section can drive future ambassador or product features.

**Preview**

- Verified at 1440×900: section min-height 702px (≈ 78vh) ✓; display word renders Crystal Ultra Condensed at 316.8px with `webkitTextStroke: 2px rgba(255,255,255,.55)` ✓; CTA renders Emerald primary button linked to `/collections/best-sellers` ✓; desktop JPG loads from Shopify CDN at natural 2400px width ✓.
- Verified at 375×812: section drops to 730.8px (≈ 90vh), align-items flex-end stacks copy at the bottom, display word at 120px positioned `bottom: 38%`, no horizontal overflow ✓.

**Caveats / follow-ups**

- CTA defaults to `/collections/best-sellers` until a dedicated Bryson collection or page lands. Update the link from the section's CTA setting when content is ready (e.g. `/pages/bryson-dechambeau` editorial or `/collections/bryson-setup`).
- Tagline copy ("Trained on a Net Return.") is a placeholder pending COO sign-off. Schema is open for the merchant to edit without code.
- Default image alt is "Bryson DeChambeau in front of a Net Return setup". Override per-image in the theme editor if Shopify Files images are swapped in.

## #11 — Motion + pattern pass (in flight)

Phase goal: pull the unused gradient pattern colorways and the two new client-supplied videos into homepage rotation. Adds the brand's first scroll-triggered motion moment (pin-on-scroll film) and the first use of the toolkit's gradient SVGs as surface backdrops.

**Files**

- `assets/pattern-gradient-{black,shadow-green,emerald-green,glow-green,clear-grey,clear-white}.svg` — full-bleed 1920×1080 gradient backdrops staged from `UPDATED Net Return Toolkit (/PATTERN/Gradient Pattern/`. ~225 KB each, vector polygons of the Precision+ glyph at varying opacity. Used at `background-size: cover` as section-scale backdrops, *not* repeating tiles.
- `assets/pattern-grid-emerald-green.svg`, `assets/pattern-grid-white.svg` — missing grid colorways from the same toolkit; now complete the 5-way grid set alongside the existing black / shadow / glow.
- `assets/home-brand-film-8s.mp4` — 8-second multi-shot Quick Mashup video, copied from `~/Documents/Quick Mashup - 8 seconds - Home.mp4`. 9.5 MB. Drives the brand-film section.
- `output/brand-hero-bryson-source.mp4` — 26 MB Bryson hero master. Gitignored + Shopify-ignored — staged locally only. **Manual step: upload to Shopify Admin → Settings → Files** and paste the resulting CDN URL into the Brand hero section's "Desktop video URL" setting in the theme editor. See "Bryson hero upload runbook" below.
- `sections/brand-hero.liquid` — added `video_url_desktop` / `video_url_mobile` URL schema fields; renders a muted autoplay loop `<video>` when a desktop URL is set, with the existing image picker becoming the poster frame and the reduced-motion fallback. Small inline script pauses the video and clears `autoplay` under `prefers-reduced-motion: reduce`. Image fallback path is untouched when no video URL is provided.
- `sections/brand-film.liquid` — new section. Cinematic full-bleed `<video>` with three input modes (video picker, direct URL, asset-filename fallback). Defaults to `home-brand-film-8s.mp4`. Pin-on-scroll on desktop via `position: sticky` inside a 220vh outer; pin disabled on `≤749px` and under `prefers-reduced-motion`. Glow Green progress bar fills via `timeupdate` events. Miracle Mono caps overlay with step counter + label. Gradient backdrop colorway is schema-selectable (default Shadow Green) and surrounds the video while the gradient drift animation runs (60s loop, opt-out under reduced motion).
- `assets/brand-revamp.css.liquid` — three additions:
  - New CSS custom properties for all 6 gradient backdrops and 2 new grid colorways (`--brand-gradient-{black,shadow,emerald,glow,clear-grey,clear-white}`, `--brand-grid-{black,shadow,glow,emerald,white-full}`).
  - New `.brand-surface--gradient` + `.brand-surface--gradient--{shadow,emerald,glow,clear-grey,clear-white}` surface utilities. Opt-in `.brand-surface--gradient--drift` adds the ambient 60s drift animation (reduced-motion safe).
  - New `.brand-film` block (pin behavior, stage, video, overlay, progress bar) with mobile + reduced-motion overrides.
- `templates/index.json` — registered `brand_film_homepage` between `brand_product_story_dont_settle` and `brand_bryson_feature`. The brand film acts as a tonal break between the editorial "Don't Settle" argument and the Bryson credibility punch. Order array updated.

**Behavior**

- Hero now plays the Bryson video full-bleed once the merchant pastes the Files CDN URL in the theme editor. Poster image (existing `brand-hero-train-with-intent-desktop.jpg` by default, overridable) shows during the ~200ms buffer and as the reduced-motion still. Mobile URL is optional — if blank, the desktop URL is used at all viewports.
- Brand film section pins for one viewport of scroll travel on desktop, with autoplay/loop continuing through the pin. Visitors who pause naturally see one full 8-second loop and the Glow Green progress bar fill to the right. Mobile users get the same video in a normal-flow 64vw block, no pin.
- Gradient backdrop on the brand film section uses the Shadow Green colorway by default; merchant can switch via the schema select. Drift animation is on by default but auto-disables under prefers-reduced-motion.

**Bryson hero upload runbook**

1. In Shopify admin → Settings → Files → Upload `output/brand-hero-bryson-source.mp4`. Wait for processing.
2. Copy the resulting `https://cdn.shopify.com/...mp4` URL.
3. Theme editor → Brand hero → Background video → paste into "Desktop video URL (.mp4)". Save.
4. (Optional but recommended) On a machine with ffmpeg, compress a mobile cut to ~3 MB 720p:
   ```bash
   ffmpeg -i "/Users/kelton1/Developer/TheNetReturn/Shopify/output/brand-hero-bryson-source.mp4" \
     -vf "scale=1280:-2" -c:v libx264 -crf 26 -preset slow -an \
     -movflags +faststart \
     "/Users/kelton1/Developer/TheNetReturn/Shopify/output/brand-hero-bryson-mobile.mp4"
   ```
   Upload that to Files too, paste into "Mobile video URL". Reduces ≤749px viewers' load from 26 MB → ~3 MB.

**Preview / verification**

- Theme Check: 161 offenses / 1 error — unchanged from baseline. No new offenses introduced by this pass.
- JSON: `templates/index.json` validates after stripping the auto-generated header comment. `brand_film_homepage` present in both `sections` and `order`.
- Still pending: live preview on `theme:dev` once the videos resolve through the storefront. Specifically watch for:
  - iOS Safari autoplay: confirm the muted/playsinline combo plays without tap on iOS 17+.
  - Sticky-pin behavior on long pages: confirm the brand-film section releases cleanly before the Bryson section reaches the viewport (no overlap during transition).
  - Gradient SVG file size on first paint: 225 KB per backdrop is below the "first contentful paint" threshold the theme already pays for hero JPGs (~280 KB), but worth monitoring under Lighthouse.

**Caveats / follow-ups**

- Bryson hero video URL is not committed — needs the manual Files CDN upload step. Until then the hero falls back to the existing still JPG (no regression).
- Brand-film step number is `02` placeholder pending the broader "rep counter" concept landing (creative-direction idea #2 — page-wide scroll progress indicator).
- The 8-second mashup file `home-brand-film-8s.mp4` ships at 9.5 MB inside `assets/`. If we add another video later that pushes the section over its size budget, move both to Files CDN via the URL setting.
- Gradient SVG opacity vs. video legibility: if the gradient backdrop visibly leaks through letterboxed edges in production, lower its opacity in `.brand-film__stage` (it inherits from the parent — currently 1.0).

---

## Downstream surface audit (2026-05-20)

Mapped the post-homepage customer journey to find friction. Codex owns homepage/header/footer; everything those surfaces link to is still Focal stock. Captured as a 12-task punch list, prioritized by friction × conversion weight:

1. Compare Nets — high-intent decision gate (homepage "See the difference" CTA)
2. /collections/nets-1, packages, simulation, general-accessories — destinations of the new category grid
3. PDP stack (default / azalea / cro) — conversion endpoint
4. Cart — pre-checkout
5. Quiz — guided shopping
6. Build Your Setup — guided shopping
7. 404 — recovery moment
8. Bryson destination — content task (best-sellers placeholder)
9. Search — dead-end risk

Open content / non-code follow-ups for marketing & merchandising:

- Bryson CTA currently lands on `/collections/best-sellers` placeholder. Decide between dedicated `/collections/bryson-setup` or `/pages/bryson-dechambeau` editorial.
- One homepage rich-text section uses an absolute `https://www.thenetreturn.com/pages/quiz` URL — should be relative `/pages/quiz`.

## #12 — Compare Nets page (task #1, done)

**Files**

- `sections/brand-compare-hero.liquid` — new. Shadow Green hero with Precision+ pattern overlay, eyebrow + display headline + body + dual CTA (Take Quiz / Talk to Expert). All copy editable from admin.
- `sections/brand-compare-grid.liquid` — new. Series grid; one block per net model. Schema settings: eyebrow, series heading, body, surface (white / shadow / glow). Each block: linked product (or fallback URL), image, model name, dimensions line, weight line, price (auto from linked product or merchant fallback), CTA label. `max_blocks: 8` so it covers Pro Series (5) and Home Series (3) with headroom.
- `assets/brand-revamp.css.liquid` — appended "Compare Nets page (task #1)" block. Hero spans clamp(56px, 9vw, 120px) padding-block. Grid auto-fits 220px columns at desktop; `data-card-count="3"` constraint caps Home Series so 3 cards don't stretch oversized. Mobile collapses to single column with horizontal card layout (image left, copy right, sticky-feel CTA). White card on any surface for product clarity; Emerald hover border + lift.
- `templates/page.compare.json` — rewired. Was `main-page` (disabled) + `rich-text` + 2× `multi-column` Focal stock. Now `main-page` (disabled) + `brand-compare-hero` + `brand-compare-grid` (Pro Series, 5 models) + `brand-compare-grid` (Home Series, 3 models). Original `shopify://shop_images/comp-*.jpg` image references and `shopify://products/...` URLs preserved per model.

**Behavior**

- Page now reads as one Shadow Green hero band with two white series grids beneath. Eyebrow has Precision+ glyph prefix; primary CTA is Emerald, secondary is outline-white on the hero, primary Emerald on each card.
- Card grid: 5 across at desktop ≥1200px (Pro Series row), wraps cleanly at smaller breakpoints. Home Series row is capped at 3 cols max so the cards stay product-sized rather than stretching.
- Hover scales card 2px lift + Emerald border + soft Shadow drop shadow.
- Mobile ≤579px: full-width horizontal cards, image:38% + body:62%, full-width CTA.

**Verification**

- Theme Check: 161 offenses / 1 error — unchanged from baseline. No new offenses introduced.
- JSON: `templates/page.compare.json` validates (4 sections, Pro has 5 blocks, Home has 3 blocks).
- Live preview QA blocked: Codex's parallel homepage work pushed `templates/index.json` over Shopify's 25-section-order limit; the dev preview is currently returning a theme-wide upload error. Once Codex trims index.json under 25 entries, compare page can be QA'd at http://127.0.0.1:9292/pages/compare without further changes.

**Caveats / follow-ups**

- Prices are stored as merchant fallback text on each block (use_product_price defaulted to false in the JSON wiring) because the existing template carried hardcoded prices and I didn't want to silently flip pricing source. Toggle "Use linked product price" on each block from the editor when ready to source from the live products.
- Hero secondary CTA points to `/pages/contact`. Once an "expert chat" surface lands (or if booking moves off HubSpot), update the link from the section settings.
- Card images still use the original `comp-*.jpg` Shopify shop_images. They're old hero crops; when the toolkit's PHOTOGRAPHY SELECTS get tied to specific models, swap in via the block image picker (or upload per-model and use as theme assets like the category grid).

## #13 — Collection landing intros (tasks #2-#5, done)

Single shared section applied to all four homepage-linked collection landings so the first viewport of /collections/nets, /collections/packages, /collections/simulation, and /collections/accessories all read on-brand without restructuring the rest of each page.

**Files**

- `sections/brand-collection-intro.liquid` — new. Two visual modes:
  - Image mode (image setting present): full-bleed photography with dark gradient scrim, eyebrow + display headline + body + dual CTA. Eager-loaded image with priority for LCP.
  - Solid mode (no image): brand surface (Shadow / Emerald / Black select) with Precision+ pattern overlay.
  Auto-fills headline from `collection.title` and body from `collection.description` when the merchant leaves them blank — so a future merchant adding a new collection page can drop the section in and get a sensible default without retyping copy.
- `assets/brand-revamp.css.liquid` — appended "Collection intro (tasks #2-#5)" block. clamp(360px, 52vh, 520px) min-height; gradient scrim with deeper top-darken for readability behind status bars / sticky headers; brand display headline at clamp(48px, 8vw, 120px). Mobile collapses to 420px min-height with stacked full-width CTAs.
- `templates/collection.nets.json` — prepended `brand_collection_intro` at order[0]. Existing `image_with_text_block_m9rGeW` was already disabled; left in place. CTAs: Compare models → /pages/compare, Take the quiz → /pages/quiz. Background image preserved from the original block (`backyard-home.png`).
- `templates/collection.packages.json` — prepended at order[0]. Disabled the previously active `image_with_text_block_7KExXY`. CTAs: Build your setup → /pages/build-your-setup, Compare nets → /pages/compare. Image preserved (`new-package-slider.png`).
- `templates/collection.simulation.json` — prepended at order[0]. Disabled the previously active `image_with_text_block_bBbGkY`. CTAs: Shop sim bays → /collections/sim-bays, Sim packages → #simulator-packages (in-page anchor to the existing featured collections section). Image preserved (`simbay-slider.jpg`). Order is now 22 items, well under the 25-section limit.
- `templates/collection.accessories.json` — prepended at order[0]. Disabled the previously active `collection-banner` so the brand intro is the only top-of-page surface. CTAs: Shop essentials → #essentials, Training aids → #training (existing anchors from the in-page custom_liquid blocks). Image: `2160x1200-poolside.jpg` from the existing accordion FAQ block, which is the most editorial existing asset on the page.

**Behavior**

- Each of the four homepage-linked collection pages now opens with a Shadow-Green-toned hero band: brand mono eyebrow with Precision+ glyph prefix, oversized Crystal Ultra Condensed headline, body copy, primary Emerald CTA + secondary outline-white CTA.
- Image-mode is on for all four (continues the agency mockup's full-bleed dark hero language). Solid Shadow-Green fallback is the schema default so a future collection that doesn't pick an image still reads on-brand.
- The existing rich content (featured-collections, FAQ accordions, sim partner logo list, image-with-text panels, etc.) is preserved unchanged underneath. This pass intentionally does not restyle those — they are tracked as Phase-4 legacy along with the campaign sections.

**Verification**

- Theme Check: 161 offenses / 1 error — unchanged from baseline. No new offenses.
- JSON: All four templates parse, all four have `brand_collection_intro` at order[0]:
  - nets: 10 sections / order
  - packages: 6 sections / order
  - simulation: 22 sections / order (3 below the 25-limit)
  - accessories: 14 sections / order
- Live preview QA blocked: same `templates/index.json` upload error blocking the Compare page is also blocking these. Once Codex trims index.json under 25 entries, all four collection pages are ready to QA.

**Caveats / follow-ups**

- **Collection handle mismatch (task #13)**: The homepage category grid and mobile drawer link to `/collections/nets-1` and `/collections/general-accessories`, but the rich landing templates that just received the brand intro are keyed to handles `nets` and `accessories`. Users hitting the homepage-linked URLs currently fall through to the generic `collection.json` template and will not see the brand-collection-intro at all. Resolve in Shopify Admin (redirect, link update, or rename — see task #13). This is the single highest-impact follow-up from this pass.
- Simulation and accessories use in-page anchor links (`#simulator-packages`, `#essentials`, `#training`) for the secondary CTA because the existing page has anchor-target `custom_liquid` blocks already. If those custom-liquid blocks ever get cleaned up (they're noise sections marked `name: "Custom Liquid"`), update the CTA links from the section settings.
- The image-with-text-block on collection.simulation.json was renamed to disabled. It can be re-enabled from the theme editor if the brand intro should be paired with the editorial overlap-left treatment underneath; otherwise it stays out of the page flow.
- The four pages do NOT have unique brand-styled product grids yet — once a user scrolls past the intro, they're back on Focal's `featured-collections` cards. That's a follow-up pass (likely as part of task #6, PDP stack), since collection cards and product cards share styling.

## Preview unblock + handle reconciliation (2026-05-20)

**Context**: The dev preview at `http://127.0.0.1:9292/` was returning a theme-wide 500 because `templates/index.json` had grown to 26 entries — past Shopify's 25-section hard limit on both the `sections` dict and the `order` array.

**Changes**

- `templates/index.json` — removed the disabled apps section `17139716501e2e2a7b` (a Loox carousel block, `disabled: true`, sat at the tail of `order`) from both `sections` and `order`. Section count is now 25 (at the limit). This was the lowest-impact removal — disabled, non-adjacent to any active brand section, opaque hash name.
- `templates/collection.nets.json` → `templates/collection.nets-1.json` (rename) — the file was keyed to handle `nets` which has no underlying Shopify collection. The live homepage links to `/collections/nets-1`, so the file is now keyed to match. **But** the dev theme already had its own `collection.nets-1.json` content (different from my local file), which is why the rendered page does not yet show the brand intro. A `theme:pull` is required to reconcile.
- `templates/collection.accessories.json` → `templates/collection.general-accessories.json` (rename) — same issue. Local file was keyed to handle `accessories`. The actual live URL `/collections/general-accessories` had a different template content upstream. Also needs reconciliation via `theme:pull`.

**Verified live**

| URL | Status |
|---|---|
| `http://127.0.0.1:9292/` | 200 — homepage intact after the index.json trim |
| `http://127.0.0.1:9292/pages/compare` | 200 — new brand-compare-hero + 2 brand-compare-grid sections rendering |
| `http://127.0.0.1:9292/collections/packages` | 200 — brand-collection-intro rendering |
| `http://127.0.0.1:9292/collections/simulation` | 200 — brand-collection-intro rendering |

**Needs reconciliation**

| URL | What renders today | Action |
|---|---|---|
| `http://127.0.0.1:9292/collections/nets-1` | The dev theme's own `collection.nets-1.json` (cro-grid, rich_text_MR7W3T, compare_models_table_e8bPyF, etc. — sections that don't exist in the local file). Brand intro does not appear. | Run `theme:pull` to overwrite the local file with the live content, then re-add `brand_collection_intro` at the top of `order` and to `sections`. Block-level reapply, not a re-rewrite. |
| `http://127.0.0.1:9292/collections/general-accessories` | Same pattern — dev theme has upstream content that the local file did not match. Brand intro does not appear. | Same fix: `theme:pull` then re-add `brand_collection_intro`. |

**Caveat on the index.json trim**

The removed apps section was `disabled: true` so it had no live rendering impact. Its data still exists in git history if anyone needs to recover it. The actual ceiling problem is Codex's homepage continuing to grow — once another brand section lands on the homepage, the 25-limit will bite again. Either keep pruning disabled legacy from `order/sections`, or split the homepage across additional templates (e.g. `index.context.b2b.json` already exists; could also move a chunk into a reusable section group).

---

## Sitewide copy realignment

**Date:** 2026-05-20

The "Train With Intent" brand-kit direction has been retracted from commercial storefront surfaces because it pointed toward unreleased product messaging. Current storefront copy now centers The Net Return's live offer: automatic ball return, durable net construction, fast setup, space fit, simulator compatibility, warranty, and trusted proof.

Preserve this rule going forward: homepage, collection, product, and support copy should sell the net and current setup ecosystem first. Practice philosophy can appear in blog/editorial content, but it should not replace concrete product proof on shopping pages.

**Files touched**

- `templates/index.json` — hero (`The Net That Returns.`), category-grid heading (`Start with the net. Build around your space.`), brand-film label (`Every Ball Comes Back`), product-story (`Stop Chasing Golf Balls`), Bryson copy (`Trusted by Bryson` / `The net he trusts at home.`), both proof-system instances (`Built around the return.` + four net-specific proof blocks), mini-builder body.
- `sections/brand-hero.liquid`, `sections/brand-film.liquid`, `sections/brand-bryson-feature.liquid`, `sections/brand-proof-system.liquid`, `sections/brand-proof-system-cinematic.liquid`, `sections/brand-proof-system-diagram.liquid`, `sections/brand-category-grid.liquid`, `sections/brand-category-rail.liquid`, `sections/brand-category-mosaic.liquid`, `sections/brand-category-accordion.liquid`, `sections/brand-mini-builder.liquid` — schema defaults and presets aligned with the new voice so future merchant-added instances ship correct copy.
- `templates/page.our-story.json` — 2024 entry rewritten to ground the rebrand in the existing product story, not an unreleased platform.
- `templates/page.browse-all-products.json` — hero rewritten to point shoppers at nets/packages/add-ons.

**Preserved on purpose**

- Vendor / third-party product descriptions for Uneekor, FlightScope, Foresight, Full Swing simulators and the ExtraPoint football net — they describe vendor product, not Net Return commercial messaging.
- `sections/academy-skill-tabs.liquid` "Train smarter with a clear focus each week." — academy/editorial context.
- Existing CRO proof points on product pages (50,000+ golfers, 225 MPH ball speed, <5 min assembly, etc.) — current, factual, conversion-load-bearing.

**Plan step skipped**

- Task 4 Step 4 asked to replace a Pro Series FAQ *intro* paragraph in `templates/product.pro-series.json` (`accordion_content_cDkVRL`). The block has no intro paragraph — only Q&A items — so there was nothing to overwrite. The FAQ items themselves are already net-specific and factual. Revisit if/when an intro field is added to that accordion.

**Validation**

- All five edited JSON templates parse clean (`templates/index.json`, `templates/index.context.b2b.json`, `templates/page.our-story.json`, `templates/page.browse-all-products.json`, `sections/header-group.json`).
- Theme Check: `383 files inspected with 161 total offenses found across 88 files. 1 errors. 160 warnings.` — same baseline as before the copy pass.
- Residual ripgrep scan over `templates`/`sections`/`snippets` for the retracted phrases returns zero hits.

**Follow-ups**

- Verify `shopify://pages/bryson-dechambeau-the-net-return` exists in admin before the Bryson CTA goes live — the link was changed from `/collections/best-sellers` to a dedicated page per the plan, and the page handle needs to resolve.
- `rich_text_tkbxXR` on the homepage still uses an absolute `https://www.thenetreturn.com/pages/quiz` URL — flagged in earlier audit. Convert to relative `/pages/quiz` next time that section is touched.

---

## Readability pass v2 — typography tokens

**Date:** 2026-05-20

**Why this happened**

Stakeholder feedback after the brand revamp's first font pass: key items (nav, buttons, prices, body) feel hard to read; only side messaging (eyebrows, marquee, SEO long-tail, fine print) should have a leash on small/decorative sizing. The previous pass followed the brand-guide direction literally — Miracle Mono Regular at 10-13px fixed pixels on every "small copy and accent" surface, including load-bearing UI like header nav, dropdown items, buttons, footer link lists, and the mobile drawer. Mono fonts at small fixed sizes with heavy caps and 0.18-0.22em letter-spacing read as decorative texture, not as navigation.

**Files**

- `assets/brand-revamp.css.liquid` — two additions:
  1. Typography token system v2 appended to the existing `:root` block. Introduces fluid `--brand-fs-*` size tokens (display, headline, title, subtitle, body, body-sm, nav, action, action-sm, meta, eyebrow, micro) and role-based `--brand-font-{nav,action,meta}` tokens, plus a tighter `--brand-ls-*` letter-spacing scale. Documented inline with the role / font / use-on table.
  2. "Readability pass v2" override block appended at the end of the file. Intentionally last in the cascade so it overrides the 145 prior `font-size` declarations without needing to touch each one. Targets the load-bearing surfaces only — buttons, body copy, header top-level nav, header dropdown items, mega-menu copy, mobile drawer, footer link list — and switches them off Miracle Mono onto Crystal (higher x-height, more legible) at fluid 15-18px minimums. Mobile floors set so buttons / nav / footer links stay at 16px on phones regardless of fluid math.

**What did NOT change**

- The Crystal / Crystal Ultra Condensed / Miracle Mono font stack itself. Same fonts, repositioned by role.
- Eyebrows, marquee, micro-labels, and footer block headings. These are intentional "side messaging" surfaces — they kept Miracle Mono with minor letter-spacing tightening and a small min-size bump (11 -> 12-13).
- Display headlines for hero / Bryson / "Don't Settle" custom layouts. Section-specific clamps remain; only the generic `.brand-headline` and `.brand-headline--display` defaults were tuned so they don't blow out at 4K or crush below the floor on phones.
- The 145 existing `font-size` declarations sprinkled through section-specific rules. These remain on intention; only declarations for the documented KEY surfaces are overridden by the v2 pass.

**Tradeoffs**

The brand guide explicitly assigned Miracle Mono to "nav, eyebrows, meta, marquee, buttons." This pass reinterprets that direction: Miracle Mono stays on **accents** (eyebrows, marquee, meta, micro) but moves off **interactive load-bearing UI** (nav, buttons, footer links). The argument is that the brand-guide language "small copy and accents" was about typographic flavor, not about applying mono to every link on the site. If marketing / design wants to revisit, the role tokens are isolated to a single `:root` block — flipping `--brand-font-nav` / `--brand-font-action` back to `var(--brand-font-accent)` reverts the entire pass.

**Validation**

- Theme Check: `383 files inspected with 161 total offenses found across 88 files. 1 errors. 160 warnings.` — exact baseline, no new offenses.
- No `font-family`, `font-size`, or `letter-spacing` declaration in the rest of `brand-revamp.css.liquid` was edited; the override block at the end does the work via cascade order.

**Follow-ups**

- Live preview QA on `theme:dev` to walk through the surfaces touched: homepage hero, header nav (desktop + mobile drawer), footer, compare page, a PDP, and a collection landing. Validate nothing reads worse on small screens; validate the 4K hero does not feel "shrunk."
- Optional next pass: audit the 145 section-specific `font-size: clamp(...)` declarations and migrate the mid-range ones (subtitles, card bodies, meta lines) onto the new tokens so the next visual change is a one-line edit at the token layer rather than a multi-section sweep.
- If marketing decides Miracle Mono should stay on header nav / buttons, swap the `--brand-font-nav` and `--brand-font-action` tokens back to `var(--brand-font-accent)` and bump `--brand-fs-nav` / `--brand-fs-action` floors a little higher to compensate. One-line revert per role.

---

## Compare page fit-finder

**Date:** 2026-05-20

The 2026-05-13 `compare-mobile-guided-flow` plan was written before the brand revamp rewired the Compare page. Its target file `sections/mobile-compare-nets.liquid` is now orphaned (no template references it). Rather than execute the plan literally against dead code, the same goal was ported onto the new `brand-compare-hero` + `brand-compare-grid` sections that the brand revamp ships.

**What landed**

- `sections/brand-compare-hero.liquid` — added a fit-finder chip strip ("How much space do you have?" / "Where will you use it?"), an active-filter pill list, and a tertiary "Watch the size guide" link. New schema settings: `show_fit_finder`, `width_label`, `use_case_label`, `size_guide_label`, `size_guide_link`. Inline `{% javascript %}` block contains the chip/pill/filter coordinator — single instance, guarded by `window.__brandCompareFinderBound` so it doesn't double-bind if the hero renders twice.
- `sections/brand-compare-grid.liquid` — added per-block `fit_width`, `fit_use_cases`, `fit_note` settings. Cards render `data-fit-width`, `data-fit-use-cases`, `data-fit-note` attributes. A hidden `.brand-compare-card__fit-note` element gets populated when JS marks the card as a best match. Each grid carries `data-brand-compare-grid` so the coordinator can flip eyebrow state per grid (`has-best` vs `has-only-other`).
- `assets/brand-revamp.css.liquid` — appended ~140 lines for chips, pills, the tertiary link, card `.is-best`/`.is-other` ordering and dimming, the inline fit-note callout, and `prefers-reduced-motion` fallbacks. Grid eyebrows prefix with "Best matches · " or "Other sizes · " via CSS pseudo-elements driven by JS-applied classes.
- `templates/page.compare.json` — populated fit metadata for all 8 models (Junior, Mini, Home, Pro, Pro 8, Pro 9, Pro 10, Pro XL) plus enabled the fit-finder on the hero and added the size-guide link to `/pages/assembly`.

**Behavior**

- All cards visible by default (no JS-required state).
- Tap a chip → JS finds matching cards (width ≤ selected bucket AND use case present), gives them `.is-best`, the others `.is-other`. Best matches sort first via `order: 1`, others sort to `order: 2` and dim to 65 % opacity (full opacity on hover/focus).
- A short "why this fits" line appears on best-match cards, sourced from the per-block `fit_note`.
- Active filters render as Glow-Green pills the shopper can tap to clear.
- URL state persists via `?width=…&use=…` (`history.replaceState`), so the result is deep-linkable.
- Reset by clearing all pills returns the page to the default all-cards-visible state.

**Width bucket logic**

Cards match a chip selection when their bucket fits inside the chosen one. Junior (5) matches any width chip. Mini (7) matches "Up to 7" / "Up to 8" / "9-10". Pro 8 (8) doesn't match "Under 5" or "Up to 7" but does match "Up to 8" and "9-10". This mirrors a shopper's mental model — "I have 8 ft of width" means a 5-ft Junior still fits.

**Validation**

- Theme Check: `383 files inspected with 161 total offenses found across 88 files. 1 errors. 160 warnings.` — same baseline as before. No new offenses introduced.
- `templates/page.compare.json` parses clean.
- Curl-fetched HTML confirms all 8 chips render, all 8 cards carry the correct `data-fit-width` and `data-fit-use-cases` attributes, and all 8 fit notes render in `data-fit-note`. The hero's `{% javascript %}` block bundles into Shopify's per-theme `compiled_assets/scripts.js` and contains the coordinator function (`__brandCompareFinderBound`, `cardMatches`, `applyFilter`).

**Gotcha for future agents**

When a section's `{% schema %}` adds new select options for a setting that the JSON template already references, Shopify's dev sync can cache the JSON against the old schema and silently fall back to the option default. If new fit values render as `"none"` on the live preview, force a JSON re-sync (touch the file with a trivial content change) — the second sync picks up the new schema.

**Plan supersession**

`docs/superpowers/plans/2026-05-13-compare-mobile-guided-flow.md` is now superseded. The orphan section `sections/mobile-compare-nets.liquid` (1,105 lines, no template references it) can be archived in a follow-up cleanup pass — it's dead weight in the theme repo.

---

## Mobile header island and full-screen menu

**Date:** 2026-05-21

The approved Allbirds / SharkNinja-inspired mobile header direction has been implemented in the local theme code. The design spec lives at `docs/superpowers/specs/2026-05-21-mobile-header-navigation-design.md`, with inspiration screenshots preserved under `docs/inspiration/header-mobile-nav-2026-05-21/`.

**What landed**

- `sections/header.liquid` — mobile control order now supports logo, flexible space, search, account/login, cart, and far-right menu. The original left-side mobile hamburger is reserved for the desktop drawer layout, and a mobile-only menu toggle now renders after cart.
- `snippets/mobile-menu.liquid` — the drawer content now renders from the `menu` parameter, which is supplied by `section.settings.sidebar_navigation_menu | default: section.settings.navigation_menu`. Hardcoded mobile shopping cards were removed as the production source of truth.
- `sections/header-group.json` — `enable_transparent_header` is enabled for Focal's homepage-only transparent header behavior, and `sidebar_navigation_menu` is explicitly set to `main-menu-2024` until a dedicated mobile Shopify Navigation menu is created in Admin.
- `assets/brand-revamp.css.liquid` — a final cascade block adds the floating header island, homepage transparent/glass island state, mobile control layout, and full-screen dark brand drawer using the current `--brand-*` color, typography, spacing, and motion tokens.
- `scripts/validate-header-footer-navigation.mjs` — updated to validate the Shopify Navigation-driven mobile menu, far-right mobile toggle, transparent header setting, and dark full-screen menu classes.

**Admin follow-up**

Create a dedicated mobile Shopify Navigation menu and assign it to the header section's `sidebar_navigation_menu` / `Mobile menu` setting. Recommended order remains:

1. Shop Nets
2. Shop Packages
3. Simulation
4. Accessories
5. Compare Nets
6. Build Your Setup
7. Talk To An Expert
8. Learn & Support

Until that Admin menu exists, the local config points `sidebar_navigation_menu` at `main-menu-2024` so the mobile menu is still Navigation-controlled rather than hardcoded.

**Validation**

- Shopify skill validation passed for `sections/header.liquid`, `snippets/mobile-menu.liquid`, `sections/header-group.json`, and `assets/brand-revamp.css.liquid` when run with the absolute theme path.
- Static validator passed: `node scripts/validate-header-footer-navigation.mjs` (`13` checks).
- Theme Check remained on the known baseline: `383 files inspected`, `161 total offenses`, `1 error`, `160 warnings`.
- Local preview restarted at `http://127.0.0.1:9292` using development theme `149375975517`.
- Mobile DOM verification at 390px confirmed header controls render as search, logo, login, cart, menu in the banner semantics, and the far-right menu button opens `#mobile-menu-drawer` as a visible `390px x 844px` full-screen drawer.
- Screenshot capture through the in-app browser timed out on Shopify's rendered page, so final visual screenshot artifacts were not produced in this pass.
