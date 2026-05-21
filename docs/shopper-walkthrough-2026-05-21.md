# Shopper walkthrough — homepage & purchase intent

**Date:** 2026-05-21
**Theme:** `brand-revamp-2026` branch, dev preview (theme `149375975517`) on `localhost:9292`
**Viewports tested:** Desktop 1280×900, Mobile 375×812
**Method:** Walked the page section-by-section and clicked the CTAs a first-time shopper would actually click (Shop nets, Compare models, View Details, hamburger menu).

This is a shopper-POV pass — not a code audit. Tone is "I'm a guy looking at a new golf net for my garage; would I buy it?"

---

## TL;DR for whoever is reading

The homepage **looks like a $1,500 product**. Photography, typography, hero, the Bryson moment, the Setup Rooms — all premium and on-brand. The shopper-experience problems are not aesthetic; they're **trust, friction, and "what do I do next"** problems:

1. Developer concept badges (`CONCEPT A · ACCORDION`, `CUSTOMER SETUPS`) are visible to a shopper.
2. A countdown popup with a 39-second timer is the **first interaction** after landing.
3. Free-shipping copy contradicts itself in three places.
4. The hero takes the whole viewport on mobile — the headline, body, and both CTAs are below the fold on a 375×812 phone.
5. The mini builder has step labels `01 / 02 / 05` (skips 03 and 04), and the net options are named "Home / Pro / Pro 8 / Pro 9" with no explanation of what's different. As a first-time shopper, **I don't know what to click.**
6. The Setup Rooms image for "The Garage" is actually a rooftop patio with a sofa and a skyline.

The good news: most of these are small. None of them are "rebuild the homepage." Several are one-line config changes.

---

## What I liked (genuinely)

- **The hero photo.** Indoor studio, real player mid-follow-through, the net in frame. Aspirational and specific. I immediately know what this product is for.
- **"The #1 Net In Golf."** Confident headline, no hedging. I respect it. The body copy below — "Hit real golf balls at home without chasing them down" — that's the actual job. That sentence sells the product.
- **The Bryson DeChambeau panel.** "Trusted by Bryson" / "The net he trusts at home" with his name as a giant outline behind him. This is the single strongest moment on the page. Best-in-class.
- **The customer setups grid.** Real photos of real people's garages and backyards. The Mike T. quote — *"I bought three nets before this one. The first ripped in a month. The second sagged. The third lost tension."* — that's the moment I went from "looking" to "actually thinking about buying." It pre-handles my objection.
- **Setup Rooms.** "Where will you train? Garage / Backyard / Studio / Pro Shop." Smart segmentation. Lets shoppers self-identify and shop for *their* situation, not generic "products."
- **The proof system diagram.** Net on the right, numbered callouts on the left with green dots on the net image. Educational, clean, and tells me *why* the patented S-shape matters. I'd actually read it.
- **PDP variant switcher.** The "Home" net product page lets me swap to Pro / Pro 8 / Pro 9 / etc. without leaving the page. That's the right pattern for a product line.
- **Sticky add-to-cart bar on PDP.** Mini-card with product name, price, ADD TO CART that follows as I scroll. Good.
- **VIEW IN 3D / VIEW IN MY SPACE on PDP.** AR for a big-footprint product is exactly what shoppers need — "will this fit in my garage?" is the #1 objection.
- **Mobile mega menu.** Full-screen, with a hero image and a written explainer ("Find the right net, package, or add-on") before the links. Most mobile menus are link soup. This one isn't.
- **The "Book a call now" closer.** Right before the footer, a Shadow-green panel saying "Talk to a Net Return advisor" with a real CTA. For a high-consideration product this is the right move.

---

## What I didn't like

### Trust-breakers (fix these first)

1. **Developer concept badges leaking to the front end.** Green pills reading **`CONCEPT A · ACCORDION`** sit above the category mosaic, and **`CUSTOMER SETUPS`** sits above the customer-photo grid. These look like internal QA tags. To a shopper they read "this site isn't finished." Probably driven by `show_concept_badge: true` in section settings — should be off in production.
2. **Free-shipping message contradicts itself in three places.**
   - Announcement bar: "FREE SHIPPING ON ORDERS OVER $250"
   - Footer trust bar: "Free Standard UPS Shipping for all the orders."
   - PDP trust badge: "FREE Shipping on ALL Products – LIMITED TIME"
   Pick one. As a shopper this either reads as a bait-and-switch or makes me question whether anything else on the page is true.
