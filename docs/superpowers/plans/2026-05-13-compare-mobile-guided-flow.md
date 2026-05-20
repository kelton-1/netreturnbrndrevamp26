# Compare Mobile Guided Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/pages/compare` from a filtered product-card grid into a guided mobile buying flow that helps shoppers start from their space/use case, understand the recommendation, and take the next best action.

**Architecture:** Keep the existing `sections/mobile-compare-nets.liquid` section and `templates/page.compare.json` content model. Add customer-intent entry chips, an assisted action header, active filter pills, recommendation state, and clearer result grouping inside the same section so the theme editor remains the content source. Keep JavaScript section-local and progressive-enhancement friendly: all cards remain visible without JavaScript.

**Tech Stack:** Shopify Liquid section, Shopify JSON template, section `{% stylesheet %}`, section `{% javascript %}`, local Node validation script, Shopify Theme Check / Shopify validation, Playwright browser QA.

---

## File Structure

- Modify `sections/mobile-compare-nets.liquid`: markup, CSS, JS, and schema for the guided compare flow.
- Modify `templates/page.compare.json`: new section settings for assisted actions and improved default copy.
- Modify `scripts/validate-compare-page.mjs`: structural assertions for new guided-flow elements.
- Optionally modify `docs/compare-mobile-sprint-plan.md`: add a completion checkpoint after implementation.

Do not touch home page files, global product cards, collection templates, `assets/theme.js`, or Claude's home-page work.

## Design Intent

The current compare section is easier to digest than the old page, but it asks mobile users to start by manipulating four dropdowns. The improved experience should start with the user's mental model:

- "How much space do I have?"
- "Where will I use it?"
- "Do I want the safest recommendation or just all options?"

The page should then explain the result:

- Show "Best matches" first.
- Keep "Other sizes" available instead of making the page feel empty.
- Show active selections as removable pills.
- Add a short "why this fits" line on recommended cards.
- Provide top-level exits: "Shop nets," "Talk to an expert," and "Watch size guide."

## Task 1: Extend Structural Validation

**Files:**
- Modify: `scripts/validate-compare-page.mjs`

- [ ] **Step 1: Add assertions before implementation**

Replace the `needle` array in `scripts/validate-compare-page.mjs` with:

```js
  [
    'compare-assist',
    'compare-fit-entry',
    'data-fit-pill-list',
    'data-result-summary',
    'data-result-group="best"',
    'data-result-group="other"',
    'data-fit-reset',
    'data-width',
    'data-height',
    'data-price',
    'data-use-case',
    '{% schema %}',
    '{% javascript %}',
  ].forEach((needle) => {
    if (!section.includes(needle)) {
      errors.push(`${sectionPath} is missing "${needle}"`);
    }
  });
```

- [ ] **Step 2: Run validation and confirm failure**

Run:

```bash
node scripts/validate-compare-page.mjs
```

Expected:

```text
sections/mobile-compare-nets.liquid is missing "compare-assist"
sections/mobile-compare-nets.liquid is missing "compare-fit-entry"
sections/mobile-compare-nets.liquid is missing "data-fit-pill-list"
sections/mobile-compare-nets.liquid is missing "data-result-summary"
sections/mobile-compare-nets.liquid is missing "data-result-group=\"best\""
sections/mobile-compare-nets.liquid is missing "data-result-group=\"other\""
```

Exact count may vary if some markers were already added by another worker, but the command must fail before production markup is added.

## Task 2: Add Assisted Compare Header

**Files:**
- Modify: `sections/mobile-compare-nets.liquid`
- Modify: `templates/page.compare.json`

- [ ] **Step 1: Add markup below `.compare-nets__header`**

Insert after the closing `</div>` for `.compare-nets__header`:

