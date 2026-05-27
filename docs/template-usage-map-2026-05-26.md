# Template Usage Map — full audit

**Date:** 2026-05-26
**Source:** Live Shopify Admin (the-net-return.myshopify.com) GraphQL `templateSuffix` on every product/collection/page, cross-referenced with `templates/*.json` files in the brand-revamp-2026 branch.

## TL;DR

| Resource | Live count | Local template files | Files actively used | Ghost files (delete candidates) | Orphan refs (live → no file) |
|---|---:|---:|---:|---:|---:|
| Products (active) | 104 | 44 + default | 25 | **19** | **11** |
| Collections | 133 | 22 + default | 14 | **7** | **8** |
| Pages | 132 | 53 + default | 35 | **12** | **18** |

**Total cleanup surface: 38 ghost files to evaluate for deletion, 37 orphan references to fix in Admin or backfill in code.**

---

## How Shopify template assignment actually works

Two things people get wrong:
- Shopify looks at `templateSuffix` on the resource (set in Admin), **not** the handle.
- If `templateSuffix` is set but the file doesn't exist, Shopify silently falls back to the default (`product.json` / `collection.json` / `page.json`). The page renders without the custom design. **No error is shown to the merchant.**

Most of the chaos below is one of three patterns:
1. Agency built a custom template, assigned it to a few products, then someone deleted the file → products silently using default.
2. Agency built a template but never assigned it to anything → file sits in repo as dead code.
3. Brand-revamp work created files using collection/page handle as the filename, but Shopify still uses the old `templateSuffix` value → new design doesn't render.

---

## PRODUCT TEMPLATES (44 local files, 104 active products)

### Actively used (these are the templates that matter)

| File | Active products | What it's powering |
|---|---:|---|
| `product.json` *(default)* | 41 | Catch-all. Mix of: replacement parts (Neat Net, Caterpillar Bag), launch monitors (Mevo Gen2, Stack Radar, TheStack, Garmin R10/R50), GPOD line (5 SKUs), training aids (Divot Board, Tee Claw, Hazy Golf, Timeless), upgrades, projectors, etc. |
| `product.pro-package.json` | **12** | All package PDPs — Home/Pro/Pro 8/Pro 9/Pro 10/Pro XL/Mini packages, plus all 5 No Fly Zone packages. **This is the canonical package PDP.** |
| `product.cro-002.json` | **8** | **All 8 main net PDPs — Home, Pro, Pro 8, Junior, Mini, Pro 9, Pro 10, Pro XL.** This is the canonical net PDP. CRO-002 = a CRO experiment that won and became the default. |
| `product.simseries.json` | 3 | Sim Bay 8 / 10 / 12 |
| `product.no-fly-zone.json` | 2 | NFZ V2 accessory + NFZ V2 KIT |
| `product.uneekor.json` | 2 | Uneekor Eye Mini, Eye Mini Lite |
| `product.azalea-net.json` | 1 | Azalea Net |
| `product.azalea-package.json` | 1 | Azalea Package |
| `product.foresight-gc3.json` | 1 | Foresight GC3 |
| `product.foresight-gc3s.json` | 1 | Foresight GC3S |
| `product.foresight-netpackage.json` | 1 | GC3 with Net Package |
| `product.foresight-simpackage.json` | 1 | GC3 with Sim Bay |
| `product.full-swing.json` | 1 | Full Swing KIT |
| `product.full-swing-netpackage.json` | 1 | Full Swing + Net |
| `product.full-swing-simpackage.json` | 1 | Full Swing + Sim Bay |
| `product.uneekor-mini-netpackage.json` | 1 | Uneekor Eye Mini + Net |
| `product.uneekor-mini-simpackage.json` | 1 | Uneekor Eye Mini + Sim Bay |
| `product.uneekor-lite-netpackage.json` | 1 | Uneekor Eye Mini Lite + Net |
| `product.uneekor-lite-simpackage.json` | 1 | Uneekor Eye Mini Lite + Sim Bay |
| `product.flightscope-mevo-plus.json` | 1 | Mevo+ |
| `product.extrapoint.json` | 1 | Extra Point Football Net |
| `product.mczr.json` | 1 | Custom Extra Point Net (MyCustomizer-driven) |
| `product.outdoor-cover.json` | 1 | Outdoor Cover |
| `product.platinum-turf.json` | 1 | Platinum Turf |
| `product.pro-turf.json` | 1 | Pro Turf |
| `product.rubber-tees.json` | 1 | Rubber Tees |

