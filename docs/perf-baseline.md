# Performance Baseline

Date started: 2026-05-13
Status: **static audit complete, runtime measurements pending**

This doc captures everything that can be measured by reading the theme code, plus a structured template for the runtime (browser-side) measurements still to come. Update both halves as you go.

---

## Part 1 — Static facts (measured from theme source)

### Critical CSS payload, per template

Inline `<style>` blob sizes shipped in every HTML response:

| Template scope | Snippet | Size (bytes) | Size (KB) |
|---|---|---|---|
| Home (`template == 'index'`) | `index-css.liquid` | 121,467 | 119 |
| Collection | `collection-css.liquid` | 118,048 | 115 |
| List-collections | `list-collection-css.liquid` | 110,797 | 108 |
| Product | `product-css.liquid` | 243,485 | 238 |
| All other (cart, search, blog, page, customer) | `all-css.liquid` + `all-css2.liquid` | 362,151 | 354 |

Deferred CSS (loaded via the WNW scheme after first user interaction):

| Asset | Size (bytes) | Size (KB) |
|---|---|---|
| `assets/theme.css` | 311,227 | 304 |
| `assets/custom.css` | 14,626 | 14 |

**Observation:** Every HTML response carries 100–360 KB of inline CSS that is not cached across pages. After interaction another ~320 KB of CSS becomes active. Total CSS budget per first page view ≈ 420–680 KB uncompressed.

### Deferred JS payload (gated on first user interaction)

| Asset | Size (bytes) | Size (KB) |
|---|---|---|
| `assets/vendor.js` | 107,289 | 105 |
| `assets/theme.js` | 278,263 | 272 |
| `assets/custom.js` | 26,905 | 26 |
| **Total core JS** | **412,457** | **403** |

Plus third-party scripts also gated by the same scheme (loaded into `data-src` after interaction):
- GTM (`googletagmanager.com/gtm.js?id=GTM-WF7K2CSD`) — `<script type="lazyload_int">` in body
- Loox (`cdn.loox.io/loox.js`) — IntersectionObserver near page bottom
- mm-uxrv pixel — DOMContentLoaded + idle
- Facebook Pixel (`connect.facebook.net/en_US/fbevents.js`) — idle
- Redo widget (`cdn.redo.do/...`) — IntersectionObserver, sentinel-based

### Loading scheme summary

The theme uses a "WNW" interaction-gated deferred-loading orchestrator ([snippets/wnw_header.liquid](../snippets/wnw_header.liquid)). Sequence on every page load:

1. **0 ms** — HTML response arrives. Browser starts parsing. Inline critical CSS in the response styles the page.
2. **0 ms** — A MutationObserver in `wnw_header` auto-converts any Shopify-injected `<script>` (web pixels, Maestrooo, etc.) to `type="lazyload_int"` and rewrites `src` to `data-src`. The `mainopt` HTML class is added on non-blocked UAs (Chrome OS, certain platforms are excluded).
3. **0 ms** — `content_for_header` is mutated by a 12-stage `| replace:` chain ([layout/theme.liquid:104](../layout/theme.liquid)) that rewrites Shopify's own `async`/`defer`/`src=` to `data-src=`/`type="lazyload_int"`. Shopify's `trekkie` and `BOOMR` analytics objects are **stubbed with no-ops** inline ([layout/theme.liquid:105](../layout/theme.liquid)).
4. **+1000 ms** — `setTimeout(w3_loadscripts.execute, 1000)` fires ([wnw_header.liquid:304](../snippets/wnw_header.liquid)). Orchestrator binds passive interaction listeners (`keydown`, `mousemove`, `touchmove`, `touchstart`, `touchend`, `wheel`) and starts injecting `<link rel="preload" as="style/script">` tags so the deferred resources warm up in the network.
5. **First interaction (or scroll past `body.top < -30px`)** — Orchestrator:
   - Promotes all `<link data-href>` to real stylesheets (replaces nodes).
   - Replays all `<script type="lazyload_int">` as live `<script src>` in order: normal → defer → async.
   - Re-enables Shopify's stubbed analytics via `wnwAnalytics()` / `wnwBoomerang()`.
   - Dispatches synthetic `w3-DOMContentLoaded` and `w3-load` events for any scripts that registered listeners against the rewritten event names.
