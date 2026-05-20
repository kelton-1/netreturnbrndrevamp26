# Mobile bug audit — iPhone Safari image rendering on "Pick Your Lane"

**Date:** 2026-05-13
**Trigger:** User reports the 4 category-tile images on the home page "Pick Your Lane" / "Shop by Category" section don't load on iPhone Safari. Mac Safari + Mac Chrome render correctly. Reproducible.

**Section:** [`sections/tnr-collection-list.liquid`](../sections/tnr-collection-list.liquid) (block `tnr_collection_list_VRWxpC` in `templates/index.json`).

---

## 1. Evidence gathered

### 1.1 HTML served to iPhone Safari is correct

Curl with `User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ... Safari/604.1` plus the session cookie returns the staged theme. The four `<img>` tags inside the grid render are well-formed (from `/tmp/iphone-debug.html` line 3097–3109):

```html
<div class="list-collections__item-image-wrapper">
  <img src="//www.thenetreturn.com/cdn/shop/t/64/assets/home-nets.jpg?v=143575328606610214541778711682"
       class="list-collections__item-image" alt="Nets"
       loading="eager" fetchpriority="high" decoding="async"
       width="1200" height="1500">
</div>
```

The previously-removed `data-class="LazyLoad"` + 1×1 base64 placeholder shim IS gone. The `src=` is direct and protocol-relative. iPhone receives the same markup as a desktop UA would (Shopify does not branch on UA for this section — single render path, no `.context.*.json` mobile override).

### 1.2 Image dimensions are MISMATCHED against the declared HTML attributes

The IMG attributes declare `width="1200" height="1500"` (portrait, 4:5). Actual JPEG dimensions on disk:

| Asset | Actual pixels | Aspect | Declared in HTML |
|---|---|---|---|
| `home-nets.jpg` | **1600 × 1200** | 4:3 landscape | 1200 × 1500 (portrait) |
| `home-packages.jpg` | **1600 × 1066** | 3:2 landscape | 1200 × 1500 (portrait) |
| `home-sim-series.jpg` | **1066 × 1600** | 2:3 portrait | 1200 × 1500 (portrait) |
| `home-accessories.jpg` | **1600 × 1066** | 3:2 landscape | 1200 × 1500 (portrait) |

This is a sloppy hand-coded width/height pair in the section (line 277). Not the root cause of the iPhone bug, but it does force iOS Safari into an extra layout reflow once the actual pixels decode, which compounds the real cause.

### 1.3 The `<a class="list-collections__item">` element has NO in-flow children

Looking at the section CSS at [`sections/tnr-collection-list.liquid:61–86`](../sections/tnr-collection-list.liquid):

```css
#shopify-section-XXX .list-collections__item {
  aspect-ratio: 4 / 5 !important;
  overflow: hidden !important;
  position: relative !important;
  display: block !important;       /* <a> forced from inline to block */
  height: auto !important;
}
#shopify-section-XXX .list-collections__item-image-wrapper {
  position: absolute !important;   /* OUT OF FLOW */
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
}
#shopify-section-XXX .list-collections__item-info {
  position: absolute !important;   /* OUT OF FLOW */
  top: auto !important;
  bottom: 28px !important;
  ...
}
```

**Every direct child of the `<a>` is `position:absolute`.** The `<a>`'s in-flow content height is therefore 0. The only thing giving the `<a>` a non-zero box is the `aspect-ratio: 4 / 5 !important` rule, which is supposed to compute `height = width × 5/4`.

### 1.4 iOS Safari `aspect-ratio` + display-converted `<a>` + all-absolute-children = collapsed box

This is the root cause. iOS Safari (WebKit) has documented layout-engine issues where `aspect-ratio` does not reliably establish a sizing box on an inline element that has been `display: block !important`-ed when **every descendant is `position:absolute`**. Tracked in WebKit bug history (213983 + follow-ups). Affected configurations:

- iOS 15.0–15.3: `aspect-ratio` partially broken, frequently ignored on display-overridden inline elements
- iOS 16.0–16.3: still flaky for `<a>` with all-absolute children
- iOS 16.4+ / 17.x: mostly fixed but specific edge cases (display-via-important + flex/grid parent + absolute children) still regress

The grid parent (`.list-collections__item-list`) uses `display: grid; grid-template-columns: 1fr` on mobile. The child `<a>` ends up with `width = 1fr = container width`, and the engine must derive `height` from `aspect-ratio` alone (because no in-flow content contributes height). Mac WebKit and Blink resolve this correctly; iPhone WebKit collapses the `<a>` to **height: 0**.

