# Visual & Conversion Audit

Working document for methodically auditing TheNetReturn storefront pages and ranking changes by impact/effort. Each page gets a top-down walkthrough, findings logged inline, scored, and routed via a lightweight RACI lens for ownership.

## How to read this doc

- **Each page** is a section below. Order = priority (highest-revenue surface first).
- **Findings** are concrete, located in source (file + line if specific), with a recommended change and rationale.
- **Severity** = effect on user trust / conversion / brand: **S0** blocker, **S1** material conversion hit, **S2** noticeable polish gap, **S3** minor.
- **Effort** = developer hours for the change: **E1** < 30 min, **E2** ½ day, **E3** > ½ day, **EX** unknown.
- **Priority** = Severity × (1/Effort), capped at: **P0** (do now), **P1** (this week), **P2** (this month), **P3** (backlog).
- **RACI** is collapsed for a 2-person team:
  - **R/A** = Kelton (decisions, brand alignment, sign-off)
  - **C** = Claude (proposes, drafts, implements after approval)
  - **I** = anyone else on the team (designer / copy / stakeholder if applicable)

The audit is **observation → recommendation → priority**, not "do this now." Nothing here ships without Kelton's explicit go.

## Pages in audit scope (in order)

| # | Page | Template | Why this priority |
|---|---|---|---|
| 1 | Home | `templates/index.json` | Highest-traffic landing; sets first impression; current slideshow + 18 sections |
| 2 | Pro Series product page | `templates/product.json` (default variant) | Flagship product; default product template; baseline for cart funnel |
| 3 | Nets collection | `templates/collection.nets.json` | Main product category landing; product-card consistency surface |
| 4 | Cart | `templates/cart.json` | Final conversion surface; theme name signals cart bug history |
| 5 | Build Your Setup | `templates/page.build-your-setup.json` | Configurator-style flow; high-AOV path |
| 6 | Compare Models | `templates/page.compare.json` | Decision-stage page; CRO leverage |

Landing pages (`academy-landing`, `bfcm`, etc.), variant product templates (`azalea`, `cro`), and B2B contexts are out of initial scope. Add rows above when one of them becomes priority.

## Audit dimensions per page

For each page, walk top-down through five lenses (skip a lens if N/A for the section):

1. **Layout & hierarchy** — visual order, density, scroll fatigue, mobile vs desktop balance
2. **Copy** — headline punch, value-prop clarity, jargon, length, voice consistency
3. **Imagery & motion** — quality, relevance, cropping, file size, autoplay/looping behavior
4. **CTA & funnel** — primary action presence, button copy, color contrast, distance from hero
5. **Trust & social proof** — reviews placement, badges, guarantees, brand consistency

---

## 1. Home page

**Template:** [templates/index.json](../templates/index.json) — 12 active sections, 6 disabled, last edited via Shopify admin.
**Source:** Audited from JSON + section source. Not rendered in browser yet — flagging where browser verification is needed.

### Section-by-section walkthrough

| # | Section (active) | Type | First impression |
|---|---|---|---|
| 1 | `slideshow` | slideshow | Hero — 2 active slides (Bryson, "#1 Net in Golf") |
| 2 | `trust_bar_DdPqga` | trust-bar | Black bar, 3 white pills: Free Shipping / 3-Yr Warranty / 30-Day MBG |
| 3 | `_blocks` (Best Sellers) | _blocks → ai_gen_block | Collection: `best-sellers-bfcm`, starting `universal-side-barriers` |
| 4 | `tnr_collection_list_VRWxpC` | tnr-collection-list | 4-tile grid: Nets / Packages / Simulation / Accessories |
| 5 | `video_49RaHd` | video | **No video set** — falls back to placeholder SVG |
| 6 | `image-with-text` | image-with-text | 2-tab item: Pro Series / Sim Series ("Best Sellers" subheading) |
| 7 | `text_with_icons_BQA78q` | text-with-icons | 4 USP pills: Instant Ball Return / Easy to Assemble / Indoor or Outdoor / Premium Design |
| 8 | `image_with_text_overlay_YtBHJk` | image-with-text-overlay | "Build Your Practice Setup" / Get Started (link style) |
| 9 | `image_with_text_8dmRyz` | image-with-text | 2-tab item: Instant Ball Return / Quick Assembly (technical detail) |
| 10 | `rich_text_tkbxXR` | rich-text | "Find The Perfect Setup" / "Need more info?" / "take the quiz" |
| 11 | `image_with_text_overlay_FUPQcD` | image-with-text-overlay | "Simulation" / "The Optimal Path to Reaching Your Goals" / Shop Simulation |
| 12 | `image_with_text_block_9YtgJ7` | image-with-text-block | Bryson testimonial ("...not another net out there that I would trust") |
| 13 | `video_dN76e7` | video | Full-width Vimeo (id 949289364) |
| 14 | `17139716501e2e2a7b` | apps | Loox reviews carousel (last before footer) |

### Findings

#### H-01 — Empty video section breaks visual flow

- **Where:** Section `video_49RaHd`, position 5 (between collection list and product-tab section).
- **What:** No `video` and no `video_url` configured. Renders the placeholder SVG `lifestyle-1` via [sections/video.liquid:75](../sections/video.liquid:75).
- **Why it matters:** Visitors see a generic Shopify lifestyle placeholder where a brand video should be. Reduces credibility, breaks the rhythm of the page.
- **Recommendation:** Either (a) populate with the Net Return Animated Logo Card / 3D net spin video already in `Video Assets/`, or (b) disable the section. Option (a) is likely the original intent — a brand video between the collection grid and the Pro/Sim tab section.
- **Severity:** S1 (broken-looking) · **Effort:** E1 · **Priority:** **P0**
- **R/A:** Kelton · **C:** Claude (upload video, update section settings)

#### H-02 — Icons don't match their USPs in `text-with-icons`

- **Where:** Section `text_with_icons_BQA78q`, position 7. From [templates/index.json](../templates/index.json):
  - "Instant Ball Return" → `picto-return-box` ✅
  - "Easy to Assemble" → `picto-shield` ❌ (shield = security/warranty, not assembly)
  - "Indoor or Outdoor" → `picto-address-pin` ✅
  - "Premium Design" → `picto-warranty` ❌ (warranty icon for design)
- **Why it matters:** Mismatched iconography makes the value props feel rushed/automated and undermines the "premium" claim.
- **Recommendation:** Swap to icons that fit: "Easy to Assemble" → tool / wrench / clock; "Premium Design" → diamond / sparkle / build icon. Then double-check `picto-shield` isn't being used elsewhere with assembly meaning.
- **Severity:** S2 · **Effort:** E1 (icon set is local in `assets/`) · **Priority:** **P1**

#### H-03 — Slideshow has only 2 active slides with near-identical CTAs

- **Where:** `slideshow` section, 5 blocks total, only 2 active. Both slides have button_1_text = "Shop Nets".
- **Slide 1:** "Trusted by the Champion" / "Bryson Dechambeau - 2024 U.S. Open Champion" / "Shop Nets"
- **Slide 2:** "The #1 Net in Golf" / "Where Better Begins" / "Shop Nets"
- **Why it matters:** Two slides saying "buy a net" with the same button doesn't reward the slide change. The Bryson slide is the stronger of the two — pulling specificity (Champion) and brand asset. The "#1 Net in Golf" slide is generic and unsubstantiated.
- **Recommendation options:**
  1. Drop to a single static slide (Bryson, "Shop Nets" or "Shop Bryson's Setup") — kills the carousel entirely, which is fine for LCP and removes the "should I read this or wait?" cognitive cost.
  2. Keep two slides but differentiate: slide 1 = product-led ("The #1 Net in Golf — Shop Nets"), slide 2 = athlete-led ("Trusted by Bryson DeChambeau — Shop His Setup", linking to a Bryson collection).
- **Severity:** S2 · **Effort:** E1–E2 · **Priority:** **P1**

#### H-04 — First-time visitor has no immediate "what is this product?" answer

- **Where:** Above-the-fold copy across slideshow + trust bar.
- **What's missing:** Neither hero slide nor trust bar tells a stranger this is a golf practice net that returns the ball to you. "Trusted by the Champion", "#1 Net in Golf", "Where Better Begins" — these are aspirational tagline phrases that assume the visitor already knows what The Net Return sells.
- **Why it matters:** Conversion economics. Cold paid-traffic visitors (Meta, Google Display) often have no brand awareness. They bounce if they can't tell in 3 seconds what's for sale.
- **Recommendation:** Test a hero subheading that's literal: e.g. "Hit. Return. Repeat. The patented practice net that gives you back every ball." Slot this between the title and the CTA. Keep "Trusted by the Champion" as the headline; add the literal explanation underneath.
- **Severity:** S1 · **Effort:** E1 (copy + section setting) · **Priority:** **P1**

