# Cart variant investigation

Date: 2026-06-01

## Scope

This pass closed the open sprint-plan item for cart 400 / variant handling with a static inspection of the current brand-revamp checkout. No Shopify source theme push, publish, pull, or Admin mutation was performed.

Files reviewed:

- `snippets/product-form.liquid`
- `snippets/product-form-cro.liquid`
- `snippets/product-form-azalea.liquid`
- `snippets/product-info.liquid`
- `assets/theme.js`
- `assets/custom.js`
- `sections/brand-best-sellers.liquid`
- `sections/brand-mini-builder.liquid`

## Current add-to-cart path

Standard PDPs submit through Focal's custom `product-form` element in `assets/theme.js`. The Liquid snippets render a hidden `name="id"` input seeded from `product.selected_or_first_available_variant.id`, while the variant picker emits option inputs and `variant:changed` events. `product-payment-container` listens for those variant changes and disables the Add to Cart button when the selected variant is unavailable.

Before posting, the JS builds `FormData` from the product form, appends the mini-cart section request, and removes `option1`, `option2`, and `option3` so Shopify receives the resolved variant `id`, quantity, and line-item properties instead of raw option values. On success it refreshes cart state and dispatches the cart notification event.

Brand quick-add surfaces are separate:

- `sections/brand-best-sellers.liquid` uses `product.selected_or_first_available_variant` and disables the button when `product.available` is false.
- `sections/brand-mini-builder.liquid` builds an `items` array from checked `data-bb-variant-id` values and filters out empty ids before posting to `/cart/add.js`.

## Finding fixed

The PDP product-form success handler referenced the optional upgrade-product global `upgradePropertyLabel` before checking whether the upgrade block exists. On products without that block, Shopify could accept the add-to-cart request while the local success path failed before cart refresh and notification dispatch.

Fixed in `assets/theme.js` by guarding the optional upgrade lookup with:

```js
typeof upgradePropertyLabel !== "undefined"
```

and by checking that `variant.properties` exists before reading the property.

## Remaining risks

- The upgrade add-on script in `assets/custom.js` is still legacy global-script code. It is wrapped in `try/catch`, so it should not block normal add-to-cart, but a future cleanup should move the upgrade settings into data attributes or a namespaced `window` object.
- Runtime QA verified the canonical CRO product add-to-cart path only. A future storefront pass should still verify: default product add-to-cart, Azalea product add-to-cart, disabled/unavailable variant behavior, and mini-cart refresh on mobile.
- The source theme name suggests a prior disabled-variant cart 400 fix. I did not find a speculative rewrite target; the safer next step is runtime QA against representative products rather than changing variant resolution logic blindly.
- The first runtime pass found the redundant "You are eligible for free shipping!" mini-cart bar had returned. The theme config has been reset to keep the free-shipping threshold bar disabled, and a follow-up preview confirmed the rendered page had zero `free-shipping-bar` elements after add-to-cart.

## Runtime QA checkpoint

Date: 2026-06-01

Preview lane:

- Local preview: `http://127.0.0.1:9292`
- Development theme: `149375975517`
- Product tested: `/products/pro-series-golf-net`
- Variant id submitted: `40942150713437`

Before QA, `theme:dev` reported two upload blockers from pre-existing local work:

- `sections/brand-breadcrumb.liquid`: missing opening `{% comment %}` for the second documentation block.
- `templates/product.accessories-no-material.json`: referenced missing section type `related-products`, then invalid `main-product` block types.

Those blockers were fixed so the development preview could render.

Normal add-to-cart result:

```text
POST /cart/add.js -> 200
GET /cart.js -> 200
Header cart count -> 1
Cart notification -> "Item added to your cart!"
Mini-cart opened with Pro line item at $795.00
```

CT-01 cart messaging follow-up:

```text
cart_show_free_shipping_threshold -> false
Add-to-cart itemCount -> 1
free-shipping-bar elements -> 0
"You are eligible for free shipping!" page text -> absent
Browser cart cleanup -> /cart/clear.js
```

Automation notes:

- The in-app browser could render the page but timed out on screenshot/click operations and exposed inconsistent page-global runtime state. Terminal Playwright was used as fallback.
- Two Klaviyo popup dialogs blocked the Add to Cart button until dismissed. After closing both dialogs, the product form submitted successfully.
- Screenshot artifact: `/tmp/thenetreturn-cart-success-2026-06-01.png`
- The browser cart was cleared after the smoke test with `POST /cart/clear.js -> 200`.

## Validation

Added `scripts/validate-cart-variant-path.mjs` to keep this path checkable in future sessions.

Run:

```bash
node scripts/validate-cart-variant-path.mjs
```

Expected result:

```text
PASS: 16 cart variant path checks passed
```