### Ghost files (delete candidates — file exists, ZERO active products use it)

| File | Status | Recommendation |
|---|---|---|
| `product.bulletproof.json` | Bulletproof series — `collection.bulletproof-series.json` still references the series. Are there actual SKUs? | Investigate: if no live SKU exists, delete file + collection template. |
| `product.bulletproof-package.json` | Same as above | Same |
| `product.country-club-elite.json` | The "Country Club Elite Hitting Mat" exists ACTIVE but uses `accessories-no-material` template, not this one | **DELETE — agency built it then never assigned the product to it.** |
| `product.flightscope-mevo.json` | Legacy Mevo (Gen1). Mevo Gen2 is active but uses default `product.json` | **DELETE if Mevo Gen1 is no longer sold.** |
| `product.flightscope-mevo-plus-le.json` | "Limited Edition" Mevo+ — appears retired | **DELETE.** |
| `product.flightscope-netpackage.json` | Generic FlightScope+Net package | Active equivalent uses `foresight-netpackage` / `uneekor-*-netpackage`. **Probably DELETE.** |
| `product.flightscope-simpackage.json` | Same pattern | **Probably DELETE.** |
| `product.flightscope-x3.json` | Flightscope X3 — retired product | **DELETE.** |
| `product.home-package.json` | The "Home Package" SKU is `home-golf-net-package` which uses `pro-package` suffix — this file is unused | **DELETE — pro-package handles all packages now.** |
| `product.home-series.json` | The Home net SKU (`golf-and-multi-sport-nets`) uses `cro-002` suffix, not this | **Brand-revamp work invested here but it's orphan.** Either: (a) re-assign the SKU's templateSuffix to `home-series` in Admin to activate this work, OR (b) **DELETE** and consolidate the work into `cro-002`. |
| `product.home-series-og.json` | "Original" version pre-revamp | **DELETE.** |
| `product.mczrmobile.json` | MyCustomizer mobile variant — separate template was an old responsive-design pattern, no longer needed | **DELETE.** |
| `product.pre-order.json` | Fordeer Preorder app template — depends on app config | Investigate: if no SKU is on preorder today, **DELETE** (re-create if/when needed). |
| `product.pro-series.json` | The Pro net SKU (`pro-series-golf-net`) uses `cro-002` not this | **Same situation as home-series.json — orphan brand work.** |
| `product.quick-buy-drawer.json` | Focal stock — only relevant if quick-buy drawer feature is enabled | Likely vestigial. Check Focal settings before deleting. |
| `product.quick-buy-popover.json` | Same as above | Same |
| `product.surfthing-computers.json` | Active SurfThing computer products use **default** `product.json` not this | **Agency built a custom template, never assigned it. DELETE.** |
| `product.surfthing-laptop.json` | Active SurfThing laptop product uses **default** not this | **DELETE.** |

### Orphan references (live products → no template file exists locally)

These are the urgent ones. Products are assigned a `templateSuffix` value but the file isn't in the repo, so they're falling back to default `product.json` — losing whatever custom design was built.

| Missing file | Referenced by | Severity |
|---|---|---|
| `product.accessories-no-material.json` | **6 active products** including Country Club Elite Hitting Mat, both Duffle Bags, Simulator Screen, Sim Valence, No Fly Zone V2 Side Barriers | **HIGH** — this was clearly a real shared template for hardgoods accessories. Either: (a) recreate it, (b) re-assign all 6 products to use default + a real shared section, OR (c) determine what file currently exists upstream — `theme:pull` to check. |
| `product.sand-bags.json` | Sandbags (active SKU) | MED |
| `product.hitting-mat.json` | Pro Turf Replacement Panel | MED |
| `product.net-guardian.json` | Net Guardian | MED |
| `product.precision-target.json` | Precision Target | MED |
| `product.side-barriers.json` | Universal Side Barriers | MED |
| `product.2x2-target.json` | Square Target | LOW |
| `product.golf-impact-screens.json` | Custom Simulator Screen | MED |
| `product.simulator-kits.json` | Simulator Kit | MED |
| `product.the-split-screen.json` | Split Screen Accessory | MED |
| `product.frame-pad.json` | Frame Pads (active) | MED |

**Action:** Run `theme:pull` to verify whether these files exist in the source theme (`149365096541`) but were deleted locally, or whether they were deleted from the source long ago and the product `templateSuffix` values are stale.

---

