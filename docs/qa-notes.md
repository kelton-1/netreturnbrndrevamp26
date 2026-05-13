# QA Notes

Date: 2026-05-13

## Preview Target

Canonical inactive theme for this sprint:

- Theme: `[FIX] Cart 400 - variant id disabled - 2026-05-12`
- Theme ID: `149365096541`
- Admin editor: `https://admin.shopify.com/store/the-net-return/themes/149365096541/editor`
- Native preview pattern: `https://the-net-return.myshopify.com/<path>?preview_theme_id=149365096541`

Important boundary:

- The live theme is not the sprint target.
- No `theme push`, `theme publish`, or source-theme mutation command has been run.
- `theme:dev` may create a separate development theme and should only be used as a local sync health check unless explicitly chosen for QA.

## Initial Preview Checks

These checks were used to identify representative storefront paths before local theme fixes were uploaded anywhere:

- Home: `/`
- Collection: `/collections/nets-1`
- Product: `/products/pro-series-golf-net`
- Cart: `/cart`
- Search: `/search?q=net`

## Current Status

- Native inactive-theme product preview opened successfully for `/products/pro-series-golf-net?preview_theme_id=149365096541`.
- Add-to-cart QA was not completed after the preview target was corrected back to inactive theme `149365096541`.
- Full flow QA should be rerun after local fixes are either tested through a chosen preview lane or uploaded to inactive theme `149365096541` with explicit approval.
