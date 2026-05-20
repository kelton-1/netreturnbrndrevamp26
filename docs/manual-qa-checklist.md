# Manual QA — Things to verify on the Shopify preview

Date: 2026-05-13
Theme to QA: **`149365096541`** — "[FIX] Cart 400 - variant id disabled - 2026-05-12" (unpublished, not customer-facing)

## How to preview

Two reliable paths:

**Path A (recommended) — Shopify Admin editor preview:**
1. Open https://the-net-return.myshopify.com/admin/themes/149365096541/editor
2. The right pane is the live preview. Use the page picker at the top to jump between Home / Product / Cart / etc.
3. Toggle mobile vs desktop with the device icons in the header.

**Path B — Browse the storefront with the theme active:**
1. Click "Actions → Preview" on the theme in Shopify Admin → Themes.
2. Shopify gives you a preview link tied to your admin session. The custom-domain redirect strips `?preview_theme_id`, but the cookie set by the preview link persists, so subsequent navigation on `www.thenetreturn.com` will render this theme until you close the tab.

**Comparison setup:** Open a private/incognito window for the **live** theme (just go to `www.thenetreturn.com`), and a regular window for the preview. Side-by-side is the fastest way to see what changed.

---

## What we shipped (in order)

Two batches landed on source theme `149365096541`:

### Batch A — Performance / hygiene (5 fixes)
1. **A1** — Removed the invisible `<div id="fv-loading-icon">Γ</div>` from `<head>` (was an LCP-gaming hack)
2. **A2** — Fixed slideshow: only the first slide is now `fetchpriority="high"`; slides 3+ are `loading="lazy"` again
3. **A3** — Removed a dead `<link rel="preload">` for a section setting that wasn't in scope (never fired)
4. **A4** — Microsoft Clarity + Heatmap.com scripts now ride the same deferred-loading scheme as theme JS
5. **A5** — Documented the `.mainopt` font-strip finding for follow-up (no code change)

### Batch B — Visual / conversion (4 fixes)
6. **H-06** — Loox reviews carousel **moved from end of home page to position 3** (right after trust bar)
7. **P-01** — On product pages: one of two duplicate Loox dynamic sections **disabled**; remaining one switched from sample/demo mode to real reviews
8. **CT-01** — Cart's "You are eligible for free shipping!" banner **turned off** (was redundant against the announcement bar and shipping methods note)
9. **CT-03** — Cart recommendations changed from "related products" (similar nets) to "complementary products" (accessories/add-ons), count reduced from 10 → 4, title changed from **"You may also like"** to **"Complete your setup"**

---

## QA checklist — go in this order

### ⓵ Home page — `/`

**Open the home page on both preview and live, scroll through both.**

- [ ] **(H-06) Reviews carousel position.** On the preview, the Loox reviews carousel should appear **near the top** of the page — right after the dark trust bar with the three green pills (Free Shipping / 3-Yr Warranty / 30-Day MBG), and **before** the Best Sellers carousel. On live it's at the bottom, just above the footer.
  - ✅ Pass: Reviews show up early; you see star ratings + review text before scrolling much.
  - ❌ Flag: Reviews still at the bottom, OR they don't render at all, OR they render in a broken-looking spot.