## COLLECTION TEMPLATES (22 local files, 133 live collections)

### Actively used

| File | Live collections | What it powers |
|---|---:|---|
| `collection.json` *(default)* | 92 | The catch-all. Most accessory/replacement-part/sport-specific collections. |
| `collection.accessories.json` | 3 | `accessories`, `general-accessories`, `accessories-1` |
| `collection.packages.json` | 2 | `packages`, `pro-series-packages-1` |
| `collection.azalea.json` | 1 | `azalea` |
| `collection.bulletproof-series.json` | 1 | `bulletproof` |
| `collection.commercial-simulators.json` | 1 | `commercial-simulator-bays` (0 products) |
| `collection.cro-001.json` | 1 | **`nets-1`** — the main Nets landing — uses templateSuffix `cro-001`, NOT `nets-1` |
| `collection.flightscope.json` | 1 | `flightscope` |
| `collection.foresight.json` | 1 | `foresight` |
| `collection.full-swing.json` | 1 | `fullswing` |
| `collection.nets.json` | 1 | `home-series` (handle) — templateSuffix is `nets` |
| `collection.netsop.json` | 1 | `pro-series-1` (handle) — templateSuffix is `netsop` |
| `collection.packagesop.json` | 1 | `home-series-packages-1` |
| `collection.simulation.json` | 1 | `simulation` |
| `collection.uneekor.json` | 1 | `uneekor` |

### Ghost files (delete candidates — file exists, zero collections use it)

| File | Notes |
|---|---|
| `collection.general-accessories.json` | **Brand-revamp work created this expecting Shopify to auto-route by handle. The live `general-accessories` collection uses templateSuffix `accessories` → goes to `collection.accessories.json`. To activate: either change templateSuffix in Admin OR fold brand work into `collection.accessories.json`.** |
| `collection.home-series.json` | Live `home-series` collection has handle = `home-series` but templateSuffix = `nets` → uses `collection.nets.json`. **Same handle vs. templateSuffix mismatch as above.** |
| `collection.home-series-2.json` | Likely a deprecation candidate per brand-revamp-journey-status notes |
| `collection.nets-1.json` | Live `nets-1` collection uses templateSuffix `cro-001` → uses `collection.cro-001.json`. **Brand-revamp file is orphan.** |
| `collection.pro-series.json` | Live `pro-series` collection has empty templateSuffix → uses default `collection.json`. **Brand-revamp investment that isn't being rendered.** |
| `collection.resellers.json` | Likely retired |
| `collection.simulation.context.b2b.json` | B2B override of simulation — keep if B2B is live. |

### Orphan references (live collections → missing files)

| Missing file | Referenced by | Severity |
|---|---|---|
| `collection.accessories-breaks.json` | **8 collections** (home7x7, pro-series-8-x-7-5, large-pro-8-x-8 / 9-x-8 / 10-x-8 / 10-x-9-5, junior, mini-5-x-6) — these are the **"accessories for your net size"** collections | **HIGH** — used by the long-tail per-size accessory shopping path. |
| `collection.assembly.json` | 7 assembly-specific collections (pro-series-assembly, home-series-assembly, sim-series-assembly, etc.) | MED |
| `collection.assembly-new.json` | The main `assembly` collection (22 products) | MED |
| `collection.coming-soon.json` | 4 collections including lacrosse-nets, football-nets | LOW — these are placeholder collections, default may be acceptable |
| `collection.custom.json` | `custom-nets` (1 product) | LOW |
| `collection.packages-no-fly.json` | `no-fly-zone-packages` (5 products) | MED |
| `collection.sim-landing-page.json` | `launch-monitors-dev` (dev collection) | LOW |
| `collection.storage.json` | `bags` collection (16 products — storage/duffle) | MED |

---

## PAGE TEMPLATES (53 local files, 132 live pages)

### Actively used (live = published, hidden = unpublished but still in admin)

