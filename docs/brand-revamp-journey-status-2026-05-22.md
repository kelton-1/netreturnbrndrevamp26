# Brand revamp — customer journey status

**Branch:** `brand-revamp-2026`
**Checkpoint:** 2026-05-22
**Session goal:** Extend brand cohesion from homepage to the full customer journey while owner was away. Every page, template, and card should feel like one brand. Navigation makes sense. Filtering makes sense. Mobile-optimized.

## Shipped this session (15 commits on top of the prior homepage work)

| Surface | What changed | Commit |
|---|---|---|
| Homepage scaffolding | Sectioned the homepage iteration: series-cards added, category-mosaic disabled, order reshuffled. Wireframe doc captured prior state. | `9bff3b3` |
| `/collections/nets-1` | First branded collection: breadcrumb → intro → series rail → brand grid → cross-links. Replaces main-collection. | `9bff3b3` |
| `/collections/packages` | Branded: breadcrumb → intro → series rail (Home/Pro/No Fly Zone packages) → brand grid → cross-links. Replaces featured-collections. | `a8845b0` |
| `/collections/simulation` | Surgical pass: breadcrumb + 4-card section nav + cross-links. Curated sub-section featured-collections preserved. | `071900d` |
| `/collections/general-accessories` | Same pattern as simulation: breadcrumb + 4-card section nav + cross-links. | `d43bc44` |
| `/collections/home-series`, `pro-series`, `commercial-simulators` | Sub-series collections branded. Home/Pro get the full stack; Commercial Simulators gets the surgical pass. | `e2d740b` |
| PDP defaults | `product.json` gets brand-breadcrumb + brand-cross-links (Compare / Accessories / Talk). `product.pro-series.json` and `product.home-series.json` get breadcrumb only. | `9661ab8` |
| Navigation polish | Fixed broken `?simulator-bays` query-string anchor in `page.faq.json`. Wrote admin handoff doc for the mobile-menu and Shop-All-X work that needs to happen in Shopify Admin. | `3086344` |
| Mobile CSS | 3 audit-driven fixes: cross-links gets a 2-col tablet step, brand-btn padding tightens at 540px, breadcrumb gap relaxed. | `6c5ce30` |
| `/pages/compare`, `build-your-setup`, `quiz`, `contact` | Four cross-link destination pages branded. Build Your Setup gets a 3-step rail with anchor nav. Contact gets a click-to-call hero. | `61151c8` |
| Journey QA fix | Repointed nets-1 series rail from `/home-series-nets` and `/pro-series-nets` (un-branded default fallback) to `/home-series` and `/pro-series` (the branded landing pages this session). | `3701987` |
| Launch monitor partner collections | FlightScope / Foresight / Full Swing / Uneekor collection pages branded with 4-segment breadcrumb (Home > Simulation > Launch Monitors > Brand), brand intro hero, and brand-cross-links. Legacy hero overlays kept disabled. | `892ccb2` |
| Default collection.json catch-all | Replaces collection-banner with brand-collection-intro (auto-fills heading from `collection.title` and body from `collection.description`). Affects every Shopify collection that doesn't have a custom template. | `164935c` |
| Bryson page | brand-breadcrumb + brand-cross-links wrap. Custom Bryson storytelling content (slideshow, timeline, video, image-with-text) preserved intact. | `7b42aac` |
| Testimonials / Setups / Our Story | Same surgical pattern: breadcrumb + cross-links tuned per page's next-step intent. Custom rich-text/gallery/timeline content untouched. | `016be27` |

## State by surface

**Branded and cohesive:**

- Homepage
- 4 top-level collection pages: Nets, Packages, Simulation, Accessories
- 3 sub-series collection pages: Home Series, Pro Series, Commercial Simulators
- 4 launch monitor partner collection pages: FlightScope, Foresight, Full Swing, Uneekor
- Default `collection.json` catch-all (auto-fills hero from collection title/description, so every uncovered collection — sim-bays, accessories-essentials, bulletproof, azalea, resellers, etc. — now lands on a branded page)
- 4 reference destination pages: Compare, Build Your Setup, Quiz, Contact
- 4 storytelling / proof pages: Bryson DeChambeau, Testimonials, Setups, Our Story
- Default PDP (`product.json`)
- Pro Series and Home Series PDPs (breadcrumb only — see followups)

**Not yet branded (followup candidates):**

- Other product templates (~40 variants — Azalea, CRO, Country Club Elite, No Fly Zone, Outdoor Cover, Pro Turf, Rubber Tees, Sim Series, brand-specific launch-monitor product templates, package templates)
- `collection.home-series-2.json`, `collection.home-series-og.json` (deprecation candidates — these are templates, not collections; will only render if the matching Shopify handle is still live. Admin-side verification needed)
- Filter UI on `brand-collection-grid` (currently sort-only, no filter sidebar)
- Other page templates not touched this session: support, faq, assembly, warranty, academy-landing, browse-all-products, ambassador, affiliate, BFCM/holiday landings, etc.

## Navigation cohesion

Theme-side: Done. `sections/header.liquid` was already brand-styled. Breadcrumb is consistent on every branded surface.

Admin-side: Three changes need to happen in Shopify Admin (Online Store → Navigation), captured in `docs/navigation-admin-handoff-2026-05-22.md`:

1. **P0** — Create `mobile-drawer-2026` menu with 9 conversion-first items, assign to header section's mobile menu setting.
2. **P1** — Add "Shop All X" first-children under each parent in `main-menu-2024`.
3. **P1** — Normalize Simulation anchor URLs in `main-menu-2024` (likely have a duplicate-path issue per prior audit).

None of these require theme push.

## Followups worth queueing

1. **Brand the remaining product templates** — biggest blocker to "every page feels like one brand." Priority order suggested: bulletproof, country-club-elite, no-fly-zone, the package templates, then the brand-specific launch-monitor templates.
2. **Brand the launch-monitor brand collection pages** (`collection.flightscope.json`, `collection.foresight.json`, `collection.full-swing.json`, `collection.uneekor.json`). All use `collection.json` default today.
3. **Filter UI on `brand-collection-grid`** — sort dropdown exists; filter sidebar doesn't. The audit flagged filtering as a goal; the underlying `main-collection` section it replaced did have filters. Consider whether to port them into the brand grid or accept a sort-only flat browse.
4. **Disposition of `home-series-2` and `home-series-og` templates** — three Home-Series-ish templates exist. Decide canonical, delete others or mark deprecated.
5. **Storefront preview verification** — none of this session's work was visually verified in a real preview. Shopify CLI `theme:dev` is the QA lane (see `Shopify/CLAUDE.md`). Recommend a 30-minute pass at 375px and 1280px hitting: home → nets → home-series → product → compare → quiz.
6. **Live cart smoke test** — the source theme is named `[FIX] Cart 400 - variant id disabled - 2026-05-12`. Brand revamp didn't touch cart code, but verify add-to-cart still works from the new `brand-collection-grid` product cards (they use `product-item-brand` snippet, which doesn't include an inline ATC — clicking goes to PDP first).

## Reference docs in this session

- `docs/homepage-wireframe-2026-05-21.md` — homepage section-by-section anatomy (pre-shuffle).
- `docs/navigation-admin-handoff-2026-05-22.md` — admin-side changes needed.
- This file — what shipped and what's next.