3. **Rating inconsistency between collection page and PDP.** Nets collection shows the *same* "4.9 ★ (2007 reviews)" on every product. The Home PDP shows "5.0 ★ (1819 reviews)." Either the collection card pulls a store-wide aggregate or both numbers are wrong — either way it's the kind of thing a careful shopper notices and flags as fishy.
4. **Mystery-Offer popup with a 39-second countdown is the first interaction.** I haven't scrolled, I haven't looked at a product, and I'm being asked for my email to "reveal" an offer. It also re-appears on every collection/PDP navigation. Move it to scroll-trigger or exit-intent, not "instant on first paint."
5. **Persistent "WANT A MYSTERY OFFER?" tab in bottom-left covers content.** It sits over the customer-setups grid and the brand film section.
6. **"Free Standard UPS Shipping for all the orders."** ungrammatical — "for all the orders" should be "on all orders".

### Friction in the shopping flow

7. **Mobile hero hides the message.** On 375×812 the hero image fills the full viewport. I have to scroll to see "The #1 Net In Golf", the body copy, and the SHOP NETS / COMPARE MODELS buttons. A first-time shopper on mobile may bounce before seeing the value prop.
8. **Mini-builder step labels: `01 / 02 / 05`.** Two empty collections (`launch_monitors_collection: ""`, `screens_collection: ""`) make the visible step labels skip 03 and 04. The footer counter correctly says "STEP 1 OF 3," so the labels and the counter disagree. Either renumber on the fly (01 / 02 / 03) or hide the step number entirely.
9. **Mini-builder net names are unexplained.** Radios read "Home / Pro / Pro 8 / Pro 9" with prices and nothing else. What's the difference? Why is Pro 9 $200 more than Pro? Add a one-line spec under each option (the collection page already has these: *"Garage-ready setup in minutes", "Versatile size for indoor and outdoor use", "Used by Bryson for home practice"*).
10. **Setup Rooms image mismatch.** "The Garage" scenario shows an outdoor rooftop patio with a string of bulb lights, a couch, and a city skyline. That is not a garage. (Backyard, Studio, and Pro Shop images are fine.) The Studio and Pro Shop also appear to share what looks like the same indoor-simulator photo.
11. **Collection cards say "VIEW DETAILS" instead of "ADD TO CART" or "SHOP HOME."** I've already chosen — make me click once to buy, not twice. The compare page does this right ("SHOP PRO 8", "SHOP HOME"), the nets collection doesn't.
12. **PDP breadcrumb is "Home / Home"** on the Home net (the page hierarchy crumb "Home" + product name "Home"). Reads like a glitch. Either rename the product display to "Home Series Net" or change the crumb to "Nets / Home."
13. **The "TAKE THE QUIZ" CTA before the testimonial wall is styled differently from every other green CTA on the page** — sentence-case label and a slightly different green. It also lives in a section that has almost no context ("NEED MORE INFO? Find The Perfect Setup"). Either give it more setup or fold it into a CTA on an existing section.
14. **Two person icons in the header.** There's a mail icon, then a person, then a person, then cart. One of the person icons appears to be Login and the other Account; from a shopper POV it's two people standing next to each other, which is confusing.

### What I was trying to find but couldn't

15. **A price range up front.** Hero says "Shop nets" but never hints whether this is a $300 backyard net or a $3,000 commercial setup. A shopper bouncing on price would have to click through to even know if it's in their universe.
16. **Sport context.** It says "#1 Net In Golf" — got it. But the actual products are called *"Golf and multi-sport nets."* Multi-sport for *what*? Baseball? Soccer? Lacrosse? On the homepage I never see a single non-golf use case. If multi-sport is a real value driver, surface it; if it isn't, drop it from product names.
17. **Made in / where it ships from.** For a 50-pound steel-frame product, shipping origin and lead time matter. I can't find either on the homepage or above the fold on the PDP.
18. **What's actually inside a "Package."** The category mosaic says *"Net, mat, side barriers, sandbags, tees, and a duffel — bundled to swing the day it lands."* That's the best line on the page. But there's no visual of what's in the box. A bundle photo or a simple ingredient list would close the sale.
19. **A way to see all nets compared on one screen.** The Compare page is buried behind the hero's secondary CTA, and the chips ("UNDER 5 FT WIDE", "UP TO 7 FT WIDE", etc.) are a quiz, not a comparison table. A side-by-side spec grid (price / size / weight / ball speed rating / warranty) is what shoppers actually want at the compare step.
20. **Where Bryson actually shows up.** "Trusted by Bryson" is a great line, but the Bryson section links to a `/pages/bryson-dechambeau-the-net-return` landing. I'd want a quick "Watch Bryson hit into this" video right there on the homepage, not a click away.