- [ ] **(A1) No visible LCP-gaming glitch.** The page should paint normally; no flash of a giant Γ character anywhere. (On most real devices you wouldn't have seen this before either — the hack was invisible by design — but worth a sanity check.)

- [ ] **(A2) Hero slideshow loads cleanly.** Click through the two active slides ("Trusted by the Champion" → "The #1 Net in Golf"). First image should appear immediately; subsequent images should load when navigated to.

- [ ] Look at the slideshow on mobile. Cropping / image positioning OK?

- [ ] **Audit-flagged item to eyeball (not yet fixed):** the four icon + label pairs in the "value props" section. Do the icons match their labels? (Specifically: "Easy to Assemble" should be a tool/wrench icon, not a shield; "Premium Design" should not be a warranty icon.)

### ⓶ Product page — `/products/pro-series-golf-net` (or any product)

- [ ] **(P-01) Loox reviews on product pages.** Scroll past the description. Do you see real customer reviews — names, dates, star ratings, photo thumbnails, actual review text? Or do you see Loox demo / placeholder data (sample names, fake reviews)?
  - ✅ Pass: Real reviews from real customers, ideally with photos.
  - ❌ Flag: Sample/demo reviews, or no reviews at all. (If no reviews: check Shopify Admin → Apps → Loox to confirm the integration is configured and reviews have been imported.)

- [ ] **(P-01) Loox section count.** Below the product description / "You may also like", count the Loox sections. Should be **at most 2** (a card carousel + one full reviews feed). On live there are three (the third was a duplicate).

- [ ] **(P-07) Buy buttons visible.** "Add to cart" and "Buy it now" buttons should be visible with normal brand colors. (We confirmed in code that the `rgba(0,0,0,0)` setting means "use theme default" — buttons should look like buttons.)

- [ ] **Verify variant pickers (P-06).** Look at the size / variant selector. Are there **two pickers** doing the same thing, or one custom picker for net size and one Shopify picker for color/option? If it's two redundant pickers, flag — we'd want to drop one.

- [ ] **Audit-flagged (not yet fixed):** the rating in the hero. Is there a Loox rating with stars near the product title? If not, Loox may be silent there too.

### ⓷ Cart page / drawer

**Add the same product to cart on both preview and live.**

- [ ] **(CT-01) No "Yay, free shipping!" bar.** On preview, you should NOT see a green progress bar that says "You are eligible for free shipping!" On live you will see one (always at 100% — that's the bug we fixed).

- [ ] **(CT-03) Recommendations under the cart.** Below the cart items, the section title should be **"Complete your setup"** (was "You may also like"). The 4 products shown should be **complementary** (side barriers, turf, projector, accessories) — NOT competing nets.
  - ✅ Pass: Title is "Complete your setup", recommendations are accessories.
  - ❌ Flag: Old title, or recommendations are still showing similar nets.
  - ⚠️ Note: complementary recommendations require Shopify Admin → Search & Discovery → Product Recommendations to have complementary rules set up. If the recommendations are blank or fall back to popular products, that's a sign rules aren't configured yet (separate Admin task — flag back and we'll set them up).

- [ ] Confirm the other free-shipping messaging is consistent: the announcement bar still says "FREE Shipping on ALL Products - LIMITED TIME". The shipping methods box still says "Free Standard UPS Shipping for all the orders." Are both accurate? (Specifically: is the "LIMITED TIME" line in the announcement bar still true, or is it stale and should be reworded?)

### ⓸ `/collections/nets` — note this is NOT a shoppable grid

- [ ] **(C-01) Confirm intent.** Visit `/collections/nets` on the preview. You'll see featured tiles for Pro Series + Home Series, then gallery / video / FAQ — but **no product grid**. Is this intentional?
  - If yes: confirmed, no action.
  - If no (this should be a shoppable grid): flag — we'd re-enable the disabled `main-collection` section.

### ⓹ Build Your Setup — `/pages/build-your-setup`

- [ ] **(B-02) Hero CTA absent.** Confirm the page hero shows "Build Your Setup / Perfect your practice, improve your game" with **no visible CTA button**. This is unchanged in this batch; flagged for a future fix.

### ⓺ Compare — `/pages/compare`

- [ ] **(CM-01) Currently two stacked grids.** Unchanged; flagged for rebuild later.

---

## What to do with findings

After running through this checklist, tell me:

1. ✅ Things that look good and can stay shipped
2. ❌ Things that look broken or wrong on the preview — I'll fix or revert
3. ⚠️ Things that are unclear / unexpected — we'll discuss

The full audit document with all 40 findings is at [docs/visual-audit.md](visual-audit.md). The performance audit context is at [docs/perf-baseline.md](perf-baseline.md). Both will inform the next batch once you've reviewed the preview.

---

## State of things (one-page summary)

**What's on what theme right now:**

| Theme | Role | What's on it |
|---|---|---|
| Live (whatever's published) | Live | Original — none of our changes |
| `149365096541` "[FIX] Cart 400…" | Unpublished (source) | **All of Batch A + Batch B** |
| `149375975517` "Development (1ede08…)" | Dev (throwaway) | Earlier Batch A push, before B; will get auto-cleaned by Shopify after 7 days idle |

**Open strategic decisions** (no code yet — need your call):
- Hero subheading copy for cold traffic (H-04)
- Best Sellers collection — keep `best-sellers-bfcm` or swap (H-05)
- Configurator vs quiz — which owns "find your setup"? (H-08 + B-01)
- `/collections/nets` — marketing landing or restore product grid? (C-01)
- Compare page rebuild as a real comparison table (CM-01)

**Open implementation work** (waiting on a decision or design):
- Trust block in product hero (P-04)
- Additional product page tabs: Specs / Shipping / FAQ (P-02)
- Complementary products on product page (P-03 — needs Shopify Admin → Search & Discovery rule setup)
- Image / video asset audit for hero + sections (the original "imagery revamp" goal)

**Next-session entry points:**
1. Review this checklist's outcomes, decide what to revert / extend
2. Make calls on the strategic items
3. Move into copy revamps (drafting hero subheading variants, CTA copy options) or imagery work
