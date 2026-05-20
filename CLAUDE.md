# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Active workstream — Brand Revamp 2026

**Branch**: `brand-revamp-2026` (off `main`). **Progress log**: [docs/brand-revamp-2026.md](docs/brand-revamp-2026.md). This is the live workstream — a full visual redesign driven by the 2026 brand guide and agency mockups. Future sessions landing on this branch should read the progress log first, then check `TaskList` for the current pending tasks before starting work.

**Naming conventions for files in this stream** — keep them prefixed and predictable so the brand-revamp surface is easy to identify and roll back if needed:

- Sections: `sections/brand-*.liquid` (e.g. `brand-marquee.liquid`, `brand-footer-cta.liquid`).
- CSS: one `assets/brand-revamp.css.liquid`, eagerly loaded in `layout/theme.liquid`. Brand-prefixed classes only (`.brand-*`, plus targeted overrides to Focal's existing `.header__*`, `.footer__*`, etc.). No global element-selector overrides.
- Images: `assets/nr-*.png` (logos), `assets/precision-*.svg` (Precision+ mark variants), `assets/pattern-*.svg` (grid/gradient patterns).
- Brand palette and asset URLs are CSS custom properties at the top of `brand-revamp.css.liquid` (`--brand-emerald`, `--brand-shadow`, `--brand-plus-glyph`, etc.). Add new tokens there; don't sprinkle hex literals through sections.

**Sources of truth**:

- 2026 brand guide PDF: `/Users/kelton1/Downloads/NETRETURN_BrandGuidelines_2026.pdf` (38 pages — palette p.18, ratios p.19, combos p.20, typography p.21, gradients p.26, logo suite p.17).
- Updated brand toolkit: `../TheNetReturn | Brand Guidelines & Logos/UPDATED Net Return Toolkit (/` — fonts (Crystal + Miracle Mono, both trial), patterns, Precision+ mark, photography selects (31 PNGs), gradients. The `LOGOS/` subfolder is empty pending agency delivery; meanwhile the local `Logos/NR Full {White,Black}.png` files are staged in `assets/` as `nr-wordmark-*.png`.
- Agency mockups: shared via chat by the user; key reference points are full-bleed dark hero, Glow Green marquee bar, condensed Crystal headlines, Precision+ glyph on category nav, Shadow Green footer with "BOOK A CALL NOW" CTA.

## What this is

Local working copy of TheNetReturn's Shopify theme, pulled from the unpublished source theme `149365096541` (`[FIX] Cart 400 - variant id disabled - 2026-05-12`) on store `the-net-return`. The theme is a customized fork of **Focal** (Maestrooo) — see the boilerplate developer note in `layout/theme.liquid` and the dependency on `custom.js` event hooks.

There is **no build step**. Liquid + vanilla JS + CSS are pushed as-is. No bundler, no TypeScript, no transpilation.

## Critical safety rules

**Read this before running any Shopify CLI command:**

- The source theme `149365096541` is a real merchant theme on a real store. Any `theme push`, `theme publish`, `theme delete`, or `theme rename` against it is a production mutation.
- **Never** run `shopify theme push`, `shopify theme publish`, `shopify theme delete`, or any mutating CLI command without an explicit, in-session user instruction naming the action. A prior session's permission does not carry over.
- `theme:pull` is safe but will **overwrite local files** with what's on Shopify. Confirm working tree is clean (or stashed/committed) before pulling, and the script uses `--nodelete` so local-only files survive.
- `theme:dev` syncs to a *separate* development theme (last seen current as `149375975517`; older dev theme `149375320157` may also exist), not the source theme. It is the preferred QA lane. Always stop it before ending a session.
- Don't run any command with `--live` or that targets the published theme.

## Commands

All commands run from `Shopify/`. Node lives at `/Users/kelton1/.local/bin/` — prepend it to `PATH` if `npm` isn't found:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:list   # list themes on the-net-return
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:pull   # pull 149365096541 (--nodelete)
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:dev    # dev preview on a development theme
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check  # Theme Check linter
```

Theme Check is the only linter. There is no test suite — verification is preview-based (browser QA against `theme:dev` or `?preview_theme_id=149365096541`).

## Architecture: how this theme is wired

### Entry point and routing

`layout/theme.liquid` is the single layout. It conditionally renders one of several `*-css` snippets based on `template` (`index-css`, `collection-css`, `list-collection-css`, `product-css`) to keep per-page CSS payloads smaller — this is theme-specific, not standard Focal. When adding template-specific CSS, follow this pattern; don't dump everything into `theme.css`.

`{% render 'wnw_header' %}` and the `wnw_footer` snippet are a custom header/footer injection point (likely a third-party app integration — the `wnw_` prefix is consistent). Treat changes there carefully.

### Section/template proliferation

This theme has scope: **~105 sections, ~130 templates, ~50 snippets**. A few patterns to know:

- **Variants of "main" sections per product line**: `main-product.liquid`, `main-product-azalea.liquid`, `main-product-cro.liquid` (plus matching `product-form-*`, `product-info-*`, `product-media-*` snippets). The product page selected depends on the JSON template. When fixing product-page bugs, find the template first (e.g. `templates/product.azalea.json`), then trace to its sections — fixes to `main-product.liquid` may not apply to azalea or cro variants.
- **`academy-*` sections** (~13 files): a dedicated landing experience with its own CSS/JS (`assets/academy-landing.css`, `assets/academy-landing.js`).
- **`cro-*` sections**: conversion-rate-optimization landing pages with their own product form (`product-form-cro.liquid`).
- **`vm-*` sections**: feature/holiday merchandising blocks.
- **`ai_gen_block_*` in `blocks/`**: app-generated theme blocks (Shopify Magic / generative editor). Don't rename these — Shopify Admin references them by handle.

### Cart / variant subsystem (active concern)

The source theme name (`[FIX] Cart 400 - variant id disabled - 2026-05-12`) signals an in-flight cart fix. Relevant files:

- `sections/main-cart.liquid`, `sections/cart-recommendations.liquid`
- `snippets/product-form.liquid`, `snippets/product-form-azalea.liquid`, `snippets/product-form-cro.liquid`
- `snippets/product-info.liquid`, `snippets/product-sticky-form.liquid`
- `assets/custom.js`, `assets/theme.js` — Focal's behavior layer; custom event hooks documented inline in `custom.js`

If you touch any add-to-cart or variant selection logic, verify across **all three** product-form variants (default / azalea / cro), not just the one you opened.

### B2B context

`templates/index.context.b2b.json`, `sections/header-group.context.b2b.json`, etc. — `.context.b2b.json` is Shopify's market-/customer-context override mechanism. Changes to a base template may need a parallel change to its `.context.b2b.json` counterpart, or the B2B audience won't see it.

### Locales

13 locales in `locales/`. `en.default.json` is the source of truth. `nb.json` (Norwegian) currently has invalid translated HTML strings flagged by Theme Check — known issue, not to be hand-edited without translation review.

## Theme Check baseline

`theme:check` currently exits non-zero — this is **expected and tracked**. Current state (per `docs/theme-check-baseline.md`):

- After the first fix pass: **161 offenses, 1 error, 160 warnings** (down from 180 / 16 errors).
- The remaining error is `ContentForHeaderModification` in `layout/theme.liquid` (~line 103) — flagged for product/design review, not a casual fix.

When making changes, re-run `theme:check` and ensure your edits don't *add* new offenses. Don't try to drive the count to zero in one pass — many warnings are deprecated-filter or remote-asset noise that needs batched review.

## Configuration and skills

- `.agents/skills/` contains 19 Shopify AI Toolkit skills (`shopify-liquid`, `shopify-storefront-graphql`, `shopify-use-shopify-cli`, etc.). These were installed for the prior Codex session. Claude Code does not auto-load them, but the markdown inside them is useful reference if you're stuck on a Liquid filter, schema field, or Storefront GraphQL query.
- `.shopifyignore` keeps `.git`, `.agents`, `node_modules`, `docs/`, `README.md`, and `package.json` from being uploaded to Shopify by `theme push/dev`. Don't add theme-rendered files (sections/snippets/templates/assets) to it.
- `shopify-cli-home/` is a leftover sandbox workaround folder — ignored by both git and Shopify, safe to ignore or delete.

## Project context docs

These docs were written by the prior Codex session and remain accurate for theme state, with the path caveat noted in the parent `CLAUDE.md`:

- `README.md` — high-level setup summary
- `docs/setup-status.md` — what was installed and how
- `docs/sprint-plan-2026-05-13.md` — the original five-workstream plan (Baseline, Theme Check Triage, Storefront QA, Cart Investigation, Workflow Hardening)
- `docs/theme-check-baseline.md` — Theme Check progress log; update this when reducing the count
- `docs/qa-notes.md` — preview QA log; update when running storefront flow checks

When you complete meaningful work, append to the relevant doc rather than creating new ones — the prior session set up this convention.

## Brand revamp coordination notes

The active revamp branch is `brand-revamp-2026`. Opus's latest footer pass is commit `a0e25b5 feat(brand): footer rebuild + Book a Call CTA panel`; the follow-up audit cleanup is documented in `docs/brand-revamp-2026.md`.

Keep this distinction clear:

- Opt-in brand utilities in `assets/brand-revamp.css.liquid` can remain global when they are `.brand-*` classes applied by new sections.
- Overrides for Focal's existing components should be scoped to the redesigned surface. For example, mobile-menu drawer styling should target `#mobile-menu-drawer`, not every `.drawer`, because product help, size chart, store availability, cart/search, and collection filter drawers all share Focal's drawer classes.
- Do not add convenience push scripts that target source theme `149365096541`. Source-theme pushes should be typed deliberately only after explicit in-session approval.