```liquid
    <div class="compare-assist" aria-label="{{ section.settings.assist_label | escape }}">
      {%- if section.settings.shop_nets_label != blank and section.settings.shop_nets_link != blank -%}
        <a class="compare-assist__action button button--small button--primary" href="{{ section.settings.shop_nets_link }}">
          {{ section.settings.shop_nets_label | escape }}
        </a>
      {%- endif -%}

      {%- if section.settings.expert_label != blank and section.settings.expert_link != blank -%}
        <a class="compare-assist__action button button--small button--outline" href="{{ section.settings.expert_link }}">
          {{ section.settings.expert_label | escape }}
        </a>
      {%- endif -%}

      {%- if section.settings.size_guide_label != blank and section.settings.size_guide_link != blank -%}
        <a class="compare-assist__link link" href="{{ section.settings.size_guide_link }}">
          {{ section.settings.size_guide_label | escape }}
        </a>
      {%- endif -%}
    </div>
```

- [ ] **Step 2: Add schema settings**

Add these settings after the `intro` setting:

```json
    {
      "type": "text",
      "id": "assist_label",
      "label": "Assist actions accessibility label",
      "default": "Compare page actions"
    },
    {
      "type": "text",
      "id": "shop_nets_label",
      "label": "Shop nets label",
      "default": "Shop Nets"
    },
    {
      "type": "url",
      "id": "shop_nets_link",
      "label": "Shop nets link"
    },
    {
      "type": "text",
      "id": "expert_label",
      "label": "Expert help label",
      "default": "Talk to an Expert"
    },
    {
      "type": "url",
      "id": "expert_link",
      "label": "Expert help link"
    },
    {
      "type": "text",
      "id": "size_guide_label",
      "label": "Size guide label",
      "default": "Watch Size Guide"
    },
    {
      "type": "url",
      "id": "size_guide_link",
      "label": "Size guide link"
    },
```

- [ ] **Step 3: Add JSON template defaults**

In `templates/page.compare.json`, inside `mobile_compare_nets.settings`, add:

```json
        "assist_label": "Compare page actions",
        "shop_nets_label": "Shop Nets",
        "shop_nets_link": "shopify://collections/nets-1",
        "expert_label": "Talk to an Expert",
        "expert_link": "shopify://pages/contact",
        "size_guide_label": "Watch Size Guide",
        "size_guide_link": "shopify://pages/assembly",
```

Place them after `intro`.

- [ ] **Step 4: Add CSS**

Add to `{% stylesheet %}` after `.compare-nets__intro`:

```css
  .compare-assist {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0 auto 22px;
    max-width: 760px;
  }

  .compare-assist__action {
    min-width: 148px;
  }

  .compare-assist__link {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    color: #12753d;
    font-weight: 800;
  }
```

In the existing `@media screen and (max-width: 740px)` block, add:

```css
    .compare-assist {
      justify-content: flex-start;
      gap: 8px;
    }

    .compare-assist__action {
      flex: 1 1 calc(50% - 4px);
      min-width: 0;
    }

    .compare-assist__link {
      flex: 1 1 100%;
      justify-content: center;
      min-height: 44px;
    }
```

- [ ] **Step 5: Validate**

Run:

```bash
node scripts/validate-compare-page.mjs
```

Expected: still fails because Task 3 result markers are not implemented yet, but no longer complains about `compare-assist`.

## Task 3: Replace Dropdown-First Entry With Guided Choice Chips

**Files:**
- Modify: `sections/mobile-compare-nets.liquid`

- [ ] **Step 1: Add entry chip markup before dropdown controls**

Inside `.compare-fit-finder`, after `.compare-fit-finder__header`, add:

```liquid
        <div class="compare-fit-entry" data-fit-entry>
          <div class="compare-fit-entry__group">
            <p class="compare-fit-entry__label">Start with your space</p>
            <div class="compare-fit-entry__chips">
              <button type="button" class="compare-fit-entry__chip" data-chip-filter="width" data-chip-value="5">Under 5 ft wide</button>
              <button type="button" class="compare-fit-entry__chip" data-chip-filter="width" data-chip-value="7">Up to 7 ft wide</button>
              <button type="button" class="compare-fit-entry__chip" data-chip-filter="width" data-chip-value="8">Up to 8 ft wide</button>
              <button type="button" class="compare-fit-entry__chip" data-chip-filter="width" data-chip-value="10">9-10 ft wide</button>
            </div>
          </div>

          <div class="compare-fit-entry__group">
            <p class="compare-fit-entry__label">Where will you practice?</p>
            <div class="compare-fit-entry__chips">
              <button type="button" class="compare-fit-entry__chip" data-chip-filter="use" data-chip-value="small-space">Small space</button>
              <button type="button" class="compare-fit-entry__chip" data-chip-filter="use" data-chip-value="garage">Garage</button>
              <button type="button" class="compare-fit-entry__chip" data-chip-filter="use" data-chip-value="yard">Backyard</button>
              <button type="button" class="compare-fit-entry__chip" data-chip-filter="use" data-chip-value="commercial">Commercial</button>
            </div>
          </div>
        </div>

        <div class="compare-fit-finder__pills" data-fit-pill-list aria-live="polite"></div>
```

- [ ] **Step 2: Relabel dropdowns as fine tuning**

Before `.compare-fit-finder__controls`, add:

```liquid
        <details class="compare-fit-finder__advanced">
          <summary>Fine tune by height and budget</summary>
```

After the closing `</div>` for `.compare-fit-finder__controls`, add:

```liquid
        </details>
```

Do not wrap the status paragraph inside `details`; it should remain visible.

- [ ] **Step 3: Add CSS for chips and active pills**

Add after `.compare-fit-finder__header` styles:

```css
  .compare-fit-entry {
    display: grid;
    gap: 14px;
    margin-bottom: 14px;
  }

  .compare-fit-entry__group {
    display: grid;
    gap: 8px;
  }

  .compare-fit-entry__label {
    margin: 0;
    color: #171b18;
    font-size: 0.9rem;
    font-weight: 800;
  }

  .compare-fit-entry__chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
  }

  .compare-fit-entry__chip,
  .compare-fit-finder__pill {
    flex: 0 0 auto;
    min-height: 40px;
    padding: 0 13px;
    border: 1px solid rgba(34, 41, 37, 0.18);
    border-radius: 999px;
    background: #ffffff;
    color: #171b18;
    font-weight: 800;
  }

  .compare-fit-entry__chip.is-active {
    border-color: #12753d;
    background: #12753d;
    color: #ffffff;
  }

  .compare-fit-finder__pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .compare-fit-finder__pill {
    min-height: 34px;
    padding-inline: 11px;
    background: #eef7f1;
    color: #12753d;
    font-size: 0.82rem;
  }

  .compare-fit-finder__advanced {
    border-top: 1px solid rgba(34, 41, 37, 0.12);
    padding-top: 12px;
  }

  .compare-fit-finder__advanced summary {
    min-height: 40px;
    cursor: pointer;
    color: #12753d;
    font-weight: 800;
  }
```

- [ ] **Step 4: Add JavaScript for chips and pills**

Inside `initCompareNets`, after `var fields = ...`, add:

```js
    var chips = Array.prototype.slice.call(section.querySelectorAll('[data-chip-filter]'));
    var pillList = section.querySelector('[data-fit-pill-list]');
```

Add this helper before `getFilters()`:

```js
    function setFieldValue(filterName, value) {
      var field = fields.find(function (item) {
        return item.dataset.filter === filterName;
      });

      if (field) {
        field.value = value;
      }
    }
```

Add this helper after `hasActiveFilter(filters)`:

```js
    function renderFilterPills(filters) {
      if (!pillList) {
        return;
      }

      var labels = {
        width: filters.width ? 'Width up to ' + filters.width + ' ft' : '',
        height: filters.height ? 'Height up to ' + filters.height + ' ft' : '',
        use: filters.use ? filters.use.replace('-', ' ') : '',
        price: filters.price ? 'Budget up to $' + filters.price : ''
      };

      pillList.innerHTML = Object.keys(labels).filter(function (key) {
        return labels[key] !== '';
      }).map(function (key) {
        return '<button class="compare-fit-finder__pill" type="button" data-clear-filter="' + key + '">' + labels[key] + ' ×</button>';
      }).join('');
    }
```

