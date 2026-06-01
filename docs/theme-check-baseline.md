# Theme Check Baseline

Date: 2026-05-13

## Scope

Theme Check was run locally against the pulled inactive Shopify theme:

- Theme: `[FIX] Cart 400 - variant id disabled - 2026-05-12`
- Theme ID: `149365096541`
- Store: `the-net-return`

No source theme push, publish, or Shopify library mutation was performed.

## Baseline Before Fixes

```text
341 files inspected with 180 total offenses found across 97 files.
16 errors.
164 warnings.
```

## Current Result After First Local Fix Batch

```text
341 files inspected with 161 total offenses found across 88 files.
1 errors.
160 warnings.
```

Fixed locally:

- `blocks/ai_gen_block_ecefba7.liquid`: replaced invalid `limit` filter usage with a valid `for` loop limit.
- `sections/academy-expanding-cards.liquid`: replaced parser-blocking `script_tag` output with a deferred script tag.
- `snippets/trust-badges.liquid`: added explicit `width` and `height` attributes to the three static badge images.
- `sections/net-brand-usp.liquid`: added image dimensions and replaced deprecated image URL output.
- `sections/main-gift-card.liquid`: added default gift card image dimensions and replaced deprecated image URL output.
- `snippets/css-variables.liquid`: updated font preloads to `preload_tag` and referenced existing `.svg.liquid` assets.
- `sections/vm-feature.liquid` and `sections/vm-holiday.liquid`: reduced `max_blocks` from `60` to Shopify's maximum of `50`.
- `sections/cro-collection-grid.liquid`: removed unsupported schema `templates` property.
- `sections/header.liquid`: fixed malformed cart link `aria-expanded` output and modernized logo image URLs.
- `sections/testimonials.liquid`: fixed malformed dot navigation attribute and replaced deprecated `include` icon calls.

## Remaining Errors

### Must Fix

- No must-fix Theme Check errors remain after the first local fix pass.

### Needs Product Or Design Review

- `layout/theme.liquid`: `ContentForHeaderModification` near line 103. This may be intentional app or SEO behavior and should be reviewed separately before changing.

### Defer

- Warnings for deprecated filters, remote assets, orphaned snippets, unused assigns, deprecated includes, deprecated fonts, and locale HTML should be handled in smaller follow-up batches after the errors are reduced.

## 2026-06-01 Product Recommendations Follow-Up

```text
417 files inspected with 160 total offenses found across 88 files.
1 errors.
159 warnings.
```

Delta from the prior 417-file brand-revamp baseline: two deprecated `include` warnings were removed from `sections/product-recommendations.liquid` by replacing the carousel arrow icon calls with `render`. The one remaining error is still the pre-existing `ContentForHeaderModification` in `layout/theme.liquid`.