6. **+10,000 ms** — Google Fonts stylesheet appended (`google_fonts_delay_load = 1e4`).

Cart and checkout templates **bypass step 3** — `content_for_header` is rendered raw on those pages ([layout/theme.liquid:100](../layout/theme.liquid)). The interaction-gating still applies to the theme's own scripts.

### Concrete bugs and footguns found in static audit

Priority key: **P0** = correctness/UX bug, **P1** = clear perf win, **P2** = quality/cleanup.

| # | Severity | Location | Issue |
|---|---|---|---|
| 1 | P1 | [layout/theme.liquid:112-114](../layout/theme.liquid) | `{%- if section.settings.mobile_image -%}` preload **never fires** — `section` is out of scope in a layout file. The intended hero preload is dead code. |
| 2 | P0 | [sections/slideshow.liquid:84](../sections/slideshow.liquid) | `{%- assign loading_attribute_value = 'eager' -%}` unconditionally overwrites the `forloop.index > 2` logic on lines 79-83. **Every slide** is rendered with `loading="eager" fetchpriority="high"`, so all 8+ slides race for bandwidth with the LCP image. |
| 3 | P1 | [layout/theme.liquid:117-123](../layout/theme.liquid) | Microsoft Clarity is loaded **synchronously inline**, outside the WNW scheme. Bypasses the optimization on every page. |
| 4 | P1 | [layout/theme.liquid:124](../layout/theme.liquid) | Heatmap.com loader is `defer` but outside WNW. Adds a third-party origin connection at parse time. |
| 5 | P2 | [layout/theme.liquid:43](../layout/theme.liquid) | `<div id="fv-loading-icon">Γ</div>` is inside `<head>`. Invalid HTML; the browser will re-parent it. Move to `<body>` or remove. |
| 6 | P2 | [layout/theme.liquid:67, 90](../layout/theme.liquid) | `<link rel="stylesheet" data-href="...">` is non-standard. Until WNW orchestrator runs, the stylesheet doesn't load — relies entirely on inline critical CSS. Acceptable if intentional, but coupled tightly to WNW. |
| 7 | P1 | [layout/theme.liquid:104](../layout/theme.liquid) | 12-stage `| replace:` on `content_for_header` is fragile. If Shopify changes the format of any injected script (web pixels, Shop Pay, Bundle config, etc.) the replace silently fails and either nothing lazy-loads or the script breaks. Needs a Theme Check policy or test. |
| 8 | P1 | [layout/theme.liquid:108-110](../layout/theme.liquid) | `vendor.js`, `theme.js`, `custom.js` are all `type="lazyload_int"` with **no fallback**. If WNW orchestrator fails (JS error, blocked by CSP, ad blocker breaks the MutationObserver), the theme has no interactive behavior — cart drawer, variant picker, add-to-cart all dead. |
| 9 | P2 | [layout/theme.liquid:98](../layout/theme.liquid) | `jquery` for `template == 'page.quiz'` loaded via cdnjs with `defer`, outside WNW. Could be lazy-loaded or removed if quiz isn't shipping. |
| 10 | P1 | (system-wide) | Theme Check baseline shows many images missing `width`/`height` attributes ([docs/theme-check-baseline.md](theme-check-baseline.md)). CLS risk when CSS unblocks. |
| 11 | P2 | [snippets/wnw_header.liquid:304](../snippets/wnw_header.liquid) | The 1000 ms hard `setTimeout` before the orchestrator binds is arbitrary — the WNW intent is to *not* delay critical render, but this also delays the preload of deferred resources by a full second. |

### Render order on home page

`templates/index.json` has 19 sections, 7 disabled, 12 active. First active section is `slideshow` (LCP candidate). Order:

1. `slideshow` ← LCP source
2. `trust-bar`
3. `_blocks` (custom)
4. `tnr-collection-list`
5. `video`
6. `image-with-text`
7. `text-with-icons`
8. ... (rest below the fold)

---

## Part 2 — Runtime measurements (Lighthouse, 2026-05-13)

Source: Lighthouse 11.x via `npx lighthouse`, default mobile preset (Moto G Power emulation, simulated 4G + 4× CPU throttling, performance category only). Raw JSON reports in `docs/perf-reports/`.

### Test URLs

`?preview_theme_id=149365096541` does **not work** as a preview pattern. The Shopify primary-domain redirect (`the-net-return.myshopify.com → www.thenetreturn.com`) **strips the `preview_theme_id` query param** during the 301. So all measurements below are against the **currently live theme**, not the local inactive theme. The smoke test confirms this: hitting the myshopify.com URL with `preview_theme_id` added 1.9s of redirect waste and still rendered the live theme.

Canonical URLs used for measurement (live, no preview):

| Template | URL |
|---|---|
| Home | `https://www.thenetreturn.com/` |
| Collection | `https://www.thenetreturn.com/collections/nets-1` |
| Product | `https://www.thenetreturn.com/products/pro-series-golf-net` |
| Cart | `https://www.thenetreturn.com/cart` |
| Search | `https://www.thenetreturn.com/search?q=net` |

### ⚠️ Critical caveat: LCP is being gamed

On every single page measured, Lighthouse identifies the LCP element as `body.no-focus-outline > div#fv-loading-icon`. This is the invisible `<div id="fv-loading-icon">Γ</div>` injected from `<head>` in [layout/theme.liquid:43](../layout/theme.liquid). Its CSS in [snippets/wnw_header.liquid:44-69](../snippets/wnw_header.liquid):

```css
html:not(.w3_user) #fv-loading-icon {
  visibility: visible; font-size: 190vw; width: 99vw; height: 99vh;
  opacity: 0.0001;     /* ← invisible to users, visible to Lighthouse */
}
html.mainopt #fv-loading-icon { display: none; }
```

- `.w3_user` is added by the WNW orchestrator only after first user interaction.
- `.mainopt` is added by JS in `wnw_header.liquid` *only* on non-x86 UAs (excluding "x86_64 not CrOS", "power", "rix"). Lighthouse runs headless x86 Chrome, so `.mainopt` is never added — the div stays visible.
- Outcome: **Lighthouse sees a near-invisible 99vw × 99vh element as LCP** and reports a fast LCP value that bears no relation to real user experience.

This is a Lighthouse-gaming hack — almost certainly intentional, baked into a "WNW" performance app pattern. **All LCP values below should be read as a synthetic lab metric, not the real user LCP.** The real user LCP is the actual hero / product image, and that is bound by the slideshow eager-all bug + missing hero preload + interaction-gated CSS.

For the **honest user-perceived speed**, look at **Speed Index** and **TTI** instead — those are based on visual progress and main-thread responsiveness and aren't fooled by the invisible div.

### Core Web Vitals — Lighthouse Mobile (lab)

| Template | Perf score | LCP* (s) | FCP (s) | TBT (ms) | CLS | **Speed Index (s)** | **TTI (s)** | TTFB (ms) | Total bytes (KB) |
|---|---|---|---|---|---|---|---|---|---|
| Home | **90** | 1.32 | 1.32 | 112 | 0.054 | **9.14** | **10.47** | 72 | 1,612 |
| Collection (nets-1) | **90** | 1.38 | 1.38 | 102 | 0.010 | **9.80** | **9.77** | 89 | 2,882 |
| Product (pro-series-golf-net) | **84** | 1.93 | 1.93 | 168 | 0.081 | **17.20** | **14.37** | 95 | 3,039 |
| Cart | **89** | 1.57 | 1.57 | 316 | 0.040 | **4.40** | **19.66** | 83 | 2,495 |
| Search (q=net) | **88** | 1.53 | 1.53 | 165 | 0.010 | **10.72** | **9.87** | 93 | 1,196 |