Inside `updateCards()`, immediately after `var active = hasActiveFilter(filters);`, add:

```js
      renderFilterPills(filters);

      chips.forEach(function (chip) {
        chip.classList.toggle('is-active', filters[chip.dataset.chipFilter] === chip.dataset.chipValue);
      });
```

Before the reset listener, add:

```js
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filterName = chip.dataset.chipFilter;
        var nextValue = chip.classList.contains('is-active') ? '' : chip.dataset.chipValue;

        setFieldValue(filterName, nextValue);
        updateCards();
      });
    });

    if (pillList) {
      pillList.addEventListener('click', function (event) {
        var clearButton = event.target.closest('[data-clear-filter]');

        if (!clearButton) {
          return;
        }

        setFieldValue(clearButton.dataset.clearFilter, '');
        updateCards();
      });
    }
```

- [ ] **Step 5: Validate**

Run:

```bash
node scripts/validate-compare-page.mjs
```

Expected: still fails only for result group markers if Task 4 is not done.

## Task 4: Make Results Explain Themselves

**Files:**
- Modify: `sections/mobile-compare-nets.liquid`

- [ ] **Step 1: Add result summary markup**

Replace:

```liquid
    <div class="compare-nets__grid" data-model-list>
```

with:

```liquid
    <div class="compare-results" data-result-summary>
      <p class="compare-results__eyebrow">Best matches</p>
      <p class="compare-results__text" data-result-text>All models are shown. Choose a space or use case above to see the best fit first.</p>
    </div>

    <div class="compare-nets__grid" data-model-list data-result-group="best">
```

Add after the closing `</div>` of `.compare-nets__grid`:

```liquid
    <div class="compare-results compare-results--other" data-result-group="other" hidden>
      <p class="compare-results__eyebrow">Other sizes to consider</p>
      <p class="compare-results__text">These may still work if you have more room or want a larger hitting area.</p>
    </div>
```

- [ ] **Step 2: Add "why this fits" text on every card**

Add this inside `.compare-net-card__body`, immediately after `.compare-net-card__best`:

```liquid
            <p class="compare-net-card__fit-note" data-fit-note hidden></p>
```

- [ ] **Step 3: Add CSS for result summary and fit notes**

Add before `.compare-nets__grid` styles:

```css
  .compare-results {
    max-width: 1080px;
    margin: 0 auto 14px;
  }

  .compare-results__eyebrow {
    margin: 0 0 3px;
    color: #12753d;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .compare-results__text {
    margin: 0;
    color: #4f5a53;
    font-size: 0.94rem;
  }

  .compare-results--other {
    margin-top: 22px;
  }

  .compare-net-card__fit-note {
    margin: -2px 0 0;
    padding: 9px 10px;
    background: #eef7f1;
    border-radius: 6px;
    color: #12753d;
    font-size: 0.86rem;
    font-weight: 800;
    line-height: 1.35;
  }
```

- [ ] **Step 4: Change JavaScript from hide-only to explain-and-rank**

Inside `initCompareNets`, after `var status = ...`, add:

```js
    var resultText = section.querySelector('[data-result-text]');
```

Replace the current `updateCards()` function with:

