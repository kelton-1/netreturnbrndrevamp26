# Sitewide Copy Realignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retract unreleased-product and abstract brand-kit messaging, then realign The Net Return storefront copy around the current net business: automatic ball return, durable construction, easy setup, fit guidance, home practice, simulator compatibility, warranty, and trusted proof.

**Architecture:** This is a copy-only implementation. Edit Shopify JSON template settings and Liquid section schema defaults without changing section markup, CSS, product data, or app behavior unless a copy field cannot be reached any other way. Homepage copy changes go first because they set the brand promise; product, collection, story, blog, and support copy follow so the whole site speaks with one current Net Return voice.

**Tech Stack:** Shopify theme JSON templates, Liquid section schemas, repo docs, Shopify Theme Check, local preview/manual storefront QA.

---

## Copy Direction

### Keep

- The Net Return as the hero of the message, not a future training platform.
- Net-specific proof: automatic ball return, patented S-shape frame, Quick Color Connect setup, indoor/outdoor use, real golf balls, simulator compatibility, 3-year warranty, 30-day money-back guarantee, free shipping, and since-2009 credibility.
- Current buyer language: home golfers, garages, backyards, studios, coaches, families, pros, commercial facilities.
- Bryson proof when it is tied to the net he uses and the reliability of the product.
- Guided shopping CTAs: Shop Nets, Compare Models, Find Your Fit, Build Your Setup, Talk to an Expert, Take the Quiz.

### Retract Or Rewrite

- "Train With Intent" as a sitewide brand promise. It can survive only in a blog/article context about practice habits, not as homepage or brand-system language.
- Copy implying an unreleased product, connected training platform, digital progression system, or app-led athlete development.
- Broad "athlete performance" and "future of athlete performance" language on core commercial pages.
- Abstract agency lines that sound good but do not tell shoppers what the net does.
- Placeholder or overly generic copy such as "Built for every part of the work" where a net-specific decision message would convert better.

### Replacement Voice

Use direct, current-product language:

- "The golf net that sends every ball back."
- "Practice at home without chasing balls."
- "Built for real golf balls, fast setup, and daily reps."
- "Choose the Net Return size that fits your space."
- "From garage practice to simulator builds, start with the net."
- "Trusted by golfers, coaches, and pros because it is consistent, safe, and built to last."

Avoid:

- "Digital progression"
- "Athlete development" as a standalone promise
- "Performance platform"
- "Train With Intent" on commercial surfaces
- "The work" as a vague substitute for practice
- "Launch" or "future" language unless it refers to current launch monitors

---

## Current Evidence

- Live homepage still uses current Net Return anchors: Bryson proof, "The #1 Net in Golf", Shop Nets, automatic ball return, quick assembly, indoor/outdoor, warranty, and since-2009 proof.
- Live collection and compare pages are already net-specific: filters by space, dimensions, price, and fit; comparison copy says the products mainly differ by size.
- Live product pages convert best when they explain the tangible buying reasons: hitting area, automatic return, setup speed, simulator compatibility, delivery, warranty, and safety.
- The local brand revamp introduced the risky copy mostly in `templates/index.json` and schema defaults for new brand sections.

---

## File Structure

- Modify `templates/index.json` for the actual homepage copy currently wired into the draft theme.
- Modify `sections/brand-hero.liquid`, `sections/brand-film.liquid`, `sections/brand-bryson-feature.liquid`, and `sections/brand-proof-system.liquid` so future merchant-added sections default to current Net Return copy instead of the retracted brand-kit copy.
- Modify `templates/page.our-story.json` to soften 2024 rebrand language away from unreleased technology and toward the current product/category evolution.
- Modify `templates/page.browse-all-products.json` to make the all-products entry page more net-led and less generic.
- Audit `templates/product.*.json`, `templates/collection.*.json`, `templates/page.*.json`, and `templates/blog.*.json` for residual abstract training-platform language. Only change high-confidence copy; keep third-party launch-monitor product copy where it describes the vendor product.
- Update `docs/brand-revamp-2026.md` after implementation so future agents know the copy decision changed.

---

## Task 1: Homepage Hero And Film Copy

**Files:**
- Modify: `templates/index.json`
- Modify: `sections/brand-hero.liquid`
- Modify: `sections/brand-film.liquid`
- Modify: `docs/brand-revamp-2026.md`

- [ ] **Step 1: Replace the active homepage hero copy in `templates/index.json`.**

Set the active `brand_hero_train_with_intent` settings to:

```json
{
  "eyebrow": "The Net Return",
  "heading_lead": "The Net That",
  "heading_em": "Returns.",
  "body": "Hit real golf balls at home without chasing them down. The Net Return sends every shot back, sets up fast, and fits garages, backyards, studios, and simulator builds.",
  "cta_text": "Shop nets",
  "cta_link": "shopify://collections/nets-1",
  "secondary_cta_text": "Compare models",
  "secondary_cta_link": "shopify://pages/compare"
}
```

