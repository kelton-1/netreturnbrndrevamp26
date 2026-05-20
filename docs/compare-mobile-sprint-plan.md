# Compare Page Mobile Sprint Plan

Date: 2026-05-13  
Page: `/pages/compare`  
Template: `templates/page.compare.json`  
Primary audience: mobile shoppers deciding which Net Return model fits their space, budget, and use case.

## Current State

The page currently has:

- Intro rich text: "Compare Nets" with a short materials/size message.
- Pro Series multi-column carousel/grid: Pro, Pro 8, Pro 9, Pro 10, Pro XL.
- Home Series multi-column carousel/grid: Junior, Mini, Home.

Each model card includes an image, dimensions, weight, price, and a "Shop Now" text link. This is content-rich, but mobile users have to swipe through two separate product groups and mentally compare specs across screens.

## Sprint Goal

Turn the compare page into a mobile-first decision tool that helps visitors answer three questions quickly:

1. Which net fits my available space?
2. Which model is right for my use case?
3. What should I buy next?

## Success Metrics

- Increase click-through from `/pages/compare` to product pages.
- Reduce mobile bounce or quick exits from `/pages/compare`.
- Improve scroll depth to the first product CTA.
- Reduce customer support questions around size/model selection.
- Keep mobile page interaction simple enough to understand within 5 seconds.

## Workstream 1: Mobile Comparison UX

Intent: Replace the current "two product grids" experience with a true comparison flow.

### Tasks

- Create a mobile-first compare section that lists all net models together.
- On mobile, present products as compact comparison cards with the key specs visible:
  - Model name
  - Best for
  - Width
  - Height
  - Depth
  - Weight
  - Price
  - CTA
- Add a sticky or persistent comparison action area on each card, with a stronger button-style "Shop [Model]" CTA.
- Add a "Best for" row so shoppers do not need to infer use cases from dimensions alone.
- Keep desktop support with either a true side-by-side table or a wide comparison layout.

### Acceptance Criteria

- A mobile visitor can compare Junior, Mini, Home, Pro, Pro 8, Pro 9, Pro 10, and Pro XL without jumping between two sections.
- The page has visible button CTAs, not only text links.
- Key specs are readable at 375px width without horizontal text overflow.
- The design works without requiring custom app dependencies.

### Priority

P0 for this sprint.

## Workstream 2: Fit Finder Shortcut

Intent: Help users narrow the list without reading every spec.

### Tasks

- Add a compact "Find my fit" control near the top of the page.
- Start with simple mobile-friendly filters:
  - Available width
  - Available height
  - Use case: kids, small space, garage, yard, commercial/pro training
  - Budget range
- Highlight the best matching models after the user selects filters.
- Add a clear reset option.
- Keep the first version lightweight: client-side only, using data already present in the section.

### Acceptance Criteria

- A user can filter to likely models in under three taps.
- The recommended result is visually obvious.
- The filter does not hide all products without an explanation.
- The page remains usable with JavaScript disabled, showing the full comparison list.

### Priority

P1. Build after the comparison section is in place.

## Workstream 3: Content And Merchandising

Intent: Make each product easier to understand and reduce decision fatigue.

### Tasks

- Rewrite the intro to clarify the page scope: freestanding golf nets, all built with the same core materials, mainly differentiated by size and use case.
- Add concise labels:
  - "Best small-space pick"
  - "Most popular garage size"
  - "Best for commercial spaces"
  - "Tallest model"
- Standardize dimensions for scanning:
  - Width, height, and depth as separate fields.
  - Keep feet/inches, but avoid dense strings like `8'w x 7'6"h x 3'6"d` as the only presentation.
- Decide whether Sim Series belongs on this page.
  - If yes, add a separate "Compare simulator setups" section.
  - If no, add a clear link to simulation products so those shoppers are not stranded.

### Acceptance Criteria