```js
    function updateCards() {
      var filters = getFilters();
      var active = hasActiveFilter(filters);
      var matches = cards.filter(function (card) {
        return cardMatches(card, filters);
      });

      renderFilterPills(filters);

      chips.forEach(function (chip) {
        chip.classList.toggle('is-active', filters[chip.dataset.chipFilter] === chip.dataset.chipValue);
      });

      cards.forEach(function (card) {
        var fitNote = card.querySelector('[data-fit-note]');
        var match = matches.indexOf(card) !== -1;

        card.classList.remove('is-hidden', 'is-match', 'is-secondary-match');
        card.style.order = '2';

        if (fitNote) {
          fitNote.hidden = true;
          fitNote.textContent = '';
        }

        if (!active) {
          card.style.order = '1';
          return;
        }

        if (match) {
          card.classList.add('is-match');
          card.style.order = '1';

          if (fitNote) {
            fitNote.hidden = false;
            fitNote.textContent = 'Fits your selected space and use case.';
          }
        } else {
          card.classList.add('is-secondary-match');
        }
      });

      if (!active) {
        if (status) {
          status.textContent = status.getAttribute('data-default-status') || status.textContent;
        }

        if (resultText) {
          resultText.textContent = 'All models are shown. Choose a space or use case above to see the best fit first.';
        }

        return;
      }

      if (matches.length === 0) {
        if (status) {
          status.textContent = 'No exact match. Showing every model so you can compare the closest sizes.';
        }

        if (resultText) {
          resultText.textContent = 'No exact match yet. Start with the closest size, or talk to an expert before choosing.';
        }

        return;
      }

      if (status) {
        status.textContent = matches.length === 1 ? 'Showing 1 best fit first.' : 'Showing ' + matches.length + ' best fits first.';
      }

      if (resultText) {
        resultText.textContent = matches.length === 1 ? 'This model best matches your selections.' : 'These models best match your selections.';
      }
    }
```

- [ ] **Step 5: Add secondary-card CSS**

Add near `.compare-net-card.is-match`:

```css
  .compare-net-card.is-secondary-match {
    opacity: 0.72;
  }

  .compare-net-card.is-secondary-match:hover,
  .compare-net-card.is-secondary-match:focus-within {
    opacity: 1;
  }
```

- [ ] **Step 6: Validate**

Run:

```bash
node scripts/validate-compare-page.mjs
```

Expected:

```text
Compare page validation passed
```

## Task 5: Tighten Mobile Card Hierarchy

**Files:**
- Modify: `sections/mobile-compare-nets.liquid`

- [ ] **Step 1: Make CTA and price easier to act on**

In `.compare-net-card__title-row`, keep title and price but add a class to make it tighter on mobile. Add CSS:

```css
  .compare-net-card__title-row {
    align-content: start;
  }

  .compare-net-card__button {
    min-height: 44px;
  }
```

In the mobile media query, add:

```css
    .compare-net-card__button {
      position: sticky;
      bottom: 8px;
      z-index: 1;
      box-shadow: 0 8px 18px rgba(18, 117, 61, 0.18);
    }
```

- [ ] **Step 2: Keep card badges shorter**

Update `templates/page.compare.json` badges:

```json
"badge": "Kids"
"badge": "Small spaces"
"badge": "Popular"
"badge": "Flagship"
"badge": "8 ft tall"
"badge": "Wider"
"badge": "Commercial"
"badge": "Tallest"
```

Only change `badge` fields. Do not change product links or specs.

- [ ] **Step 3: Validate**

Run:

```bash
node scripts/validate-compare-page.mjs
```

Expected:

```text
Compare page validation passed
```

## Task 6: Shopify Validation And Browser QA

**Files:**
- Validate: `sections/mobile-compare-nets.liquid`
- Validate: `templates/page.compare.json`
- Validate: `scripts/validate-compare-page.mjs`

- [ ] **Step 1: Run structural validation**

Run:

```bash
node scripts/validate-compare-page.mjs
```

Expected:

```text
Compare page validation passed
```

- [ ] **Step 2: Run Shopify validation**

Run:

```bash
node .agents/skills/shopify-liquid/scripts/validate.mjs \
  --theme-path /Users/kelton1/Developer/TheNetReturn/Shopify \
  --files sections/mobile-compare-nets.liquid,templates/page.compare.json \
  --model gpt-5 \
  --client-name codex \
  --client-version desktop \
  --artifact-id compare-mobile-guided-flow \
  --revision 1
```

Expected:

```json
{
  "success": true,
  "result": "SUCCESS"
}
```

- [ ] **Step 3: Start dev preview**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:dev
```

Expected:

```text
Preview your theme
http://127.0.0.1:9292
```

- [ ] **Step 4: Browser QA at 390px**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH /Users/kelton1/.codex/skills/playwright/scripts/playwright_cli.sh open http://127.0.0.1:9292/pages/compare
PATH=/Users/kelton1/.local/bin:$PATH /Users/kelton1/.codex/skills/playwright/scripts/playwright_cli.sh resize 390 844
PATH=/Users/kelton1/.local/bin:$PATH /Users/kelton1/.codex/skills/playwright/scripts/playwright_cli.sh eval "() => ({ cards: document.querySelectorAll('.compare-net-card').length, activeChips: document.querySelectorAll('.compare-fit-entry__chip.is-active').length, overflow: document.documentElement.scrollWidth > window.innerWidth })"
```

Expected before selecting chips:

```json
{ "cards": 8, "activeChips": 0, "overflow": false }
```

- [ ] **Step 5: Browser QA chip behavior**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH /Users/kelton1/.codex/skills/playwright/scripts/playwright_cli.sh eval "() => { document.querySelector('[data-chip-filter=\"width\"][data-chip-value=\"7\"]').click(); document.querySelector('[data-chip-filter=\"use\"][data-chip-value=\"garage\"]').click(); return { activeChips: document.querySelectorAll('.compare-fit-entry__chip.is-active').length, matches: document.querySelectorAll('.compare-net-card.is-match').length, pills: document.querySelectorAll('[data-fit-pill-list] .compare-fit-finder__pill').length, summary: document.querySelector('[data-result-text]').textContent, overflow: document.documentElement.scrollWidth > window.innerWidth }; }"
```

Expected:

```json
{
  "activeChips": 2,
  "matches": 1,
  "pills": 2,
  "summary": "This model best matches your selections.",
  "overflow": false
}
```

If the match count is not exactly 1 because content has changed, accept `matches >= 1` and record the actual count in the final notes.

- [ ] **Step 6: Browser QA at 320px and desktop**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH /Users/kelton1/.codex/skills/playwright/scripts/playwright_cli.sh resize 320 844
PATH=/Users/kelton1/.local/bin:$PATH /Users/kelton1/.codex/skills/playwright/scripts/playwright_cli.sh eval "() => ({ overflow: document.documentElement.scrollWidth > window.innerWidth, width: window.innerWidth })"
PATH=/Users/kelton1/.local/bin:$PATH /Users/kelton1/.codex/skills/playwright/scripts/playwright_cli.sh resize 1440 1000
PATH=/Users/kelton1/.local/bin:$PATH /Users/kelton1/.codex/skills/playwright/scripts/playwright_cli.sh eval "() => ({ overflow: document.documentElement.scrollWidth > window.innerWidth, width: window.innerWidth })"
```

Expected:

```json
{ "overflow": false, "width": 320 }
{ "overflow": false, "width": 1440 }
```

- [ ] **Step 7: Stop dev preview**

Find and stop the preview process:

```bash
ps -ax -o pid,command | rg 'shopify theme dev|theme dev --store'
kill <pid>
```

Expected: no remaining `shopify theme dev` process.

## Task 7: Documentation Checkpoint

**Files:**
- Modify: `docs/compare-mobile-sprint-plan.md`

- [ ] **Step 1: Add implementation note**

Append:

```markdown
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
```

- [ ] **Step 2: Final status check**

Run:

```bash
git status --short
```

Expected: changed files are limited to compare-page plan/section/template/docs/validation files plus any pre-existing unrelated work from Claude or earlier sessions. Do not stage or revert unrelated files.

## Completion Notes

This plan intentionally improves only the compare page. The collection compare tray, fit-based collection filters, and complete-your-setup carousel are still valuable, but they should be separate follow-up plans because they touch collection/product-card surfaces and could collide with home-page work.