Visible result: each tile shrinks to a 0-height white sliver (the section CSS sets `.tnr-collection-list .list-collections__item { background: #fff }` via [`snippets/index-css.liquid`](../snippets/index-css.liquid)). The image wrapper at `inset: 0` of a 0-height containing block is also 0×0. The IMG is `width: 100%; height: 100%` of a 0×0 wrapper, so it renders nothing. **The browser DOES fetch the image — it just paints it to a 0×0 box.**

This matches the user's "images don't load" symptom: white rectangles where photos should be.

### 1.5 What it isn't (eliminated)

| Hypothesis | Eliminated by |
|---|---|
| iPhone gets different HTML (mobile UA branching) | Section liquid has no `request.host`/UA branching; Shopify serves identical markup to all UAs. The captured iPhone HTML (`/tmp/iphone-debug.html`) shows the same img tags Mac would receive. |
| Image asset URLs are unreachable from iPhone | URLs are protocol-relative to `www.thenetreturn.com/cdn/shop/t/64/assets/...` — same CDN that serves Mac. No UA-gated CDN policy. |
| `data-class="LazyLoad"` shim left over | Removed in the prior fix. Current line 277 uses direct `src=`. |
| WNW orchestrator hides images on iPhone | `wnw_header.liquid` adds `.mainopt` to `<html>` for iPhone (UA doesn't match the skip conditions on lines 5–13). The only CSS rule keyed off `:not(.mainopt)` in [`custom-css.liquid:46`](../snippets/custom-css.liquid) targets `[reveal]` images in the carousel half — our section has `reveal_on_scroll: false`, so no `reveal` attribute exists. No reveal animation runs. |
| `w3_bg_load` style strips backgrounds | Only kills `background-image` on `div`/`section`. Our images are `<img>`, unaffected. |
| `.image-zoom img { transform: translateZ(0) }` triggers a render bug | Plausible secondary contributor (creates a stacking context layer of 0×0), but the root cause is the parent collapsing. Removing translateZ alone wouldn't fix this. |
| The grid `.hidden-pocket` is stuck hidden on mobile | Section override `.list-collections--grid.hidden-pocket { display: block !important }` (line 146) wins over the theme's base `@media (max-width:999px) .hidden-pocket { display: none !important }` on specificity (1,2,0 vs 0,1,0). Confirmed: the grid container renders. |

---

## 2. Root cause (S0)

**The `<a class="list-collections__item">` element collapses to height 0 on iPhone Safari because `aspect-ratio: 4 / 5 !important` does not establish a sizing box when (a) the element is `display: block !important` (converted from inline `<a>`), and (b) all of its direct children are `position: absolute`. Mac Safari and Blink resolve `aspect-ratio` correctly in this configuration; iPhone WebKit does not.**

Evidence trail: [`sections/tnr-collection-list.liquid:61–110`](../sections/tnr-collection-list.liquid) (CSS that absolutely-positions both children), [`sections/tnr-collection-list.liquid:267`](../sections/tnr-collection-list.liquid) (the `<a>` itself with `image-zoom` class).

---

## 3. Fix recommendation

The minimal, durable fix: **make the image wrapper itself the in-flow box that carries the aspect-ratio**, and absolutely position only the IMG inside it. This removes the dependency on `aspect-ratio` resolving on the `<a>`.

### Concrete diff — [`sections/tnr-collection-list.liquid`](../sections/tnr-collection-list.liquid)

Lines 61–86 currently:

```css
#shopify-section-{{ section.id }} .list-collections__item {
  aspect-ratio: 4 / 5 !important;
  overflow: hidden !important;
  text-align: left !important;
  position: relative !important;
  display: block !important;
  height: auto !important;
}
#shopify-section-{{ section.id }} .list-collections__item-image-wrapper {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 0;
}
#shopify-section-{{ section.id }} .list-collections__item-image {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
  min-height: 0 !important;
}
```

Change to:

```css
#shopify-section-{{ section.id }} .list-collections__item {
  /* aspect-ratio removed — owned by the wrapper now */
  overflow: hidden !important;
  text-align: left !important;
  position: relative !important;
  display: block !important;
}
#shopify-section-{{ section.id }} .list-collections__item-image-wrapper {
  position: relative !important;     /* in-flow */
  aspect-ratio: 4 / 5 !important;    /* carries the size now */
  width: 100% !important;
  height: auto !important;
  z-index: 0;
}
#shopify-section-{{ section.id }} .list-collections__item-image {
  position: absolute !important;     /* fill wrapper */
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
}
```

And in the mobile media-query block at lines 160–165, change the wrapper override the same way:

```css
@media screen and (max-width: 999px) {
  #shopify-section-{{ section.id }} .list-collections__item-image-wrapper {
    position: relative !important;
    aspect-ratio: 4 / 5 !important;
    width: 100% !important;
    height: auto !important;
  }
  /* (rest of the block unchanged) */
}
```

The `.list-collections__item-info` block (line 99 and line 167) stays `position: absolute` — that's fine because it's positioned against the now-sized `<a>` and is purely decorative overlay text.

### Why this works

- The wrapper is now an **in-flow block** with `width: 100%` and `aspect-ratio: 4/5`. iOS Safari's known regression is around `aspect-ratio` on elements with all-absolute children; an in-flow wrapper with no children needing to push height does NOT trigger the bug.
- The `<a>` derives its height from the wrapper's content height (the wrapper IS its content), which is rock-solid across every engine.
- The IMG remains `position: absolute; inset: 0` of the wrapper, so `object-fit: cover` still crops the variable-aspect source images (1600×1200, 1600×1066, 1066×1600, 1600×1066) into the 4:5 box exactly as today.
- The `:before` overlay pseudo-element (line 89–96) sits on `.list-collections__item-image-wrapper` and already uses absolute positioning — it continues to overlay the IMG correctly.

### Secondary cleanup (optional, same edit window)

The hardcoded `width="1200" height="1500"` HTML attributes on the IMG at line 277 don't match any of the four actual source images. Change to `width="1600" height="1200"` or simply omit the attributes — the wrapper's `aspect-ratio` now defines layout. Mismatched intrinsic dimensions trigger an extra layout pass once pixels arrive; harmless but wasteful.

---

## 4. Other mobile-only bugs found

Scope: a quick sweep of touch-device interactions, hover-only behaviors, and lazy-load shim patterns across sections that render on the home page or top navigation paths.

### S1 — `<img reveal>` images can stay invisible on iPhone if WNW orchestrator never runs

**Where:** [`snippets/custom-css.liquid:16–20`](../snippets/custom-css.liquid) sets:

```css
html:not(.w3_user) .list-collections__item-image-wrapper [reveal] { opacity: 1 !important; transition: ...; transform: translateZ(0); }
```

Combined with the global `[reveal] { opacity: 0 }` rule baked into [`snippets/index-css.liquid`](../snippets/index-css.liquid) (line 2 of the minified bundle).

**Risk:** Any section that uses `reveal_on_scroll: true` puts `reveal` on its images. Until the `TileSlider` / `CollectionList` reveal animation runs (which requires `theme.js` to load — and `theme.js` is deferred by the WNW orchestrator until first user interaction — see [`snippets/wnw_header.liquid:15–37`](../snippets/wnw_header.liquid)), images stay at `opacity: 0`. On a quick-bounce iPhone visit with no scroll/touch within ~1 second, the user sees blank tiles.

**Mitigation:** This particular `tnr-collection-list` instance has `reveal_on_scroll: false` (set in `templates/index.json`), so the bug doesn't fire for it. But every OTHER section with `reveal_on_scroll: true` has this latent issue. Check sections that are above-the-fold on mobile and set `reveal_on_scroll: false` for those, OR add a `<noscript>`/`reveal[opacity:1 !important]` fallback after a JS-execution timeout.

**Severity:** S1 (visible-broken to ITP-locked-down iPhone users who never interact).
**Files to audit:** all sections with a `reveal_on_scroll` setting — `image-with-text*`, `gallery.liquid`, `slideshow.liquid`, `featured-collections`, `image-with-text-overlay.liquid`.

### S2 — Best Sellers carousel "Add to cart" button uses hover-only reveal pattern

**Where:** [`blocks/ai_gen_block_74536a9.liquid:157`](../blocks/ai_gen_block_74536a9.liquid) sets `.ai-carousel-card:hover .ai-carousel-add-to-cart { opacity: 1 }`. The mobile override at line 350 forces `opacity: 1` for `<991px`, so this is **already mitigated for mobile**.

**Verification:** Confirmed at line 341–354: `@media (max-width: 990px) .ai-carousel-add-to-cart { opacity: 1; transform: translateY(0); }`.

**Severity:** S3 (already mitigated; flagging only because the desktop pattern is hover-only — would be a problem for hybrid touch laptops at >990px, e.g. Surface, iPad in landscape with desktop UA).

### S3 — `data-class="LazyLoad"` shim still present in 8 other sections / snippets

Files still using the WNW LazyLoad shim pattern (placeholder base64 + `data-src=`):

- [`sections/gallery.liquid`](../sections/gallery.liquid)
- [`sections/image-with-text-block.liquid`](../sections/image-with-text-block.liquid)
- [`sections/image-with-text-overlay.liquid`](../sections/image-with-text-overlay.liquid)
- [`sections/image-with-text.liquid`](../sections/image-with-text.liquid)
- [`sections/hero-bg-video.liquid`](../sections/hero-bg-video.liquid)
- [`sections/video.liquid`](../sections/video.liquid)
- [`snippets/app-block.liquid`](../snippets/app-block.liquid)
- [`snippets/product-item.liquid`](../snippets/product-item.liquid)

**Risk:** Same failure mode that the user previously hit on this section before the data-src removal — if the WNW orchestrator never runs (no user interaction within ~1s on an iPhone), these images stay at the 1×1 placeholder. The fact that the bug was previously reported and fixed *just for this one section* means it's almost certainly still reproducible on at least one of the others, especially the above-the-fold ones (`image-with-text.liquid`, `image-with-text-overlay.liquid` on the home page).

**Recommendation:** Triage each file the same way. For above-the-fold home sections, use direct `src=` (the fix already applied here). For below-the-fold, native `loading="lazy"` is fine — let the browser handle it instead of WNW's interaction-gated shim.

**Severity:** S2 (likely reproducible, image rendering on top funnel pages).

### S3 — IMG HTML attribute aspect-ratio mismatch (cosmetic / perf)

**Where:** [`sections/tnr-collection-list.liquid:277`](../sections/tnr-collection-list.liquid) hardcodes `width="1200" height="1500"` while the actual JPEG assets are 1600×1200, 1600×1066, 1066×1600, 1600×1066.

**Risk:** Extra layout reflow once each image's intrinsic dimensions decode. Causes a single re-paint per tile but no visible jank because the `aspect-ratio` rule pins the box size.

**Severity:** S3 (cosmetic; resolves naturally if the fix in §3 is applied and the attributes are removed/corrected at the same time).

### S3 — `align-items: center` on `.list-collections__item-list` base CSS

**Where:** [`snippets/index-css.liquid`](../snippets/index-css.liquid) base rule: `.list-collections__item-list { align-items: center; gap: 24px; display: grid; }`. With single-column mobile and `align-items: center`, if any tile collapses (e.g., the iPhone bug here), it centers a 0-height tile, which may visually re-flow the section to look "empty." The section CSS overrides to `align-items: stretch` for desktop but does NOT override for mobile.

**Severity:** S3 (only matters as a *symptom* of the S0 bug above; harmless once the root cause is fixed). Worth normalizing to `align-items: stretch !important` in the mobile media-query block for consistency.

---

## 5. Validation plan

After applying the §3 fix to [`sections/tnr-collection-list.liquid`](../sections/tnr-collection-list.liquid):

1. Run `npm run theme:check` — confirm no new offenses (current baseline: 161 / 1 / 160).
2. Push to dev theme `149375320157` via `npm run theme:dev` (or `theme:push` to the dev preview, NOT to source).
3. Verify on:
   - Mac Safari 17 — must still render 4 tiles correctly at desktop, 1-column at <1000px.
   - Mac Chrome — same.
   - **iPhone Safari (iOS 17+)** — primary test. Tiles must show images, not white rectangles.
   - **iPhone Safari (iOS 15 / 16 if available)** — the configurations most likely to have hit the bug.
   - iPad Safari (between iPhone and desktop breakpoints) — must show the grid layout.
4. Spot-check that the `:before` dark overlay still sits on top of the image (z-index ordering unchanged).
5. Confirm `object-fit: cover` still crops the 1066×1600 portrait `home-sim-series.jpg` without weird letterboxing.

Once verified on dev, promote to source theme `149365096541` per the established workflow.

---

## 6. Constraints respected

- No code files modified (`templates/`, `sections/`, `assets/`, `blocks/`, `snippets/` all untouched).
- No `theme push` or `theme pull` invoked.
- This document only. Total: under 400 lines.