\* LCP = invisible fv-loading-icon div. Disregard for user-experience interpretation.

### Bootup time and main-thread work

| Template | JS bootup (s) | Main-thread work (s) | Unused JS (KB) | Unused CSS (KB) |
|---|---|---|---|---|
| Home | 2.28 | 6.02 | 263 | 14 |
| Collection | 2.86 | 4.54 | 263 | 15 |
| Product | 3.65 | 6.01 | 263 | 38 |
| Cart | 1.98 | 4.05 | **389** | 49 |
| Search | 3.30 | 4.93 | 263 | 40 |

Cart loads **126 KB more unused JS** than other pages — worth a separate investigation. JS bootup of 2.3–3.7s on mobile is the dominant TTI contributor across all pages.

### "WNW disabled" comparison (`?nonopt=1`)

`?nonopt=1` flips the `i` flag in [wnw_header.liquid:12](../snippets/wnw_header.liquid), which prevents adding `.mainopt` — but the interaction-gate orchestrator still runs (it only checks for `.w3_user`, not `.mainopt`). So `?nonopt=1` does **not** actually disable the WNW scheme; it just hides `.mainopt`-conditional CSS. The orchestrator and its interaction-gating still run.

| Template | Variant | Perf | LCP | TBT | Speed Index | TTI | Main-thread |
|---|---|---|---|---|---|---|---|
| Home | default | 90 | 1.32 | 112 | 9.14 | 10.47 | 6.02 |
| Home | `?nonopt=1` | 90 | 1.33 | 133 | 8.93 | 10.81 | 6.88 |
| **Product** | **default** | **84** | **1.93** | **168** | **17.20** | **14.37** | **6.01** |
| **Product** | **`?nonopt=1`** | **89** | **1.51** | **84** | **9.82** | **12.68** | **5.19** |

**Note for the product page**: with `?nonopt=1` performance score goes 84 → 89, LCP improves 22%, TBT improves 50%, Speed Index improves 43%, TTI improves 12%. Since `?nonopt=1` doesn't actually disable the orchestrator, the only thing it does differently is skip adding `.mainopt`. So either (a) the `.mainopt`-gated CSS in the rest of the theme is causing real-user perf harm on product pages, or (b) the absence of `.mainopt` is causing different render paths in `wnw_header.liquid`'s `<style>` blocks. Worth a follow-up dig — this is potentially a 5-point perf score win on the most important page type.

### Hypothesis status after measurement

| # | Hypothesis | Status | Evidence |
|---|---|---|---|
| H1 | LCP bottlenecked by missing hero preload | **Inconclusive** | Reported LCP is the gamed fv-loading-icon, not the real hero image. Need to remove the hack first, then re-measure. |
| H2 | Slideshow eager-all bug hurts LCP | **Likely confirmed** | Speed Index 9.14s on home indicates significant visual delay after the fake LCP fires. Multiple eager hero images contribute. |
| H3 | WNW interaction-gate hurts INP | **Lighthouse can't measure** | INP needs field data. TBT 112–316ms is a directional proxy — cart's 316ms is notable. |
| H4 | Clarity + Heatmap are net negative pre-interaction | **Partially supported** | Lighthouse's "unused JS" (263 KB consistent across pages) includes their loaders, suggesting they run but most code is unused on the measured page. |
| H5 | Inline critical CSS is over-broad | **Supported** | Unused CSS savings range 14–49 KB. Product page has 38 KB unused — implies ~16% of the 243 KB inline CSS is dead on that template. |
| **NEW: H6** | **LCP-gaming hack distorts every other perf decision** | **Confirmed** | fv-loading-icon is reported LCP on 5/5 pages tested. Cannot trust LCP-based recommendations until removed. |
| **NEW: H7** | **Product page has a `.mainopt`-conditional perf regression** | **Root cause found** | [snippets/custom-css.liquid:43-44](../snippets/custom-css.liquid) sets `font-family: unset !important` on `html:not(.mainopt):not(.w3_user)`. So when WNW is on (`.mainopt` added), custom fonts load immediately → slower paint. When WNW is off (`?nonopt=1`, `.mainopt` not added), fonts fall back to system until interaction → faster paint, FOUT-after-interaction. The "optimization" is doing the wrong thing for mobile users. **Fix is architectural — defer to Batch C.** |
| **NEW: H8** | **myshopify.com → custom domain redirect wastes 1.9s** | **Confirmed** | Smoke test (with `preview_theme_id`) chained two 301s for 1.9s of waste. Direct hits avoid it. Real-user impact depends on inbound link distribution. |