### What I wish there was more of

21. **Video.** There's one short film block ("Every Ball Comes Back") which is good. But for a product whose entire value prop is *"the ball comes back to you"* — show me. Slow-mo. Multiple angles. Bryson swinging into it. Right now I have to take the headline's word for it.
22. **A "What's it like to set this up" beat.** "10 min" tool-free setup is mentioned once in the proof diagram. Show it. A 6-second timelapse of someone assembling it answers half the "is this annoying" objections.
23. **Reviews surfaced higher.** The Mike T. quote is the strongest persuader on the page, and it's halfway down. The hero or the section right under it could carry an aggregated star rating ("4.9 ★ across 12,000+ reviews") to anchor trust at the top.
24. **Risk reversal earlier.** The "30-DAY RISK-FREE TRIAL" line is in the rotating announcement bar and in the footer trust strip. For a $700–$1,600 purchase that's the *single most-important* line to a hesitant shopper — it deserves to sit next to the hero CTAs.

---

## Section-by-section quick notes

| # | Section | Verdict | Single biggest fix |
|---|---------|---------|--------------------|
| 1 | Hero "The #1 Net In Golf" | Strong | Mobile: shrink hero so CTAs sit above the fold |
| 2 | Category Mosaic ("Industry-leading sport nets") | Strong copy, weak image for Accessories tile | Turn off `show_concept_badge`; replace Accessories tile image (it's currently the NR logo on a net texture, not an accessory) |
| 3 | Customer Setups grid + Mike T. quote | **Best on the page** | Turn off `show_concept_badge`; consider moving higher |
| 4 | Brand film ("Every Ball Comes Back") | Fine | Make it longer / add slow-mo |
| 5 | Bryson feature | **Hero-tier** | Add inline video of him hitting into the net |
| 6 | Setup Rooms (Garage / Backyard / Studio / Pro Shop) | Strong concept | Fix "Garage" image (it's a patio); de-dup Studio vs Pro Shop image |
| 7 | Proof System diagram | Strong | Clarify what "250K" means — number of shots? Frame rating? It's currently floating without context |
| 8 | Mini builder | Strong concept | Fix `01/02/05` step numbering; add a one-line spec under each net option |
| 9 | "Find The Perfect Setup" quiz CTA | Filler | Either remove or give it real lead-in |
| 10 | Testimonial wall | Strong | Show "5.0 VERIFIED" pill consistently on every tile (currently inconsistent) |
| 11 | Trust strip (warranty / shipping / support / since 2009) | Fine | Fix shipping copy contradiction |
| 12 | "Book a Call Now" closer | Strong | Keep as is |
| 13 | Footer | Clean | Move "B2B Login" out of the SHOP column; rename "Recommendations Quiz" → "Setup Quiz" |

---

## Most damaging issues, ranked

Ranked by "how much would this cost the store in lost orders." Concrete asks, not abstract feedback.

1. **`show_concept_badge: true` is on in production-mirror.** Visible on at least two sections (category accordion, customer setups). Set to `false` in all `templates/index.json` section settings, or strip the badge render in the section liquid before launch.
2. **Mystery-offer popup on first paint with a 39s countdown.** Move trigger to scroll-50% or 30-second timeout. The current behavior reads as desperate and obscures the product on every page.
3. **Shipping copy is internally inconsistent.** Decide the actual policy and use the same sentence in the announcement bar, footer trust strip, and PDP badge.
4. **Mobile hero pushes the value prop below the fold.** Cap hero height to ~80vh on mobile so headline + CTAs are visible without scrolling. (Desktop is fine.)
5. **Mini-builder step labels `01 / 02 / 05` + opaque net names.** Renumber on the fly, and add a one-liner under each variant.
6. **"The Garage" Setup Rooms image is a rooftop patio.** Swap to an actual garage photo.
7. **Rating mismatch: 4.9/2007 on collection vs 5.0/1819 on PDP.** Reconcile the source.
8. **Collection cards use "VIEW DETAILS" instead of a direct shop CTA.** Cheap conversion win.

---

## Things I'd want before another pass

- The Bryson video asset, if it exists.
- Confirmed shipping policy from the merchant (free over $X? or always free?).
- A "what's in the box" photo for each package SKU.
- The actual ball-speed / shot-count rating ("225 MPH" appears on the Compare page but not the homepage). It belongs in the proof diagram.
- Whether "Mini" / "Junior" are meant to be a separate brand tier or the same family. Right now they read as kids' products, which may be a different intent than what's wanted.