- [ ] **Step 2: Replace the active homepage category-grid copy if the section is re-enabled.**

In `templates/index.json`, change:

```json
{
  "eyebrow": "Shop the system",
  "heading": "Built for every part of the work."
}
```

to:

```json
{
  "eyebrow": "Shop by setup",
  "heading": "Start with the net. Build around your space."
}
```

- [ ] **Step 3: Replace the active brand-film label.**

In `templates/index.json`, change:

```json
{
  "label_text": "Train With Intent"
}
```

to:

```json
{
  "label_text": "Every Ball Comes Back"
}
```

- [ ] **Step 4: Update `sections/brand-hero.liquid` schema defaults and preset copy.**

Replace every default/preset occurrence of:

```text
Train With
Intent.
Physical repetition. Digital progression. Daily discipline. We connect the work to the score.
Brand hero — Train With Intent
```

with:

```text
The Net That
Returns.
Hit real golf balls at home without chasing them down. The Net Return sends every shot back, sets up fast, and fits garages, backyards, studios, and simulator builds.
Brand hero — net return
```

Also update the schema paragraph from:

```text
Full-bleed immersive hero with mixed-weight headline. Ships defaulted to 'Train With Intent.' over photo #14 (male swing) from the brand toolkit; both can be overridden here.
```

to:

```text
Full-bleed immersive hero with mixed-weight headline. Ships defaulted to current Net Return net-first copy over golf practice photography; both can be overridden here.
```

- [ ] **Step 5: Update `sections/brand-film.liquid` schema defaults and preset.**

Change:

```text
Train With Intent
```

to:

```text
Every Ball Comes Back
```

- [ ] **Step 6: Run JSON validation.**

Run:

```bash
node -e "const fs=require('fs'); const strip=s=>s.replace(/^\\s*\\/\\*[\\s\\S]*?\\*\\/\\s*/,''); for (const f of ['templates/index.json']) JSON.parse(strip(fs.readFileSync(f,'utf8'))); console.log('homepage JSON ok')"
```

Expected: `homepage JSON ok`

- [ ] **Step 7: Commit the homepage hero/film copy pass.**

```bash
git add templates/index.json sections/brand-hero.liquid sections/brand-film.liquid docs/brand-revamp-2026.md
git commit -m "copy: realign homepage hero around net return proof"
```

---

## Task 2: Homepage Product Proof And Bryson Copy

**Files:**
- Modify: `templates/index.json`
- Modify: `sections/brand-bryson-feature.liquid`
- Modify: `sections/brand-proof-system.liquid`
- Modify: `docs/brand-revamp-2026.md`

- [ ] **Step 1: Replace the active product-story copy in `templates/index.json`.**

Change the `brand_product_story_dont_settle` settings to:

```json
{
  "heading_line_1": "Stop",
  "heading_line_2": "Chasing",
  "heading_outline": "Golf Balls",
  "body": "A cheaper net can slow practice down with rebounds, resets, and doubt. The Net Return is built to absorb the shot, return the ball, and keep your session moving.",
  "cta_text": "See the difference",
  "cta_link": "shopify://pages/compare"
}
```

- [ ] **Step 2: Replace active Bryson copy in `templates/index.json`.**

Use:

```json
{
  "display_word": "BRYSON",
  "eyebrow": "Trusted by Bryson",
  "tagline": "The net he trusts at home.",
  "body": "Bryson DeChambeau has used The Net Return since he was 15. The reason is simple: the ball comes back, the setup holds up, and practice keeps moving.",
  "cta_text": "Shop Bryson's setup",
  "cta_link": "shopify://pages/bryson-dechambeau-the-net-return"
}
```

- [ ] **Step 3: Update `sections/brand-bryson-feature.liquid` schema defaults.**

Replace:

```text
Official ambassador
Trained on a Net Return.
Bryson DeChambeau trains the way he plays — relentlessly, on his own terms. His daily reps land on a Net Return because the ball comes back, the math holds, and nothing slows the work.
```

with:

```text
Trusted by Bryson
The net he trusts at home.
Bryson DeChambeau has used The Net Return since he was 15. The reason is simple: the ball comes back, the setup holds up, and practice keeps moving.
```

- [ ] **Step 4: Update active proof-system copy if the section is enabled in `templates/index.json`.**

Use:

```json
{
  "eyebrow": "Why golfers choose it",
  "heading": "Built around the return.",
  "body": "<p>The patented S-shape frame absorbs impact and sends the ball back to your feet. Set it up without tools, use it indoors or outdoors, and build from a standalone net to a simulator setup when you are ready.</p>",
  "cta_text": "Build your setup"
}
```