### What's still unmeasured

- **Real user LCP**: removing the fv-loading-icon hack and re-measuring is the only way to get an honest LCP.
- **INP**: requires CrUX field data. Pull from PageSpeed Insights field tab, Clarity, or a real-device test.
- **Interaction-cost cascade**: how long is the page unresponsive between first interaction and orchestrator completing all preload-to-stylesheet promotions + script executions? Needs Playwright with synthetic interaction, or Chrome MCP, or a real device.

---

## Recommended fix batches (data-grounded)

Reordered after measurement. Numbered fixes refer to entries in the Part 1 bug table.

### Batch A — Quick wins, low risk (ship together)

| Fix | Bug # | Why now | Expected effect |
|---|---|---|---|
| **A1.** Remove `<div id="fv-loading-icon">` from `<head>` and its `wnw_header.liquid` CSS that targets it | #5 | LCP-gaming hack distorts every metric we look at. Even if real-user perf is unchanged, removing it lets us trust Lighthouse + RUM going forward. | Reported LCP will go UP (because Lighthouse will now find the real LCP element). **This is OK** — we want truthful numbers. |
| **A2.** Fix slideshow `loading_attribute_value = 'eager'` unconditional override at [slideshow.liquid:84](../sections/slideshow.liquid) | #2 | All hero slide images currently race for bandwidth. Only the first visible slide should be eager + fetchpriority=high. | Real LCP on home should improve. Won't show up until A1 lands. |
| **A3.** Remove dead `section.settings.mobile_image` preload at [theme.liquid:112-114](../layout/theme.liquid). Replace with `<link rel="preload" as="image">` driven by the actual slideshow section's first slide. | #1 | The intended preload code never fires (out-of-scope `section` variable). Real preload would shave 200-500 ms off the real LCP. | Real LCP improvement after A1+A2 land. |
| **A4.** Move Microsoft Clarity ([theme.liquid:117-123](../layout/theme.liquid)) and Heatmap.com ([theme.liquid:124](../layout/theme.liquid)) into `type="lazyload_int"` so they ride the WNW scheme instead of bypassing it | #3, #4 | They currently run pre-LCP and contribute to the 6+s main-thread work. | Main-thread work should drop ~300-500ms; performance score +1–2. |
| **A5.** Investigate the product-page `?nonopt=1` gap (H7) and either remove the offending `.mainopt`-gated rule or document why it's there | (new) | Free 5-point perf-score win on the highest-revenue page type. | Product perf 84 → 89 if cause is purely CSS-conditional. |

### Batch B — Image dimensions sweep

| Fix | Why |
|---|---|
| Add explicit `width`/`height` to all images flagged by Theme Check | CLS on product is 0.081 (close to 0.1 "needs improvement" threshold); systemic fix lowers all-page CLS. |

### Batch C — WNW hardening (only after A is verified safe)

Touching the WNW scheme is high risk. Defer these until Batch A is verified live for 1–2 weeks of RUM.

| Fix | Bug # | Risk |
|---|---|---|
| Replace the 12-stage `| replace:` chain on `content_for_header` with a more robust extractor (snippet or regex array) | #7 | Medium. Touches Shopify analytics pipeline. |
| Add a fallback that promotes `theme.js` after 5 s even without user interaction | #8 | Medium. Reduces "dead button" risk on quick-bounce mobile sessions; may hurt Lighthouse score because the late JS runs during measurement window. |
| Reduce the 1-second `setTimeout` on orchestrator startup | #11 | Low. Likely a vestigial WNW default. |
| Investigate cart's 389 KB unused JS (vs 263 KB on other pages) — likely a cart-specific bundle that doesn't need to load on first cart view | (new) | Medium. Cart-page UX risk if mis-pruned. |
| Address the myshopify.com → custom-domain redirect chain (1.9s waste) | H8 | Low/configuration. Shopify Admin → Domains → set primary correctly. May affect SEO if changed. |