#### H-05 — "Best Sellers" block may be running stale (BFCM) data

- **Where:** Section `_blocks` (position 3), block `ai_gen_block_74536a9_zQN8y8`. Collection = `best-sellers-bfcm`. Starting product = `universal-side-barriers`.
- **Why it matters:** The collection handle suggests Black Friday / Cyber Monday curation. If the BFCM collection wasn't updated post-holiday, the "Best Sellers" carousel could be showing 2025 holiday picks in 2026. "Universal Side Barriers" as the leading best-seller is also suspicious — they're an accessory, not a flagship product. Could be alphabetical ordering rather than actual sales rank.
- **Recommendation:** (1) Confirm in Shopify Admin that `best-sellers-bfcm` is the right collection to surface year-round, or rename/swap to a `best-sellers` collection. (2) Verify the products are ordered by actual sales, not alphabetical. (3) Consider what "Best Sellers" means without a season qualifier.
- **Severity:** S2 (could be S1 if products are wildly miscalibrated) · **Effort:** E2 (collection edit in Admin) · **Priority:** **P1**
- **R/A:** Kelton (decision on collection) · **C:** Claude (template setting change)

#### H-06 — Loox reviews carousel is at position 14 (last before footer)

- **Where:** Section `17139716501e2e2a7b` (apps), last active section.
- **Why it matters:** Reviews are the strongest CRO lever after price and product photos. Putting them at the end of a 13-section scroll means most visitors never see them, and visitors who scrolled that far are already deep in consideration. The Bryson testimonial earlier (position 12) is good but is a single endorsement, not a review volume signal.
- **Recommendation:** Move the Loox carousel up to **position 3 or 4** — directly after the trust bar (and before the collection list, or between the collection list and the Pro/Sim tabs). Standard high-CRO placement is "hero → trust → social proof → catalog."
- **Severity:** S1 · **Effort:** E1 (drag-reorder in template editor or JSON `order` array) · **Priority:** **P1**

#### H-07 — Quiz CTA copy is weak ("take the quiz")

- **Where:** `rich_text_tkbxXR` (position 10). Subheading "Need more info?", title "Find The Perfect Setup", button "take the quiz".
- **Why it matters:** Lowercase button copy reads as unstyled. "Take the quiz" is generic — every site has quizzes. "Need more info?" suggests doubt rather than helpfulness.
- **Recommendation:** Title: "Not Sure Which Setup Is Right?" Subheading: drop or reframe to "60 seconds. 4 questions." Button: "Find My Setup" (consistent with "Build Your Practice Setup" CTA elsewhere — but those two CTAs may compete; consolidate).
- **Severity:** S2 · **Effort:** E1 · **Priority:** **P2**

#### H-08 — Two CTAs compete for the "build your setup" mental model

- **Where:**
  - Position 8: "Build Your Practice Setup" / Get Started (link style)
  - Position 10: "Find The Perfect Setup" / take the quiz
- **Why it matters:** Both promise help finding the right gear. Visitors don't know whether to build (configurator) or quiz (questionnaire). Two paths to the same goal, neither owns it.
- **Recommendation:** Pick the lane.
  - If the configurator (`pages/build-your-setup`) is the strong path → make it a button (not link), strengthen the headline, and remove the quiz section or fold it inside the configurator.
  - If the quiz is the strong path → invert: drop "Build Your Practice Setup" or replace its CTA with "Take the quiz first."
- **Severity:** S1 · **Effort:** E2 (depends on which pillar wins) · **Priority:** **P1**

#### H-09 — Bryson testimonial CTA is awkward ("BRYSON collection")

- **Where:** `image_with_text_block_9YtgJ7`, position 12. Subheading "BRYSON DECHAMBEAU", title "Trusted by the Pros", quote, CTA "BRYSON collection".
- **Why it matters:** All-caps "BRYSON collection" looks like a template stub, not finished copy.
- **Recommendation:** "Shop the Bryson Collection" or "See Bryson's Setup". Keep the all-caps "BRYSON DECHAMBEAU" as the subheading badge (intentional brand styling); fix the button.
- **Severity:** S2 · **Effort:** E1 · **Priority:** **P2**

#### H-10 — Generic Simulation tagline

- **Where:** `image_with_text_overlay_FUPQcD`, position 11. Title "Simulation", content "The Optimal Path to Reaching Your Goals", CTA "Shop Simulation".
- **Why it matters:** "Optimal path to reaching your goals" applies to any sport, any product. Doesn't tell visitors what simulation means at TheNetReturn (golf sim / launch monitor packages).
- **Recommendation:** Tighten to product specificity: "Pro-grade launch monitors and full sim packages — practice or play anytime." Then CTA "Shop Simulators".
- **Severity:** S2 · **Effort:** E1 · **Priority:** **P2**

### Above-the-fold sanity check (still needs browser verification)

Things I want to validate by actually viewing the page on the dev theme:

- Slideshow image quality / cropping at mobile vs desktop
- Whether trust bar overlaps awkwardly with the hero on mobile (the negative margin tricks in `trust-bar.liquid` suggest tight composition)
- `tnr-collection-list` overlay text legibility — all four collections have `overlay_color: rgba(0,0,0,0)` (zero opacity), meaning text sits on raw imagery. May be unreadable depending on the photo.
- Whether the Loox carousel actually has reviews loading at all (the script is interaction-gated by WNW).
- Mobile scroll depth from hero to first "buy" CTA.

### Home page summary

- **P0 (now):** H-01 (empty video section)
- **P1 (this week):** H-03 (slideshow), H-04 (hero subheading), H-05 (best-sellers data integrity), H-06 (reviews position), H-08 (build vs quiz)
- **P2 (this month):** H-02 (icons), H-07 (quiz copy), H-09 (Bryson CTA), H-10 (simulation tagline)

**The single highest-leverage change** is H-06 (move reviews up). It's E1 effort, S1 severity, and reorders a single line in `templates/index.json`. Everything else benefits from copy/design judgment calls.

## 2. Pro Series product page

**Template:** [templates/product.json](../templates/product.json) — default product template, 6 sections.
**Note:** Variants `product.azalea.json` and `product.cro.json` exist; this audit covers the default.

### Section structure

| # | Section | Type | Notes |
|---|---|---|---|
| 1 | `main` | main-product | Gallery + title + price + variant pickers + qty + buy buttons |
| 2 | `product-content` | product-content | Tabbed content area — only the `description` tab is active |
| 3 | `product-recommendations` | product-recommendations | "You may also like" |
| 4 | `1713971222a271d416` | apps | **Loox** — card carousel section |
| 5 | `1761660997981904f8` | apps | **Loox** — dynamic section (1) |
| 6 | `176166137173574290` | apps | **Loox** — dynamic section (2) |

### Findings

#### P-01 — Three separate Loox sections at the bottom of every product page

- **Where:** Sections 4, 5, 6.
- **What:** Three Loox app sections render in a row: a card carousel and two "dynamic sections." From Loox's product, dynamic sections are typically the full reviews list / Q&A widget — having two means likely duplication, or one is leftover from a layout experiment.
- **Why it matters:** Visually heavy footer. Each Loox section loads its own script + iframe. Page bloat (every product page) for redundant social proof.
- **Recommendation:** Consolidate to **one or two** Loox blocks. Standard pattern: rating in the hero (already present via `loox_reviews_loox_rating_twDDRR` block in `main`), card carousel below product-content, full reviews list near the bottom. Drop the third.
- **Severity:** S1 (perf + visual noise) · **Effort:** E1 (disable a section in JSON) · **Priority:** **P0**
- **Verify in browser** that the three sections aren't intentionally showing different content modes before deleting.

#### P-02 — Description tab is the only product-content tab

- **Where:** Section `product-content`, only `description` block active. The `complementary_products` block is **disabled**.
- **What:** Shopify's tab interface for product info supports description / reviews / content / liquid / complementary products. Only the description tab renders, so the tabbed UI shell is overkill for one tab — and there's no specs / shipping / FAQ / "what's included" tab.
- **Why it matters:** Net Return nets have technical specs (dimensions, weight, included accessories, assembly time, warranty terms) that customers compare across products. Burying them in a single description tab means visitors scroll a wall of text rather than scanning tabs.
- **Recommendation:** Add tabs for **Specs**, **What's Included**, **Shipping & Returns**, and **Assembly** (the assembly page handles list in `layout/theme.liquid:126` references dozens of assembly videos, suggesting setup is a real concern). Use the existing `content` or `liquid` block type, or add Shopify metafields per product for structured specs.
- **Severity:** S1 · **Effort:** E3 (per-product content authoring; structural change once) · **Priority:** **P1**

#### P-03 — Disabled `complementary_products` block is a missed AOV lever

