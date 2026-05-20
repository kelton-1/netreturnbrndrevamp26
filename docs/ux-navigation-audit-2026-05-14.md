# UX And Navigation Audit

Date: 2026-05-14  
Workspace: `/Users/kelton1/Developer/TheNetReturn/Shopify`  
Preview used: `http://127.0.0.1:9292` via Shopify development theme `149375975517`  
Scope: homepage landing experience, navigation into product types, quality-of-life issues, bugs, and ghost-code cleanup candidates.

## Executive Summary

The current homepage has a strong commercial spine: hero, trust proof, best sellers, category paths, setup help, quiz, simulation, and brand proof. The biggest UX opportunity is not lack of content; it is route clarity. Shoppers are offered several overlapping ways to shop: category grid, "Build Your Setup", quiz, compare, footer links, and header mega-menu imagery. Those paths are useful, but they do not yet resolve into one obvious decision system.

Highest-priority fixes:

1. Make product-type entry points consistent. The homepage sends "Nets" to `/collections/nets-1`, while an older `/collections/nets` template still exists with its main grid disabled.
2. Decide whether `/collections/nets` is a landing page or a shoppable grid, then remove/redirect or rebuild the unused path.
3. Add a clear CTA to `/pages/build-your-setup`; it currently opens with a hero but no primary action.
4. Clean stale/ghost sections and seasonal code: disabled BFCM/Masters blocks, old collection copy, backup menu snippets, and template sections with placeholder text.
5. Treat the `layout/theme.liquid` WNW/content-header rewrite as the major technical debt item. Theme Check still reports it as the only error.

Preview caveat: the local Shopify proxy logged repeated `/cart/update.js` 502 warnings during page loads, and `/pages/compare` returned 429/connection verification in the automated browser run. Those should be re-checked in a normal logged-in browser session before labeling them customer-facing defects.

## Homepage Journey Map

### 1. Arrival

The header currently exposes three primary top-level links: `Shop`, `Explore`, and `Learn`, with search, login, and cart on the right. The header settings use the `main-menu-2024` menu and a mega-menu block keyed to `Shop`, with two image pushes: Recommendations Quiz and Build Your Setup.

Evidence:
- `sections/header-group.json` configures `navigation_menu` as `main-menu-2024` and the `Shop` mega menu imagery at lines 84-130.
- `snippets/desktop-menu.liquid` renders menu links and mega-menu columns/images from Shopify navigation data at lines 1-135.
- Browser preview showed visible header links: `Shop`, `Explore`, `Learn`, `Search`, `Login`, and `Cart`.

UX read:
- The top-level navigation is compact and sensible.
- The `Shop` top-level URL points to `/pages/browse-all-products` in the preview, while the homepage category grid sends users directly to collections. That is acceptable, but it should be intentional and documented as "all products" versus "guided category entry".

### 2. Hero And Trust

The active homepage hero is the legacy slideshow, not the newer disabled `theme-banner` section. Active slides point to `Shop Nets` and `/collections/nets-1`.

Evidence:
- `templates/index.json` active hero slide buttons point to `shopify://collections/nets-1` at lines 83-84 and 102-103.
- The newer `theme-banner` image/text slideshow exists but is disabled at `templates/index.json` lines 249-285.
- `sections/slideshow.liquid` renders the hero and makes a whole slide clickable only when button text is blank, lines 120-190.

UX read:
- The hero message is clear for cold traffic: product category plus pro proof.
- The page repeats "Best Sellers" later in an image/text section after already showing a Best Sellers carousel. Consider whether the later section should become "Compare Pro vs Sim" or "Which setup fits you?" instead.

### 3. Best Sellers

The homepage best-seller carousel appears early and pulls from `best-sellers-bfcm`, with add-to-cart buttons on cards.

Evidence:
- `templates/index.json` sets the carousel collection to `best-sellers-bfcm` at lines 134-170.
- `blocks/ai_gen_block_74536a9.liquid` renders product cards and add-to-cart buttons at lines 436-531.
- Its JavaScript posts to `cart/add.js` at lines 594-635.

Quality risk:
- The add-to-cart code calls `response.json()` but does not check `response.ok`, so a Shopify cart error payload can still move into the success path and briefly show `Added`. That can mask the exact cart/variant class of bug this theme was named for.

### 4. Category Decision Point

The strongest homepage navigation moment is "Pick Your Lane": Nets, Packages, Sim Series, Accessories.

Evidence:
- `templates/index.json` configures the four tiles at lines 306-384.
- `sections/tnr-collection-list.liquid` renders each tile as one full-card link and supports local asset overrides at lines 265-321.
- Browser preview confirmed these destinations:
  - Nets -> `/collections/nets-1`
  - Packages -> `/collections/packages`
  - Sim Series -> `/collections/simulation`
  - Accessories -> `/collections/general-accessories`

UX read:
- This is the cleanest shopper path on the homepage.
- The labels are product-type oriented, which is good.
- The "Accessories" path goes to `/collections/general-accessories`, not the `collection.accessories.json` template path. That may be intentional, but it creates naming drift between merchant-facing collection handles and theme templates.