| File | Live | Hidden | Pages |
|---|---:|---:|---|
| `page.json` *(default)* | 58 | 10 | All the V2 Assembly Video pages, foresight, golf-packages, etc. |
| `page.contact.json` | 2 | 0 | `contact-us`, `contact` ← **duplicate contact pages** |
| `page.octane-quiz.json` | 1 | 1 | `quiz`, `test-quiz` |
| `page.resellers.json` | 1 | 1 | `b2b-portal`, `test` |
| `page.our-story.json` | 1 | 0 | `our-story` |
| `page.compare.json` | 1 | 0 | `compare` (Compare Nets — brand-revamp-styled) |
| `page.bryson.json` | 1 | 0 | `bryson-dechambeau-the-net-return` |
| `page.testimonials.json` | 1 | 0 | `testimonials` |
| `page.support.json` | 1 | 0 | `support` |
| `page.setups.json` | 1 | 0 | `setups` |
| `page.faq.json` | 1 | 0 | `faq` |
| `page.ambassador.json` | 1 | 0 | `ambassador-program` |
| `page.affiliate.json` | 1 | 0 | `affiliate-program` |
| `page.certified-partner.json` | 1 | 0 | `certified-partner-program` |
| `page.teamnetreturn.json` | 1 | 0 | `team-net-return` |
| `page.countryclubreps.json` | 1 | 0 | `country-club-reps` |
| `page.flightscope.json` | 1 | 0 | `flightscope` |
| `page.build-your-setup.json` | 1 | 0 | `build-your-setup` |
| `page.browse-all-products.json` | 1 | 0 | `browse-all-products` |
| `page.assembly-new.json` | 1 | 0 | `assembly` |
| `page.register.json` | 1 | 0 | `register` |
| `page.thank-you.json` | 1 | 0 | `thank-you` |
| `page.video.json` | 1 | 0 | `top-videos` (Golf Net Video Gallery) |
| `page.Forms - Fundraiser Program.json` | 1 | 0 | `fundraiser-program` — auto-named by Shopify Forms app |
| `page.Forms - Home Giveaway.json` | 0 | 2 | `home-giveaway`, `negs` |
| Seasonal campaigns (all hidden) | — | — | `bfcm`, `bfcm-landing`, `holiday`, `holiday-vm`, `fathers-day`, `ryder-cup-sale`, `ultimate-golf-giveaway`, `spring-2026`, `masters-2026`, `masters-sale`, `labor-day`, `big-deal-days`, `18th-club-giveaway`, `giveaway-customxp` |
| `page.rewind_menu_backup_do_not_delete.json` | 0 | 1 | Rewind app backup — the file is in the repo and the page exists, hidden |

### Ghost files (delete candidates — file exists, zero pages use it)

