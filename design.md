# TheNetReturn Brand Revamp Design Brief

Use this file as a Stitch-ready source brief for faster mockup iteration. It reflects the current Shopify theme layout in this workspace as of 2026-05-20, plus the in-progress 2026 brand revamp layer.

## Project Context

TheNetReturn is a premium golf practice, sports net, package, and simulator brand. The current Shopify theme is a heavily customized Focal theme with a new brand revamp layer being added in phases.

Primary design goal: keep the proven ecommerce structure, but make it feel more premium, sharper, more athletic, and more product-confident. The site should feel like a serious training equipment brand, not a generic Shopify catalog.

## Current Global Layout

Top of page:

1. Brand marquee announcement bar
   - Glow Green background.
   - Black mono uppercase text.
   - Repeating messages: free shipping, warranty, Bryson trust, 30-day trial.
   - Precision+ glyph separators.

2. Sticky header
   - Pure black surface.
   - White Net Return wordmark.
   - Centered desktop logo/navigation layout.
   - Uppercase nav links with Emerald Precision+ glyphs.
   - Dark dropdown and mega menu.
   - Mobile drawer is dark, but this styling is intentionally scoped only to the mobile menu drawer.

3. Existing announcement bar
   - Still present in the header group, but disabled.

Footer:

1. Legacy footer trust row
   - Text-with-icons section remains above the footer.
   - Current copy: 3-Year Warranty, Free shipping, Customer service, Since 2009.

2. Brand footer CTA
   - Shadow Green panel.
   - Subtle Precision+ grid pattern overlay.
   - Centered heading: "Talk to a Net Return advisor".
   - Body: "Get help spec'ing the right net, package, or simulator for your space and your game."
   - Emerald CTA: "Book a call now".

3. Main footer
   - Shadow Green surface.
   - White text.
   - Mono uppercase block headings.
   - Footer links use Emerald Precision+ glyph prefixes.
   - Newsletter input uses a bottom rule and Emerald focus state.

## Current Homepage Structure

The current `templates/index.json` order is:

1. Slideshow hero
   - Active slides include Bryson U.S. Open image and a home net image.
   - Current headlines include "Trusted by the Champion" and "The #1 Net in Golf".
   - Legacy green CTAs remain on the active hero slides.

2. Trust bar

3. Disabled promotional/app sections
   - Several older promo/timer sections remain disabled in the template.

4. Best Sellers product rail
   - AI generated block.
   - Collection: `best-sellers-bfcm`.
   - Product cards and add-to-cart behavior are still largely legacy Focal styling.

5. Category grid
   - Four categories:
     - Nets
     - Packages
     - Simulation
     - Accessories
   - Existing images point to Shopify assets, and local optimized category assets are also staged:
     - `assets/home-nets.jpg`
     - `assets/home-packages.jpg`
     - `assets/home-packages-backyard-patio.jpg`
     - `assets/home-sim-series.jpg`
     - `assets/home-accessories.jpg`

6. 3D logo spin video
   - Uses `newlogo-3dspin.mp4`.

7. Product feature tabs
   - Pro Series.
   - Sim Series.

8. Black benefits strip
   - Instant Ball Return.
   - Easy to Assemble.
   - Indoor or Outdoor.
   - Premium Design.

9. "Build Your Practice Setup" image overlay
   - Full-width image.
   - Centered white text.
   - CTA: Get Started.

10. Feature explanation block
   - Instant Ball Return.
   - Quick Assembly.

11. Quiz CTA
   - "Find The Perfect Setup".
   - CTA: take the quiz.

12. Simulation image overlay
   - Title: Simulation.
   - CTA: Shop Simulation.

13. Bryson testimonial block
   - "Trusted by the Pros".
   - Quote: "I've been using Net Return since I was 15 years old. There is not another net out there that I would trust."

14. Video section
   - Vimeo URL.

15. Loox review carousel

## Brand Tokens

Use these as the current revamp palette:

- Emerald: `#009C43`
- Shadow Green: `#233A35`
- Glow Green: `#A5E6C6`
- Neon Green: `#68FD00`
- Black: `#000000`
- White: `#FFFFFF`

Current font reality:

- Theme currently uses Inter.
- Licensed brand fonts are deferred.
- Planned future direction:
  - Crystal by NewGlyph for bold/condensed athletic display moments.
  - Miracle Mono by Keith Zo for mono technical labels and utility text.

Until brand fonts are available:

- Use Inter or a close geometric sans for body and primary UI.
- Use mono uppercase labels for technical/trust/navigation details.
- Use condensed/expanded display styling through weight, scale, spacing, and composition rather than requiring the final font.

## Brand Assets Available In Theme

Wordmarks:

- `assets/nr-wordmark-white.png`
- `assets/nr-wordmark-black.png`
- `assets/nr-symbol-white.png`
- `assets/nr-symbol-black.png`

Precision+ mark and patterns:

- `assets/precision-plus-white.svg`
- `assets/precision-plus-black.svg`
- `assets/precision-plus-shadow-green.svg`
- `assets/pattern-grid-black.svg`
- `assets/pattern-grid-glow-green.svg`
- `assets/pattern-grid-shadow-green.svg`
- `assets/pattern-grid-tile-white.svg`
- `assets/pattern-grid-tile-black.svg`

Homepage category image assets staged locally:

- `assets/home-nets.jpg`
- `assets/home-packages.jpg`
- `assets/home-packages-backyard-patio.jpg`
- `assets/home-sim-series.jpg`
- `assets/home-accessories.jpg`

## Design Direction For Stitch

Create homepage mockups that preserve the current ecommerce flow, but modernize the visual system.

Core feeling:

- Premium DTC sports equipment.
- High contrast.
- Clean and decisive.
- Product and athlete imagery first.
- Quietly technical.
- Confident, not playful.

Avoid:

- Generic Shopify card stacks.
- Beige, tan, brown, dark blue, or purple-led palettes.
- Gradient orb backgrounds.
- Decorative blobs.
- Stock-photo feeling.
- Overly rounded UI.
- Explainer text that describes the interface instead of selling the product.

## Mockup Target: Homepage

Recommended above-the-fold structure:

1. Glow Green marquee at the very top.
2. Black sticky header with centered white wordmark.
3. Full-bleed hero using real golf/net imagery.
4. Large headline:
   - "Train With Intent."
   - Or "The Net That Sends Every Ball Back."
5. Supporting copy:
   - Focus on instant ball return, real ball speeds, indoor/outdoor setup, and premium durability.
6. Primary CTA:
   - Shop Nets.
7. Secondary CTA:
   - Build Your Setup.
8. Keep a hint of the next product/category section visible below the fold.

Recommended homepage flow after hero:

1. Category selector/grid
   - Nets+
   - Packages+
   - Simulation+
   - Accessories+
   - Large image tiles, not tiny cards.
   - Use Precision+ glyphs as controlled accents.

2. Best sellers/product proof
   - 3 to 4 product cards.
   - Clean price/add-to-cart treatment.
   - Use Emerald for primary actions.

3. Training benefits band
   - Instant Ball Return.
   - Easy Assembly.
   - Indoor or Outdoor.
   - Premium Design.
   - Prefer a black or Shadow Green band with white text.

4. Feature story
   - Pro Series / Sim Series split or tabbed feature.
   - Large product image.
   - Sparse copy.
   - Strong CTA.

5. Build Your Practice Setup
   - Full-width lifestyle image.
   - Overlay copy.
   - CTA to setup builder.

6. Bryson/social proof section
   - Athlete image or portrait.
   - Quote treatment.
   - Use outlined display typography sparingly, e.g. a giant "BRYSON" background word.

7. Quiz CTA
   - "Find The Perfect Setup".
   - Should feel like a guided product finder, not a generic form CTA.

