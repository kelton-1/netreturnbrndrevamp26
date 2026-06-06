# Section Store + Claude Code PDP workflow

Date: 2026-06-06
Status: research + playbook. No theme files changed by this doc.

## Why this exists

The viral clip that prompted this (`section.store.shopify` on Instagram — *"Claude Code x Shopify creates insane, done-for-you product pages"*) shows a "Runner Hydration" PDP with a star-rating header, feature checklist, a three-up **Choose Your Quantity** selector with "Save 17% / Save 38%" badges, a delivery-by-date line, a single big CTA, trust microcopy, and an **Expert Review / Description / Delivery Info** tab block with a verified-expert card.

That is exactly the kind of layout Section Store sells — and the account is Section Store's own marketing showing that an AI agent can now *build* pages like theirs. So there are **two separate things** in that video, and they're easy to conflate:

1. **Section Store** — a Shopify app + marketplace of pre-built theme sections you buy once ($9 each) and drop in via the theme editor. We already have it on the-net-return store but haven't used it like this.
2. **The Claude Code workflow** — using an AI agent against the theme code to assemble / customize / recreate high-converting PDP sections, from a screenshot or a Section Store section as the starting point.

The high-leverage move for Net Return is **combining them**: use Section Store sections as a fast, owned, native-Liquid starting point, and use Claude Code to brand them, wire them to our real product data/metafields, and fit them into our existing PDP architecture. This doc documents how.

---

## Part 1 — What Section Store actually is

- **App, not a page builder.** Free to install; you pay per section. Individual sections are a **one-time $9 purchase**, owned forever, installable on any theme within the same store. There's an optional ~$10/mo *Plus* tier (Conversion Blocks, volume bundles, upsells, add-ons, AI agents).
- **Native Liquid, no runtime dependency.** Installing a section writes a real `.liquid` file straight into the theme's `sections/` folder. No external scripts, no app-embed JS on the page. **The section keeps working even if you uninstall the app** — it's just theme code at that point.
- **How it lands in our theme.** From the app's *My Sections* → Install → pick the theme. In the **theme editor** the section shows up in *Add section* prefixed with **`SS`** (e.g. `SS - Featured Collection #15`), so Section Store sections are easy to spot in both the editor and in `sections/`.
- **Customized in the theme editor** like any native section — collection/product pickers, columns, colors, spacing, headings, CTAs — *or* in code, since it's plain Liquid.
- **Library:** 700+ sections across heroes, comparison tables, testimonials, FAQs, bundles, tabs, trust bars, etc. The "Runner Hydration" look is a composite of several of these (variant/quantity selector with savings badges, trust bar, tabbed content, review card).

### What this means for us specifically
- A Section Store install will appear as `sections/ss-*.liquid` (or similar `SS`-prefixed handle). That is **outside** our brand-revamp naming convention (`sections/brand-*.liquid`) and outside the existing `cro-*` / `main-product*` family. Treat a freshly installed `SS` section as *vendor scaffold to adapt*, not as a finished Net Return section.
- Because it's owned native Liquid, there's no licensing reason we can't fork an `SS` section into a properly named Net Return section and delete the original. (Keep the purchase record; re-installing is free within the store.)

---

## Part 2 — How our PDPs are wired (so a section actually fits)

Read [CLAUDE.md](../CLAUDE.md) "Architecture" and [docs/pdp-concepts/README.md](pdp-concepts/README.md) first. The short version that governs where a Section Store section can go:

- **Three product-page families**, selected by JSON template, each with its own section + form snippet:
  - Default: `sections/main-product.liquid` + `snippets/product-form.liquid`
  - Azalea: `sections/main-product-azalea.liquid` + `snippets/product-form-azalea.liquid`
  - **CRO: `sections/main-product-cro.liquid` + `snippets/product-form-cro.liquid`** ← the conversion-tuned one, and the closest match to the video's intent.
- The **active net PDP template is `templates/product.cro-002.json`**, rendered by `main-product-cro.liquid`. Packages use `product.pro-package.json`; sim bays use `product.simseries.json`. Do **not** build against the orphan `product.home-series.json` / `product.pro-series.json` / `product.home-package.json` files unless Admin template assignments change first (see pdp-concepts README).
- `main-product-cro.liquid` is **already block-based and already has CRO blocks** that mirror the video's components:
  - `variant_picker`, `quantity_selector`, `buy_buttons`, `product_variations` (metafield-driven model picker), plus custom blocks `cro_trust_cards`, `cro_availability`, `cro_payment_icons`, `cro_bryson_quote`, and a `liquid` custom-block escape hatch.
  - So a lot of the "Runner Hydration" surface (trust bar, availability/delivery line, endorsement/review card, payment icons) **already exists as the same kind of block** — the gap is mostly the *three-up quantity/savings selector* and the *tabbed content* block.

