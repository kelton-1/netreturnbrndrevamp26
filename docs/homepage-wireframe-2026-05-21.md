# Homepage wireframe — current state

**Branch:** `brand-revamp-2026`
**Source:** `templates/index.json` + `sections/header-group.json` + `sections/footer-group.json`
**Date:** 2026-05-21
**Purpose:** Conversation anchor for re-ordering / re-purposing sections. ASCII frames show approximate desktop layout. Mobile notes appended where the section behaves differently. Disabled-but-still-in-the-template sections are listed at the bottom.

---

## Page skeleton (10 active body sections, top → bottom)

```
                  HEADER GROUP (sticky)
        ╭───────────────────────────────────────────╮
        │  ① marquee   ↻ rotating promo bar         │
        │  ② header    [SHOP][EXPLORE][LEARN]       │
        │              LOGO  [search][acct][cart]   │
        ╰───────────────────────────────────────────╯

                  BODY (templates/index.json render order)
   1.  HERO                  "The #1 Net In Golf"
   2.  CATEGORY MOSAIC       4 tiles  Nets/Packages/Sim/Accessories
   3.  CUSTOMER SETUPS       Mike T. quote + photo grid
   4.  BRAND FILM            8-sec product video
   5.  BRYSON FEATURE        "Trusted by Bryson"
   6.  SETUP ROOMS           Garage/Backyard/Studio/Pro Shop
   7.  PROOF DIAGRAM         Net with 4 numbered callouts
   8.  MINI BUILDER          5-step setup builder
   9.  QUIZ CTA              "Find the perfect setup"
   10. TESTIMONIAL WALL      4 customer quotes

                  FOOTER GROUP
   11. BOOK-A-CALL CTA       "Talk to a Net Return advisor"
   12. TRUST STRIP           Warranty / Shipping / Support / Since 2009
   13. FOOTER                Link columns + email + socials
   14. PAYMENT BAR           Country selector + card icons
```

---

## Header group (always visible)

### ① Brand marquee — `brand-marquee`
**Job:** Rotating promo strip. Currently 4 items at ~28s cycle.
```
┌─────────────────────────────────────────────────────────────────┐
│ +  Free shipping on orders over $250  +  3-yr warranty  +  ...  │  ← 28s scroll
└─────────────────────────────────────────────────────────────────┘
```
Items: *Free shipping on orders over $250* · *3-year warranty on every net* · *Trusted by Bryson DeChambeau* · *30-day risk-free trial*.
Sibling `announcement-bar` section is **disabled** (held in reserve for Masters Sale / event-based promos).

### ② Site header — `header` (Focal default, wnw-augmented)
```
┌─────────────────────────────────────────────────────────────────┐
│  + SHOP   + EXPLORE   + LEARN     LOGO     🔍  👤  👤  🛒  ☰   │
└─────────────────────────────────────────────────────────────────┘
```
Three nav columns left, centered NETRETURN wordmark, icons right (search, mail, account, cart, mobile hamburger). Two person icons visible on desktop — login vs account — currently undifferentiated to the eye.

---

## Body sections

### 1. HERO — `brand-hero` *(section key: `brand_hero_train_with_intent`)*

**Job:** Set the brand promise in one frame. Anchor for "Shop nets" vs "Compare models" intent.

**Desktop layout (`height: full`, dark image with overlay):**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                                                                 │
│                  [ FULL-BLEED HERO PHOTO ]                      │
│                  golfer hitting into net                        │
│                                                                 │
│  THE NET RETURN                                                 │
│                                                                 │
│  The #1 Net In Golf.                                            │
│                                                                 │
│  Hit real golf balls at home without chasing them down.         │
│  The Net Return sends every shot back, sets up fast, and        │
│  fits garages, backyards, studios, and simulator builds.        │
│                                                                 │
│  [ SHOP NETS ]   [ COMPARE MODELS ]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
Text block sits bottom-left. Overlay strength 55. Primary CTA `/collections/nets-1`, secondary CTA `/pages/compare`.

**Mobile:** Same image, text stack centers near bottom. After today's fix the headline + body + both CTAs sit above the fold on 375×812.

---

### 2. CATEGORY MOSAIC — `brand-category-accordion` *(section key: `brand_category_mosaic`)*

**Job:** First "what can I shop?" decision. Funnels into 4 product collections.

