# Premium DTC UX Pattern Research

Date: 2026-05-13  
Focus: Blue Tees, YETI, GoPro, Meta AI Glasses, Apple, and adjacent premium product UX patterns.

## Evidence

### Screenshots Captured

- Blue Tees rangefinders: [screenshot with popup](premium-screenshots/blue-tees-rangefinders-mobile.png), [page](https://blueteesgolf.com/collections/rangefinders)
- Meta AI Glasses: [screenshot](premium-screenshots/meta-ai-glasses-mobile.png), [page](https://www.meta.com/ai-glasses/)
- Apple iPhone comparison: [screenshot](premium-screenshots/apple-iphone-compare-mobile.png), [page](https://www.apple.com/iphone/compare/)
- YETI bot gate screenshot: [screenshot](premium-screenshots/yeti-tumblers-mobile.png), [page](https://www.yeti.com/drinkware/tumblers/)
- GoPro bot gate screenshot: [screenshot](premium-screenshots/gopro-compare-mobile.png), [page](https://gopro.com/en/us/compare)

### Source Notes

- Blue Tees exposes a category hero, proof strip, product rows, and accessory completion paths. Their rangefinder page leads with "RANGEFINDERS," a benefit statement, "ONLINE EXCLUSIVE," trust items, product cards, and "Complete your gear."
- YETI exposes a dense faceted collection model: size, color, beverage type, lid type, features, and lifestyle filters.
- GoPro has a camera comparison page with multiple "Select camera" controls, add-to-cart CTAs, learn-more links, and spec groups such as overview, camera type, video modes, image quality, and hardware specs.
- Meta AI Glasses leads with a full-bleed lifestyle/video hero, a clear emotional headline, a starting price, sale anchoring, and a single dominant "Shop all" CTA.
- Apple iPhone Compare leads with "Compare iPhone models," then immediately offers "Shop iPhone," "Chat with a Specialist," and a guided-tour link before the model comparison grid.

## What To Borrow For The Net Return

### 1. Apple-style assisted comparison

Apple does not just show a comparison grid. It gives the shopper three exits at the top: buy now, get help choosing, or watch a guided tour.

Adopt:

- Add a "Get help choosing" row above the compare grid.
- Pair three actions:
  - "Shop Nets"
  - "Talk to an Expert"
  - "Watch Size Guide"
- Keep the comparison UI visible immediately below those actions.

Why it fits:

Net Return buyers often need reassurance on room size, garage fit, and model differences. Apple's structure normalizes asking for help without making the user feel stuck.

### 2. GoPro-style product selector comparison

GoPro's compare page is built around selectable products and grouped specs. The key pattern is not just the table; it is the ability to choose which models are in the comparison.

Adopt:

- Let shoppers compare any 2-3 nets from collection cards.
- Group specs into expandable sections:
  - Fit and dimensions
  - Use case
  - Portability and setup
  - Warranty and included parts
- Add "Shop" and "Learn more" actions inside each compared model column.

Why it fits:

The Net Return has fewer products than GoPro, but the size-choice problem is similar. A selector-driven comparison tray would make the collection flow much stronger.

### 3. YETI-style faceted shopping language

YETI's filters are not technical SKU filters alone. They match how people shop: size, color, beverage type, lid type, features, lifestyle.

Adopt:

- Use fit-based filters:
  - Width
  - Height
  - Indoor/outdoor
  - Garage/backyard/commercial
  - Portable/permanent
  - Budget
- Use customer language in labels rather than internal product-family labels.

Why it fits:

"Pro 8" is a product name. "8 ft ceiling" is a customer problem. The filter language should start with the problem.

### 4. Meta-style immersive hero with one clear CTA

Meta's AI Glasses page works because the hero is product-in-use, emotional, and simple: headline, supporting copy, starting price, sale anchor, one button.

Adopt:

- Use immersive product-in-use hero sections for major category pages.
- For `/collections/nets-1`, show a net in a real garage/backyard context rather than only product renders.
- Keep one primary CTA per hero: "Find Your Net" or "Compare Sizes."

Why it fits:

Nets are spatial products. The first visual should help the customer imagine the setup in their own space.

### 5. Blue Tees-style ecosystem merchandising

Blue Tees uses a compact product ecosystem: rangefinders, GPS speakers, launch monitors, accessories, app, and replacement cases. Their category page also cross-sells "Complete your gear."

Adopt:

- Add "Complete your practice setup" sections under nets:
  - Side barriers
  - Turf/mats
  - Sandbags/weights
  - Simulator accessories
- Pair every net/product card with one small "pairs well with" hint.

Why it fits:

Net Return has obvious add-ons and package upsells. This can increase AOV without feeling like an unrelated upsell.

### 6. Trust strip close to the buying decision

Blue Tees and the golf simulator retailers put trust close to product discovery: shipping, warranty, returns, expert support, authorized dealer positioning.

Adopt:

- Add trust chips above product grids and compare modules:
  - Free shipping
  - 3-year warranty
  - 30-day money-back guarantee
  - Automatic ball return
  - Since 2009
- Keep them compact; avoid a large decorative section that pushes products down.

Why it fits:

These claims answer objections at the moment the shopper is choosing between models.

## What Not To Copy

### Blocking popups too early

Blue Tees showed a first-order discount popup before the visitor could evaluate the category. Truegolfs also triggered an interruptive modal in earlier research.

Recommendation:

- Avoid full-screen or center-screen popups on compare and collection pages.
- Prefer a small delayed offer or bottom sheet after engagement.
- Do not cover product specs or comparison controls.

### Overlong mobile hero copy

Some golf simulator retailers use long collection intros before the product grid. This helps SEO but can delay shopping.

Recommendation:

- Keep mobile category intros short above products.
- Put long SEO/buying-guide copy below the first product module or inside accordions.

### Bot-gate fragility

YETI and GoPro blocked automated screenshots. This is not a design issue by itself, but it reminds us to keep Net Return preview/QA accessible for testing tools.

Recommendation:

- Avoid over-aggressive bot tooling on theme previews and core product pages.
- Make sure product grids, compare tools, and CTAs are testable with Playwright/Lighthouse.

## Component Backlog For The Net Return

### P0: Assisted compare header

Add an Apple-inspired row above the compare module:

- "Shop Nets"
- "Talk to an Expert"
- "Watch Size Guide"

### P0: Collection compare tray

Add GoPro-style selectable comparison to collection cards. Let users compare selected models without leaving the collection.

### P1: Fit-based filter drawer

Use YETI-style customer-language filters: width, height, use case, budget, indoor/outdoor, portability.

### P1: Complete-your-setup carousel

Use Blue Tees-style ecosystem merchandising to show accessories and packages related to the selected net size.

### P1: Product-in-space hero

Use Meta-style immersive hero treatment for major collection pages. The image/video should show the net in a real garage, backyard, or simulator setup.

### P2: Guided video CTA

Use Apple's guided-tour pattern for a "Watch Size Guide" video that explains Junior/Mini/Home/Pro/Pro XL in under 90 seconds.

### P2: Spec-group accordions

Use GoPro-style spec grouping for product pages and compare pages: dimensions, setup, portability, included parts, warranty.

## Priority Recommendation

Build in this order:

1. Assisted compare header.
2. Collection compare tray.
3. Fit-based collection filters.
4. Complete-your-setup carousel.
5. Product-in-space collection hero.

The first two connect directly to the compare-page work already completed and should improve mobile decision flow fastest.
