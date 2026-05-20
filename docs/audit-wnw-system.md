# WNW Deferred-Loading System — Audit & Strategic Recommendation

Date: 2026-05-13
Scope: full audit of the custom "WNW" / `w3_loadscripts` interaction-gated loader and the supporting `mainopt` UA-class scheme.
Status: read-only audit; no code changes made.

Companion to [docs/perf-baseline.md](perf-baseline.md). Where that doc measures, this doc explains and prescribes.

---

## 1. Executive summary

The WNW system is a third-party-style "speed booster" pattern grafted into the theme. It:

1. Stops every theme script (`vendor.js`, `theme.js`, `custom.js`, GTM, Clarity, Heatmap, web pixels, Maestrooo, 16 marketing scripts, Hulk forms, Fordeer, Inbox, etc.) from running until the **first user interaction** (mousemove / touchstart / scroll / keydown / wheel) or until the page scrolls past `body.top < -30px`.
2. Stops the two main stylesheets (`theme.css` 304 KB, `custom.css` 14 KB) from loading until the same interaction trigger.
3. Rewrites Shopify's injected `content_for_header` markup via a 12-stage `| replace:` chain so Shopify's own scripts also get gated.
4. Lazy-loads images via a `src="data:image/png;base64,..."` placeholder + `data-src` + a scroll-handler in `wnw_footer.liquid`.
5. Adds a `.mainopt` class to `<html>` on most UAs (excludes x86 non-CrOS desktop, PowerPC, and `nonopt=1` query) so a couple of `:not(.mainopt)` CSS rules in `custom-css.liquid` flip behaviour between lab benchmarks and real users.

**Verdict: REPLACE with a standard `defer`/`async` + `loading="lazy"` posture.** Specifically a phased migration (described in §7). The scheme delivers a real but modest TBT/main-thread win on lab tests, but:

- The "wins" are partly real (gating 400+ KB of JS) and partly Lighthouse-gamed (the `.mainopt` font-family trick exposed in `perf-baseline.md` H7, the removed `fv-loading-icon` LCP hack, and the `_blocks/footer-app-block.liquid` synthetic-mousemove that fires the gate within 100 ms of DOMContentLoaded on mobile anyway — see §4.1).
- It introduces real customer-affecting failure modes: hero images that never load until scroll on iOS, third-party scripts that never run on quick-bounce visitors, and a brittle string-replace pipeline that silently breaks when Shopify changes any injected snippet (Shop Pay, web pixels, B2B preloads).
- The complexity tax is large: ~280 lines in `wnw_header.liquid`, ~230 in `wnw_footer.liquid`, the `replace:` chain in `theme.liquid`, conditional CSS in `custom-css.liquid` and `footer-app-block.liquid`, plus the `data-class="LazyLoad" data-src=...` Liquid-replace at 21 image render sites.

Shopify and the Focal base theme already give you 80% of the same effect with `defer` on scripts and native `loading="lazy"` on images, without any of these failure modes.

---

## 2. Full system map

### 2.1 `snippets/wnw_header.liquid`

Two `<script>` blocks rendered inside `<head>` ahead of the title.

#### Block A — IIFE UA gate + MutationObserver ([wnw_header.liquid:1-42](../snippets/wnw_header.liquid))

```js
i = location.href.includes("nonopt=1")
 || (navigator.platform.indexOf("x86_64") > -1 && navigator.userAgent.indexOf("CrOS") < 0)
 || navigator.userAgent.indexOf("power") > -1
 || navigator.userAgent.indexOf("rix") > -1;
!i && document.documentElement.classList.add("mainopt");
window.mainopt = i;   // NB: this stores the *exclusion* boolean, not the class state.
```

- Adds `.mainopt` on iOS, Android, ARM Macs, ChromeOS, and any other non-x86 platform. **Excludes**: x86_64 Windows / Linux / Intel macOS, anything UA-stamped `power` (legacy PowerPC) or `rix` (likely Matrix / Selenium / Phantom — a bot-fingerprint filter).
- Lighthouse runs on headless x86 Chrome → no `.mainopt` → falls into the `:not(.mainopt)` CSS branch (see §3.4).
- `window.mainopt` is the **inverted** boolean. Code that reads `!window.mainopt` (e.g. [footer-app-block.liquid:47](../snippets/footer-app-block.liquid)) is actually testing "did `.mainopt` get added". This naming is a footgun.

A `MutationObserver` watches `<html>` and rewrites any newly-injected `<script>` whose `id === "web-pixels-manager-setup"` OR whose `src` contains `maestrooo` to `type="lazyload_int"` / `data-src=` / `data-w3-type="module"`. It self-disconnects when `<html>.xh` class appears (the class is never set anywhere in this theme — the observer runs for the full page lifetime).