**Implication:** the cleanest path is usually **add a new block type to `main-product-cro.liquid`**, not dropping a standalone `SS` section into the middle of the product template. Standalone sections are fine for content *below* the buy box; the buy-box internals should stay as blocks of the main product section so variant/quantity/cart logic stays consistent.

### Hard constraints to respect
- **No build step.** Liquid + vanilla JS + CSS, pushed as-is. Don't introduce a bundler/framework.
- **Cart subsystem is an active concern.** Any add-to-cart, variant, or quantity change must be verified across **all three** product-form variants (default / azalea / cro), per CLAUDE.md and [docs/cart-variant-investigation.md](cart-variant-investigation.md).
- **Brand revamp is live** on `brand-revamp-2026`. New visual work should use brand tokens from `assets/brand-revamp.css.liquid` (`--brand-emerald`, etc.) and scope overrides — don't ship a section with hard-coded hexes or global element selectors.
- **Theme Check baseline** is tracked (~161 offenses). Re-run `theme:check`; don't *add* offenses. ([docs/theme-check-baseline.md](theme-check-baseline.md))

---

## Part 3 — Safety / governance (read before any CLI)

These mirror CLAUDE.md "Critical safety rules" and are non-negotiable:

- The source theme `149365096541` is a **real merchant theme on a real store**. **Never** `theme push` / `publish` / `delete` / `rename` against it without an explicit, in-session instruction naming the action. Prior-session permission does not carry over.
- **Installing a Section Store section from the app writes to a theme on the live store.** Install into a **development/duplicate theme**, not the source theme — same principle as `theme:dev` (last seen dev theme `149375975517`). Inspect/QA there, then bring the Liquid into git deliberately.
- `theme:pull` overwrites local files — commit/stash first; the script uses `--nodelete` so local-only files survive.
- QA is preview-based: `theme:dev` or `?preview_theme_id=…`. There is no test suite.
- Don't add convenience push scripts targeting `149365096541`.

---

## Part 4 — The two integration paths

### Path A — Buy a Section Store section, then adapt with Claude Code
Best when a Section Store section is ~80% of what you want (e.g. a polished tabbed-content or comparison block).

1. **Buy + install into a dev/duplicate theme** (never the source theme). Confirm it renders.
2. **Pull the Liquid into the repo.** Either `theme:pull` (after committing) or copy the `sections/ss-*.liquid` file the install created.
3. **Fork + rename** to our convention: `sections/brand-*.liquid` for revamp-stream work, or a `cro-*` name if it belongs to the conversion PDP family. Delete/ignore the raw `SS` file once forked.
4. **Have Claude Code re-skin and re-wire it:** swap hard-coded copy/colors for brand tokens and schema settings; bind images/price/reviews to real `product` / metafield data instead of hard-coded sample values; align class names to `.brand-*`; remove any inline styles that fight the brand CSS.
5. If it's buy-box logic, **convert it into a block** of `main-product-cro.liquid` rather than a standalone section.
6. `theme:check`, then QA on `theme:dev` across mobile + all three product-form families if cart logic is touched.

### Path B — Recreate from a screenshot with Claude Code (no purchase)
Best when you just want the *layout idea* (like the video) and want it fully on-brand and owned from line one. This is literally what the clip demonstrates.

1. **Give Claude Code the reference** — a screenshot (drag it into the session) or a description of the target, plus the brand guide tokens.
2. **Point it at the right base file:** "Read `sections/main-product-cro.liquid` and its schema. Add a new block type `cro_quantity_savings` that renders a three-up quantity selector (Single / 6-pack / 12-pack) with per-tier savings badges, bound to variants, updating the buy button price." (Adapt the example to the real Net Return product.)
3. **Iterate in code**, leaning on the Shopify AI Toolkit MCP (see Part 5) so filter names and schema fields are validated, not guessed.
4. Same finish line: brand tokens, schema-driven copy, `theme:check`, `theme:dev` QA, cart verification across all three forms.

**Rule of thumb:** Path A for finished *content* sections below the buy box; Path B (blocks on `main-product-cro.liquid`) for anything that touches variant/quantity/price/cart.

---

## Part 5 — Tooling: the Shopify AI Toolkit (MCP)