- **Where:** Section `product-content`, block `complementary_products_L6N39c` (disabled), title "Featured products".
- **What:** Shopify has built-in complementary products via Search & Discovery; this block is wired up but disabled.
- **Why it matters:** Complementary products are a proven AOV lever (Frequently Bought Together, Bundle & Save). For TheNetReturn, every base net pairs with side barriers, turf, projector, sim screen — high-AOV accessories. Currently `product-recommendations` (section 3) shows "You may also like" but that's similar products, not complements.
- **Recommendation:** Re-enable. Audit Shopify Admin → Search & Discovery → Product Recommendations to ensure complementary product rules are set for each major net. Title: "Complete your setup" (more action-oriented than "Featured products").
- **Severity:** S1 (revenue) · **Effort:** E2 (enable + populate rules per product in Admin) · **Priority:** **P1**

#### P-04 — Trust block exists in schema but is not used

- **Where:** `main-product.liquid` schema at line 597 defines a `trust` block type. The product template doesn't include one.
- **What:** There's a built-in slot for trust copy next to the product description (per the schema comment "Show extra text next to your product description to improve trust"). Unused.
- **Why it matters:** Product page is where trust signals matter most — guarantees, shipping promises, return policy. The trust bar on the home page (Free Shipping / 3-Yr Warranty / 30-Day MBG) doesn't appear here.
- **Recommendation:** Add a `trust` block to `main` section near the ATC button. Pull the three trust bar promises (Free Shipping, 3-Year Warranty, 30-Day MBG) into the product hero so they're visible alongside the price/buy decision.
- **Severity:** S1 · **Effort:** E2 (block addition + per-product or default settings) · **Priority:** **P1**

#### P-05 — Native product rating is off; Loox-only