#### Block B — `<style id="w3_bg_load">` ([wnw_header.liquid:43](../snippets/wnw_header.liquid))

```css
div:not(.w3_bg), section:not(.w3_bg), iframelazy:not(.w3_bg) {
  background-image: none !important;
}
```

Globally suppresses **every** `background-image` on the page until the in-viewport scanner in `wnw_footer.liquid` tags the element with `.w3_bg`. This is the mechanism that defers section background images. The style element is removed in `w3_events_on_end_js()` once orchestrator finishes ([wnw_footer.liquid:14-17](../snippets/wnw_footer.liquid)).

#### Block C — `w3_loadscripts` orchestrator ([wnw_header.liquid:44-276](../snippets/wnw_header.liquid))

Class with the following responsibilities:

| Method | What it does |
|---|---|
| `constructor` | Sets passive listener options, picks up `w3_googlefont` (never defined → empty array, font-loading is dead code), seeds four script buckets: `normal`, `async`, `defer`, `lazy`. |
| `user_events_add` | Binds `keydown`, `mousemove`, `touchmove`, `touchstart`, `touchend`, `wheel` to `triggerListener`. |
| `triggerListener` | Removes listeners, sets `.w3_user` class, calls `load_style_resources()` then `load_resources()`. |
| `load_style_resources` | Promotes every `<link data-href>` to a real stylesheet via `preload_scripts` (named confusingly — it actually inserts `<link rel="preload" as="style">`). Waits for the `css-preloaded` flag, then in `execute_styles` creates a `<link rel="stylesheet" href=...>` and removes the original `<link data-href>`. |
| `load_resources` | Calls `hold_event_listeners` (rewrites `DOMContentLoaded`/`load` to `w3-DOMContentLoaded`/`w3-load` so scripts that listen for them fire late), `exe_document_write` (proxies `document.write`), then runs scripts serially: `normal` → `defer` → `async`, then dispatches synthetic `w3-DOMContentLoaded`, `w3-readystatechange`, `w3-load`, `w3-pageshow` events. |
| `wnwAnalytics` | Walks `.analytics` script tags, re-enables `trekkie.integrations = false → true` indirectly by replacing each tag with a clone that executes. Pairs with the inline `trekkie=[]` stub at [theme.liquid:104](../layout/theme.liquid). |
| `wnwBoomerang` | Same pattern for `.boomerang` script tags (Shopify's BOOMR perf-monitoring). |
| `hold_jquery` | Defines a getter/setter on `window.jQuery` so any later assignment is intercepted; rewrites `$(document).ready()` and `$(window).on('load', ...)` to fire on the synthetic `w3-` events. |
| `hold_event_listeners` | Globally rewrites `addEventListener('DOMContentLoaded', ...)`, `addEventListener('load', ...)`, etc. on `document` and `window`. **This affects scripts loaded by third parties later** (e.g. anything that runs after orchestrator promotes `vendor.js`). |
| `execute` (static) | Entry point. Binds listeners, polls every 500 ms for `body.getBoundingClientRect().top < -30` and triggers if scrolled. |

Scheduled at the bottom: `setTimeout(w3_loadscripts.execute, 1000)`. The 1-second startup delay is the most-impactful arbitrary constant in the system.

### 2.2 `snippets/wnw_footer.liquid`

Single inline `<script>` (NOT itself lazy-gated). Runs synchronously at the end of `<body>`. Provides:

| Function | Behaviour |
|---|---|
| `lazyloadimages(top)` | Scans every `img[data-class=LazyLoad]`, every `div/section/iframelazy:not(.w3_js)` for background images, plus all `<video>` / `<audio>`. If element is within `w3_lazy_load_by_px = 200` of viewport, copies `data-src` → `src` (and `data-srcset` → `srcset`). |
| `lazyload_img` | Inner loop. **Skips elements where `elemRect.top == 0`** — i.e. hidden / `display:none` / `visibility:hidden` elements. This is the iOS hero-slide bug (§4.2). |
| `lazyload_imgbgs` | Adds `.w3_bg` to in-viewport `div`/`section`/`iframelazy` so the `#w3_bg_load` style stops blanking them. |
| `convert_to_video_tag` | Promotes `<videolazy>` custom elements into real `<video>`. Triggered by `w3_events_on_start_js` (which is only invoked from `load_resources` after first interaction). |
| `w3_events_on_end_js` | Removes the `#w3_bg_load` style, flips `w3_bglazyload = 0`, calls `lazyloadimages(0)`, then `jQuery(".hamburger").click()` if `window.site_nav_link_burger == false`. |
| `setInterval(lazyloadimages(0), 3000)` and `setInterval(lazyloadiframes(top), 8000)` | Continuous safety nets. |
| `document.addEventListener("click", lazyloadimages(0))` | Click safety net. |
| `lazyloadimages(0)` | Initial call at parse time (line 223). |

The footer script is **independent** of the orchestrator firing — it runs from inline parse and the interval/scroll handlers will eventually pick up in-viewport images even if `w3_loadscripts.execute` never fires. The interlock is `w3_bglazyload`: backgrounds remain suppressed until `w3_events_on_end_js` runs.

### 2.3 `layout/theme.liquid` mutations

`{% render 'wnw_header' %}` at [line 21](../layout/theme.liquid). `{% render 'wnw_footer' %}` at [line 236](../layout/theme.liquid). Plus:

#### The 12-stage `content_for_header` replace chain ([theme.liquid:102-104](../layout/theme.liquid))

```liquid
{% capture content_for_header2 %}{{ content_for_header }}{% endcapture %}
{{ content_for_header2
  | replace: ' async="async" ', ' type="lazyload_int" '
  | replace: ' defer="defer" ', ' type="lazyload_int" '
  | replace: " src=", " data-src="
  | replace: "DOMContentLoaded", "w3-DOMContentLoaded"
  | replace: "window.addEventListener('load', asyncLoad, false);", "window.addEventListener('w3-DOMContentLoaded', asyncLoad, false);"
  | replace: "addEventListener('load', prefetchAssets);", "addEventListener('w3-DOMContentLoaded', prefetchAssets);"
  | replace: 'type="module" data-', 'data-w3-type="module" type="lazyload_int" data-'
  | replace: "type='text/javascript' async=''", "type='lazyload_int' "
  | replace: 'async data-w3-type="module" type="lazyload_int"', 'data-w3-type="module"'
  | replace: '<script type="module">', '<script data-w3-type="module" type="lazyload_int">'
  | replace: "type='text/javascript' defer='defer' data-src", "type='lazyload_int' data-src"
  | replace: 'type="lazyload_int" data-src="https://shop.app/checkouts/internal/preloads.js', 'type="lazyload_ext" data-src="https://shop.app/checkouts/internal/preloads.js'
}}
<script>var trekkie=[];trekkie.integrations=!0;window.BOOMR={},window.BOOMR.version=true;</script>
```

Then:

| Stage | Purpose | Risk if Shopify changes format |
|---|---|---|
| 1, 2 | Convert `async="async"`/`defer="defer"` to `lazyload_int` | If Shopify emits `async` without `="async"`, stage misses it → script runs unrestricted. |
| 3 | `src=` → `data-src=` | Catches almost everything, but also rewrites `src=` inside attribute strings (e.g. inline `<iframe src=>` for noscript). |
| 4, 5, 6 | Rewrite `DOMContentLoaded` listeners to fire on synthetic event | Brittle string match. Shopify Shop Pay / Bundle preloads use slightly different listener invocations. |
| 7-10 | Handle `type="module"` permutations | Three different module-script patterns — every Shopify pixel update risks a permutation drift. |
| 11 | Catch a specific text/javascript+defer+data-src ordering | Order-dependent. |
| 12 | **Re-allow** Shop Pay checkout preloads to lazy-load as `lazyload_ext` (a separate bucket that runs after orchestrator completes script chain, see `w3_trigger_lazy_script`). | Required because Shop Pay would otherwise be deferred and break checkout transitions. |

The `trekkie = []` / `BOOMR = {}` stub at line 104 disables Shopify analytics so the late re-enable via `wnwAnalytics`/`wnwBoomerang` can work. **Cart and checkout pages skip the entire mutation** ([theme.liquid:99-101](../layout/theme.liquid)) so analytics fire normally there.

#### Direct `lazyload_int` script tags in `<head>` and `<body>`

| Line | What | Weight |
|---|---|---|
| [66](../layout/theme.liquid) | `<link rel="stylesheet" data-href="theme.css">` | 304 KB |
| [89](../layout/theme.liquid) | `<link rel="stylesheet" data-href="custom.css">` | 14 KB |
| [107](../layout/theme.liquid) | `vendor.js` | 105 KB |
| [108](../layout/theme.liquid) | `theme.js` | 272 KB |
| [109](../layout/theme.liquid) | `custom.js` | 26 KB |
| [113-119](../layout/theme.liquid) | Microsoft Clarity inline loader | ~2 KB + remote |
| [120](../layout/theme.liquid) | Heatmap.com inline loader | ~1 KB + remote |
| [131-142](../layout/theme.liquid) | Google Tag Manager loader | ~1 KB + remote |
| [238-247](../layout/theme.liquid) | Octane.AI quiz `dataLayer` listener | trivial |
| [248-334](../layout/theme.liquid) | Loox + mm-uxrv + FB Pixel + Redo idle/IO-loader (this block is NOT WNW-gated logically — it uses its own IntersectionObserver / idleCallback. The outer `<script type="lazyload_int">` wrapper *also* gates it, so it triple-defers.) | ~3 KB + remote |

### 2.4 `snippets/app-block.liquid`

Hulk Form Builder (`form-builder-script.js`) + Shopify Inbox chat loader — both `type="lazyload_int"` with `data-src`. The Hulk inline config blob is also `type="lazyload_int"`, so `window.hulkFormBuilder` doesn't exist until orchestrator runs.

### 2.5 `snippets/footer-app-block.liquid`

- **Sixteen marketing scripts** ([line 6](../snippets/footer-app-block.liquid)) bundled into a single `asyncLoad()` that fires on `w3-DOMContentLoaded`: AdRoll, Loox, Affirm, Logbase upsell, NFCube Instafeed, Lucky Orange, levar-viewer, GovX, MyCustomizer, RIO, Klaviyo, Octane.AI, SocialSnowball, Redo, Hextom Event Promotion Bar, Refersion. **All of these only run after first interaction.**
- Shopify Inbox chat-button-container ([line 24-38](../snippets/footer-app-block.liquid)) gated as `lazyload_int`.
- Fordeer preorder app embed ([line 42](../snippets/footer-app-block.liquid)) gated as `lazyload_int`.
- **Synthetic-mousemove dispatcher** ([line 44-60](../snippets/footer-app-block.liquid)):

```js
document.addEventListener('DOMContentLoaded', function () {
    const startinterval = setInterval(() => {
        if (!document.documentElement.classList.contains("w3_user") && !window.mainopt) {
            const mouseMoveEvent = new MouseEvent('mousemove', { ... });
            document.dispatchEvent(mouseMoveEvent);
        } else {
            clearInterval(startinterval); console.log("stoped")
        }
    }, 100);
});
```

This fires a synthetic mousemove every 100 ms on any UA that got the `.mainopt` class (= every iOS, Android, ARM-Mac visitor) until the orchestrator triggers. **It defeats the interaction-gate on the very devices that the gate was supposed to protect.** It's also still gated by the 1-second `setTimeout` startup, and it leaves `console.log("stoped")` in production.

### 2.6 Image lazy-replace at render sites

21 Liquid `image_tag` invocations across 6 files use this pattern:

```liquid
{{ image | image_url: ... | image_tag: loading: 'eager', ... |
   replace: ' src="', ' src="data:image/png;base64,iVBOR...AAABCAQAAAC1HAwCAAAA..." data-class="LazyLoad" data-src="' |
   replace: ' srcset="', ' data-srcset="' }}
```

Files affected: `sections/tnr-collection-list.liquid`, `sections/image-with-text-block.liquid`, `sections/image-with-text.liquid`, `sections/gallery.liquid`, `sections/image-with-text-overlay.liquid`, `snippets/product-item.liquid`. The slideshow only sets `data-class="LazyLoad"` (no src rewrite) — see §4.2.

---

## 3. What's gated (and how much it weighs)

### 3.1 First-party JS gated by interaction trigger

| Asset | Bytes | Loaded as |
|---|---|---|
| `vendor.js` | 107,289 | `lazyload_int` normal bucket |
| `theme.js` | 278,263 | `lazyload_int` normal bucket |
| `custom.js` | 26,905 | `lazyload_int` normal bucket |
| **Total** | **412,457 (~403 KB uncompressed)** | |

### 3.2 First-party CSS gated by interaction trigger

| Asset | Bytes |
|---|---|
| `theme.css` | 311,227 |
| `custom.css` | 14,626 |
| **Total** | **325,853 (~318 KB)** |

### 3.3 Third-party scripts gated by interaction trigger (via `w3-DOMContentLoaded`)

16-script `footer-app-block.liquid` bundle: AdRoll, Loox widget, Affirm Shopify, Logbase upsell, NFCube Instafeed, Lucky Orange, levar-viewer, GovX, MyCustomizer, RIO, Klaviyo, Octane.AI, SocialSnowball, Redo, Hextom Event Promotion Bar, Refersion. Plus directly via `lazyload_int`: Shopify Inbox chat, Hulk Form Builder, Fordeer preorder, GTM, Microsoft Clarity, Heatmap.com, Octane quiz listener, and any Shopify-injected web-pixel script captured by the MutationObserver or the `replace:` chain.

### 3.4 What `.mainopt` actually controls

Only 4 CSS rules across the theme touch `.mainopt`:

| Location | Rule | Effect |
|---|---|---|
| [custom-css.liquid:43](../snippets/custom-css.liquid) | `html:not(.mainopt):not(.w3_user), html:not(.mainopt):not(.w3_user) * { font-family: unset !important; }` | **Lighthouse-only**: strips custom fonts pre-interaction on x86 desktops so FCP is fast. Real users (mobile) get fonts immediately — i.e. the "optimization" reverses on the audience that needs it most. Confirmed in `perf-baseline.md` H7: this single rule is the root cause of the 84 vs 89 product-page Lighthouse delta when toggling `?nonopt=1`. |
| [custom-css.liquid:46](../snippets/custom-css.liquid) | `html:not(.mainopt) body.tpl--index ... img[reveal] { opacity: 0 !important; }` | Hides mobile collection-list images pre-WNW. With the synthetic mousemove dispatcher firing within 100 ms of DOMContentLoaded, this is usually invisible to real users — but if the dispatcher is blocked or delayed, the images stay invisible. |

(The other `.mainopt` references in `wnw_header.liquid` and `footer-app-block.liquid` are the class-write site and the inverted-boolean read site, not CSS rules.)

### 3.5 Net "saved" weight per page view (lab)

Assuming a Lighthouse bot that never interacts or scrolls: ~720 KB (403 KB JS + 318 KB CSS) of work is deferred past the FCP/LCP measurement window. This is the headline number that makes the scheme attractive on paper.

Assuming a real user on iPhone Safari: the synthetic mousemove dispatcher fires within 100 ms of DOMContentLoaded, so practically all gating expires within ~1.1 s of page-start (the 1-second startup `setTimeout` + dispatcher cycle). **The "gate" exists mainly to fool lab tests on desktop x86.**

---

## 4. Identified failure modes

### 4.1 (Documented) `.mainopt` font-family flip causes real-user perf regression on product pages

Severity: **P1**. Already documented in `perf-baseline.md` H7. Mobile users get custom fonts loaded immediately (slow FCP), x86 desktops get system-font fallback until interaction (fast FCP). Net Lighthouse score on product page is 5 points worse with the "optimization" than without.

### 4.2 (Probable) iOS hero-slide images never load (matches reported bug)

Severity: **P0**. Reported symptom: "iPhone Safari images don't load." Root-cause hypothesis:

1. `slideshow.liquid` emits all hero slides with `data-class="LazyLoad"` but a **real** `src=` and `srcset=` (no data-URI placeholder). The `image_tag` filter generates the real URL.
2. Non-first slides have `visibility: hidden` / `display: none` from the slide-show CSS until the slideshow component activates them. `getBoundingClientRect()` on these returns `{top: 0, left: 0, ...}`.
3. `lazyload_img` in `wnw_footer.liquid:69` skips elements where `elemRect.top == 0`. So hidden hero slides are never lazy-loaded.
4. The slideshow component (in `theme.js`) is `lazyload_int` — it doesn't execute until first interaction.
5. On iOS Safari, `touchstart` / `touchend` only fire when the user taps. If the user scrolls (pure swipe with no tap), the `wheel` event is **not** synthesized on iOS; only `touchmove`/`scroll`-on-window fire. The orchestrator binds `touchmove` and `touchstart` (good). However the synthetic-mousemove dispatcher in `footer-app-block.liquid` dispatches a `mousemove` on `document` — and the orchestrator binds `mousemove` on `window`. The dispatcher uses `bubbles: true`, so this should propagate, but only if the document → window propagation chain isn't broken. There's a window for this to be flaky.
6. Even after the orchestrator fires and `theme.js` runs, the slideshow's auto-rotate uses CSS transforms to bring non-first slides into view. These transforms don't fire `scroll` on window. The 3-second `setInterval(lazyloadimages(0), 3000)` should catch them eventually — **but only if the user isn't on iOS low-power mode**, which throttles setInterval to ≥30s.

The combination of (3) and (6) is the most likely explanation for hero slides 2-N never loading until the user manually scrolls.

**Concrete reproduction path**: iPhone, slideshow page, low-power mode on, swipe left to advance slides without scrolling the page. Slides 2+ stay blank (real `src` was placeholder-less so they technically *could* load, but the lazy-loader has stripped them or the slide is still `display:none` at the moment the loader runs).

### 4.3 Quick-bounce visitors get blank analytics

Severity: **P1**. Customer-affecting because revenue attribution breaks.

A visitor who lands on a page from an ad, decides instantly "not what I want", and back-buttons within 1 second (very common on mobile) **never triggers** the orchestrator. The 16 marketing scripts in `footer-app-block.liquid` never run. Klaviyo, Refersion, AdRoll, Lucky Orange — none of them register the visit. Facebook Pixel and GTM also miss the event. The cohort that bounces is exactly the cohort marketing wants to track for retargeting.

The `setTimeout(execute, 1000)` startup is the floor here: nobody who leaves in < 1 s is tracked, ever.

### 4.4 Shopify format drift silently breaks the `replace:` chain

Severity: **P1** latent. The 12-stage chain at [theme.liquid:104](../layout/theme.liquid) is a series of exact-string substitutions. Three concrete drift cases:

- **Shopify Web Pixels Manager**: Shopify has updated the pixel-manager script ID/markup at least twice since 2024. Stage 1 (`async="async"`) matches today; a future version emitting `async` (bare) would slip through and run before user interaction.
- **Shop Pay preloads**: Stage 12 specifically opts Shop Pay back **out** of full lazy-loading by routing it to the `lazyload_ext` bucket, which fires after the normal/defer/async chains finish. If Shop Pay changes its preload URL or adds a query string, the opt-out fails and Shop Pay either fails to load or breaks checkout.
- **B2B contexts**: B2B customers get extra Shopify-injected markup (market context, currency-conversion stubs). The `replace:` chain doesn't handle these explicitly; whether they survive is luck-of-the-draw.

There is no test or Theme Check rule that asserts the chain is still correct.

### 4.5 Orchestrator JS error → fully broken theme

Severity: **P0** latent. `vendor.js`, `theme.js`, `custom.js` are all `type="lazyload_int"`. If a JS error in the inline orchestrator (e.g. a Shopify pixel injects unusual markup that crashes the MutationObserver callback, or an ad-blocker injects a `MutationObserver` shim) prevents `triggerListener` from running, then **no theme JS ever runs**:

- Cart drawer dead (no add-to-cart, no cart-line-item updates).
- Variant picker dead (PDP buyers can't choose options).
- Mini-cart count never updates.
- All `theme.js` custom elements (slideshow, product-media, scroll-shadow, etc.) stay as parsed-but-undefined HTML elements.

The IIFE wraps the MutationObserver block in `try/catch`, but the orchestrator class itself (lines 44-275) and the `setTimeout(execute, 1000)` are not wrapped. There is **no fallback** that promotes `theme.js` after a deadline even if the orchestrator never runs.

### 4.6 `hold_event_listeners` rewriting `addEventListener` is invasive

Severity: **P2**. The `hold_event_listeners` method ([wnw_header.liquid:163-195](../snippets/wnw_header.liquid)) rewrites `document.addEventListener` and `window.addEventListener` so that the strings `"DOMContentLoaded"`, `"load"`, `"pageshow"`, `"readystatechange"` are silently rewritten to `"w3-..."`. This affects **every** subsequently-loaded script for the rest of the page lifetime. Third-party scripts (Klaviyo, Loox, etc.) that subscribe to `DOMContentLoaded` after orchestrator runs will subscribe to the synthetic event — and never fire if the synthetic event already fired before they ran. Subtle bugs that look like "the third-party app sometimes doesn't initialize" likely have this as a root cause.

### 4.7 Dead code

- `w3_googlefont` variable is read but never written → `load_fonts([])` is a no-op. The font-deferral system is dead.
- `<style id="w3_bg_load">` is only useful if any backgrounds are page-essential — the section components on this theme mostly use `<img>` not CSS `background-image`. Worth measuring how many backgrounds actually use this path.
- `MutationObserver` self-disconnect predicate (`document.documentElement.classList.contains("xh")`) never triggers — the class is never set. The observer runs forever.

---

## 5. Was it worth it?

Three honest yes/no questions:

| Question | Answer | Evidence |
|---|---|---|
| Did WNW improve Lighthouse mobile score vs. doing nothing? | **Yes, modestly.** | Removing the `fv-loading-icon` hack already shifted real LCP from 1.3 s (fake) to 2.5 s (real), but TBT improved from 575 ms → 93 ms once Clarity/Heatmap were deferred. Most of the TBT win is recoverable with plain `defer`. |
| Did WNW improve real-user perceived speed? | **Probably not, possibly worse.** | Speed Index 9.1 s (home) / 17.2 s (product) is hostile on mobile. The `.mainopt` font-family flip on product pages is a confirmed real-user regression. The synthetic-mousemove dispatcher means the gate expires within ~1.1 s for most real users — so the user gets a *delayed* render of everything by a flat 1 s with no compensating gain. |
| Did WNW deliver value proportional to its complexity? | **No.** | ~700 lines of bespoke JS, 21 Liquid render-site rewrites, a `replace:` chain, conditional CSS, a synthetic-input loop, and an inverted-boolean class system. Same Speed Index / LCP / TBT win is achievable in ~50 lines of standard browser semantics: `<script defer src=...>`, `<img loading="lazy" decoding="async">`, `preload`+`onload` swap for non-critical CSS. Plus Shopify's own pixel manager which is already designed not to block. |

The `perf-baseline.md` `?nonopt=1` comparison is the cleanest empirical answer: on home page, score is identical (90 vs 90); on product, the WNW path is **5 points worse** than disabling its `.mainopt` half. Nothing else in the codebase has a 5-point performance line item.

---

## 6. Strategic recommendation: **Replace**

Modify-in-place is tempting (e.g. drop the 1-second `setTimeout`, remove the `.mainopt` font-family rule, fix the iOS-slide bug) but each modification surfaces the next bug — the simplicity of `defer`/`async` is the real win. A focused 1–2 week migration removes ~700 lines and ~21 Liquid rewrites and brings the theme back to standard practice.

### Why not "modify"

- The bugs aren't local. Fixing iOS slides means changing `lazyload_img` to honor `display:none` differently, which then needs re-validation across product item / gallery / collection list / image-with-text. Each of these has its own `replace:` chain that strips `src`. Touch one, audit twenty.
- The MutationObserver-based catch-all is fundamentally unverifiable. Adding a new Shopify pixel will keep silently breaking the chain.
- The Lighthouse-gaming has already been called out (the `fv-loading-icon` div removed, the `.mainopt` font flip identified). Continuing to maintain "tricks" that work on bots but not users is bad engineering and bad faith.

### Why "replace"

- `<script defer>` runs after DOM parse, in order, before `DOMContentLoaded`. That covers `vendor.js`/`theme.js`/`custom.js` and recovers most TBT savings without breaking interactivity.
- Native `loading="lazy"` on `<img>` is now universally supported (Safari 15.4+, all modern browsers). Replaces the entire 230-line `wnw_footer.liquid` scroll-handler.
- `<link rel="stylesheet">` is fine for `theme.css` if it's correctly minified and split. Critical CSS is already inlined per-template (`index-css.liquid`, `product-css.liquid`, etc.) — that part of the existing setup is good and should stay.
- Shopify's pixel manager, GTM, Loox, Klaviyo all support `async` and partition-aware loading natively. Putting them back on Shopify's own deferred-load mechanisms means they keep working when Shopify updates them.

### 7. Migration sketch (replace path)

Phased to keep risk bounded and reversible. Each phase ships, sits in production for 3-5 days under RUM, then the next phase ships.

#### Phase 0 — Instrumentation (2 days, no theme changes)

- Add Web Vitals JS (Google `web-vitals` package, <2 KB) reporting LCP, INP, CLS to GA4 / Clarity. Inline, non-deferred. **This is the missing measurement: today the team is flying blind on INP and field LCP.**
- Capture a 7-day baseline of field LCP, INP, CLS, and conversion rate on the 5 templates from `perf-baseline.md`.

#### Phase 1 — Drop the `.mainopt` font-family hack (1 day)

- Delete the rule at [custom-css.liquid:43-45](../snippets/custom-css.liquid). Real users get correct fonts on first paint; desktop Lighthouse will see custom fonts too. Reported Lighthouse score on product page should rise 84 → 89 (see `perf-baseline.md` H7).
- Keep everything else WNW for now. This is a single-line change with the highest ROI per character touched.

#### Phase 2 — Promote `theme.js` / `vendor.js` / `custom.js` to plain `defer` (3 days)

- Replace the three `type="lazyload_int" data-src=...` at [theme.liquid:107-109](../layout/theme.liquid) with standard `<script defer src=...>`.
- Remove `vendor.js`/`theme.js`/`custom.js` from the `w3_scripts.normal` bucket in the orchestrator. Keep the orchestrator running for everything else for now.
- Remove the synthetic-mousemove dispatcher at [footer-app-block.liquid:44-60](../snippets/footer-app-block.liquid).
- Add a `loading="lazy" decoding="async"` posture to image render sites in slideshow, product-item, gallery (Liquid `image_tag` already supports this via the `loading:` arg — most sites are already passing it).
- **Expected risk**: cart-drawer event timing might shift (was firing on `w3-DOMContentLoaded`, now fires on real `DOMContentLoaded`). Test add-to-cart on all three product-form variants (default / azalea / cro).
- **Expected gain**: cart drawer / variant picker available immediately on first paint. INP improves. Quick-bounce ad clicks now get tracked because `theme.js`-bound analytics fire.

#### Phase 3 — Drop image src-rewrite in Liquid (3 days)

- Remove the `| replace: ' src="', ' src="data:image/png;base64,..." data-class="LazyLoad" data-src="' | replace: ' srcset=", ' data-srcset="'` patterns at the 21 image render sites.
- Replace with native `loading: 'lazy'` on `image_tag` (or `eager` + `fetchpriority: 'high'` for the LCP image only).
- Once no more `data-class="LazyLoad"` exists in the rendered HTML, delete `lazyloadimages`, `lazyload_img`, `lazyload_video`, `lazyload_imgbgs`, `lazyload_iframes` and the `<style id="w3_bg_load">` block. `wnw_footer.liquid` collapses from ~230 lines to maybe ~30 (or zero — even the `setInterval`s become unnecessary).
- For section background images, audit them individually. Sections currently using `.w3_bg` class flip: either inline the background-image in critical CSS (above the fold) or use a `<picture>` element with `loading="lazy"` (below the fold).

#### Phase 4 — Drop the orchestrator and the `replace:` chain (3 days)

- Replace [theme.liquid:102-105](../layout/theme.liquid) with plain `{{ content_for_header }}` for all templates (not just cart/checkout). The `trekkie = []` / `BOOMR = {}` stubs go too.
- Convert remaining `lazyload_int` scripts in `app-block.liquid`, `footer-app-block.liquid`, and the inline GTM/Clarity/Heatmap in theme.liquid to native `<script async>` or `<script defer>`. Most of those scripts (Klaviyo, GTM, Lucky Orange, etc.) ship with their own async-loader pattern that's safe.
- Delete `wnw_header.liquid` and `wnw_footer.liquid`. Remove the `{% render 'wnw_header' %}` and `{% render 'wnw_footer' %}` from `theme.liquid`.
- Delete the `.mainopt` and `.w3_user` references in `custom-css.liquid` (lines 16-28, 43-48) and `footer-app-block.liquid` (the synthetic-mousemove already removed in Phase 2).
- Keep the per-template critical-CSS inlining (`index-css.liquid` etc.) — that's a separate optimization and still earns its keep. Long-term goal: re-extract those with `penthouse` so they shrink from 100-360 KB to 20-40 KB, matching `perf-baseline.md` Batch D.

#### Phase 5 — Verification & cleanup (2 days)

- Re-run Lighthouse on all 5 baseline templates. Expected: LCP improves by 200-500 ms; Speed Index improves materially; TBT recovers to within 100 ms of the current best; INP (field) improves substantially.
- Run Theme Check; the ContentForHeaderModification error at [theme.liquid:103](../layout/theme.liquid) should now be gone.
- Confirm cart/checkout flows on the three product-form variants.
- Remove the `?nonopt=1` references from internal docs (the flag will be dead code).

#### Rollback strategy

Each phase touches a localized set of files and can be reverted via git. Phase 2 is the riskiest because it changes JS run order; if cart / variant picker breaks, revert just the three lines in `theme.liquid:107-109` and keep the rest. Phase 3 has no functional risk if images keep `data-class="LazyLoad"` (the loader keeps running and they keep loading), only adds redundant native lazy-load.

---

## 8. Files referenced

- [layout/theme.liquid](../layout/theme.liquid) — the integration site (`{% render 'wnw_header' %}`, `replace:` chain, direct `lazyload_int` script tags)
- [snippets/wnw_header.liquid](../snippets/wnw_header.liquid) — UA gate, MutationObserver, `w3_loadscripts` orchestrator (~280 lines)
- [snippets/wnw_footer.liquid](../snippets/wnw_footer.liquid) — image / video / background lazy-loader (~230 lines)
- [snippets/footer-app-block.liquid](../snippets/footer-app-block.liquid) — 16-script async bundle, synthetic-mousemove dispatcher
- [snippets/app-block.liquid](../snippets/app-block.liquid) — Hulk Form Builder + Inbox chat (both `lazyload_int`)
- [snippets/custom-css.liquid](../snippets/custom-css.liquid) — `.mainopt` and `.w3_user` conditional CSS
- [sections/slideshow.liquid](../sections/slideshow.liquid) — hero slides with `data-class="LazyLoad"` (no src rewrite — different lazy pattern, source of the iOS hero-image bug)
- [sections/tnr-collection-list.liquid](../sections/tnr-collection-list.liquid), [sections/image-with-text-block.liquid](../sections/image-with-text-block.liquid), [sections/image-with-text.liquid](../sections/image-with-text.liquid), [sections/image-with-text-overlay.liquid](../sections/image-with-text-overlay.liquid), [sections/gallery.liquid](../sections/gallery.liquid), [snippets/product-item.liquid](../snippets/product-item.liquid) — image src-rewrite render sites
- [docs/perf-baseline.md](perf-baseline.md) — quantitative companion (H6, H7, Batch A measurements)