- Every model has a plain-language "best for" statement.
- Dimensions are broken into scannable fields.
- The page makes clear whether it compares nets only or broader setups.
- Product labels are consistent with actual merchandising priorities.

### Priority

P1.

## Workstream 4: Data Integrity

Intent: Avoid stale prices and product details.

### Tasks

- Replace hardcoded prices with dynamic product data where practical.
- If fully dynamic pricing is too much for this sprint, add a merchant-facing maintenance note in the section schema or documentation.
- Store comparison attributes in a single structured source where possible:
  - Product metafields, or
  - Section block settings, or
  - A dedicated compare section schema.
- Ensure product links use the canonical product handles.

### Acceptance Criteria

- Price updates are either automatic or clearly documented as a required content update.
- Product page links are verified.
- A future merchandiser can update specs without editing code.

### Priority

P2, unless prices are currently wrong.

## Workstream 5: Mobile QA And Analytics

Intent: Verify the experience and measure whether it helps.

### Tasks

- Run mobile QA at 320px, 375px, 390px, and 430px widths.
- Check tap targets, sticky elements, image cropping, button visibility, and text wrapping.
- Add analytics events for:
  - Compare page product CTA clicks
  - Filter use
  - Recommended model clicks
  - Scroll depth
- Track before/after performance and conversion behavior.

### Acceptance Criteria

- No horizontal page-level overflow on mobile.
- Product CTAs are reachable without excessive scrolling.
- Filter interactions and product clicks can be measured.
- Page performance remains acceptable after images and scripts are added.

### Priority

P1 for QA, P2 for expanded analytics.

## Suggested Sprint Sequence

1. Build the mobile-first comparison section.
2. Swap the existing Pro/Home multi-column sections for the new compare section on a development theme.
3. Update CTA styling from text links to buttons.
4. Rewrite intro and add "best for" labels.
5. QA on mobile breakpoints.
6. Add lightweight fit-finder filters.
7. Verify product links and price handling.
8. Review results in Shopify preview before any push to the source theme.

## Implementation Notes

- Existing section candidates: `sections/compare-models-table.liquid` and `sections/net-package-table.liquid`.
- The existing table sections are a useful data starting point but should be redesigned for mobile rather than shipped as a simple horizontally scrolling 900px table.
- Avoid editing `templates/page.compare.json` directly as the final merchandising source if the Shopify theme editor will own section order and content.
- Keep the first implementation section-based so the merchant can adjust content in the theme editor.

## Definition Of Done

- `/pages/compare` has one clear mobile-first comparison experience.
- All eight current net models can be compared from one interface.
- Each model has a clear CTA, best-use label, and scannable specs.
- Mobile QA passes at common viewport widths.
- The team has a decision on whether Sim Series belongs on this page.

## Implementation Checkpoint

Initial implementation completed locally on 2026-05-13:

- Added `sections/mobile-compare-nets.liquid`.
- Wired `templates/page.compare.json` to use the new section.
- Kept the previous rich-text and multi-column compare sections in the template as disabled fallback content.
- Added `scripts/validate-compare-page.mjs` for a quick structural check.
- Verified the compare section through Shopify validation and local browser QA at 320px, 390px, and desktop widths.

Still open:

- Decide whether Sim Series should be added to this compare page or linked as a separate path.
- Add analytics events for filter use and product CTA clicks if those are not already captured globally.

## Guided Flow Checkpoint

The next compare-page iteration improved the mobile entry flow:

- Added assisted actions: Shop Nets, Talk to an Expert, Watch Size Guide.
- Replaced dropdown-first filtering with customer-language chips for space and practice location.
- Added active filter pills so shoppers can see and remove selections.
- Changed result behavior from hiding products to ranking best matches first and explaining why the page changed.
- Tightened mobile card CTAs and badge language.

Verification:

- `node scripts/validate-compare-page.mjs`
- Shopify validation for `sections/mobile-compare-nets.liquid` and `templates/page.compare.json`
- Browser QA at 320px, 390px, and desktop widths