The "Claude Code x Shopify" half of the workflow is much stronger with the **Shopify AI Toolkit** — a free, open-source MCP server that exposes Shopify's dev docs, GraphQL Admin/Storefront schemas, Liquid reference, and CLI operations to the agent, with Liquid/schema validation and LiquidDoc enforcement. It stops the agent guessing at filter names and setting types.

- This session already has a Shopify MCP server connected (store management + `graphql_query`/`graphql_mutation` + docs search) — useful for reading real product/metafield data so a recreated section binds to live values instead of placeholders.
- The `.agents/skills/` folder holds 19 Shopify skills (`shopify-liquid`, `shopify-storefront-graphql`, `shopify-use-shopify-cli`, …) installed for the prior session — good reference when stuck on a filter/schema/GraphQL detail.

---

## Part 6 — Worked example: mapping the "Runner Hydration" PDP onto Net Return

Decomposing the video against what we already have:

| Video component | Net Return equivalent | Build path |
|---|---|---|
| Star rating + "921 reviews" header | Loox reviews (`product-rating.liquid`, Loox integration) | Reuse existing rating snippet |
| Pill badges (1000mg Sodium / Watermelon) | Product metafield-driven spec pills | New small block or extend `cro_trust_cards` |
| Checkmark feature list | Bullet/feature block | `liquid` custom block or new `cro_feature_list` block |
| **Choose Your Quantity (3-up + savings %)** | Net/package tier or bundle selector | **New `cro_quantity_savings` block on `main-product-cro.liquid`** (Path B) — the main gap |
| "Receive by Fri, Jun 5" | Delivery estimate | Extend `cro_availability` block |
| Single big CTA | `buy_buttons` block | Already present |
| "Money back / free shipping" microcopy | Trust line | `cro_trust_cards` |
| **Expert Review / Description / Delivery Info tabs** | Tabbed content | Path A (Section Store tabs) *or* new `cro_tabs` block |
| Verified-expert review card | Endorsement card | Extend `cro_bryson_quote` (already an avatar + name + quote block) |

So for Net Return, only **two** net-new pieces are really needed — a **quantity/savings selector** and a **tabbed content** block — both attachable to the existing CRO product section. Everything else is reuse.

---

## Part 7 — Step-by-step checklist (either path)

1. Confirm the target template/section family (almost always `product.cro-002.json` → `main-product-cro.liquid`).
2. Decide Path A (buy + adapt) vs Path B (recreate as a block). Buy-box internals → Path B.
3. If Path A: install into a **dev/duplicate** theme, never the source theme; pull/copy the Liquid; fork + rename.
4. Implement on the brand-revamp branch with brand tokens + schema-driven copy; no hard-coded hexes; scoped class names.
5. If cart/variant/quantity is touched, verify across **default / azalea / cro** product forms.
6. `theme:check` — don't add offenses.
7. QA on `theme:dev` (desktop + mobile). Confirm live prices before shipping any pricing/savings copy.
8. Commit; update [docs/brand-revamp-2026.md](brand-revamp-2026.md) (and append a QA line to [docs/qa-notes.md](qa-notes.md) once previewed).

---

## Open questions to confirm before building
- **Which Section Store sections are already purchased** on the-net-return, and are any already installed on the source or a dev theme (look for `SS`/`ss-*` in the section list)?
- Do we want the quantity/savings selector to map to **bundle products**, **variant tiers**, or a **subscription/replenish** offer (the video's CTA says "Replenish")? That decides the data model.
- Target product(s) for the first build — a net PDP (cro-002) or a package PDP?

## Sources
- [Section Store — Shopify App Store listing](https://apps.shopify.com/section-factory)
- [Section.store — marketplace homepage](https://section.store/)
- [Section.store — partner overview (Shopifreaks)](https://www.shopifreaks.com/partners/section-store/)
- [Section.store — collection sections guide (install flow, `SS` prefix)](https://section.store/blogs/store-design-optimisation/how-to-upgrade-your-shopify-collection-sections-2026-guide)
- [Ask Phill — Shopify AI Toolkit for Claude/Cursor/VS Code](https://askphill.com/blogs/blog/shopify-just-released-an-ai-toolkit-for-claude-heres-what-it-actually-does)
- [Let's Talk Shop — Claude Code for Shopify Liquid themes (2026)](https://www.letstalkshop.com/blog/how-to-use-claude-code-for-shopify-liquid-theme)
- [Fudge.ai — Shopify AI Toolkit + Claude Code setup (2026)](https://www.fudge.ai/guides/shopify-ai-toolkit-claude-code-setup/)