### 5. Guided Help

The homepage offers both "Build Your Practice Setup" and "Find The Perfect Setup / take the quiz".

Evidence:
- Build setup CTA points to `shopify://pages/build-your-setup` at `templates/index.json` lines 500-520.
- Quiz CTA points to `https://www.thenetreturn.com/pages/quiz` at `templates/index.json` lines 567-583.
- `/pages/build-your-setup` is built from three featured-collection steps: choose a base, add a launch monitor, add accessories at `templates/page.build-your-setup.json` lines 62-230.

UX read:
- These two paths can conflict if their roles are not explicit.
- Recommended role split:
  - Quiz: "I do not know what I need."
  - Build Your Setup: "I know the pieces and want to assemble a setup."

## Product-Type Navigation Map

### Nets

Primary homepage path: `/collections/nets-1`

Observed preview experience:
- Opens as a shoppable, decision-support grid.
- Includes filters for Location/Space, Choose Your Net Size, Price, and Availability.
- Cards include use-case badges, dimensions, review summary, prices, and "View Details".

Theme/code map:
- The homepage links to `/collections/nets-1`, not `/collections/nets`.
- The older `templates/collection.nets.json` has the main shoppable collection section disabled and instead shows curated Pro/Home collection sections, gallery/video, and FAQ. See disabled `main` at lines 113-129 and subcollection sections at lines 130-170.

Recommendation:
- Preserve `/collections/nets-1` as the primary "shop nets" path if it is the better fit-finder/grid.
- Decide the fate of `/collections/nets`: redirect it, rename it as an editorial landing page, or re-enable its product grid.

### Packages

Primary path: `/collections/packages`

Observed preview experience:
- Opens with a Packages hero and tabs for Pro Series, Home Series, and No Fly Zone.
- Shows package products, then FAQ.

Theme/code map:
- The main collection grid is disabled at `templates/collection.packages.json` lines 46-61.
- The active product presentation is `featured-collections` with the three package collections at lines 63-113.

Recommendation:
- This curated approach is workable because packages are inherently comparison/solution products.
- Add a stronger "Compare package contents" module above the grid or near the tabs; right now the package inclusion copy sits in the hero, but users may need a persistent comparison aid.

### Simulation

Primary path: `/collections/simulation`

Observed preview experience:
- Opens with Simulation hero.
- Sections include Simulator Bays, Simulator Packages, FAQ, brand logos, and Launch Monitors.

Theme/code map:
- Simulator Bays are anchored at `#simulator-bays` and rendered from `sim-bays`, lines 31-75.
- Simulator Packages are anchored at `#simulator-packages` and rendered from net/sim-bay package collections, lines 76-130.
- FAQ and additional launch-monitor sections continue below, lines 131 onward.

Recommendation:
- This page is rich but long. Add an above-the-fold choice strip: "I need a bay", "I need a net package", "I already have a net", "I need a launch monitor".

### Accessories

Primary homepage path: `/collections/general-accessories`

Observed preview experience:
- Opens as "All Accessories" with sections for Essentials, Safety, Simulation, and more.

Theme/code map:
- `templates/collection.accessories.json` exists with anchored sections for essentials/safety/simulation/training/other, but the homepage does not link to `/collections/accessories`.
- Homepage links to `general-accessories` at `templates/index.json` lines 354-368.

Recommendation:
- Normalize the handle/template naming. Either keep `general-accessories` as the canonical URL and rename docs/templates mentally around it, or change the homepage path to the canonical accessories landing page if one exists.

### Compare

Primary path: `/pages/compare`

Observed preview experience:
- Browser preview hit a connection verification page for `/pages/compare`; the local dev server logged the request as `GET 429 /pages/compare`. Code inspection still shows a strong compare module with product links and filters.

Theme/code map:
- The active custom compare section is `mobile-compare-nets`, configured at `templates/page.compare.json` lines 20-219.
- Old rich-text and multi-column compare sections remain disabled at lines 220-342.

Recommendation:
- Keep compare as a first-class "Nets" support path, but verify the connection-verification behavior in a normal browser session. If customers can hit that screen, it is a major UX blocker.

## Bugs And Quality Issues

### P1: Cart add success can lie on homepage carousel

`blocks/ai_gen_block_74536a9.liquid` sends `cart/add.js` and immediately parses JSON, then marks the button `Added` without checking HTTP status. Shopify cart endpoints often return JSON error bodies on non-2xx responses. The UI should check `response.ok` and show the error state if the add failed.

Evidence: `blocks/ai_gen_block_74536a9.liquid` lines 594-635.

Related preview signal: the local dev proxy repeatedly warned that `/cart/update.js` failed with 502 while loading pages. That may be proxy/session noise, but it reinforces that cart endpoints deserve a dedicated browser QA pass.

### P1: Remaining Theme Check error is the WNW `content_for_header` rewrite

Theme Check currently reports 360 files inspected, 158 offenses, 1 error, 157 warnings. The one error is `ContentForHeaderModification` in `layout/theme.liquid`.

Evidence: `layout/theme.liquid` captures and rewrites `content_for_header` at lines 99-105.