```
┌─────────────────────────────────────────────────────────────────┐
│   + Shop the system                                             │
│                                                                 │
│   Industry-leading sport nets.                                  │
│   Made to bring training to you.                                │
│                                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                         │
│  │ NETS │  │PACKS │  │ SIM  │  │ ACC  │  ← hover expands tile   │
│  │      │  │      │  │      │  │      │                         │
│  │ desc │  │ desc │  │ desc │  │ desc │                         │
│  │ Shop→│  │ Shop→│  │ Shop→│  │ Shop→│                         │
│  └──────┘  └──────┘  └──────┘  └──────┘                         │
└─────────────────────────────────────────────────────────────────┘
```
Each tile: photo, label (NETS/PACKAGES/SIMULATION/ACCESSORIES), short description, "Shop X →" CTA.
Tile copy currently differentiates by use-case: *"Patented S-shape returns the ball to your feet. Five sizes — garage to backyard to commercial-grade."* etc.
Two sibling layouts exist (`brand-category-grid`, `brand-category-rail`) — both **disabled**.

**Mobile:** Four tiles stack vertically full-width.

---

### 3. CUSTOMER SETUPS — `brand-customer-setups` *(section key: `brand_customer_setups_main`)*

**Job:** Social proof + objection handling. The Mike T. quote pre-empts "will this last."

```
┌─────────────────────────────────────────────────────────────────┐
│                          + From our reviews                     │
│                                                                 │
│    "I bought three nets before this one. The first ripped      │
│     in a month. The second sagged. The third lost tension.     │
│     This is the only one I haven't had to replace."             │
│                                                                 │
│                    MIKE T. · OWNER SINCE 2019                   │
│                                                                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                                    │
│  │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │  ← 4-col grid, 18 customer photos  │
│  └────┘ └────┘ └────┘ └────┘    cycling every 5s                │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                                    │
│  │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │                                    │
│  └────┘ └────┘ └────┘ └────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```
**Mobile:** Grid collapses to 2 columns. Quote stays full-width.

---

### 4. BRAND FILM — `brand-film` *(section key: `brand_film_homepage`)*

**Job:** Show the product in motion. Reinforces "Every ball comes back."

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              [ AUTOPLAY MUTED LOOP – 8 SECONDS ]                │
│                                                                 │
│   02  Every Ball Comes Back                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
Step number "02", label overlay, Shadow-green gradient backdrop. Currently a short loop — no narration, no scroll-pin effect (both pinned/drift options exist in schema, both off).

---

### 5. BRYSON FEATURE — `brand-bryson-feature` *(section key: `brand_bryson_feature`)*