- **Where:** `main` section setting `show_product_rating: False`.
- **What:** Loox provides the rating via the `loox_reviews_loox_rating_twDDRR` block in the hero. Fine in theory — but if Loox script fails (it's gated by WNW interaction-loading per the perf audit), the hero loses its rating entirely with no fallback.
- **Why it matters:** Rating stars in the hero are critical for conversion. A blank gap pre-interaction may cost trust on quick-bounce mobile sessions.
- **Recommendation:** Verify in browser that Loox renders the rating before user interaction. If not, consider one of: (1) inline a pre-rendered rating from Shopify metafields (`product.metafields.reviews.rating`), (2) flip `show_product_rating: True` as a fallback alongside Loox.
- **Severity:** S2 · **Effort:** E2 · **Priority:** **P1** (after browser verification)

#### P-06 — Both `product_variations` AND `variant_picker` blocks are active

- **Where:** `main` section, blocks:
  - `product_variations_tH4fqU` with `option_name: 'Choose Net Size'` (uses metafields `custom.variant_name` / `custom.variant_value`)
  - `variant_picker` (standard Shopify variant selector)
- **What:** Two variant pickers configured on the same product page. The `product_variations` block appears to use a custom metafield-driven pattern to surface size choices, while `variant_picker` is the standard one.
- **Why it matters:** Either they show different option dimensions (custom = "net size" via metafields, picker = color/option) — in which case fine — or they double up the same choice and confuse the user. Without rendered output, can't tell.
- **Recommendation:** Verify in browser whether each block renders separately or duplicates the same choice. If the product_variations is a cross-product chooser (pick another product variation), document why and rename `option_name` for clarity. If they overlap, drop one.
- **Severity:** S2 · **Effort:** E1–E2 (after verification) · **Priority:** **P1** — but **needs browser verification first**

#### P-07 — buy_buttons colors are zero-opacity (intentional or broken?)

- **Where:** `main` → `buy_buttons` block, all four color settings = `rgba(0,0,0,0)`.
- **What:** Either (a) the section logic treats `rgba(0,0,0,0)` as "use theme default", or (b) the buttons render with literally transparent backgrounds and text — i.e., invisible.
- **Why it matters:** ATC button visibility is the single most important visual element on the product page.
- **Recommendation:** Quick browser check to confirm the buttons are rendering correctly. If they're using theme defaults — fine, but worth setting explicit brand colors to remove ambiguity.
- **Severity:** S0 if broken, S3 if intentional · **Effort:** E1 · **Priority:** **P0** (verify first)

#### P-08 — SKU and product rating share count are hidden

- **Where:** `main` section: `show_sku: False`, `show_product_rating: False`.
- **What:** SKU hidden by default. Rating shown via Loox (see P-05).
- **Why it matters:** SKU matters for B2B customers ([sections/header-group.context.b2b.json](../sections/header-group.context.b2b.json) shows B2B context exists), commercial reps who quote orders, and customers tracking warranty claims. Not showing SKU is a B2B friction point.
- **Recommendation:** Flip `show_sku: True` for the B2B context override (via `templates/product.context.b2b.json` if it exists, or create one). Keep B2C default off if visual cleanliness is preferred.
- **Severity:** S2 (B2B) · **Effort:** E1 · **Priority:** **P2**

#### P-09 — "You may also like" is generic; complementary products would be more revenue-positive

- **Where:** Section `product-recommendations`, title "You may also like".
- **What:** Standard Shopify recommendations algorithm. Likely surfaces similar products — competing nets, not complements.
- **Why it matters:** "You may also like" suggests alternatives to the current product (reduces certainty of purchase). Complementary products (P-03 above) suggests additions (increases AOV).
- **Recommendation:** Tie this together with P-03: when complementary products are enabled, retitle this to "More from this series" or "Compare similar nets" and let the complementary block own the "complete your setup" surface.
- **Severity:** S2 · **Effort:** E1 · **Priority:** **P2** (depends on P-03 landing first)

### Product page summary

- **P0 (now):** P-01 (3 Loox sections — consolidate), P-07 (verify buy buttons render visibly)
- **P1 (this week):** P-02 (tabs beyond description), P-03 (enable complementary), P-04 (trust block in hero), P-05 (Loox rating fallback), P-06 (verify variant pickers)
- **P2 (this month):** P-08 (SKU on B2B), P-09 (rename recommendations)

**Highest-leverage single change:** P-03 (enable complementary products with action-oriented title). Direct AOV impact; ~E2 effort.

**Most P0-urgent verification:** P-07. Need to look at a rendered product page and confirm the ATC button is visible. The `rgba(0,0,0,0)` setting is suspicious enough that I don't want to assume it's just a default.

**Browser-verify queue** (do before acting on these):
- P-01: confirm the three Loox sections aren't showing distinct content modes
- P-05: confirm whether Loox rating renders before user interaction
- P-06: confirm whether `product_variations` and `variant_picker` are duplicating or complementing
- P-07: confirm ATC button visibility

## 3. Nets collection (`/collections/nets`)

**Template:** [templates/collection.nets.json](../templates/collection.nets.json) — 9 sections, **4 disabled** including the standard product grid (`main-collection`).
**Fallback:** [templates/collection.json](../templates/collection.json) is the default template (2 sections: banner + grid) used by collections that don't have a per-handle override.

### What this template is, in plain terms

`/collections/nets` is **not a shoppable product grid** — the `main-collection` section that would render the grid is **disabled**. Instead the page is a brand/category landing that funnels visitors into two sub-collections:

1. (banner / multi-column / grid — all disabled)
2. `featured-collections`: **Pro Series Nets** + **Home Series Nets** (2 sub-collections)
3. `gallery`: 6 image blocks
4. `video`: YouTube (`_9VUPq3SxOc`), autoplay, no controls, full-width
5. `rich-text`: "Every Net Return is manufactured with the same high-quality materials, only differing in size." / "Find Your Fit" CTA
6. `accordion-content`: 5 FAQ items ("How do I choose a golf net?", "Can you use real golf balls...", etc.)

### Findings

#### C-01 — `/collections/nets` is not a shoppable collection (intentional?)

- **Where:** `templates/collection.nets.json`. `main` (main-collection) is disabled along with the banner and multi-column intro.
- **What:** Visitors who click "Nets" in the nav (or land here from a "Shop Nets" CTA) see a marketing page with two sub-collection tiles, not a product grid.
- **Why it matters:** Mixed signals. From the home page, the slideshow CTAs say "Shop Nets" — implying the user lands ready to browse and buy nets. Landing on a category page that requires a second click (Pro Series or Home Series) adds friction and may drop visitors who expected a familiar e-commerce grid.
- **Recommendation, two paths:**
  1. **If this is intentional** (Pro vs Home is the real top-of-funnel choice): rename the home-page CTA from "Shop Nets" to "Explore Nets" so expectations match. Also strengthen this page to be a clear decision tool — comparison table, "Which net is right for you?" guide, decision-tree quiz.
  2. **If this is unintentional** (someone disabled the grid by accident): re-enable `main-collection` at the bottom of this page below the featured-collections block, or merge the two existing nets sub-collections into one `nets` collection with proper grid display.
- **Severity:** S1 (potential conversion drop) · **Effort:** E2 (depends on path) · **Priority:** **P0** for the decision; implementation depends.
- **R/A:** Kelton (which path)

#### C-02 — Only 2 sub-collections featured: Pro Series + Home Series

- **Where:** `featured_collections_BiA4a4` blocks.
- **What:** Two tiles — `pro-series-nets` (label "Pro Series") and `home-series-nets` (label "Home Series").
- **Why it matters:** The site sells more than two net families. Sim Series, Bryson collection, accessories, packages are all mentioned elsewhere. If a visitor lands on `/collections/nets` looking for any of those, they're funneled into Pro or Home only.
- **Recommendation:** Verify these are the two top-of-funnel choices. If so, fine — but consider adding "Sim Series" if it's net-adjacent enough to belong here. If Pro vs Home truly is the only decision, the page would benefit from a third tile: "Not sure? Take the quiz."
- **Severity:** S2 · **Effort:** E1 (template edit) · **Priority:** **P2**

#### C-03 — "Find Your Fit" CTA on rich-text has no button_link visible

- **Where:** `rich_text_ifqe9e`, button_text "Find Your Fit". JSON shows no `button_link` setting.
- **What:** Either the button uses a default link, or it's a non-functional CTA.
- **Why it matters:** A CTA without a destination is a dead end. If it goes to a sensible page (the quiz, the compare page, the Pro Series collection), fine. If it links nowhere, every clicker bounces.
- **Recommendation:** Verify in browser. Likely intended destination: `/pages/build-your-setup` (configurator) or `/pages/quiz`. Set explicit `button_link`.
- **Severity:** S1 if broken, S3 if working · **Effort:** E1 · **Priority:** **P0** (verify first)

#### C-04 — FAQ section is good, but headings are formal/SEO-style

- **Where:** `accordion_content_YALWAi`, 5 items.
- **What:** Headings are SEO-style questions: "How do I choose a golf net?", "Are golf nets worth it?", "Can you use real golf balls with practice nets?", "Is using a golf net good practice?", "Is it easy to learn how to set up a golf net at home?"
- **Why it matters:** Good for organic search; the questions match what people Google. Slightly formal/long for a brand voice though.
- **Recommendation:** Keep as-is for SEO. Optional polish: pair each formal question with a punchier subhead inside the expanded content (e.g. open with "Short answer: yes, if you practice >2x/week." then the long-form). Low priority; current copy is functional.
- **Severity:** S3 · **Effort:** E2 · **Priority:** **P3**

#### C-05 — Autoplay YouTube video in `/collections/nets`

- **Where:** `video_LWhEwt`, `video_url: youtube/_9VUPq3SxOc`, `autoplay: True`, `show_video_controls: False`.
- **What:** A full-width YouTube embed that autoplays without controls.
- **Why it matters:** YouTube embeds are heavy (the iframe pulls in YouTube's full player JS). Autoplay-on-page-load is universally muted by browsers unless interaction happens, so the autoplay setting often doesn't fire on first load. Hidden controls means users can't pause if it does play. Also a CLS risk if the iframe loads after layout.
- **Recommendation:** (1) Verify what plays — if the video genuinely belongs here (product demo), keep but consider a self-hosted MP4 from `Video Assets/` instead of YouTube for performance. (2) Enable controls so users can stop / unmute. (3) If just decorative B-roll, replace with a looping silent MP4.
- **Severity:** S2 · **Effort:** E2 · **Priority:** **P2**

#### C-06 — Other collection pages: are they all using the default grid?

- **Where:** `templates/collection.json` is the fallback grid; per-handle overrides exist (`collection.azalea.json`, `collection.nets.json`, `collection.pro-series.json`, etc.).
- **What:** This audit only covers `collection.nets.json`. The rest may follow different patterns.
- **Recommendation:** Quick scan of all `collection.*.json` files to see which have `main-collection` disabled / heavily customized. This is a cross-page concern — added to the backlog below.
- **Severity:** S2 · **Effort:** E1 (one scan) · **Priority:** **P2**

### Collection page summary

- **P0 (now/decision):** C-01 (decide intent of /collections/nets), C-03 (verify "Find Your Fit" link)
- **P2 (this month):** C-02 (third tile?), C-05 (video performance), C-06 (audit other collection templates)
- **P3 (backlog):** C-04 (FAQ voice polish)

**Headline:** The `/collections/nets` page is structurally different from a normal shoppable collection. It's a brand landing that funnels into Pro vs Home Series. That's a deliberate UX choice but it may not match what users expect when they tap a "Shop Nets" CTA. Decision needed before any cosmetic changes.

## 4. Cart (`/cart`)

**Template:** [templates/cart.json](../templates/cart.json) — 2 sections.
**Style:** Per theme settings, primary cart is a **drawer** (overlays the page). The `/cart` route is the message-style fallback / dedicated page.

### Section structure

| # | Section | Type | Notes |
|---|---|---|---|
| 1 | `main` | main-cart | Cart items, totals, order_note, shipping estimator (US default), payment methods shown |
| 2 | `cart-recommendations` | cart-recommendations | "You may also like" — pulls 10 related products via `intent="related"` |

### Findings

#### CT-01 — Free shipping threshold is set to `"0"` but the bar is enabled

- **Where:** [config/settings_data.json](../config/settings_data.json): `cart_show_free_shipping_threshold: true`, `cart_free_shipping_threshold: "0"`.
- **What:** The free shipping progress bar reads the threshold in cents and divides cart total by it. A threshold of `"0"` would either: divide-by-zero crash, always show 100% ("Yay! Free shipping unlocked!"), or display nonsensically.
- **Why it matters:** This is the kind of bug that erodes trust — visitors notice a permanently-celebrating "free shipping unlocked" banner and tune it out, or worse, see a broken UI element. Also a footgun if the brand later wants to add a real threshold (e.g., "$50 unlocks free shipping") — the broken state is masking the feature's intent.
- **Recommendation, decide which:**
  1. **Free shipping is always free** → set `cart_show_free_shipping_threshold: false` and add a static "Free shipping on all orders" line instead.
  2. **There IS a threshold** (e.g. some accessories ship for $X under $Y) → set the actual threshold value.
  3. **Threshold varies by product** → multi-threshold syntax (the code at [main-cart.liquid:12](../sections/main-cart.liquid:12) supports `"USD:50, CAD:75"` format).
- **Severity:** S1 (UX confusion + missed merchandising opportunity) · **Effort:** E1 (settings tweak) · **Priority:** **P0**
- **R/A:** Kelton (decide policy) · **C:** Claude (apply setting)
- **Verify in browser** what the bar currently shows.

#### CT-02 — Cart has zero trust signals

- **Where:** `main` section. Settings: `show_payment_methods: True`, `show_shipping_estimator: True`. No trust badges, no return policy reminder, no warranty line, no secure-checkout reassurance.
- **What:** The cart drawer / page shows items + totals + payment method icons. None of the home-page trust bar promises (Free Shipping / 3-Year Warranty / 30-Day MBG) appear at the conversion moment.
- **Why it matters:** Cart abandonment is highest right before checkout. Trust signals at the cart are a proven CRO lever (especially "money-back guarantee" and "secure checkout"). The Net Return offers all three — they should be visible at the cart.
- **Recommendation:** Add a small trust block above the checkout button: three icon + label pairs (Free Shipping / 3-Year Warranty / 30-Day Money-Back). Either as a `main-cart` block addition (if the section schema supports it) or as a content block injected via theme app block / custom Liquid.
- **Severity:** S1 (conversion) · **Effort:** E2 (block addition or new section) · **Priority:** **P1**

#### CT-03 — Cart recommendations pulls 10 "related" products — wrong intent

- **Where:** `cart-recommendations` section. [sections/cart-recommendations.liquid:8](../sections/cart-recommendations.liquid:8): `intent="related"`, `recommendations-count="10"`.
- **What:** Uses Shopify's "related" recommendation intent, which surfaces similar products. For the cart, the correct intent is `complementary` — products that *complete* the order, not *substitute* for what's already in it.
- **Why it matters:** At the cart, "you may also like other golf nets" is unhelpful: the customer has already picked one. "Add side barriers, turf, or a launch monitor to complete your setup" is the AOV-positive ask.
- **Recommendation:** Change `intent="related"` → `intent="complementary"`. Also reduce `recommendations-count="10"` to 4 — the cart is a high-focus surface, not a discovery one. Retitle "You may also like" → "Complete your setup".
- **Severity:** S1 (AOV) · **Effort:** E1 (two Liquid attribute edits) · **Priority:** **P0**

#### CT-04 — No urgency or social proof in cart

- **Where:** No mention of stock levels, "people are buying", recent purchase notifications, or recently-viewed.
- **Why it matters:** For high-AOV gear ($500-$5000 setups), customers often pause to compare. A subtle "X people viewing this", "Limited stock", or a single recent-review snippet near the buy button keeps momentum.
- **Recommendation:** Low priority and risky to overdo. Suggest: pull a single Loox review for one of the cart items as a "social proof" line (e.g., "★★★★★ 'Best practice net I've owned' — Marc R."). Avoid fake urgency. Only ship if it tests well in the brand voice.
- **Severity:** S2 · **Effort:** E2–E3 · **Priority:** **P3**

#### CT-05 — Order note vs message-style cart vs drawer cart split

- **Where:** `main` has an `order_note` block. Theme settings show `cart_type: "drawer"` is the active behavior elsewhere, but `/cart` itself renders the message style (the fallback page).
- **What:** Most visitors probably never reach `/cart` directly because the drawer captures all add-to-cart actions. Visitors who do reach `/cart` (deep link, drawer not loaded, mobile keyboard scroll bypass) see a different layout entirely.
- **Why it matters:** Parity. Whatever lives in the drawer (trust signals, complementary upsell, free-shipping bar) should also live on `/cart` and vice versa.
- **Recommendation:** Audit the cart drawer ([sections/mini-cart.liquid](../sections/mini-cart.liquid)) in parallel with this page and ensure they have the same trust/upsell components. If only changing one, do the drawer first — it captures more traffic.
- **Severity:** S2 · **Effort:** E2 · **Priority:** **P1**

#### CT-06 — Order note block adds friction without clear purpose

- **Where:** `main` → `order_note` block.
- **What:** Most consumer e-commerce sites either hide order notes or relegate them to a collapsible. Order notes are typically a B2B / gifting feature.
- **Why it matters:** On a B2C cart, an open "Add a note to your order" textarea can be a friction / typo magnet without revenue benefit.
- **Recommendation:** Verify what % of orders include a note (Shopify Admin → Orders → filter). If <2% of orders use it, collapse to a "Add note (optional)" toggle or remove for B2C. Keep in B2B context (`/templates/cart.context.b2b.json` if it exists).
- **Severity:** S3 · **Effort:** E1 · **Priority:** **P2**

### Cart page summary

- **P0 (now):** CT-01 (free shipping threshold bug), CT-03 (recommendations intent)
- **P1 (this week):** CT-02 (trust signals on cart), CT-05 (drawer parity)
- **P2 (this month):** CT-06 (order note)
- **P3 (backlog):** CT-04 (social proof in cart)

**Highest-leverage single change:** **CT-03** — two-attribute edit, no design work, immediate AOV impact. `intent="related"` → `intent="complementary"`, count from 10 to 4, title from "You may also like" to "Complete your setup."

**Most urgent verify:** CT-01. The free-shipping threshold = "0" is either a misconfiguration with a visible UI artifact, or a working choice with a meaningless bar. Either way the bar's current state needs eyes.

## 5. Build Your Setup (`/pages/build-your-setup`)

**Template:** [templates/page.build-your-setup.json](../templates/page.build-your-setup.json) — 6 sections, 2 disabled.
**Intent:** Three-step configurator flow that funnels visitors through Base → Launch Monitor → Accessories.

### Section structure

| # | Section | Type | Content |
|---|---|---|---|
| 1 | hero | image-with-text-block | "Build Your Setup" / "Perfect your practice, improve your game" — **no CTA** |
| 2 | main | main-page (disabled) | No body copy |
| 3 | (disabled) image-with-text-overlay | | |
| 4 | featured-collections | featured-collections | **Choose a Base** — Nets, Packages, Sim Bays |
| 5 | featured-collections | featured-collections | **Add a Launch Monitor** — FlightScope, Uneekor, Full Swing, Foresight |
| 6 | featured-collections | featured-collections | **Add Accessories** — Essentials, Safety, Simulation |

### Findings

#### B-01 — The flow has good IA but no actual configurator state

- **What:** Three sequential "choose this" sections. There's no running cart, no selection state ("you picked: Pro 9 + FlightScope X1"), no running total. It's a *guided browse*, not a *configurator*.
- **Why it matters:** "Build Your Setup" sets the expectation of a tool. What it delivers is a vertical-scroll list of three category groups. Visitors may bounce expecting interactivity.
- **Recommendation, two paths:**
  1. **Rename and lower expectations** → call it "Setup Guide" or "How to Pick Your Setup". Keep the static layout, drop the configurator framing. Lowest effort, immediate honesty.
  2. **Build a real configurator** → JS-driven step-through with selection state, running total, "add all to cart" at the end. High effort but potentially the best AOV lever on the site.
- **Severity:** S2 (depends on path) · **Effort:** E1 (rename) or EX (real configurator) · **Priority:** **P1** for the decision

#### B-02 — Hero has no CTA

- **Where:** `image_with_text_block_kNPrw7`. Title "Build Your Setup", content "Perfect your practice, improve your game", button_background / button_text_color set but **no `button_text` and no `button_link`**.
- **Why it matters:** Visitors land here with momentum from a "Build Your Practice Setup" home-page CTA. Reaching the page and seeing a hero with no follow-on action breaks momentum. The next prompt is the "Choose a Base" section heading two scrolls down.
- **Recommendation:** Add hero CTA "Start with a Net" → anchor link to `#choose-a-base`. Or "Take the quiz first" → `/pages/quiz`.
- **Severity:** S1 · **Effort:** E1 · **Priority:** **P0**

#### B-03 — Foresight tile missing label

- **Where:** Section 5 (Launch Monitors), block `collection_UnRQC8`. Collection: `foresight`, label: *(empty)*.
- **What:** Three of four tiles have explicit labels ("FlightScope", "Uneekor", "Full Swing"). The Foresight tile has no label setting.
- **Why it matters:** Likely fine — the section may fall back to the Shopify collection title, which is presumably "Foresight." But it's inconsistent — every other tile is explicit, this one is implicit. Sloppy.
- **Recommendation:** Set `label: 'Foresight'` (or whatever the brand naming convention is — e.g., "Foresight Sports").
- **Severity:** S3 · **Effort:** E1 · **Priority:** **P2**

#### B-04 — No "I don't need this" path through the funnel

- **Where:** The three sequential sections don't offer skip options. Visitors who already own a launch monitor or who don't want one have no clean way past section 5.
- **Recommendation:** In a real configurator, "skip" is a button. In this static layout, the rich-text could add a subtitle: "Already have a launch monitor? Skip to accessories" with an anchor link.
- **Severity:** S3 · **Effort:** E1 · **Priority:** **P3**

### Build Your Setup summary

- **P0:** B-02 (hero CTA)
- **P1:** B-01 (decide configurator vs guide)
- **P2:** B-03 (Foresight label)
- **P3:** B-04 (skip path)

## 6. Compare Models (`/pages/compare`)

**Template:** [templates/page.compare.json](../templates/page.compare.json) — 4 sections, 1 disabled.

### Section structure

| # | Section | Type | Content |
|---|---|---|---|
| 1 | main | main-page (disabled) | No body copy |
| 2 | intro | rich-text | "Compare Nets" / "Every Net Return is manufactured with the same high-quality materials, only differing in size." |
| 3 | pro_series | multi-column | **Pro Series** — Pro, Pro 8, Pro 9, Pro 10, Pro XL (5 items) |
| 4 | home_series | multi-column | **Home Series** — Junior, Mini, Home (3 items) |

Each item lists dimensions (`8'w x 7'6"h x 3'6"d`), weight, and price.

### Findings

#### CM-01 — "Compare" page is two stacked grids, not an actual comparison

- **Where:** Two separate multi-column sections (Pro Series and Home Series).
- **Why it matters:** Users on a "Compare" page want to see **all options side-by-side in one row**. Stacking 5 Pro items in one section and 3 Home items in another forces vertical mental comparison across screens. The actual comparison job — "I have 8' of ceiling height, which net fits?" — is harder than it needs to be.
- **Recommendation:** Replace with a **proper comparison table** that lists models as columns and attributes (width, height, depth, weight, price, "best for…") as rows. On mobile, allow horizontal scroll or stack-with-sticky-row-labels. This page is a P0 candidate for design work given how content-ready it already is.
- **Severity:** S1 (decision-stage CRO) · **Effort:** E3 (new layout) · **Priority:** **P1**

#### CM-02 — Sim Series missing entirely from comparison

- **Where:** Only Pro Series and Home Series listed. No Sim Series, no Bryson collection, no accessories.
- **Why it matters:** If a visitor is browsing simulators (heavily merchandised elsewhere), the compare page is a gap. They have to leave to find sim setup info.
- **Recommendation:** If sim setups are net-adjacent enough to compare, add a third section. If not, the page's scope is implicitly "freestanding nets only" — add that disclaimer in the intro rich-text.
- **Severity:** S2 · **Effort:** E2 · **Priority:** **P2**

#### CM-03 — Prices are static text — risk of drift

- **Where:** Item content blocks: `<p>$795</p>`, `<p>$895</p>`, etc., all hardcoded in the JSON.
- **Why it matters:** When Shopify product prices change (sale, MSRP update), this page lies. Every product price change requires a manual edit here.
- **Recommendation:** Either pull prices dynamically from product metafields / linked products (requires section logic changes), or add a content review reminder when prices change. Lower priority unless a price recently changed without this page updating.
- **Severity:** S2 (data integrity over time) · **Effort:** E3 (template logic) · **Priority:** **P2**

#### CM-04 — Dimension formatting hard to scan

- **Where:** Every item: `8'w x 7'6"h x 3'6"d<br/>Weight: 28 lbs.`
- **Why it matters:** Mixed feet/inches notation (`7'6"`) is technically correct but slow to compare. In a 5-column comparison, the user wants to spot which net has more headroom — that requires re-parsing each `Xf'Y"h` value.
- **Recommendation:** Two improvements in any future comparison rebuild: (1) consistent decimal-foot format (`7.5 ft`), (2) include cm equivalents for international visitors.
- **Severity:** S3 · **Effort:** E1 if content edit; E3 if structural · **Priority:** **P3**

#### CM-05 — "Shop Now" link style on every item

- **Where:** All 8 items: `link_text: 'Shop Now'`, `link_style: 'link'`.
- **Why it matters:** Underlined-link CTAs on a comparison page are weaker than button CTAs. The comparison is decision-stage; the user is ready to click.
- **Recommendation:** Change link_style to `button` for every item, or repeat across all items (this is a global multi-column setting).
- **Severity:** S2 · **Effort:** E1 (toggle setting across 8 blocks) · **Priority:** **P1**

### Compare Models summary

- **P1:** CM-01 (real comparison table), CM-05 ("Shop Now" → button)
- **P2:** CM-02 (Sim Series), CM-03 (static prices)
- **P3:** CM-04 (dimension formatting)

---

## Backlog of cross-page issues

Patterns that show up on more than one page. Fix once, benefits everywhere.

### X-01 — `rgba(0,0,0,0)` is everywhere as "use theme default"

Every section we audited has color settings filled with `rgba(0,0,0,0)`. This appears to be the convention for "fall back to theme defaults" — but it's indistinguishable from "literally transparent." We've already verified one suspicious case (P-07 buy_buttons) needs browser inspection. Recommendation: confirm the section base styles treat `rgba(0,0,0,0)` as "use default" universally. If yes, document this convention in `CLAUDE.md`. If no, every section with this pattern needs review.
**Severity:** S2 · **Effort:** E1 (verify) + E3 (cleanup if needed) · **Priority:** **P1** (verify only)

### X-02 — Link-style CTAs where button-style would convert better

Pattern on home (H-08), build-your-setup (B-02), and compare (CM-05): `link_style: 'link'` on key navigation CTAs. Underlined-text CTAs are weaker than buttons. Recommend a sweep: any CTA at a decision/funnel boundary should be a button.
**Severity:** S2 · **Effort:** E1 per page · **Priority:** **P1**

### X-03 — "You may also like" appears in three places with one meaning

Home page Loox carousel, product page recommendations, and cart recommendations all say "You may also like." On product and cart, the intent should be **complementary** (CT-03) rather than related. On the home page, the carousel is just reviews so the label may be incidental. Pattern: stop saying "You may also like" anywhere it should be "Complete your setup" or "Frequently bought together."
**Severity:** S2 · **Effort:** E1 per page · **Priority:** **P1**

### X-04 — Loox is heavily layered across the storefront

Home page: section 14 reviews carousel. Product page: hero rating + 3 separate Loox sections. Cart: nothing. The product-page coverage is excessive (P-01); the cart-page absence is a gap (CT-04). Consolidating product Loox + adding a cart review snippet would balance the load.
**Severity:** S2 · **Effort:** E2 · **Priority:** **P2**

### X-05 — Trust signals don't follow the user through the funnel

Trust bar (Free Shipping / 3-Yr Warranty / 30-Day MBG) is on the home page only. It disappears on product pages (P-04) and cart (CT-02). The same three promises should appear adjacent to every buy decision.
**Severity:** S1 (conversion) · **Effort:** E2 (block additions on product + cart) · **Priority:** **P1**

### X-06 — Sub-collection naming inconsistency

Home page tnr-collection-list has tiles labeled "Nets / Packages / Simulation / Accessories." The Build Your Setup page has "Nets / Packages / Sim Bays" (Sim Bays, not Simulation). The Nets collection page funnels into "Pro Series / Home Series." Compare page section titled "Pro Series" and "Home Series." Inconsistent naming across these confuses the IA.
**Severity:** S2 · **Effort:** E1 (decide canonical labels) · **Priority:** **P2**

### X-07 — Collection handle ambiguity (nets vs nets-1)

The home page CTA links to `/pages/master-2026` or `shopify://collections/azalea`. The build-your-setup page links collection `nets-1`. The compare page implicitly references Pro/Home families. We don't yet know which collection handles are canonical. Worth a Shopify Admin sweep.
**Severity:** S2 · **Effort:** E2 · **Priority:** **P2**

## Recommended fix queue (priority-ordered, rolled up from page audits)

### P0 — do now (verify or fix immediately)

| ID | Page | Finding | S | E | Needs verify in browser? |
|---|---|---|---|---|---|
| H-01 | Home | Empty video section (placeholder SVG renders) | S1 | E1 | No — confirmed empty in JSON |
| P-01 | Product | Three stacked Loox sections at bottom | S1 | E1 | Yes — confirm not distinct |
| P-07 | Product | buy_buttons all `rgba(0,0,0,0)` | S0 if broken | E1 | **Yes — visibility-critical** |
| CT-01 | Cart | Free shipping threshold = "0" | S1 | E1 | Yes — confirm what bar shows |
| CT-03 | Cart | Recommendations intent = "related" not "complementary" | S1 | E1 | No — clear AOV win |
| C-01 | Collection | /collections/nets is not shoppable (intentional?) | S1 | E2 | **Decision needed** |
| C-03 | Collection | "Find Your Fit" button has no link visible | S1 if broken | E1 | Yes — confirm link |
| B-02 | Build Setup | Hero has no CTA | S1 | E1 | No — confirmed missing |

### P1 — this week

| ID | Page | Finding | S | E |
|---|---|---|---|---|
| H-03 | Home | Slideshow has 2 near-identical slides | S2 | E1–E2 |
| H-04 | Home | No "what is this product" line above the fold | S1 | E1 |
| H-05 | Home | Best Sellers block may be stale BFCM data | S2 | E2 |
| H-06 | Home | Loox carousel at position 14 (move to 3-4) | S1 | E1 |
| H-08 | Home | Two competing "build/find your setup" CTAs | S1 | E2 |
| P-02 | Product | Description is the only tab | S1 | E3 |
| P-03 | Product | complementary_products block is disabled | S1 | E2 |
| P-04 | Product | Trust block schema exists but unused | S1 | E2 |
| P-05 | Product | Native rating off; Loox-only no fallback | S2 | E2 |
| P-06 | Product | Both product_variations AND variant_picker active | S2 | E2 |
| CT-02 | Cart | No trust signals on cart | S1 | E2 |
| CT-05 | Cart | Cart drawer vs `/cart` parity | S2 | E2 |
| B-01 | Build Setup | Decide configurator vs guide | S2 | E1 or EX |
| CM-01 | Compare | Build a real comparison table | S1 | E3 |
| CM-05 | Compare | Shop Now link → button | S2 | E1 |
| X-02 | Cross | Link-style CTAs at funnel boundaries | S2 | E1/page |
| X-03 | Cross | "You may also like" everywhere | S2 | E1/page |
| X-05 | Cross | Trust bar doesn't follow user through funnel | S1 | E2 |

### P2 — this month

| ID | Page | Finding | S | E |
|---|---|---|---|---|
| H-02 | Home | Icons don't match labels in text-with-icons | S2 | E1 |
| H-07 | Home | Quiz CTA copy is weak | S2 | E1 |
| H-09 | Home | "BRYSON collection" CTA copy awkward | S2 | E1 |
| H-10 | Home | Generic Simulation tagline | S2 | E1 |
| P-08 | Product | SKU hidden (B2B friction) | S2 | E1 |
| P-09 | Product | "You may also like" → "More from this series" | S2 | E1 |
| C-02 | Collection | Only 2 sub-collections featured | S2 | E1 |
| C-05 | Collection | YouTube autoplay video | S2 | E2 |
| C-06 | Collection | Audit other collection templates | S2 | E1 |
| CT-06 | Cart | Order note adds friction | S3 | E1 |
| B-03 | Build Setup | Foresight tile missing label | S3 | E1 |
| CM-02 | Compare | Sim Series missing from compare | S2 | E2 |
| CM-03 | Compare | Static prices risk drift | S2 | E3 |
| X-04 | Cross | Loox layering across storefront | S2 | E2 |
| X-06 | Cross | Sub-collection naming inconsistency | S2 | E1 |
| X-07 | Cross | Collection handle ambiguity | S2 | E2 |

### P3 — backlog

| ID | Page | Finding | S | E |
|---|---|---|---|---|
| C-04 | Collection | FAQ voice polish | S3 | E2 |
| CT-04 | Cart | Social proof on cart | S2 | E2–E3 |
| B-04 | Build Setup | No skip path through funnel | S3 | E1 |
| CM-04 | Compare | Dimension formatting in cm | S3 | E1/E3 |

## Browser verification log (2026-05-13)

Resolved the P0-verify items via static + curl checks before any edits:

| ID | Status | Resolution |
|---|---|---|
| **P-07** | ✅ Not a bug | [sections/main-product.liquid:20-47](../sections/main-product.liquid) explicitly handles `rgba(0,0,0,0)` as "use theme default". Buy buttons render with brand theme colors. **Downgrade P-07 to S3.** Convention applies site-wide — captured in **X-01**. |
| **P-01** | ✅ Confirmed worse than initial finding | The two `loox_reviews_loox_dynamic_section` blocks (`TQzh3L` and `6x3kU7`) have **identical settings** — they're literal duplicates. Both also have **`is_sample: True`** which in Loox is the demo/sample-review mode. Real customer reviews may not be rendering at all on product pages. **Upgrade P-01 to S0** pending confirmation that reviews are real. |
| **C-03** | ✅ Not broken | "Find Your Fit" button links to `shopify://pages/compare` (the Compare page). Worth noting that home page has a similar "Find The Perfect Setup" CTA pointing to `/pages/quiz` — different destinations, similar copy. Folded into **H-08**. |
| **CT-01** | ✅ Confirmed redundant | Verified by curl: with threshold=`"0"`, the bar renders `<free-shipping-bar threshold="0" style="--progress: 1">` with text "**You are eligible for free shipping!**" on every cart. Three places now say "free shipping": (1) announcement bar at top ("FREE Shipping on ALL Products - LIMITED TIME"), (2) this bar in cart, (3) the shipping methods box ("Free Standard UPS Shipping for all the orders."). Redundant and the "limited time" claim on the announcement bar is likely stale. **CT-01 recommendation:** turn the bar off (`cart_show_free_shipping_threshold: false`) and verify the announcement bar isn't lying about "LIMITED TIME". |

## Suggested top-5 starting fixes (no design dependencies)

If you want to ship a small batch this week with zero ambiguity:

1. **CT-03** — change cart recommendations to `intent="complementary"`, count 4, title "Complete your setup". *(E1, immediate AOV)*
2. **H-06** — move Loox carousel from position 14 to position 3 on home. *(E1, reorder one line in `index.json`)*
3. **H-01** — populate or disable the broken video section on home. *(E1, requires choosing a video from `Video Assets/` or disabling)*
4. **B-02** — add CTA to Build Your Setup hero. *(E1, copy + anchor link)*
5. **P-03** — enable complementary_products block on product page. *(E2, also requires Shopify Admin → Search & Discovery setup)*

---

## Batch B fixes shipped (2026-05-13)

Pushed to source theme `149365096541` (still unpublished, not live).

| ID | Status | What landed |
|---|---|---|
| **H-01** | ❌ False positive | The video section *is* set: `shopify://files/videos/newlogo-3dspin.mp4` (3D net spin logo video). My audit's Python extraction filtered out `shopify://` strings, masking it. No change made. Audit finding withdrawn. |
| **H-06** | ✅ Shipped | Moved `17139716501e2e2a7b` (Loox reviews carousel) from end of `order` array to position 3 — right after `trust_bar_DdPqga`, before `17621461567133e3c2`. New effective sequence: slideshow → trust bar → **Loox reviews** → Best Sellers → category tiles. |
| **P-01** | ✅ Shipped (partial) | Disabled section `176166137173574290` (the duplicate Loox dynamic section). Flipped `is_sample: true` → `false` on the remaining `loox_reviews_loox_dynamic_section_TQzh3L`. **Verify in Loox dashboard** that this section now shows real customer reviews, not sample/demo data. If it shows real reviews, P-01 fully resolved; if it shows nothing, real reviews may not be configured/imported yet. |
| **CT-01** | ✅ Shipped | Set `cart_show_free_shipping_threshold: false` in `config/settings_data.json`. The "You are eligible for free shipping!" bar at $0 threshold no longer renders. The two other "free shipping" callouts (announcement bar + shipping methods box) remain. Note: the announcement bar still says "FREE Shipping on ALL Products - LIMITED TIME" — recommend reviewing whether "LIMITED TIME" is accurate. |
| **CT-03** | ✅ Shipped | [sections/cart-recommendations.liquid:9](../sections/cart-recommendations.liquid:9): `intent="related"` → `intent="complementary"`, `recommendations-count="10"` → `4`. [templates/cart.json:40](../templates/cart.json:40): title "You may also like" → "Complete your setup". |

**Theme Check:** 158 offenses, 1 error, 157 warnings — unchanged from Batch A baseline.

**Verification queue** (do these in browser after push propagates):
- Confirm Loox reviews actually populate on product pages (P-01 follow-up)
- Confirm cart page no longer shows the "eligible for free shipping" bar (CT-01)
- Confirm cart recommendations now surface accessories/complements, not similar nets (CT-03)
- Confirm home page now shows reviews carousel in position 3 (H-06)

**Open audit decisions still pending:**

- **H-04** — hero subheading copy ("what is this product?" for cold traffic) — needs your copywriting call
- **H-05** — Best Sellers collection (`best-sellers-bfcm`) — Shopify Admin decision
- **H-08** — pick a lane: configurator vs quiz — strategic decision
- **C-01** — `/collections/nets`: keep as marketing landing or restore product grid — strategic
- **B-01** — Build Your Setup: rename to guide, or build real configurator — strategic
- **CM-01** — Compare page rebuild as actual table — design work
- **P-02** — product page additional tabs (Specs / Shipping / FAQ) — content authoring per product
- **P-03** — enable `complementary_products` block — requires Shopify Admin → Search & Discovery rule setup
- **P-04** — add trust block to product hero — schema addition

---

---

## Home page deep-dive: collection grid + Best Sellers (2026-05-13)

Going beyond the original audit on the two merchandising-heavy sections.

### TNR Collection Grid (4 tiles: Nets / Packages / Simulation / Accessories)

Source: [sections/tnr-collection-list.liquid](../sections/tnr-collection-list.liquid), block `tnr_collection_list_VRWxpC` in [templates/index.json](../templates/index.json).

| Tile | Title | Image | Link |
|---|---|---|---|
| 1 | Nets | `shopify://shop_images/nets.webp` | `shopify://collections/nets-1` |
| 2 | Packages | `shopify://shop_images/packages.webp` | `shopify://collections/packages` |
| 3 | Simulation | `shopify://shop_images/newsim.jpg` | `shopify://collections/simulation` |
| 4 | Accessories | `shopify://shop_images/accessories.webp` | `shopify://collections/general-accessories` |

#### H-11 (NEW) — Collection grid has no section heading

- **Where:** Section settings `subheading: ''`, `title: ''`. Header logic in [tnr-collection-list.liquid:54](../sections/tnr-collection-list.liquid:54) only renders if at least one is set.
- **What:** The 4 tiles appear with no header label. Visitors don't know they're looking at a category navigation.
- **Recommendation:** Set `title: "Shop by Category"` (or stronger: "Pick Your Lane" / "Where to Start"). Optionally set `subheading: "Find your setup"` for context. Adds clarity, costs nothing.
- **Severity:** S2 · **Effort:** E1 · **Priority:** **P0** (one JSON edit)

#### H-12 (NEW) — "Best Seller" badge fires on every product in carousel

- **Where:** [blocks/ai_gen_block_74536a9.liquid:372](../blocks/ai_gen_block_74536a9.liquid:372). `{% if block.settings.show_badge %}` is outside the product `forloop`, so the badge renders for every product.
- **What:** Up to 12 products in the carousel, all flagged "Best Seller." Devalues the badge. Customers see a wall of "Best Seller" labels and tune them out.
- **Recommendation, three options:**
  1. **Drop the badge entirely** (cleanest): the section heading "Best Sellers" already tells visitors what this is.
  2. **Gate to top 3** by wrapping the badge span in `{% if forloop.index <= 3 %}`.
  3. **Limit to the pinned product** (the `starting_from_product`).
- **Severity:** S2 · **Effort:** E1 (Liquid one-liner) · **Priority:** **P0** for option 1 or 2

#### H-13 (NEW) — Best Sellers `products_limit: 12` is high

- **Where:** AI block settings: `products_limit: 12`.
- **What:** 12 products in a horizontal scroll. Most carousels see attention drop after 4–6 items. The trailing 6 items are essentially invisible to typical users.
- **Recommendation:** Drop to 8 (still substantial, less filler). Or 6 for a tighter "actually best" feel.
- **Severity:** S3 · **Effort:** E1 · **Priority:** **P1**

#### H-14 (NEW) — Tile overlay/legibility risk

- **Where:** All 4 collection tiles: `overlay_color: rgba(0,0,0,0)`, `overlay_opacity: 0`, `text_color: '#191919'` (near-black text directly on the image).
- **What:** No overlay between image and text. If the image has any dark area where the title sits (e.g., a dark net visible, foliage, shadow), the dark `#191919` title becomes unreadable.
- **Recommendation:** Hard to fix blindly — depends on what the images actually look like. Options once eyeballed:
  - Add a subtle light overlay (`overlay_color: '#ffffff'`, `overlay_opacity: 20-30`) and keep dark text
  - Or invert: dark overlay + white text
  - Or pick consistent-style images that all have a light corner for the text to live in
- **Severity:** S2 (potentially S1 on certain tiles) · **Effort:** E1 if pure setting, E3 if new imagery · **Priority:** **P1** — **needs browser eyeball first**

#### H-15 (NEW) — Naming inconsistency: "Simulation" vs "Sim Bays" vs "Sim Series"

- **Where:** Home tile = "Simulation"; Build Your Setup = "Sim Bays"; Compare page references "Pro Series" / "Home Series" implying a "Sim Series" naming convention.
- **What:** Three different labels across the storefront for the same product family. Each is a separate decision the user makes about what to click.
- **Recommendation:** Pick one canonical label and roll it across all surfaces. **"Sim Series"** is the most consistent with "Pro Series" and "Home Series" naming.
- **Severity:** S2 · **Effort:** E1 (rename a few labels in JSON) · **Priority:** **P1**

#### H-16 (NEW) — `starting_from_product: 'universal-side-barriers'`

- **Where:** AI carousel pins this product as the carousel's anchor / first card.
- **What:** Universal Side Barriers is an accessory, not a flagship net. As the first "Best Seller" visitors see, it's either intentional (it genuinely *is* the top revenue product by units sold) or accidental (alphabetical, leftover from an experiment).
- **Recommendation:** **Confirm intent.** If it's the actual top seller, document and keep. If it's accidental, swap to a flagship like a Pro Series net or a Package.
- **Severity:** S2 (potentially S1 if it's the wrong anchor) · **Effort:** E1 · **Priority:** **P1** — **needs your sales-data call**

### Best Sellers collection (data side)

#### H-05 (revisited) — `collection: best-sellers-bfcm`

Still flagged. BFCM = Black Friday/Cyber Monday. Either:
- Rename the collection to `best-sellers` (year-round) in Shopify Admin, AND update the block setting
- Confirm the BFCM collection IS the right list for year-round use and rename the handle
- Create a fresh `best-sellers` collection and switch the block to that

This is your Shopify Admin call. Once decided I can update the block setting in one line.

### Recommended Batch C — ship these now

| ID | Change | Effort |
|---|---|---|
| **H-11** | Set collection grid title: "Shop by Category" (or your alternative) | E1 |
| **H-12** | Drop the per-card "Best Seller" badge (Option 1) OR gate to top 3 (Option 2) | E1 |
| **H-13** | Best Sellers `products_limit: 12 → 8` | E1 |
| **H-15** | Rename "Simulation" → "Sim Series" on the home tile (+ Build Your Setup label later) | E1 |

### Batch C — shipped (2026-05-13)

| ID | Change | Resolution |
|---|---|---|
| **H-11** | Collection grid header | Set `subheading: "Shop by Category"`, `title: "Pick Your Lane"`. The 4 tiles now have a labeled context section. |
| **H-12** | Best Seller badge | Set `show_badge: false`. Per-card badges no longer render; only the section heading "Best Sellers" calls out the curation. |
| **H-13** | Carousel product count | `products_limit: 12 → 8`. Less scroll fatigue, fewer "filler" cards. |
| **H-15** | Sim naming | Home tile "Simulation" → "Sim Series". Build Your Setup label "Sim Bays" → "Sim Series". Now consistent with Pro Series / Home Series naming. |
| **H-16** | Starting product anchor | `starting_from_product: 'universal-side-barriers'` → `'pro-series-golf-net'`. Carousel now anchors on the flagship Pro net (verified via storefront API as a member of `best-sellers-bfcm`). |

Pushed to source theme `149365096541`. Theme-check unchanged (158 / 1 / 157).

### Still pending (your call or eyeball)

| Item | Question | Path |
|---|---|---|
| **H-05** | Year-round best sellers collection — keep `best-sellers-bfcm` handle, rename in Admin, or create new `best-sellers`? | Shopify Admin decision |
| **Naming consistency followup** | Underlying collection handles still differ (`/collections/simulation` on home tile vs `/collections/sim-bays` on Build Your Setup). Both now LABELED "Sim Series" but they go to different collections. Either consolidate the collections in Admin, or pick one canonical destination. | Shopify Admin |

### Batch D — Yeti/GoPro merch redesign (2026-05-13)

User direction: "Make it look more like a yeti/gopro layout."

#### Collection grid — dark overlay + white text + per-tile CTA

All 4 blocks ([templates/index.json](../templates/index.json) `tnr_collection_list_VRWxpC`):
- `text_color: '#191919'` (dark) → `'rgba(0,0,0,0)'` → section CSS renders white text via [tnr-collection-list.liquid:39-42](../sections/tnr-collection-list.liquid:39)
- `overlay_color: 'rgba(0,0,0,0)'` (none) → `'#000000'` (black)
- `overlay_opacity: 0` → `40` (visible dark scrim, content still readable through it)
- Each tile adds explicit `link_text`: "Shop Nets" / "Shop Packages" / "Shop Sim Series" / "Shop Accessories"

Visual outcome: bold white title + arrow + "Shop X" CTA stack on top of a dark-scrim category image, like Yeti's category hero tiles and GoPro's product navigation grid.

#### Best Sellers carousel — sharper edges, settings actually drive layout

[templates/index.json](../templates/index.json) `ai_gen_block_74536a9_zQN8y8`:
- `card_border_radius: 4 → 0` (sharp corners, Yeti aesthetic)
- `card_spacing: 32 → 24` (tighter, more density)
- `heading_size: 28 → 36` (matches what was already hardcoded in CSS)

[blocks/ai_gen_block_74536a9.liquid](../blocks/ai_gen_block_74536a9.liquid) — fixed dead settings:
- Lines 20, 29: `font-size: 36px` (hardcoded) → `font-size: {{ block.settings.heading_size }}px` (live)
- Line 42: `gap: 40px` (hardcoded) → `gap: {{ block.settings.card_spacing }}px` (live)
- Line 56: `flex: 0 0 calc((100% - 120px) / 4)` (hardcoded 120 = 3×40) → `flex: 0 0 calc((100% - ({{ block.settings.card_spacing }}px * 3)) / 4)` (recalc based on setting)

The Shopify Admin sliders for heading_size, card_spacing, and card_border_radius now actually affect what visitors see. Before this fix, only `card_border_radius` worked on the desktop card geometry.

#### Visual changes you'll see on preview

1. **4-tile collection grid**: tiles now have a dark overlay; titles + arrow + "Shop X" CTA are all visible in white on top. The eyebrow "Shop by Category" + big "Pick Your Lane" heading sits above the grid.
2. **Best Sellers carousel**: cards have square corners (0 radius). Gap between cards is tighter. Heading is unchanged from current rendered size (36px) but now respects the Shopify Admin slider.

#### What this did NOT change (Yeti/GoPro paths still open)

- The Best Sellers product cards still **reveal "Add to cart" on hover only** (desktop) — on mobile / touch devices, the button may behave inconsistently. Modern Yeti/GoPro tend to always show the CTA.
- The home page section backgrounds are still white. Yeti and GoPro typically use a black or near-black background for the category-navigation strip. That's a bigger change (affects neighboring sections too) — flag if you want to test it.
- Tile aspect ratio is governed by section CSS, not block settings — currently each tile is whatever the section's grid layout dictates. Adjustments would require editing [sections/tnr-collection-list.liquid](../sections/tnr-collection-list.liquid).
- Loox star ratings under each product card in the carousel — would be a meaningful Yeti/GoPro addition. Requires Loox snippet integration into [blocks/ai_gen_block_74536a9.liquid](../blocks/ai_gen_block_74536a9.liquid).

---

## Workflow

1. Claude audits a page, fills in its section + adds rows to the fix queue.
2. Kelton reviews findings, accepts/rejects/modifies recommendations.
3. Approved fixes get implemented locally, theme-checked, pushed to dev theme `149375975517` for preview, then to source theme `149365096541`.
4. Periodically (every 5–10 fixes), batch-promote source theme → live via Shopify Admin → Themes → Publish. Kelton owns this step.