8. Reviews
   - Loox carousel or editorial quote row.
   - Keep compact and trust-building.

9. Footer CTA + footer
   - Preserve current Shadow Green footer direction.

## Component Notes

Buttons:

- Primary: Emerald background, white text.
- Hover/secondary accent: Neon Green with black text.
- Outline: white or black stroke depending on surface.
- Radius should stay tight, about 2 to 4px.
- Labels should be short, uppercase, and action-oriented.

Cards:

- Product/category cards should be image-led.
- Use hard edges or small radius only.
- Avoid nested cards.
- Avoid excessive shadows.

Typography:

- Use large, confident display headlines only in hero or major feature sections.
- Use mono uppercase labels for category tags, trust points, nav, and footer headings.
- Body copy should be concise and premium, not explanatory.

Pattern use:

- Precision+ grid pattern works best as a subtle overlay on dark or Shadow Green surfaces.
- Do not use the pattern behind dense text.
- Use the single Precision+ glyph as bullets, separators, nav accents, and small proof markers.

Mobile:

- First viewport should show marquee, compact header, strong hero image, headline, and at least one CTA.
- Category grid should become a horizontal or 2-column scan-friendly layout.
- Avoid long centered paragraphs.
- Keep buttons large enough for touch.

## Stitch Prompt: Homepage Revamp

Generate a premium ecommerce homepage mockup for TheNetReturn, a golf practice net and simulator brand. Preserve the current site structure: glow-green top marquee, black sticky header with white wordmark, full-bleed hero, category grid for Nets / Packages / Simulation / Accessories, best sellers product rail, benefits band, build-your-setup CTA, Bryson testimonial proof, reviews, and Shadow Green footer CTA. Use a high-contrast palette of black, white, Emerald `#009C43`, Shadow Green `#233A35`, Glow Green `#A5E6C6`, and Neon Green `#68FD00`. The design should feel premium, athletic, technical, and conversion-focused. Use real product/lifestyle imagery, tight-radius buttons, mono uppercase labels, sharp spacing, and Precision+ plus-mark accents. Do not create a marketing landing page detached from ecommerce; show the actual shopping experience.

## Stitch Prompt: Category Grid Exploration

Generate a focused mockup for the homepage category section. Use four image-led tiles: Nets+, Packages+, Simulation+, Accessories+. Make the section feel premium and athletic, with strong product imagery, black/white text contrast, small Emerald Precision+ accents, and direct paths to shop. Avoid generic cards and oversized descriptive text. The section should scan quickly on desktop and convert to a mobile layout that remains easy to tap.

## Stitch Prompt: Product Detail Direction

Generate a premium product page direction for TheNetReturn that matches the homepage revamp. Keep the ecommerce essentials: image gallery, product title, review proof, price, variant/options, add-to-cart, warranty/shipping trust points, product benefits, setup/assembly details, comparison or recommendation module, and reviews. Use the same black/white/Emerald/Shadow Green brand system. Prioritize clarity around which net/package/simulator is right for the customer.

## Stitch Prompt: Footer And Trust System

Generate footer and trust-section refinements for TheNetReturn. Preserve the Shadow Green footer CTA with "Talk to a Net Return advisor" and "Book a call now." Include trust points for warranty, free shipping, customer service, since 2009, reviews, and pro/athlete credibility. Use mono uppercase headings, white text, Emerald plus glyphs, and a subtle Precision+ grid overlay. Keep it clean and compact.

## Open Questions For Next Design Pass

- Should the new homepage hero lead with "Train With Intent." or a more direct commerce headline like "The Net That Sends Every Ball Back"?
- Should the category grid say "Simulation" or "Simulators"?
- Should Bryson proof appear in the first viewport or later as a credibility section?
- Should the setup-builder CTA be a major hero secondary CTA or a dedicated mid-page module?
- Should the old 3D logo spin video remain, or should it be replaced by product motion/assembly footage?