### Batch D — Critical CSS extraction (longer effort)

| Fix | Why |
|---|---|
| Re-extract per-template critical CSS by running each template through a critical-CSS tool (e.g. `critical`, `penthouse`) | Inline CSS payload is 100–360 KB per page. Real critical CSS for above-the-fold should be 20–40 KB. Could cut HTML weight by 80%. |
| Then load the rest of `theme.css` via standard preload+swap instead of the WNW data-href trick | Decouples from WNW scheme — makes the optimization survive even if WNW is later replaced. |

---

## Post-Batch-D perf re-check (2026-05-13, later)

Re-ran Lighthouse with two configurations to disambiguate "what customers see" from "what our work delivers":

- **Live theme** (without cookie, default Lighthouse fetch — hits the published theme)
- **Staged theme** (with `_shopify_essential` cookie via `--extra-headers` — hits source theme `149365096541`)

| Metric | Baseline (this doc) | Live theme now | **Staged theme (our work)** | Verdict |
|---|---|---|---|---|
| Perf score | 90 | 75 | **85** | Staged is +10 over live |
| LCP element | fv-loading-icon | fv-loading-icon | **slideshow image (Bryson)** | Staged is the FIRST honest LCP ever measured for this theme |
| LCP | 1.33s (fake) | 1.41s (fake) | **2.54s (real)** | Real LCP is "needs improvement" (Google good = <2.5s) but it's actually measured for the first time |
| FCP | 1.33s | 1.41s | 2.24s | — |
| TBT | 112 ms | 575 ms | **93 ms** | Staged is dramatically better than live |
| CLS | 0.054 | 0.011 | 0.011 | — |
| Speed Index | 9.15 s | 13.18 s | 10.28 s | Staged is better than live |
| TTI | 10.47 s | 11.69 s | 10.85 s | — |
| Bootup JS | 2.28 s | 3.39 s | **1.95 s** | Staged saves ~1.4 s of main-thread JS time vs live |
| Main-thread | 6.02 s | 6.39 s | 5.24 s | — |
| Total bytes | 1612 KB | 1536 KB | 1561 KB | — |
| Unused JS | 263 KB | 263 KB | 223 KB | Staged shaves 40 KB of dead JS |

### What this means

1. **We have not regressed.** Our staged work is materially faster than what's currently live. The headline numbers below ("Live theme") reflect changes someone has made to the published theme outside our staged work since this baseline was captured — those aren't from this session.
2. **Real LCP is unmasked.** With the `fv-loading-icon` removed in Batch A, Lighthouse now measures the actual hero slideshow image (`image_ktJUCw` Bryson Champion) as LCP. The real number is 2.54s on mobile — just over the "good" threshold. Future LCP work should focus on (a) preloading the hero image, (b) shrinking the Bryson hero file, (c) deferring the trust bar / Loox section if they're stealing render budget early.
3. **TBT win is real.** Going from 575ms → 93ms is the largest improvement and comes mostly from the Clarity + Heatmap deferral (Batch A item A4) and the removed Reveal-on-scroll opacity-0 attribute on the collection grid.

### Post-Batch-D hygiene fix (2026-05-13)

Resized the 4 lifestyle images in `/assets/` from 2400px-wide to 1600px wide:

| File | Before | After |
|---|---|---|
| home-nets.jpg | 1.4 MB | 724 KB |
| home-packages.jpg | 1.0 MB | 428 KB |
| home-sim-series.jpg | 1.0 MB | 368 KB |
| home-accessories.jpg | 820 KB | 372 KB |
| **Total** | **4.3 MB** | **1.8 MB** |