For proof blocks, use:

```json
[
  {
    "title": "Automatic ball return",
    "text": "The patented S-shape frame absorbs the shot and returns the ball to your feet."
  },
  {
    "title": "Built for real golf balls",
    "text": "Commercial-grade netting and a stable frame are made for repeat practice."
  },
  {
    "title": "Tool-free setup",
    "text": "Quick Color Connect pieces make setup and breakdown simple."
  },
  {
    "title": "Indoor, outdoor, simulator-ready",
    "text": "Use it in a garage, backyard, studio, or as the foundation for a simulator build."
  }
]
```

- [ ] **Step 5: Update `sections/brand-proof-system.liquid` schema defaults and preset.**

Use the same proof-system heading, body, CTA, and four proof block defaults from Step 4.

- [ ] **Step 6: Run JSON validation.**

Run:

```bash
node -e "const fs=require('fs'); const strip=s=>s.replace(/^\\s*\\/\\*[\\s\\S]*?\\*\\/\\s*/,''); JSON.parse(strip(fs.readFileSync('templates/index.json','utf8'))); console.log('homepage proof JSON ok')"
```

Expected: `homepage proof JSON ok`

- [ ] **Step 7: Commit the proof/Bryson copy pass.**

```bash
git add templates/index.json sections/brand-bryson-feature.liquid sections/brand-proof-system.liquid docs/brand-revamp-2026.md
git commit -m "copy: make homepage proof net-specific"
```

---

## Task 3: Story And All-Products Copy

**Files:**
- Modify: `templates/page.our-story.json`
- Modify: `templates/page.browse-all-products.json`
- Modify: `docs/brand-revamp-2026.md`

- [ ] **Step 1: Rewrite the 2024 story entry.**

In `templates/page.our-story.json`, keep:

```json
{
  "label": "2024",
  "title": "Where Better Begins"
}
```

Replace the content with:

```html
<p>In April of 2024, The Net Return introduced a fresh brand system to match what customers already knew the product for: premium nets that return the ball, set up quickly, and support serious practice at home. The look changed, but the promise stayed grounded in the same patented frame, durable materials, and reliable practice experience that have defined The Net Return for years.</p>
```

- [ ] **Step 2: Rewrite the browse-all-products hero.**

In `templates/page.browse-all-products.json`, change:

```json
{
  "subheading": "Get BETTER, WHEREVER",
  "title": "Browse All Products",
  "content": "<p>Train smarter with pro nets, <br/>monitors & accessories.</p>"
}
```

to:

```json
{
  "subheading": "Shop The Net Return",
  "title": "Find the right net, package, or add-on.",
  "content": "<p>Start with the net that fits your space, then add turf, barriers, launch monitors, or simulator accessories when your setup is ready.</p>"
}
```

- [ ] **Step 3: Run JSON validation.**

Run:

```bash
node -e "const fs=require('fs'); const strip=s=>s.replace(/^\\s*\\/\\*[\\s\\S]*?\\*\\/\\s*/,''); for (const f of ['templates/page.our-story.json','templates/page.browse-all-products.json']) JSON.parse(strip(fs.readFileSync(f,'utf8'))); console.log('story and browse JSON ok')"
```

Expected: `story and browse JSON ok`

- [ ] **Step 4: Commit the story/all-products pass.**

```bash
git add templates/page.our-story.json templates/page.browse-all-products.json docs/brand-revamp-2026.md
git commit -m "copy: ground story and browse pages in current net offer"
```

---

## Task 4: Collection And Product Copy Audit

**Files:**
- Modify as needed: `templates/collection.*.json`
- Modify as needed: `templates/product.*.json`
- Modify as needed: `templates/page.*.json`
- Modify as needed: `templates/blog.*.json`
- Modify: `docs/brand-revamp-2026.md`

- [ ] **Step 1: Generate a residual-risk list.**

Run:

```bash
rg -n -i "Train With Intent|Digital progression|athlete development|future of athlete performance|performance platform|the work|built for every part|train as hard|daily discipline|connect the work|elevate your training|unlock a new level|train smarter" templates sections snippets docs --glob '*.json' --glob '*.liquid' --glob '*.md' --glob '!docs/perf-reports/**'
```

Expected: remaining hits should be either changed in this task, intentionally kept in article/vendor contexts, or listed in `docs/brand-revamp-2026.md` under copy caveats.

- [ ] **Step 2: Keep third-party/vendor product copy when it describes an existing launch monitor or simulator product.**

Do not rewrite these only because they say "training" or "data":

```text
FlightScope, Foresight, Full Swing, Garmin, Uneekor, simulator, launch monitor, app, data points
```

Rewrite them only if they imply The Net Return itself is launching a new product or platform.

