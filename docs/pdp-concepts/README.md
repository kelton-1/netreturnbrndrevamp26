# PDP Concept Lab

Date: 2026-05-28  
Scope: isolated prototype only. No Shopify theme files were changed.

## Source Analysis

The live published PDP and local theme docs show three patterns worth preserving:

- Main Home/Pro net PDPs use the active `product.cro-002.json` template, not the orphan `product.home-series.json` or `product.pro-series.json` files. The live experience lets shoppers select Home, Pro, Pro 8, Pro 9, Pro 10, Pro XL, Mini, and Junior from one PDP.
- Package PDPs share `product.pro-package.json`, with the same family-selection behavior for Home Package, Pro Package, larger Pro packages, Pro XL Package, and Mini Package.
- Sim bay PDPs use `product.simseries.json`; the live pattern is Sim 8, Sim 10, and Sim 12 selection, followed by add-ons, included components, room/spec guidance, and launch monitor cross-sells.

The revamp direction from the repo docs is premium DTC sports equipment: high contrast, product confidence, technical labels, real product imagery, and fewer generic Shopify-feeling card stacks.

## Concepts

### 01 Fit Finder PDP

Goal: reduce selection anxiety without losing the single-PDP multi-model behavior.

Interaction:

- Switch between Nets, Packages, and Sim Bays.
- Select use case: Garage, Backyard, Studio, Commercial.
- Select the exact model in the same flow.
- Buy panel updates with image, price, dimensions, depth, ideal use, and recommendation copy.

Best for:

- Replacing the current plain swatch-like family picker with a more guided selection surface.
- Shoppers who know their room/use case but do not know which model name maps to that need.

### 02 Studio Configurator

Goal: pull the sim bay and package experience into a more premium visual builder.

Interaction:

- Choose Sim 8, Sim 10, or Sim 12.
- Toggle popular add-ons: Pro Turf, Platinum Turf, launch monitor path, expert room check.
- Visual bay changes scale.
- Total updates in place.

Best for:

- Sim bay PDPs and sim package PDPs.
- Premium room-planning shoppers who need confidence around size, included parts, and next-step add-ons.

### 03 Spec Deck PDP

Goal: make the PDP feel like a confident technical buying deck.

Interaction:

- Select any net model from a vertical product deck.
- Active row in the comparison table updates.
- Proof cards keep conversion claims close to the spec decision.

Best for:

- High-intent shoppers comparing Home versus Pro versus larger Pro models.
- A desktop-first premium PDP where specs and proof should feel sharp instead of buried.

## Prototype File

Open:

`docs/pdp-concepts/index.html`

The prototype uses local assets from `assets/` and sample product data in the HTML. Pricing is concept data for layout and interaction testing only; confirm live prices before using any direction in production.

## Implementation Notes For Later

If one of these concepts is approved, the safest production path is to implement it against the active templates:

- Net PDP: `templates/product.cro-002.json` and `sections/main-product-cro.liquid`
- Package PDPs: `templates/product.pro-package.json`
- Sim bay PDPs: `templates/product.simseries.json`

Do not build against `product.home-series.json`, `product.pro-series.json`, or `product.home-package.json` unless their Shopify Admin template assignments are changed first.