Impact:
- This touches Shopify-managed app, pixel, and analytics scripts.
- It complicates debugging and can break third-party scripts in ways that look like app bugs.

### P1: Product-type route drift

The theme contains both `/collections/nets-1` and older `/collections/nets` paths with different experiences. Homepage points to `nets-1`; docs and existing QA notes mention `/collections/nets` as "not a shoppable grid".

Evidence:
- Homepage tile link: `templates/index.json` lines 306-384.
- Older Nets template has disabled main grid: `templates/collection.nets.json` lines 113-129.

Impact:
- Shoppers, support, SEO, and future agents can talk about "Nets" while meaning different pages.

### P2: Build Your Setup has no hero CTA

The page hero says "Build Your Setup" but has no button. The actual action is scrolling into the first product tabs.

Evidence: `templates/page.build-your-setup.json` lines 12-30.

Recommendation:
- Add a primary anchor CTA to the "Choose a Base" section.
- Add a secondary CTA to quiz for unsure shoppers.

### P2: Seasonal and campaign residue

Several homepage and template sections preserve disabled campaign blocks. Some are harmless in the theme editor, but they increase admin noise and future-change risk.

Evidence:
- Disabled hero slides and campaign blocks in `templates/index.json` lines 15-57 and 210-248.
- Disabled `theme-banner` and `badge-scroller` at `templates/index.json` lines 249-305.
- Header still has BFCM highlight CSS in `sections/header.liquid` lines 119-133.
- A Rewind backup page/snippet exists: `templates/page.rewind_menu_backup_do_not_delete.liquid` and `snippets/rewind_menu_backup_do_not_delete.liquid`.

Recommendation:
- Archive intentionally kept backups outside the active theme tree.
- Remove expired campaign CSS and disabled campaign sections after confirming they are not needed by the merchant.

### P2: Placeholder and unfinished copy remains in collection templates

Some collection templates still contain default "Pair text with an image..." copy in disabled multi-column sections.

Evidence: `templates/collection.nets.json` lines 47-98 and similar collection templates found by search.

Recommendation:
- Either delete the disabled placeholder sections or replace them with real fallback content if they are expected to be re-enabled.

### P2: Footer trust copy needs polish

Footer trust copy includes awkward wording: "Used over 50 Tour players", "No quotation asked", and duplicate icon choices in the disabled feature grid.

Evidence: `sections/footer-group.json` lines 14-58.

Recommendation:
- If the disabled grid is not used, remove it. If it might be re-enabled, rewrite copy before it reaches shoppers.

### P3: Cart empty state points to all products

The cart page empty CTA points to `shopify://collections/all`, while the mini-cart empty CTA points to `shopify://collections/nets-1` in global settings.

Evidence:
- `templates/cart.json` line 34.
- `config/settings_data.json` lines 64-73.

Recommendation:
- Send empty-cart shoppers to the highest-converting guided path: likely `/collections/nets-1`, `/pages/build-your-setup`, or quiz, not all products.

### P3: Cart recommendation code has a misleading comment and one undefined variable warning

The section requests 4 complementary recommendations and stops at 4, but the comment still says "we load 10". Theme Check also flags `blends_with_background` as undefined.

Evidence: `sections/cart-recommendations.liquid` lines 9 and 32-59.

Recommendation:
- Initialize `blends_with_background` or remove the conditional class logic.
- Update the stale comment.

## Recommended Next Work Batches

### Batch 1: Navigation Clarity

- Choose canonical URLs for Nets, Packages, Simulation, Accessories.
- Redirect or retire duplicate product-type routes.
- Clarify header `Shop` destination versus homepage category-grid destinations.
- Add a CTA to Build Your Setup.

### Batch 2: Conversion QA

- Fix homepage carousel add-to-cart error handling.
- Test add-to-cart from homepage, product pages, cart, and mini-cart.
- Verify compare page in a normal browser session to rule out a customer-facing verification blocker.

### Batch 3: Cleanup

- Remove or archive old campaign sections and Rewind backup code.
- Remove placeholder disabled sections from templates.
- Clean stale BFCM/Masters CSS and menu highlight code.

### Batch 4: Technical Debt

- Replace or unwind the `content_for_header` rewrite.
- Continue Theme Check cleanup from the 1-error / 157-warning baseline.
- Keep performance work tied to honest LCP/Speed Index measurements rather than WNW-influenced synthetic wins.

## Verification Run

- Read current setup docs and sprint notes.
- Inspected homepage, header, collection, product-list, cart, and page templates.
- Ran Shopify Theme Check: 360 files inspected, 158 offenses, 1 error, 157 warnings.
- Started `npm run theme:dev` and inspected the local preview at `http://127.0.0.1:9292`.
- Browser-previewed homepage, `/collections/nets-1`, `/collections/packages`, `/collections/simulation`, `/collections/general-accessories`, `/pages/build-your-setup`, and `/pages/compare`.
- `/pages/compare` showed a connection verification screen / 429 in the automated preview; needs a human-session verification pass.
- The local preview logged repeated `/cart/update.js` 502 proxy warnings; cart add/update should be smoke-tested in a normal browser session.