- [ ] **Step 3: Rewrite high-confidence abstract Net Return copy to net-specific copy.**

Use these replacements when the same theme appears:

```text
Old: Train smarter with pro nets, monitors & accessories.
New: Start with the net that fits your space, then add turf, barriers, monitors, or simulator accessories.

Old: Built for every part of the work.
New: Start with the net. Build around your space.

Old: Train as hard as you want — it holds.
New: Built for real golf balls and repeat practice.

Old: The Optimal Path to Reaching Your Goals.
New: Build a simulator setup around the net you trust.

Old: athlete performance / future of athlete performance.
New: home practice / golf net innovation / reliable practice setup.
```

- [ ] **Step 4: Tighten the Pro Series FAQ intro only if it is still active.**

In `templates/product.pro-series.json`, if `accordion_content_cDkVRL` is active, replace the FAQ intro with:

```html
<p>The Pro Series is The Net Return's most versatile golf net family, built for real golf balls, automatic ball return, fast setup, and indoor or outdoor use. Choose the size that fits your space, then add turf, side barriers, or simulator accessories as your setup grows.</p>
```

- [ ] **Step 5: Keep the current product-page CRO copy style where it is factual and current.**

Keep messages like:

```text
50,000+ golfers trust this net
Automatic ball return
Handles 225 MPH ball speeds
Assemble < 5 mins
Premium Practice. Zero Fluff.
Trusted by golfers everywhere and backed by thousands of verified reviews
```

- [ ] **Step 6: Run JSON validation for every changed JSON file.**

Run:

```bash
git diff --name-only -- '*.json' | xargs -I{} node -e "const fs=require('fs'); const f=process.argv[1]; const strip=s=>s.replace(/^\\s*\\/\\*[\\s\\S]*?\\*\\/\\s*/,''); JSON.parse(strip(fs.readFileSync(f,'utf8'))); console.log(f+' ok')" {}
```

Expected: every changed JSON file prints `ok`.

- [ ] **Step 7: Commit the audit cleanup.**

```bash
git add templates sections snippets docs/brand-revamp-2026.md
git commit -m "copy: remove residual future-product language"
```

---

## Task 5: Sitewide QA And Handoff

**Files:**
- Modify: `docs/brand-revamp-2026.md`
- Modify or create if needed: `docs/copy-realignment-qa-2026-05-20.md`

- [ ] **Step 1: Run Theme Check.**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check
```

Expected: Theme Check may still report the known baseline issues. Confirm no new copy-edit syntax errors were introduced.

- [ ] **Step 2: Start a local Shopify preview.**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:dev
```

Expected: Shopify CLI prints a local preview URL such as `http://127.0.0.1:9292`.

- [ ] **Step 3: Manually QA the highest-value surfaces.**

Open these paths in the preview:

```text
/
/collections/nets-1
/pages/compare
/pages/browse-all-products
/pages/our-story
/products/pro-series-golf-net
/blogs/tips-and-tricks
```

Check:

```text
Homepage no longer says Train With Intent.
Homepage hero promise is about the net returning the ball.
Category and proof sections use concrete net benefits.
Bryson copy is factual and tied to current Net Return product trust.
Our Story does not imply an unreleased product or platform.
Browse All Products points shoppers toward nets, packages, and add-ons.
Product pages still preserve conversion proof and current claims.
No CTAs were accidentally changed to dead links.
```

- [ ] **Step 4: Document final copy decisions.**

Add a dated note to `docs/brand-revamp-2026.md`:

```markdown
## Sitewide copy realignment

**Date:** 2026-05-20

The "Train With Intent" brand-kit direction has been retracted from commercial storefront surfaces because it pointed toward unreleased product messaging. Current storefront copy now centers The Net Return's live offer: automatic ball return, durable net construction, fast setup, space fit, simulator compatibility, warranty, and trusted proof.

Preserve this rule going forward: homepage, collection, product, and support copy should sell the net and current setup ecosystem first. Practice philosophy can appear in blog/editorial content, but it should not replace concrete product proof on shopping pages.
```

- [ ] **Step 5: Commit the QA/handoff docs.**

```bash
git add docs/brand-revamp-2026.md docs/copy-realignment-qa-2026-05-20.md
git commit -m "docs: record sitewide copy realignment"
```

---

## Self-Review

- Spec coverage: The plan maps the user request to retract unreleased-product messaging, preserve useful current Net Return copy, and speak more to the net side of the business.
- Risk posture: The plan starts with active homepage copy, then updates schema defaults so the old message does not return when sections are reused.
- Validation: Each JSON-editing task includes a parse command; final QA includes Theme Check and storefront preview.
- Execution boundary: This plan does not push or publish to Shopify. Any theme push remains approval-gated.