| File | Notes |
|---|---|
| `page.academy-landing.json` | The Academy landing page concept — no live page exists with this templateSuffix. **Probably delete unless Academy is in roadmap.** |
| `page.assembly.json` | Old assembly template — replaced by `assembly-new`. **DELETE.** |
| `page.bfcm-25.json` | Last year's BFCM template, not used | **DELETE.** |
| `page.build-your-setup.context.b2b.json` | B2B override of build-your-setup — keep if B2B is live |
| `page.extrapoint.json` | "Extra Point" page template — the Extra Point product exists (`product.extrapoint.json`) but no extrapoint *page* | **DELETE.** |
| `page.home-package-giveaway.json` | Old giveaway | **DELETE.** |
| `page.international.json` | International landing | Investigate if used; if not, **DELETE.** |
| `page.list-collections.json` | Old list-collections page | **DELETE** (there's already a list-collections.json at theme level). |
| `page.pga-show.json` | PGA Show — the live PGA Show page uses `negs` template not this one | **DELETE.** |
| `page.quiz.json` | Quiz template — but quiz uses `octane-quiz` | **DELETE** (octane-quiz is canonical). |
| `page.resellers.context.b2b.json` | B2B override of resellers — keep if B2B is live |
| `page.uneekor.json` | Uneekor page template — no live page uses it. Brand has Uneekor *collection* not page. **DELETE.** |

### Orphan references (live pages → no template file)

These are blank-design risks. Each is a live or hidden Shopify page assigned a `templateSuffix` that has no file.

| Missing file | Page handle | Live? | Severity |
|---|---|---|---|
| `page.golf-net.json` | `golf-net` | **LIVE** | **HIGH — this is the new SEO landing page** |
| `page.accessories-for-net-size.json` | `accessories-for-your-net-size` | **LIVE** | **HIGH — accessory navigation entry point** |
| `page.faqs2.json` | `faqs` (FAQ's Video) | **LIVE** | **MED — two FAQ pages: `faq` and `faqs`** |
| `page.page.json` | `waranty-policy` | **LIVE** | **MED — Warranty Policy page rendering as default. Template name "page" is meta-recursive — Shopify can't resolve, falls back.** |
| `page.indoor-golf-net.json` | `indoor-golf-net` | hidden | MED — pending SEO page series |
| `page.golf-practice-net.json` | `golf-practice-net` | hidden | MED |
| `page.backyard-golf-net.json` | `backyard-golf-net` | hidden | MED |
| `page.calculator.json` | `calculator` | hidden | LOW |
| `page.book-an-appt.json` | `book-an-appointment-with-a-net-return-expert` | hidden | MED — relevant to footer "Book a call" CTA conversation |
| `page.gallery-new.json` | `gallery` | hidden | LOW |
| `page.golf.json` `page.soccer.json` `page.football.json` `page.baseball.json` | sport landing pages | all hidden | LOW |
| `page.custom-extra-point-nets.json` | `custom-extra-point-nets` | hidden | LOW |
| `page.alchemy.fullpage.json` | `high-converting-pages-page-using-5-reasons-why-for-the-net-return` | hidden | LOW — Alchemy app artifact, probably deletable in Admin |
| `page.bombersclub.json` | `bombers-club-exclusive` | hidden | LOW |
| `page.postscript-FREESHIPPING-subscribe.json` | `freeshipping-subscribe-page` | hidden | LOW |
| `page.page.json` (other refs) | `build-you-golf-simulator`, `panthers` | hidden | LOW |

---

## Patterns to fix systematically

### Pattern 1: Handle ≠ templateSuffix (the brand-revamp landmine)

The brand-revamp work assumed file naming would auto-attach. It doesn't. Affected:
- `collection.nets-1.json` (orphan) vs the live `nets-1` collection actually using `cro-001` suffix
- `collection.general-accessories.json` (orphan) vs live using `accessories` suffix
- `collection.home-series.json` (orphan) vs live using `nets` suffix
- `collection.pro-series.json` (orphan) vs live using `` (default)
- `product.home-series.json` (orphan) vs live Home net using `cro-002`
- `product.pro-series.json` (orphan) vs live Pro net using `cro-002`

**Fix:** Either (a) update `templateSuffix` in Shopify Admin to match the file names (one-click each in Admin, no theme push), or (b) move the brand-revamp design code from the orphan files INTO the templates that are actually being used (`collection.cro-001.json`, `collection.accessories.json`, `collection.nets.json`, `product.cro-002.json`). Option (a) is safer because Admin changes are reversible.

### Pattern 2: Agency built, never assigned

Templates that have real design work but zero live resources. Candidates: `product.country-club-elite.json`, `product.surfthing-computers.json`, `product.surfthing-laptop.json`, `product.home-package.json`, `page.uneekor.json`, `page.academy-landing.json`.

**Fix:** For each, either assign a SKU to it in Admin OR delete the file.

### Pattern 3: Assigned but file deleted (the worst pattern)

A product/collection/page references a templateSuffix that no longer exists. Customer hits the URL → silently rendered with default template → custom design gone. Examples that need immediate triage:

**Live customer-visible:**
- `/products/sandbags`, `/products/1-x2-hitting-mat`, `/products/net-guardian`, `/products/precision-target`, `/products/universal-side-barriers`, `/products/2-x3-target-new`, `/products/golf-impact-screens`, `/products/simulator-kit-...`, `/products/split-screen-add-on-for-nets`, `/products/frame-pads`, +6 products using missing `accessories-no-material`
- `/collections/home7x7`, `/collections/pro-series-8-x-7-5`, `/collections/large-pro-8-x-8`, `/collections/large-pro-9-x-8`, `/collections/large-pro-10-x-8`, `/collections/large-pro-10-x-9-5`, `/collections/junior`, `/collections/mini-5-x-6` (all use missing `accessories-breaks`)
- `/collections/pro-series-assembly`, `/collections/home-series-assembly`, etc. (7 collections use missing `assembly`)
- `/collections/bags` (16 products, missing `storage`)
- `/collections/custom-nets` (missing `custom`)
- `/collections/no-fly-zone-packages` (missing `packages-no-fly`)
- `/collections/assembly` (22 products, missing `assembly-new`)
- `/pages/golf-net` (LIVE PUBLISHED SEO page, missing template)
- `/pages/accessories-for-your-net-size` (LIVE, missing template)
- `/pages/faqs` (LIVE FAQ video page, missing `faqs2`)
- `/pages/waranty-policy` (LIVE, broken templateSuffix value `page`)

**Fix:** For each, decide:
- If the design should exist → `theme:pull` to see if it lives upstream that we lost locally, or rebuild from scratch.
- If the design shouldn't exist → clear the `templateSuffix` value in Admin so the resource renders cleanly on the default template.

### Pattern 4: Duplicates and historical dupes

- `page.contact.json` is used by **both** `/pages/contact-us` AND `/pages/contact` — pick one, redirect the other.
- `page.octane-quiz.json` used by both `/pages/quiz` (live) and `/pages/test-quiz` (hidden) — delete the test page in Admin.
- `page.resellers.json` used by both `/pages/b2b-portal` (live) and `/pages/test` (hidden) — delete the test page in Admin.
- `templates/collection.nets.json` + `collection.nets-1.json` + `collection.netsop.json` — three "nets" templates. netsop is in active use by `pro-series-1` handle, nets by `home-series` handle, nets-1 is orphan.
- `templates/page.assembly.json` (ghost) + `page.assembly-new.json` (active) — delete the old one.
- `templates/page.bfcm.json` (1 hidden page uses it) + `page.bfcm-25.json` (ghost) + `page.bfcm-landing.json` (1 hidden) — three BFCM templates. Consolidate.
- `templates/page.holiday.json` (1 hidden) + `page.holiday-vm.json` (1 hidden) — two holiday templates.
- `templates/page.masters-2026.json` + `page.masters-sale.json` — two Masters templates.

---

## Recommended cleanup order

**Phase 1 — Stop the bleeding (live broken pages)** — 1 hour
1. `/pages/golf-net` — page is **live and indexed** but has no template. Either build `page.golf-net.json` or change templateSuffix to one that exists.
2. `/pages/accessories-for-your-net-size` — same situation.
3. `/pages/waranty-policy` — fix the templateSuffix=`page` recursion bug.
4. `/pages/faqs` — decide if it should redirect to `/pages/faq` or get its own template.

**Phase 2 — Backfill the accessories paths (live but broken UX)** — half day
5. Triage the 6 products using `product.accessories-no-material` and the 8 collections using `collection.accessories-breaks`. These are real shopping paths. Either pull upstream, recreate, or migrate to default+section overrides.
6. Same for `collection.assembly` (7 refs), `collection.storage` (1 ref, 16 products).

**Phase 3 — Reconcile the brand-revamp landmines** — 1 hour
7. Decide policy on the 6 handle/suffix mismatches (home-series, pro-series, nets-1, general-accessories on both product and collection side). My recommendation: change `templateSuffix` in Admin to match the new brand-revamp files; far less invasive than rewriting code.

**Phase 4 — Delete the dead** — 30 min
8. Delete the 12 confirmed ghost page templates: assembly, bfcm-25, extrapoint, home-package-giveaway, list-collections, pga-show, quiz, uneekor, plus any agency-built-never-assigned (`academy-landing`, `international` if confirmed unused).
9. Delete confirmed ghost product templates: country-club-elite, flightscope-mevo (Gen1), flightscope-mevo-plus-le, flightscope-netpackage, flightscope-simpackage, flightscope-x3, home-package, home-series-og, mczrmobile, surfthing-computers, surfthing-laptop, quick-buy-* (after checking Focal setting).
10. Delete confirmed ghost collection templates: home-series-2, resellers, simulation.context.b2b (if B2B not live).

**Phase 5 — Admin hygiene** — 30 min
11. In Shopify Admin, delete the orphan unpublished pages that clearly aren't coming back: `test`, `test-2`, `test-quiz`, `panthers`, `gallery`, `calculator`, `freeshipping-subscribe-page`, `our-story-1` (duplicate), `our-story` vs `Our Story` for `gallery` is unpublished, `bryson-net-giveaway-t-c`.
12. Decide which of the 15 hidden seasonal campaign pages to keep (bfcm, holiday, fathers-day, ryder-cup-sale, etc.) vs delete.

---

## Open questions before deleting anything

- **Is B2B live?** The `.context.b2b.json` files (index, header-group, collection.simulation, build-your-setup, resellers) only render for B2B customers. Need confirmation before treating any as ghost.
- **Is Bulletproof an active product line?** No active SKUs found but templates and a collection exist. Marketing decision.
- **Are the seasonal campaign pages reused yearly?** Some look like dated 2025/2024 artifacts; others are templates for annual reuse. Need a yes/no per campaign.
- **Did `theme:pull` ever lose files?** The `--nodelete` flag protects local-only files but doesn't restore files that were deleted upstream. Run a fresh `theme:pull` to see if any of the 37 orphan templates actually exist in source theme `149365096541` and were dropped from this branch.
