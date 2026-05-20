# Third-Party Script Audit — TheNetReturn Storefront

Date: 2026-05-13
Source: Lighthouse mobile reports at `docs/perf-reports/home-staged-latest.json` (staged theme `149365096541`) and `docs/perf-reports/home-live-latest.json` (currently published theme). Theme source: working tree under `/Users/kelton1/Developer/TheNetReturn/Shopify/`.

**Important methodology caveat:** Lighthouse never simulates a user interaction. The theme's WNW interaction-gate suppresses every `<script type="lazyload_int">` until first scroll/keydown/mousemove/touch. So **most of the lazy-deferred scripts catalogued in section 3 do not appear in the network audit at all** — they only fire for real users. The Lighthouse numbers are the **lower bound** of third-party cost.

---

## 1. Quantified inventory (Lighthouse, what actually loaded)

### Per-vendor totals — staged theme (current source) vs live (currently published)

| Vendor | Origin(s) | Staged KB | Staged MT (ms) | Live KB | Live MT (ms) | Delta |
|---|---|---:|---:|---:|---:|---|
| **Klaviyo** | `static.klaviyo.com`, `static-tracking.klaviyo.com`, `a.klaviyo.com`, `static-forms.klaviyo.com`, `fast.a.klaviyo.com` | 237.7 | 56 | 237.4 | 67 | — |
| **Shopify (apps)** | `cdn.shopify.com/extensions/...` (Inbox chat, Geo redirect, Judge.me loader) | 304.3 | 12 | 304.3 | 11 | — |
| **Microsoft Clarity** | `clarity.ms` (scripts, c.gif, r.collect) | 29.6 | **180** | 31.0 | **221** | live worse |
| **Intelligems A/B** | `cdn.intelligems.io`, `api.intelligems.io` | 110.7 | 7 | 110.6 | 7 | — |
| **Cloudfront (Klaviyo image)** | `d3k81ch9hvuctc.cloudfront.net` | 40.9 | 0 | 40.9 | 0 | — |
| **Loox reviews** | `loox.io`, `fonts.loox.io`, `images.loox.io` | 38.9 | 23 | 38.9 | 25 | — |
| **Heatmap.com** | `dashboard.heatmap.com` | 0 | 0 | 42.6 | 6 | **staged saves 43 KB** (already lazy-int'd) |
| **Heroku (Geo redirect API)** | `xapps-geo-ca956fdeab0c.herokuapp.com` | 1.5 | 0 | 1.5 | 0 | — |
| **Google Fonts (Loox font CSS)** | `fonts.googleapis.com` | 1.3 | 0 | 1.3 | 0 | — |
| **Bing Ads (Clarity sync)** | `c.bing.com` | 0.7 | 0 | 0.7 | 0 | — |
| **Totals** | | **~983 KB** | **~278 ms** | **~1,007 KB** | **~336 ms** | |

(KB = bytes transferred / 1024; MT = main-thread time on Moto G Power emulation.)

### Single biggest individual transfers

| URL | KB | Notes |
|---|---:|---|
| `cdn.shopify.com/extensions/.../inbox-1267/assets/shopifyChatV1Widget.js` | 265 | Shopify Inbox chat widget, **fully loaded on every page** |
| `static.klaviyo.com/.../Render.276...js` | 53 | Klaviyo onsite Render bundle |
| `cdn.intelligems.io/esm/d2077182625c/bundle.js` | 107 | Intelligems A/B test bundle |
| `loox.io/widget/E1WaOfr3D_/v2/carousel?...` (iframe document) | 47 | Loox carousel iframe HTML |
| `dashboard.heatmap.com/preprocessor.min.js` | 43 | Heatmap (live only) |
| `static.clarity.ms/.../clarity.js` | 25 | Microsoft Clarity main script |

### Real-user load order (Lighthouse can't see, derived from source)

WNW orchestrator promotes `lazyload_int` → real `<script>` on first interaction. Order (per `wnw_header.liquid`):

1. **0 ms** Critical CSS, inline. Browser parses head.
2. **0 ms** `content_for_header` rewritten — Shopify-injected analytics (`trekkie`, `BOOMR`) are stubbed.
3. **+1000 ms** WNW orchestrator binds interaction listeners and starts preloading lazy assets.
4. **First interaction** All `lazyload_int` scripts replay in order: normal → defer → async. The home page replay queue includes: theme `vendor.js`/`theme.js`/`custom.js`, Clarity, Heatmap, GTM, Loox loader, Intelligems, Klaviyo, Shopify Inbox loader, xapps Geo, Judge.me loader, Hulk Form Builder, Fordeer Preorder, and the 16 URLs in `snippets/footer-app-block.liquid` (AdRoll, Affirm, Logbase, Instafeed, Lucky Orange, Levar, GovX, MyCustomizer, Octane AI, Social Snowball, Redo, Hextom, Refersion, plus duplicate Klaviyo & Loox entries).
5. **+~2000 ms after interaction** mm-uxrv idle-load and Facebook Pixel idle-load fire (from `layout/theme.liquid:300-309`).
6. **Scroll to bottom** Loox loader actually injects `cdn.loox.io/loox.js` via IntersectionObserver.

**Note on synthetic interaction:** `snippets/footer-app-block.liquid:44-60` dispatches a synthetic `mousemove` every 100 ms until `.w3_user` is set. This effectively **disables the interaction-gate** for any user whose browser fires `DOMContentLoaded` — the WNW deferral is real only for the first ~500 ms of the session.

---

## 2. Source-of-truth inventory by theme file

| # | Vendor / script | Source file | Load strategy | Notes |
|---|---|---|---|---|
| 1 | jQuery 3.7.1 (cdnjs) | `layout/theme.liquid:97` | `defer`, gated by `template == 'page.quiz'` | Standard browser defer. Outside WNW. Only loads on `/pages/quiz`. |
| 2 | Microsoft Clarity loader | `layout/theme.liquid:113-119` | `type="lazyload_int"` inline | Was inline-sync per old audit; **already fixed** to ride WNW. |
| 3 | Heatmap.com loader | `layout/theme.liquid:120` | `type="lazyload_int"` inline | **Already fixed** to ride WNW. Live theme still has the un-deferred version (43 KB / 6 ms penalty). |
| 4 | Google Tag Manager (GTM-WF7K2CSD) | `layout/theme.liquid:131-142` | `type="lazyload_int"` inline | Real-user fires after first interaction. GTM noscript iframe at line 226. |
| 5 | Theme `vendor.js`/`theme.js`/`custom.js` | `layout/theme.liquid:107-109` | `type="lazyload_int"` external | First-party but routed through WNW. |
| 6 | Shopify content_for_header (auto-rewritten) | `layout/theme.liquid:100-104` | 12-stage `replace` filter rewriting `async`/`defer`/`src=` → `data-src=`/`type="lazyload_int"` | Catches Shopify Web Pixels, Maestrooo helpers, etc. Bypassed for cart/checkout. |
| 7 | Loox reviews widget | `layout/theme.liquid:248-282` | IntersectionObserver, sentinel near page bottom, rootMargin 300px | Real script src: `https://cdn.loox.io/loox.js`. Loads only when user scrolls near bottom. The carousel iframe currently embeds from `loox.io/widget/...` directly. |
| 8 | mm-uxrv tracking pixel | `layout/theme.liquid:301-305` | `requestIdleCallback` (2 s timeout) after `DOMContentLoaded` | Listed in old audit. **Domain `mm-uxrv.com` does not appear in either Lighthouse run**, suggesting either the domain returns nothing or it's blocked. The line 22 inline version is commented out. |
| 9 | Facebook Pixel (fbevents.js) | `layout/theme.liquid:308` | `requestIdleCallback` | Real script src: `https://connect.facebook.net/en_US/fbevents.js`. **Not observed in Lighthouse runs** — fires post-interaction. |
| 10 | Redo widget | `layout/theme.liquid:311-332` | IntersectionObserver on `#returns-widget-sentinel` (falls back to immediate load if absent) | **Source URL is a placeholder:** `https://cdn.redo.do/path/to/redo-widget.js`. **DEAD CODE / 404 on every load.** Real Redo loads from `shopify-extension.getredo.com/main.js` (see #15). |
| 11 | Shopify Inbox chat | `snippets/app-block.liquid:1` + `snippets/footer-app-block.liquid:23-38` | `type="lazyload_int"` | The Inbox v2 widget. **265 KB widget JS**. Loaded on every page even though chat is rarely clicked. Two separate Inbox blocks active in `settings_data.json`. |
| 12 | Hulk Form Builder | `snippets/app-block.liquid:2-41` | `type="lazyload_int"` | Loads on every page; only needed on pages using Hulk forms. |
| 13 | Fordeer Preorder | `snippets/footer-app-block.liquid:41-43` | `type="lazyload_int"`, `type="module"` | Only relevant on product pages with preorder. Loads on every page. |
| 14 | Klaviyo onsite | App embed `klaviyo-onsite-embed` (`config/settings_data.json:104`) + `snippets/footer-app-block.liquid:6` | Native app embed (rewritten by content_for_header replace) + duplicate in footer URL array | **Duplicated:** appears once as the native app embed (`static.klaviyo.com/onsite/js/eY5eyy/klaviyo.js`) and again in the footer-app-block URL array. The second copy is a redundant `<script>` insertion. |
| 15 | Redo Returns | App embed `redo-free-return-automation` + URL in `snippets/footer-app-block.liquid:6` | `type="lazyload_int"` app embed + footer array | Real Redo: `shopify-extension.getredo.com/main.js?widget_id=1b7rcooibm5vb8k`. **Coexists with the placeholder code in `theme.liquid:317`**, which is dead. |
| 16 | Intelligems A/B testing | App embed `intelligems-a-b-testing` (`config/settings_data.json:152`) | Native app embed (lazy-int) | 107 KB bundle. Shows up in Lighthouse with `Priority: High` because preload tag rewrites priority. |
| 17 | Microsoft Clarity (app embed copy) | App embed `microsoft-clarity` (`config/settings_data.json:109`) | Native app embed | **Duplicates the inline loader at `theme.liquid:113-119`** — same tag, same site key (`uxbqg45j6a`/`tv8yq2szga`). Need to verify which actually fires; if both, Clarity init runs twice. |
| 18 | Loox app embed | App embed `loox-reviews` (`config/settings_data.json:128`) | Native app embed | Coexists with the inline IntersectionObserver loader at `theme.liquid:248-282` and the URL-array copy in `footer-app-block.liquid`. **Three loading paths for one widget.** |
| 19 | Judge.me reviews | App embed `judge-me-reviews` (`config/settings_data.json:133`) | Native app embed | Loader = 3.5 KB. **Coexists with Loox**, which is also a reviews widget. **Duplicate functionality.** |
| 20 | Shopify Inbox app embed | App embed `inbox/blocks/chat` (`config/settings_data.json:138`) | Native app embed | **Coexists with #11 (inline `app-block.liquid` Inbox loader)**. Two Inbox loaders firing. |
| 21 | xapps Geolocation redirect | App embed `geolocation-redirects-xapps` (`config/settings_data.json:114`) | Native app embed | Calls `xapps-geo-ca956fdeab0c.herokuapp.com/api/shop` (1.5 KB) + `countries-data.js` (15 KB) + `native-geo-redirects.min.js` (6.5 KB) + 3.3 KB stylesheet. Loaded on every page; only useful for cross-region traffic. |
| 22 | AdRoll, Affirm, Logbase, Instafeed, Lucky Orange, Levar, GovX, MyCustomizer, Octane AI, Social Snowball, Refersion, Hextom Event Bar, RIO/PWZ tag | `snippets/footer-app-block.liquid:6` (URL array, async load) | Triggered by WNW after first interaction | **13 third-party scripts** loaded sequentially in a single `for` loop. None visible in Lighthouse (no interaction simulated). Each is its own network connect + script eval. |

---

## 3. Dead, duplicate, or low-value scripts

| Severity | Item | Evidence | Recommendation |
|---|---|---|---|
| **DEAD** | Redo widget placeholder script | `layout/theme.liquid:317` literally loads `https://cdn.redo.do/path/to/redo-widget.js` (placeholder URL). The real Redo loads from `shopify-extension.getredo.com/main.js` in the footer URL array. The placeholder produces a 404 / DNS-fail every time it fires (once per session). | **Delete** the entire IIFE at `theme.liquid:311-333`. |
| **DEAD** | mm-uxrv tracking | Not in either Lighthouse run; line 22 of `theme.liquid` is already commented out; lines 301-305 idle-load the same domain. Domain `mm-uxrv.com` looks like an obscure attribution pixel. | Confirm with marketing it's still needed. If not, remove lines 301-305. |
| **DUPLICATE** | Microsoft Clarity loaded twice | Inline loader at `theme.liquid:113-119` (`uxbqg45j6a` site key) AND the `microsoft-clarity` app embed (`settings_data.json:109`). Lighthouse shows requests to both `clarity.ms/tag/tv8yq2szga` (network) and the script tags include `uxbqg45j6a` from source. **Two different site keys = two Clarity instances writing to different dashboards.** | Pick one. If the app embed is canonical, delete the inline loader. If inline is canonical, disable the app embed in Admin → Apps. |
| **DUPLICATE** | Loox loaded by three paths | (a) app embed in `settings_data.json:128`, (b) inline IntersectionObserver loader at `theme.liquid:248-282`, (c) URL-array entry in `footer-app-block.liquid:6`. | Delete (b) and (c). The app embed (a) is the canonical Shopify-managed path. |
| **DUPLICATE** | Klaviyo loaded twice | App embed at `settings_data.json:104` AND URL in `footer-app-block.liquid:6`. | Delete the URL-array entry. |
| **DUPLICATE** | Shopify Inbox loaded twice | Snippet `app-block.liquid:1` AND app embed at `settings_data.json:138`. | Pick one. App embed is canonical. |
| **DUPLICATE/REDUNDANT** | Reviews widgets | Loox AND Judge.me are both active app embeds. Loox is integrated into theme sections; Judge.me's loader is a 3.5 KB no-op unless a Judge.me block is rendered. | If only Loox is in use, disable the Judge.me app in Admin. |
| **REDUNDANT** | Heatmap.com (in addition to Clarity) | Both are session-replay heatmap tools. Heatmap.com is 43 KB + 6 ms; Clarity is 25 KB + 180 ms. Same job. | Marketing decision — pick one. If keeping both, the staged-theme lazy-int treatment already shifts Heatmap off the critical path. |
| **HIGH-COST** | Shopify Inbox chat widget | 265 KB JS bundle on every page. Inbox UI is only used when a customer clicks the chat bubble. | Load on click instead of on first interaction. Replace the loader with a tiny click-handler that injects `shopifyChatV1Widget.js` when the bubble is clicked. Saves ~265 KB on 99% of sessions. |
| **HIGH-COST** | Intelligems bundle | 107 KB JS for A/B testing on every page. | Confirm there's an active live test. If no test running for >30 days, disable the app. |
| **HIGH-COST** | Footer URL array (13 scripts) | `snippets/footer-app-block.liquid:6` loads 13 scripts on first interaction in a single loop. Several are likely stale (AdRoll, RIO/PWZ, Refersion, GovX, MyCustomizer, Instafeed). | Audit each with marketing. Suspect kills: AdRoll (legacy retargeting), MyCustomizer (product customization — only relevant on specific products), RIO/PWZ (tag manager), GovX (military discount — only on certain CTAs). Each removal saves a network connect + ~5-15 KB. |
| **CONFIG SMELL** | Synthetic mousemove in `footer-app-block.liquid:44-60` | Forces the WNW interaction-gate to fire on every page load by dispatching a fake `mousemove` every 100 ms until `.w3_user` lands. **This effectively neutralises the entire WNW deferred-loading scheme** for users whose browsers fire `DOMContentLoaded` normally. | Either keep the WNW scheme (delete this synthetic dispatcher) or remove the WNW scheme entirely (Batch E in `perf-baseline.md`). Currently both exist and contradict each other. |
| **NO-VALUE** | Bing Ads c.gif sync ping | `c.bing.com/c.gif` is a Clarity → Bing identity sync. 763 bytes. No marketing impact unless using Microsoft Ads. | Leave as-is unless Microsoft Ads is disabled — it rides with Clarity automatically. |

---

## 4. Performance impact summary

**Pre-interaction (what Lighthouse sees on staged):**
- 983 KB across 8 vendors
- 278 ms main-thread time (Clarity alone = 180 ms / 65%)
- Of this, ~70% is from app embeds the merchant chose to install; ~30% is theme-injected

**Post-interaction (real-user, derived from theme source):**
- An additional ~13 scripts from the `footer-app-block.liquid` URL array fire in sequence (rough estimate +200-400 KB).
- mm-uxrv and Facebook Pixel fbevents.js (~80 KB combined)
- GTM container + tags configured in GTM-WF7K2CSD (variable, typically 30-80 KB)
- Real-user third-party budget after interaction is plausibly **1.5-1.8 MB**.

**Single biggest lever:** the Shopify Inbox 265 KB widget JS that's loaded on every page even though chat is rarely opened. **Loading it on first-click of the chat bubble instead of on first-interaction would save ~265 KB per session.**

---

## 5. Ranked recommendations

### P0 — Do now (no functional risk)

1. **Remove the placeholder Redo widget IIFE** (`layout/theme.liquid:311-333`). It loads a 404 every session and the real Redo loads from a separate path in the footer URL array. Pure cleanup, no behaviour change.
2. **Remove the synthetic mousemove dispatcher** (`footer-app-block.liquid:44-60`) or document why it's there. It currently fires on every page and defeats the entire WNW interaction-gate. If WNW is supposed to defer real third-party cost, this defeats the purpose; if it's not, remove WNW entirely (Batch E).
3. **Dedupe Loox**: remove the inline IntersectionObserver loader (`theme.liquid:248-282`) and the URL-array entry in `footer-app-block.liquid:6`. Keep only the app embed.
4. **Dedupe Klaviyo**: remove the URL-array entry in `footer-app-block.liquid:6`. Keep the app embed.
5. **Dedupe Shopify Inbox**: pick one of `app-block.liquid:1` or the app embed in `settings_data.json:138`. Disable the other in Admin.
6. **Dedupe Microsoft Clarity**: confirm with marketing which site key is canonical (`uxbqg45j6a` inline vs `tv8yq2szga` app embed) and disable the other. Currently double-instrumented.

### P1 — Big perf wins (need a small spec)

7. **Defer Shopify Inbox until the chat bubble is clicked.** Replace the 265 KB lazy-int script with a 1 KB click-handler that injects `shopifyChatV1Widget.js` on first click of the chat icon. Saves ~265 KB on 99% of sessions.
8. **Audit the 13-URL array in `footer-app-block.liquid:6`** with marketing. Likely-stale: AdRoll, RIO/PWZ, Refersion, MyCustomizer, Instafeed, GovX, LuckyOrange. Each removal saves a network connection + parse cost. Estimate 100-300 KB total savings.
9. **Disable Intelligems if no test is running.** 107 KB always-loaded. Should be removed when no live A/B test exists.
10. **Pick one of {Clarity, Heatmap.com}** instead of running both session-replay tools. Saves 25-43 KB + 5-180 ms.
11. **Pick one of {Loox, Judge.me}.** Theme uses Loox; Judge.me loader is dead weight if no Judge.me block is rendered.

### P2 — Cleanup

12. **Confirm mm-uxrv is still needed.** Not in either Lighthouse network trace; likely a dormant pixel. Delete `theme.liquid:301-305` if confirmed.
13. **Consolidate the WNW vs non-WNW story.** Cart/checkout already bypass WNW; the synthetic mousemove (P0 #2) already bypasses it elsewhere. Either commit to WNW (and remove the bypasses) or remove WNW entirely.
14. **Move Hulk Form Builder loader** out of `app-block.liquid` (loaded on every page) into a snippet that renders only on templates containing a Hulk form.
15. **Move Fordeer Preorder loader** out of `footer-app-block.liquid` (loaded on every page) into product-page templates only.
16. **Add a heatmap.com fix to live.** Live theme has the un-deferred Heatmap loader; staged already fixes it. Promoting staged → live drops 43 KB and 6 ms off live's third-party cost.

### P3 — Leave alone

- jQuery on `/pages/quiz` — already gated by template check, defer, minimal.
- Google Fonts (Loox font CSS) — 1.3 KB; trivial.
- Bing Ads sync ping — 0.7 KB; rides with Clarity.
- xapps Geolocation redirect — provides actual functionality; cost is moderate (~30 KB total).
- Cloudfront Klaviyo image — pulled by Klaviyo's form, not theme code.

---

## 6. Top 3 immediate wins (summary for caller)

1. **Defer Shopify Inbox until chat is clicked** → saves ~265 KB / page (largest single transfer).
2. **Remove duplicate Loox / Klaviyo / Inbox / Clarity loaders** → saves duplicate parse and double-instrumentation noise; also lowers Clarity main-thread time (currently 180 ms staged, 220 ms live).
3. **Delete the placeholder Redo IIFE in `theme.liquid:311-333` and the synthetic mousemove dispatcher in `footer-app-block.liquid:44-60`** → removes a guaranteed 404 per session and stops self-defeating the WNW interaction-gate.
