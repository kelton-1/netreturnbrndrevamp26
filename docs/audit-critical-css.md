# Critical CSS Audit

Date: 2026-05-13.  Scope: the six `snippets/*-css.liquid` files rendered inline into `<head>` by `layout/theme.liquid:51-64`.  Goal: find dead weight in the per-template "critical CSS" that ships on every HTML response.

## TL;DR

Every per-template critical CSS file ships **~65–95 % of bytes that Chrome never uses on first paint** (per Lighthouse's `unused-css-rules` audit, run against staged). The files were extracted by hand a long time ago, they have drifted far from the current templates, and they overlap heavily with each other. Estimated savings if regenerated cleanly: **8 – 30 KiB transferred per page (compressed) / 70 – 200 KiB raw per page**.

| Template | Inline file(s) | Raw size | Brotli (~) transfer | Lighthouse unused | Realistic savings |
| --- | --- | --- | --- | --- | --- |
| Home (`index`) | `index-css.liquid` | 121 064 B | ~22 KiB | 67 % (14.8 KiB) | ~10–14 KiB |
| Collection | `collection-css.liquid` | 118 048 B | ~21 KiB | 74 % (15.5 KiB) | ~10–14 KiB |
| List-collections | `list-collection-css.liquid` | 110 394 B | ~20 KiB (est.) | not run | ~10–14 KiB (parity with collection) |
| Product | `product-css.liquid` | 243 485 B | ~36 KiB (un-minified) | 77 % (28 KiB) | ~22–28 KiB |
| Cart / blog / search / page | `all-css.liquid` + `all-css2.liquid` | 213 KB + 149 KB = **362 KB** | ~34 KiB + ~24 KiB | 81 % + 96 % (~51 KiB combined on cart) | ~40–50 KiB |

Numbers are pulled from `docs/perf-reports/{home,collection,product,cart,search}-staged-latest.json` audit `unused-css-rules`.

## Per-file breakdown

All six files start with a single inline `<style>` tag.  Counts below come from `grep -o '{'` (rule count) and `grep -oE '\.[A-Za-z][A-Za-z0-9_-]*' | sort -u` (unique class selectors).

### `snippets/index-css.liquid` — home, 121 KB

- 882 rules, 334 unique class selectors, single-line minified.
- Lighthouse: 67 % unused, 14.8 KiB compressed savings.
- 17 selectors unique to this file vs the other three per-template files — all of them are home-relevant (`.slideshow*`, `.image-with-text*`, `.heading--large`, `.text--center`, `.tnr-hide-dots`, `.icon-mobile-align-left`).  Good.
- **Dead-weight categories (selectors that have no element on a home template — verified against `templates/index.json` which renders slideshow / image-with-text / blog-posts / tnr-collection-list / trust-bar / text-with-icons / video / collection / theme-banner / badge-scroller):**
  - **PhotoSwipe** (`.pswp__top-bar` rule, partial inclusion) — only used by product gallery lightbox. Dead on home.
  - **Article DETAIL page** — 12 distinct `.article__*` selectors (`.article__nav`, `.article__nav-item--prev`, `.article__nav-item--next`, `.article__header`, `.article__info`, …).  Home renders `blog-posts` section which uses `.article-item*` (different selectors), not `.article__*`.
  - **Account page** — `.account__back-button`.
  - **Product page** — `.product-sticky-form` rules (6 instances of "product-sticky" substring).  `.product-sticky-form` is only rendered from `sections/main-product*.liquid`.
  - **Cart / mini-cart** — `.cart-notification`, `.cart-notification__close`, `.mini-cart__order-note`, `.mini-cart__order-note-title`, `.mini-cart__recommendations`, `.drawer__view-cart`, `.drawer__footer--bordered`.  The mini-cart drawer is hidden until opened — its CSS does not need to be critical.
  - **Predictive search** — `.predictive-search__form`, `.predictive-search__input`, `.main-search__submit`.  Hidden behind a click on the search icon; not critical.
  - **Combo-box / block-swatch / quantity-selector** rule blocks (12, 3 and 2 hits respectively) — these are product-form widgets that don't render on home.
- Rough split of the 14.8 KiB Lighthouse waste: ~5 KiB pswp/article-detail, ~3 KiB cart/drawer/predictive-search, ~3 KiB product-form widgets, ~3 KiB account/blog-comment/order-table.

### `snippets/collection-css.liquid` — collection, 118 KB

- 852 rules, 333 unique class selectors, single-line minified.
- Lighthouse: 74 % unused, 15.5 KiB compressed savings.
- 30 selectors unique vs the other three — all collection-relevant (`.product-list*`, `.product-item*`, `.product-item-meta*`, `.tabs-nav*`, `.product-content`, `.placeholder-background`).  Good.
- Same dead-weight buckets as `index-css.liquid` (the file is essentially the same baseline with the home-only slideshow / image-with-text stripped out and product-grid added):
  - 12 `combo-box` hits, 6 `product-sticky`, 3 `block-swatch`, 2 `gallery__` — none of these render on a collection page.
  - Full article-detail block, account__back-button, predictive-search, pswp top-bar — all dead.

### `snippets/list-collection-css.liquid` — list-collections, 110 KB

- 760 rules, 300 unique class selectors, single-line minified.
- Has **zero** unique-to-itself selectors — its entire class set is a subset of `index ∪ collection ∪ product`.
- Same dead-weight buckets as collection-css.  This file is the smallest because it dropped a few obviously irrelevant product-grid bits, but kept the same article / account / pswp / cart / predictive-search overhead.

### `snippets/product-css.liquid` — product, 243 KB **(largest, biggest waste)**

- 970 rules, 397 unique class selectors. **Not minified** — 9 427 lines of pretty-printed CSS with full indentation. This alone is responsible for ~80 KB of avoidable whitespace.
- Lighthouse: 77 % unused, 28 KiB compressed savings (largest single waste on the site).
- 91 selectors unique vs the other three — all product-relevant (`.product__media*`, `.product-meta*`, `.product-form*`, `.product-sticky-form*`, `.gallery*`, `.combo-box*`, `.quantity-selector*`, `.faq*`, `.flickity-*`, `.collapsible*`).  These are correctly here.
- Dead-weight categories on product:
  - **Article DETAIL page** — same 12 `.article__*` selectors as elsewhere.  Plus `.article-item--featured`, `.article-item--horizontal`, `.article-item__arrow` (only used by blog).
  - **Account page** — `.account__back-button`, plus product-css has it too even though templates/product.json never renders any account UI.
  - **Cart / mini-cart drawer** — same set as index-css.
  - **Predictive search** — same set as index-css.
  - **Slideshow** — none here (good — index-only).
  - **Pretty-printing overhead** — at ~9 lines per typical CSS rule, ~50–60 % of the raw byte size is whitespace. Minifying alone drops product-css from 243 KB to ~110 KB raw, which is roughly the size of the other files. **This is the single highest-ROI fix on the site.**

### `snippets/all-css.liquid` + `snippets/all-css2.liquid` — fallback for cart / blog / search / page, 213 + 149 = **362 KB combined**

- `all-css.liquid`: 950 rules, 520 unique classes, single-line minified.
- `all-css2.liquid`: 1 375 rules, 690 unique classes, single-line minified.
- Overlap between the two: only 141 classes — they are a genuine split, not duplicates.
- Lighthouse on cart: **all-css 81 % unused (27.2 KiB savings), all-css2 96 % unused (23.5 KiB savings)** — total ~51 KiB compressed savings on a single page load.
- Lighthouse on search: all-css 76 %, all-css2 93 % — total ~42 KiB savings.
- This pair is essentially "the whole theme.css inlined" for any template that doesn't match home/product/collection.  On cart it ships **18 PhotoSwipe selectors, the full announcement-bar block, full account / address / order-history block, full article-detail + article-comment block, full blog-list block, accelerated-checkout-skeleton, shop-the-look-dot keyframe, navigation-item animations** — none of which render on the cart page.
- The cart template renders only 4 section types (`main-cart`, `cart-recommendations`, `order_note`, `totals`); the search template renders 1 (`main-search`).  >95 % of the inlined fallback CSS is dead on these pages.

## Selector duplication across the per-template files

- 298 of ~330 class selectors in `index-css.liquid` also appear in `product-css.liquid`.
- 295 of ~330 also appear in `collection-css.liquid`.
- 282 selectors are present in **all four** per-template critical files.

This is expected for "critical CSS" (each file runs on a different template), but the fact that the 282 shared selectors include the dead `.article__nav-item--prev`, `.account__back-button`, `.pswp__top-bar`, `.predictive-search__input`, `.mini-cart__order-note`, etc. tells the story: the files were extracted from one common base and the dead bits were never pruned out of any of them.

## Orphan check (rules in critical CSS but not in `assets/theme.css`)

Per-file orphan class counts (classes in critical CSS that are absent from `theme.css`):

| File | Orphan classes |
| --- | --- |
| `index-css.liquid` | 10 |
| `collection-css.liquid` | 9 |
| `list-collection-css.liquid` | 8 |
| `product-css.liquid` | 29 |
| `all-css.liquid` | 2 |
| `all-css2.liquid` | 57 |

These are **not** dead — almost all of them (`tnr-*`, `wallet-cart-*`, `image-zoom-down`, `golfer-trust`, `product-quiz-section`, `back-instock-text`, `tpl--product-bulletproof`, …) come from `assets/custom.css` and `snippets/custom-css.liquid`, which are loaded as a separate deferred stylesheet (see `layout/theme.liquid:89-90,111`).  So the critical CSS is correctly a subset of `theme.css ∪ custom.css`.  No genuine orphans.

The two `.all-css.liquid` orphans (`.b2b-collection-list`, `.text-uppercase`) are also present in `custom.css` / used by `sections/featured-collections-b2b.liquid` and `snippets/product-form*.liquid` — legit.

## Top sample dead rules to remove

Confirmed by selector + grep-in-templates that none of these render on the corresponding template:

- All `.pswp*` (18 selectors) — keep only in `product-css.liquid` (product gallery).  ~1.0 KiB compressed × 5 files where it's dead.
- All `.article__*` detail-page selectors (12) — keep only in `all-css*.liquid` (used by `templates/article.*`).  Currently in index, product, collection, list-collection — dead in all four.
- All `.account__order-*`, `.account__address*`, `.account__back-button` — used only by `customers/*` templates.  Dead in index, product, collection, list-collection.
- All `.cart-notification*`, `.mini-cart__order-note*`, `.mini-cart__recommendations*`, `.drawer__view-cart`, `.drawer__footer--bordered` — mini-cart drawer is hidden behind a button click, never above-the-fold.  Dead as **critical** CSS on every template.
- All `.predictive-search__*`, `.main-search__submit` — hidden behind search button click.  Dead as critical CSS on every template; can live in deferred `theme.css`.
- All `.product-sticky-form*` (6 selectors) — only rendered from `sections/main-product*.liquid`. Dead in index, collection, list-collection, all-css*.
- All `.combo-box*` (12 selectors), `.block-swatch*` (3), `.gallery__*` (2), `.quantity-selector*` — product-form widgets.  Dead in index, collection, list-collection.
- All `.flickity-*`, `.faq__*`, `.collapsible__*` — keep only on pages that render those widgets (product page); dead in index, collection, list-collection, cart.
- All `.slideshow*`, `.image-with-text*` — keep only in `index-css.liquid`; dead in product/collection/cart/search.
- All `.shopify-payment-button__skeleton`, `.additional-checkout-buttons--*`, `.shopify-cleanslate`, `.accelerated-checkout-loading-skeleton` keyframes — these are rendered by Shopify's own JS, late in the lifecycle, never above-the-fold.

## Recommendations

### 1. **Stop pretty-printing `snippets/product-css.liquid`** (highest ROI, 5-minute fix)

`product-css.liquid` is the only file in the set that ships with full indentation and line breaks.  Minifying it (any tool — even `cleancss product-css.css`) drops it from **243 KB → ~110 KB raw / ~25 KiB compressed**.  No correctness risk, no design risk, no template touching.  Recover ~10 KiB compressed on every product-page response.

### 2. **Regenerate all six files automatically, not by hand**

Hand-extracted critical CSS rots fast — these files were extracted once and have been drifting from `theme.css` since.  Replace with a generator-driven flow:

- Tool: `penthouse` (per-template) or `critical` (Filament Group) run against a staged preview URL for each of the 5 template kinds (home, collection, list-collection, product, "rest"). Both projects support a `width × height` viewport and an above-the-fold cutoff.
- Wire it into a small `npm` script (one-off, not part of every deploy — these files don't change often).  Output goes straight into the six `snippets/*-css.liquid` files, replacing the contents between `<style>` and `</style>`.
- This will reduce each file to its real critical set (~10–25 KB compressed, vs. the current ~22–34 KiB) and naturally prune everything in the "Top sample dead rules" list above.

**Why not hand-prune?** The selectors interleave with media queries and shared utility rules; deleting individual rules by grep is fragile.  A regenerator catches the right subset and re-minifies in one shot.

### 3. **Stop emitting `all-css2.liquid` entirely**

On cart and search, `all-css2.liquid` is **96 % / 93 % unused** — it is the worst offender in the entire CSS pipeline.  Two options:

- Best: split `all-css.liquid` into per-template critical for `cart.json`, `search.json`, `blog.json`, `article.json`, `page.json`.  Most of those templates have one or two sections each, so per-template critical will be tiny.
- Cheap: just drop `all-css2.liquid` and rely on the deferred `theme.css` to cover anything that isn't above-the-fold on those simple templates.  Risk: brief FOUC on slow connections — but it's unstyled body text, not layout shift.

### 4. **Move drawer / predictive-search / mini-cart CSS out of *every* critical file**

These widgets are hidden behind interactions.  Their CSS belongs in deferred `theme.css`, not inline in `<head>`.  Sweep across all six files when regenerating.

## Quantified savings estimate

Per page (compressed transfer, ballpark; assumes brotli):

| Template | Today (critical inline) | After regen + minify | Savings |
| --- | --- | --- | --- |
| Home | ~22 KiB | ~8–10 KiB | **~12 KiB** |
| Collection | ~21 KiB | ~8–10 KiB | **~12 KiB** |
| List-collection | ~20 KiB | ~7–9 KiB | **~12 KiB** |
| Product | ~36 KiB (un-minified) | ~10–12 KiB | **~24–26 KiB** |
| Cart / blog / search / page | ~58 KiB (all-css + all-css2 combined) | ~10–15 KiB | **~43–48 KiB** |

These savings move out of the **render-blocking critical path** (inline `<style>` in `<head>` blocks first paint until parsed). LCP/FCP impact will not be 1-to-1 with bytes — Lighthouse currently rates the savings at FCP=0/LCP=0 because the inline CSS isn't network-blocked.  But CSSOM construction time scales linearly with bytes parsed, so on mid/low-end mobile (the targets for this site per `docs/perf-baseline.md`) the parse-time win is real, even if Lighthouse's "metricSavings" doesn't credit it.

### Combined per-session estimate

A typical user session: 1× home + 1–2× collection + 2–4× product + 1× cart.  Today that's roughly **22 + 21 + 4×36 + 58 ≈ 245 KiB** of critical CSS parsed and discarded over the session.  After regen + minify: **8 + 10 + 4×11 + 12 ≈ 74 KiB**.  Net per-session saving: **~170 KiB** of inline CSS parse work.

## Next actions (recommended order)

1. **Minify `snippets/product-css.liquid` in place** — biggest single win, zero risk, ~5 minutes. Drops 133 KB raw / ~10 KiB compressed per product-page response immediately.
2. **Set up `penthouse` against staged preview URLs** in a one-off npm script. Regenerate all six files. Validate visually against the manual QA checklist (`docs/manual-qa-checklist.md`).
3. **Decide on the all-css2 fate** — split per-template (best) or drop entirely (cheapest). This requires a design call: are we OK with one paint cycle of unstyled blog/article content on cold cache?
4. Re-run Lighthouse on all five staged URLs after each change and update `docs/perf-baseline.md` with the new `unused-css-rules` numbers.

## Files referenced

- `layout/theme.liquid:51-64` — critical CSS dispatch logic
- `layout/theme.liquid:66-67` — deferred `theme.css` load
- `layout/theme.liquid:89-90,111` — deferred `custom.css` and `custom-css` snippet load
- `snippets/index-css.liquid`, `snippets/collection-css.liquid`, `snippets/list-collection-css.liquid`, `snippets/product-css.liquid`, `snippets/all-css.liquid`, `snippets/all-css2.liquid` — the six critical CSS snippets
- `assets/theme.css`, `assets/custom.css`, `snippets/custom-css.liquid` — deferred stylesheets
- `docs/perf-reports/home-staged-latest.json` (audit `unused-css-rules` @ line 4222)
- `docs/perf-reports/product-staged-latest.json` (@ line 5800)
- `docs/perf-reports/collection-staged-latest.json` (@ line 3956)
- `docs/perf-reports/cart-staged-latest.json` (@ line 7425)
- `docs/perf-reports/search-staged-latest.json` (@ line 3777)
- `templates/index.json`, `templates/product.json`, `templates/collection.json`, `templates/cart.json`, `templates/search.json`, `templates/list-collections.json` — template content used to verify dead-selector status