User reported "images take a while to load when previewing on my Mac" — confirmed by file sizes. The new 1600px width is still retina-quality at the typical tile display width (~320-480px). Future further-reductions could use WebP (smaller still) and per-viewport srcset.

### Still open

- **Real-user LCP under 2.5s** — would require preloading the hero image OR shrinking the Bryson Champion file (current size unknown but it's a high-quality champion-shot photo)
- **Publish the staged theme** — the 10-point Lighthouse gain is locked up in `149365096541` until promoted to live. Customers still see the pre-Batch-A theme

---

## Batch A changes shipped (local, 2026-05-13)

Batch A landed locally. Source theme `149365096541` is **unchanged** — these edits live in the working tree only until explicitly pushed.

| Fix | File(s) | Change |
|---|---|---|
| A1 | [layout/theme.liquid](../layout/theme.liquid), [snippets/wnw_header.liquid](../snippets/wnw_header.liquid) | Removed `<div id="fv-loading-icon">Γ</div>` and the `html:not(.w3_user) #fv-loading-icon` / `html.mainopt #fv-loading-icon` CSS rules. Lighthouse will now detect the real LCP element. |
| A2 | [sections/slideshow.liquid](../sections/slideshow.liquid) | Removed the unconditional `loading_attribute_value = 'eager'` override at line 84 (restoring the `forloop.index > 2` lazy logic). Added `fetchpriority_value` Liquid variable: `'high'` only for `forloop.first`, `'auto'` otherwise. Updated all three `image_tag` calls (image, split_image, mobile_image) to use it. |
| A3 | [layout/theme.liquid](../layout/theme.liquid) | Removed the broken `{%- if section.settings.mobile_image -%}` preload (out-of-scope `section` variable; preload never fired anyway). |
| A4 | [layout/theme.liquid](../layout/theme.liquid) | Changed Microsoft Clarity and Heatmap.com inline `<script>` tags to `<script type="lazyload_int">` so both ride the WNW deferred-loading scheme. |
| A5 | This doc | Root cause for product-page `.mainopt` regression confirmed: custom font-family is stripped pre-interaction in the non-`.mainopt` path. Fix is architectural — deferred to Batch C (see below). |

### Verification status

Local-only changes. **Have not been deployed.** To quantify the Batch A delta:

1. Push to a development theme (`shopify theme push --development` or `theme:dev`) — **requires explicit user approval**.
2. Re-run `npx lighthouse` against the development theme URL using its `?preview_theme_id=<dev-theme-id>` URL.
3. Compare to the baseline numbers in the table above.

Expected outcome (best estimates pending real data):

- **LCP**: will go UP in Lighthouse (the gamed 1.3s LCP will be replaced by the real hero image LCP, likely 1.5–2.5s on home, 2–3s on product). **This is intentional and good** — we want truthful numbers.
- **Speed Index / TTI / TBT**: should show modest improvements (Clarity + Heatmap deferred frees ~200–500ms of main-thread work; correct slideshow eager/priority reduces parallel image contention).
- **Performance score**: net effect uncertain. The LCP correction may drop the score even though real-user perf is improved or unchanged. Speed Index improvement may offset this.

### Batch E — Strategic question (decision needed before Batch C/D)

The data raises an uncomfortable question: **is the WNW scheme worth the complexity?**

- Home: WNW gives essentially the same Lighthouse score as `?nonopt=1` (90 vs 90).
- Product: WNW gives a **worse** Lighthouse score than `?nonopt=1` (84 vs 89).
- The "real LCP" is gamed by an invisible div, not a legitimate perf optimization.
- The scheme adds ~700 lines of fragile JS, mutates `content_for_header`, stubs Shopify analytics, and gates all theme interactivity on first user input.

A staged migration path could be: keep critical CSS inlining (it works), drop the interaction-gate (use standard `defer`/`async`), remove the fv-loading-icon hack, restore Shopify analytics to their default load order. This would be a 1–2 week effort and could be tested against the inactive theme `149365096541` before promotion. Worth a decision after Batch A lands.