**Job:** Celebrity endorsement. Strongest single trust moment on the page.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  TRUSTED BY BRYSON                                              │
│                                  ┌─────────────────────────┐    │
│  The net he trusts at home.      │                         │    │
│                                  │      [ photo of         │    │
│  Bryson DeChambeau has used      │        Bryson with      │    │
│  The Net Return since he was     │        outline-text     │    │
│  15. The reason is simple:       │        "BRYSON" behind  │    │
│  the ball comes back, the        │        him ]            │    │
│  setup holds up, and practice    │                         │    │
│  keeps moving.                   └─────────────────────────┘    │
│                                                                 │
│  [ Shop Bryson's setup ]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
Display word "BRYSON" sits outlined across his torso — strongest type-photo composition on the page. Links to `/pages/bryson-dechambeau-the-net-return`.

**Mobile:** Photo stacks above text.

---

### 6. SETUP ROOMS — `brand-setup-rooms` *(section key: `brand_setup_rooms_main`)*

**Job:** Help shoppers self-identify by environment, not by product. Routes each persona into a collection.

```
┌─────────────────────────────────────────────────────────────────┐
│   + Setup rooms                                                 │
│                                                                 │
│   Where will you train?                                         │
│   Different spaces. Same system. Pick the room you're          │
│   building for and we'll show you the gear that fits.           │
│                                                                 │
│  ┌─────────────────────┐                                        │
│  │ 01 THE GARAGE       │     The Garage                         │
│  │   [photo]           │     Concrete floor, low ceiling,       │
│  │                     │     big swings.                        │
│  │                     │     [ SHOP THIS SETUP → ]              │
│  └─────────────────────┘                                        │
│                                                                 │
│                                  ┌─────────────────────┐        │
│   The Backyard                   │ 02 THE BACKYARD     │        │
│   Sun, breeze, and a real        │   [photo]           │        │
│   range vibe.                    │                     │        │
│   [ SHOP THIS SETUP → ]          │                     │        │
│                                  └─────────────────────┘        │
│                                                                 │
│  ┌─────────────────────┐                                        │
│  │ 03 THE STUDIO       │     The Studio                         │
│  │   [photo]           │     Indoor reps, tour-grade            │
│  │                     │     simulation.                        │
│  │                     │     [ SHOP THIS SETUP → ]              │
│  └─────────────────────┘                                        │
│                                                                 │
│                                  ┌─────────────────────┐        │
│   The Pro Shop                   │ 04 THE PRO SHOP     │        │
│   Commercial-grade bay built     │   [photo]           │        │
│   to hold up.                    │                     │        │
│   [ SHOP THIS SETUP → ]          │                     │        │
│                                  └─────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```
Image alternates left/right per scenario. Each links to its respective collection (`/collections/home-series-2`, `/collections/packages`, `/collections/simulation`, `/collections/commercial-simulators`).

**Known issue:** Garage tile currently shows a rooftop patio image (not a garage). Studio and Pro Shop appear to use the same image.

**Mobile:** All four stack vertically, image on top, copy + CTA below.

---

### 7. PROOF DIAGRAM — `brand-proof-system-diagram` *(section key: `brand_proof_system_diagram`)*

**Job:** Educate. Explain *why* the patented S-shape matters and what's commercial-grade about it.

```
┌─────────────────────────────────────────────────────────────────┐
│   + Why golfers choose it                                       │
│                                                                 │
│   Built around the return.                                      │
│   The patented S-shape frame absorbs impact and sends the      │
│   ball back to your feet. Set it up without tools, use it      │
│   indoors or outdoors, and build from a standalone net to a    │
│   simulator setup when you are ready.                           │
│                                                                 │
│  ┌─────────────────────────┐  ┌────────────────────────────┐    │
│  │ 01  PATENTED            │  │     ●─ 03                  │    │
│  │     Automatic ball      │  │                            │    │
│  │     return              │  │   [ NET PHOTO ]            │    │
│  │                         │  │       ●─ 02                │    │
│  │ 02  250K                │  │  ●                         │    │
│  │     Built for real      │  │  01                        │    │
│  │     golf balls          │  │                            │    │
│  │                         │  │              ●─ 04         │    │
│  │ 03  10 MIN              │  │                            │    │
│  │     Tool-free setup     │  │                            │    │
│  │                         │  │                            │    │
│  │ 04  ANY SPACE           │  │                            │    │
│  │     Indoor, outdoor,    │  │                            │    │
│  │     simulator-ready     │  │                            │    │
│  └─────────────────────────┘  └────────────────────────────┘    │
│                                                                 │
│  [ BUILD YOUR SETUP ]                                           │
└─────────────────────────────────────────────────────────────────┘
```
Numbered callouts on the left mirror green dots on the net diagram on the right. Stat values (PATENTED / 250K / 10 MIN / ANY SPACE) act as eyebrow chips above each callout.
Sibling cinematic version `brand-proof-system-cinematic` exists but is **disabled**.

**Mobile:** Stack — diagram first, then callouts as accordion or list.

---

### 8. MINI BUILDER — `brand-mini-builder` *(section key: `brand_mini_builder_main`)*

**Job:** Convert browsers into bundle buyers without leaving the homepage. 5 steps, single-click add-to-cart.

```
┌─────────────────────────────────────────────────────────────────┐
│   + Build your setup                                            │
│                                                                 │
│   Build the bay you'll show up to.                              │
│   Five picks, one click. Net to simulator — live total,        │
│   one button adds the whole bundle.                             │
│                                                                 │
│  01 ─── 02 ─── 05      ← step rail (skips 03, 04 because       │
│  NET    MAT    EXTRAS    monitor/screen collections are empty) │
│                                                                 │
│  Choose your net.                ┌──────────────────────┐       │
│  ○ Home   $695                   │                      │       │
│  ○ Pro    $795                   │   [ NET PRODUCT       │       │
│  ○ Pro 8  $895                   │     IMAGE - updates  │       │
│  ○ Pro 9  $995                   │     w/ selection ]   │       │
│                                  │                      │       │
│  ← Back   STEP 1 OF 3   Cont →   └──────────────────────┘       │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ + YOUR SETUP                                           │     │
│  │ NET                              Home          $695.00 │     │
│  │ ─────────────────────────────────────────────────────  │     │
│  │ BUNDLE TOTAL                              $695.00      │     │
│  │ [   ADD THIS SETUP TO CART   ]                         │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```
Step labels currently driven by `step_N_short` settings. Two upstream collections (`launch_monitors_collection`, `screens_collection`) are empty strings → steps 3 & 4 skip, leaving visible labels `01 / 02 / 05`.
Net option labels are just SKU short names ("Home / Pro / Pro 8 / Pro 9") — no spec hint.

**Mobile:** Image hides, step rail + radio list + bundle summary stack full-width.

---

### 9. QUIZ CTA — `rich-text` *(section key: `rich_text_tkbxXR`)*

**Job:** Catch-all for shoppers still undecided. Routes to the quiz at `thenetreturn.com/pages/quiz`.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       NEED MORE INFO?                           │
│                                                                 │
│                  Find The Perfect Setup                         │
│                                                                 │
│                     [ TAKE THE QUIZ ]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
Centered, full-width band. Button uses sentence case ("take the quiz") and a slightly different green than the brand CTAs — visual outlier on the page. Currently the lightest-touch section: no image, no body copy beyond the heading.

---

### 10. TESTIMONIAL WALL — `brand-testimonial-wall` *(section key: `brand_testimonial_wall_main`)*

**Job:** Closing social proof. Four named owners across four use cases.

```
┌─────────────────────────────────────────────────────────────────┐
│   + Customer proof                                              │
│                                                                 │
│   Trusted in garages, backyards, and studios.                   │
│   Real setups, real reps, and the same reason people keep       │
│   coming back: the ball returns, the setup holds, and           │
│   practice feels easier to repeat.                              │
│                                                                 │
│  ┌─────────────────────┐  ┌──────────┐  ┌──────────┐            │
│  │ [5.0 VERIFIED]      │  │"Easy to  │  │"I        │            │
│  │ [FEATURED SETUP]    │  │put       │  │researched│            │
│  │                     │  │together, │  │a lot of  │            │
│  │ "I added The Net    │  │quick to  │  │options…" │            │
│  │ Return to my studio │  │start…"   │  │          │            │
│  │ because hitting     │  │          │  │ SCOTT W. │            │
│  │ into the screen     │  │ LINDA A. │  │ Garage   │            │
│  │ was too loud…"      │  │ Home     │  │ setup    │            │
│  │                     │  │ practice │  │          │            │
│  │ TOM W. · Pro Series │  │          │  │          │            │
│  └─────────────────────┘  └──────────┘  └──────────┘            │
│                                          ┌──────────┐            │
│                                          │"Screen   │            │
│                                          │and net…" │            │
│                                          │ JASON H. │            │
│                                          └──────────┘            │
│                                                                 │
│  [ Read more reviews ]                                          │
└─────────────────────────────────────────────────────────────────┘
```
Featured tile (Tom W.) is larger — left column, full height. Three smaller tiles tile to the right.
"5.0 VERIFIED" pill only appears on some tiles — inconsistent in current state.

**Mobile:** Featured tile full-bleed, then the other three stack underneath.

---

## Footer group (always at end of page)

### 11. BOOK-A-CALL CTA — `brand-footer-cta`

**Job:** Last chance to convert. Reframes for the consultative buyer.
```
┌─────────────────────────────────────────────────────────────────┐
│   (Shadow-green panel, + pattern background)                    │
│                                                                 │
│              Talk to a Net Return advisor                       │
│                                                                 │
│   Get help spec'ing the right net, package, or simulator        │
│   for your space and your game.                                 │
│                                                                 │
│                     [ BOOK A CALL NOW ]                         │
└─────────────────────────────────────────────────────────────────┘
```

### 12. TRUST STRIP — 4-col icon row
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   🛡️         │   📦         │   📞         │   🛍️         │
│ 3-YR WARRANTY│ FREE SHIPPING│ EXPERT SUPPORT│ SINCE 2009   │
│ on all nets  │ orders $250+ │ Our team is   │ 15+ yrs of   │
│              │              │ ready to help │ innovation   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### 13. FOOTER — link columns + newsletter + socials
```
┌──────────┬──────────┬──────────────┬─────────────────────┬───────────┐
│ SHOP     │ EXPLORE  │ LEARN        │ GET SETUP ADVICE    │ THE NET   │
│ Nets     │ Compare  │ About        │                     │ RETURN    │
│ Packages │ Testim.  │ Contact      │ "Setup tips, buying │           │
│ Sim.     │ Setups   │ Support      │ guides, product     │  fb       │
│ Access.  │ News     │ FAQ          │ updates…"           │  ig       │
│ Build…   │ Tips     │ Assembly     │                     │  yt       │
│ Quiz     │          │ Ship/Return  │ [ email__________ ]→│           │
│ B2B Login│          │ Warranty     │                     │           │
│          │          │ Team NR      │                     │           │
│          │          │ Distributors │                     │           │
│          │          │ Military/1st │                     │           │
│          │          │ Privacy      │                     │           │
└──────────┴──────────┴──────────────┴─────────────────────┴───────────┘
```

### 14. PAYMENT BAR
```
┌─────────────────────────────────────────────────────────────────┐
│ [US (USD$)▾]  THE NET RETURN · POS and ecommerce by Shopify    │
│                                ACH ▪ Amex ▪ Apple Pay ▪ … ▪ Visa│
└─────────────────────────────────────────────────────────────────┘
```

---

## What's in the template but disabled (alternate layouts held in reserve)

| Section | Type | Why it's there |
|---------|------|----------------|
| `brand_category_grid_main` | `brand-category-grid` | Alternate to the accordion mosaic — 4 simple tiles, no expand behavior |
| `brand_category_rail` | `brand-category-rail` | Horizontally scrolling alternate; 60s auto-scroll |
| `brand_product_story_dont_settle` | `brand-product-story` | "Stop Chasing Golf Balls" outline-text + image story panel |
| `brand_proof_system_main` | `brand-proof-system-cinematic` | Cinematic version of the proof system (full-bleed, scroll-pinned) |
| `17621461567133e3c2` | `_blocks` (ai-gen banner) | Stale "Free Shipping… Limited time" promo bar |
| `1732595390d1c0d5bd` | `apps` (Hextom timer) | Countdown timer bar |
| Header sibling `announcement-bar` | `announcement-bar` | Held in reserve for "Masters Sale" / event promos |

These can be re-enabled in the theme editor without code changes.

---

## Section-purpose summary table

| # | Section | Shopper job it does | What it routes them to |
|---|---------|---------------------|------------------------|
| 1 | Hero | "What is this and is it for me?" | `/collections/nets-1` or `/pages/compare` |
| 2 | Category mosaic | "What category am I shopping?" | Nets / Packages / Sim / Accessories collections |
| 3 | Customer setups | "Will it last? Do real people use it?" | (no CTA — pure proof) |
| 4 | Brand film | "Show me it working" | (no CTA — looped video) |
| 5 | Bryson feature | "Is it credible?" | `/pages/bryson-dechambeau-the-net-return` |
| 6 | Setup rooms | "What about my specific space?" | 4 collection pages by use case |
| 7 | Proof diagram | "Why is this better than a $200 net?" | `/pages/build-your-setup` |
| 8 | Mini builder | "Build my bundle now" | direct add-to-cart |
| 9 | Quiz CTA | "I still don't know — help me decide" | `/pages/quiz` |
| 10 | Testimonial wall | Final social proof | `/pages/testimonials` |
| 11 | Book-a-call CTA | High-consideration close | `/pages/book-a-call` (or equivalent) |

---

## Quick observations to discuss

A few things become obvious when laid out like this — flagging them as conversation starters, not asks:

1. **Social proof shows up three times**: Customer setups (#3), Testimonial wall (#10), and trust strip (#12). Is the order right? Mike T. is the strongest line on the page and lands at #3 — could lead even earlier, or anchor the hero.
2. **"Why is it better" (proof diagram #7) lands after Setup Rooms (#6)** — the shopper has already self-identified a use case before they learn the differentiator. Worth discussing whether proof should precede setup-by-room.
3. **Two routes to "build a bundle"**: Mini Builder (#8) and the Quiz CTA (#9) sit back to back, then Testimonial wall (#10) interrupts before the Book-a-call (#11). Three "what next" decisions stacked together.
4. **Brand film (#4) is a 20-second beat between two heavy proof sections** (#3 customer setups, #5 Bryson). Worth deciding if it earns its real estate or if a longer "see the return" film belongs higher up — right after the hero, before any text-heavy section.
5. **Categories (#2) currently lead all proof.** Pros: shopper with intent can leave fast. Cons: shoppers who don't know what category they want bounce out into the wrong collection. Worth discussing whether to flip Setup Rooms (#6) and Category Mosaic (#2) so persona leads product-type.

Whenever you want to start moving boxes around, work off this doc.
