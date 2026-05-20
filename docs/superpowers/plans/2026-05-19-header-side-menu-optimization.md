# Header Side Menu Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve TheNetReturn's Shopify draft theme header and mobile side menu so shoppers can reach key product and guided-shopping paths faster, with fewer blocked or dead interactions.

**Architecture:** Keep the work scoped to the existing Focal-style header system. Code changes are localized to the header/menu Liquid snippets and a small CSS append, while Shopify navigation content changes are documented as merchant/admin configuration because linklists are store data, not theme files.

**Tech Stack:** Shopify Liquid, Shopify JSON theme sections, theme CSS in `assets/custom.css`, Shopify CLI, Theme Check, Playwright CLI for browser screenshots.

---

## File Structure

- Modify `snippets/mobile-menu.liquid`: preserve nested accordions, but make parent menu labels navigable and use a separate expand button. Move mega-menu image cards before nested category rows on mobile.
- Modify `assets/custom.css`: add focused styles for split mobile navigation rows and guided menu labels.
- Modify `snippets/desktop-menu.liquid`: add a lightweight guided-shopping heading above mega-menu image cards.
- Modify `sections/header.liquid`: remove stale global Black Friday link-highlighting CSS and JavaScript.
- Create `docs/header-side-menu-admin-config-2026-05-19.md`: document exact Shopify Navigation changes and popup QA settings for the merchant/admin layer.
- Update `docs/header-side-menu-optimization-audit-2026-05-19.md`: append implementation checkpoint notes and link the admin configuration handoff.

## Safety Rules

- Do not run `shopify theme push`, `shopify theme publish`, or any source-theme mutation command.
- Use `PATH=/Users/kelton1/.local/bin:$PATH` for Shopify CLI commands.
- Work against the local repo and Shopify preview only.
- Before implementation, confirm the draft theme is still `[FIX] Cart 400 - variant id disabled - 2026-05-12` / `149365096541` with `npm run theme:list`.

### Task 1: Mobile Parent Links Stay Navigable

**Files:**
- Modify: `snippets/mobile-menu.liquid`
- Modify: `assets/custom.css`

- [ ] **Step 1: Run the failing static check**

Run:

```bash
rg -n "mobile-nav__link-row|mobile-nav__toggle" snippets/mobile-menu.liquid assets/custom.css
```

Expected: no matches. This confirms the drawer still uses the old single-button parent rows.

- [ ] **Step 2: Replace the mobile item rendering block**

In `snippets/mobile-menu.liquid`, replace the block from:

```liquid
        <li class="mobile-nav__item" data-level="1">
```

through:

```liquid
        </li>
```

inside the `{%- for link in menu.links -%}` loop with this exact block:

```liquid
        <li class="mobile-nav__item" data-level="1">
          {%- assign top_level_heading_class = 'mobile-nav__link heading' -%}

          {%- if settings.heading_text_transform == 'uppercase' -%}
            {%- assign top_level_heading_class = top_level_heading_class | append: ' h6' -%}
          {%- else -%}
            {%- assign top_level_heading_class = top_level_heading_class | append: ' h5' -%}
          {%- endif -%}

          {%- if link.links.size > 0 or mega_menu_images != blank -%}
            <div class="mobile-nav__link-row">
              {%- if link.url == '#' -%}
                <span class="{{ top_level_heading_class }}">{{ link.title }}</span>
              {%- else -%}
                <a href="{{ link.url }}" class="{{ top_level_heading_class }}">{{ link.title }}</a>
              {%- endif -%}

              <button is="toggle-button" class="mobile-nav__toggle tap-area" aria-controls="mobile-menu-{{ forloop.index }}" aria-expanded="false" aria-label="{{ link.title | escape }} menu">
                <span class="animated-plus"></span>
              </button>
            </div>

            <collapsible-content id="mobile-menu-{{ forloop.index }}" class="collapsible">
              {%- if mega_menu_images != blank -%}
                <div class="mobile-nav__guided">
                  <p class="mobile-nav__guided-title heading heading--xsmall">Need help choosing?</p>
                  <div class="mobile-nav__images-wrapper {% if images_count >= 3 %}mobile-nav__images-wrapper--tight{% endif %} hide-scrollbar">
                    <div class="mobile-nav__images-scroller">
                      {{- mega_menu_images -}}
                    </div>
                  </div>
                </div>
              {%- endif -%}

              {%- if link.links.size > 0 -%}
                <ul class="mobile-nav list--unstyled" role="list">
                  {%- for sub_link in link.links -%}
                    <li class="mobile-nav__item" data-level="2">
                      {%- if sub_link.links.size > 0 -%}
                        <div class="mobile-nav__link-row mobile-nav__link-row--sub">
                          {%- if sub_link.url == '#' -%}
                            <span class="mobile-nav__link">{{ sub_link.title }}</span>
                          {%- else -%}
                            <a href="{{ sub_link.url }}" class="mobile-nav__link">{{ sub_link.title }}</a>
                          {%- endif -%}

                          <button is="toggle-button" class="mobile-nav__toggle tap-area" aria-controls="mobile-menu-{{ forloop.parentloop.index }}-{{ forloop.index }}" aria-expanded="false" aria-label="{{ sub_link.title | escape }} submenu">
                            <span class="animated-plus"></span>
                          </button>
                        </div>

                        <collapsible-content id="mobile-menu-{{ forloop.parentloop.index }}-{{ forloop.index }}" class="collapsible">
                          <ul class="mobile-nav list--unstyled" role="list">
                            {%- for sub_sub_link in sub_link.links -%}
                              <li class="mobile-nav__item" data-level="3">
                                <a href="{{ sub_sub_link.url }}" class="mobile-nav__link">{{ sub_sub_link.title }}</a>
                              </li>
                            {%- endfor -%}
                          </ul>
                        </collapsible-content>
                      {%- else -%}
                        <a href="{{ sub_link.url }}" class="mobile-nav__link">{{ sub_link.title }}</a>
                      {%- endif -%}
                    </li>
                  {%- endfor -%}
                </ul>
              {%- endif -%}
            </collapsible-content>
          {%- else -%}
            <a href="{{ link.url }}" class="{{ top_level_heading_class }}">{{ link.title }}</a>
          {%- endif -%}
        </li>
```

- [ ] **Step 3: Append mobile row CSS**

Append this block to the end of `assets/custom.css`:

```css
/* Header side menu optimization */
.mobile-nav__link-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 48px;
    align-items: stretch;
}

.mobile-nav__link-row>.mobile-nav__link {
    min-width: 0;
    padding-inline-end: 16px;
}

.mobile-nav__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    min-height: 48px;
}

.mobile-nav__toggle .animated-plus {
    margin: 0;
}

.mobile-nav__guided {
    padding-block: 8px 18px;
}

.mobile-nav__guided-title {
    margin: 0 0 12px;
    color: rgba(var(--text-color), .65);
}
```

- [ ] **Step 4: Run static checks**

Run:

```bash
rg -n "mobile-nav__link-row|mobile-nav__toggle|mobile-nav__guided-title" snippets/mobile-menu.liquid assets/custom.css
```

Expected: matches in both `snippets/mobile-menu.liquid` and `assets/custom.css`.

Run:

```bash
node - <<'NODE'
const fs = require('fs');
const source = fs.readFileSync('snippets/mobile-menu.liquid', 'utf8');
const imageIndex = source.indexOf('mobile-nav__guided');
const listIndex = source.indexOf('<ul class="mobile-nav list--unstyled" role="list">', imageIndex);
if (imageIndex === -1) throw new Error('mobile guided block missing');
if (listIndex === -1) throw new Error('nested mobile link list block missing after guided block');
if (imageIndex > listIndex) throw new Error('guided image cards still render after category accordions');
console.log('PASS: guided image cards render before category accordions');
NODE
```

Expected: `PASS: guided image cards render before category accordions`.

- [ ] **Step 5: Validate Liquid syntax**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check
```

Expected: Theme Check still reports the known existing baseline offenses, but no new syntax or parse error for `snippets/mobile-menu.liquid` or `assets/custom.css`.

- [ ] **Step 6: Commit**

```bash
git add snippets/mobile-menu.liquid assets/custom.css
git commit -m "feat: improve mobile menu navigation rows"
```

### Task 2: Desktop Mega Menu Guided Heading

**Files:**
- Modify: `snippets/desktop-menu.liquid`
- Modify: `assets/custom.css`

- [ ] **Step 1: Run the failing static check**

Run:

```bash
rg -n "mega-menu__guided-title|Need help choosing" snippets/desktop-menu.liquid assets/custom.css
```

Expected: no matches.

- [ ] **Step 2: Add guided heading above left-position mega menu images**

In `snippets/desktop-menu.liquid`, replace:

```liquid
                    <div class="mega-menu__images-wrapper {% if images_count >= 3 %}mega-menu__images-wrapper--tight{% endif %}">
                      {{- mega_menu_images -}}
                    </div>
```

in the `images_position == 'left'` branch with:

```liquid
                    <div class="mega-menu__images-wrapper {% if images_count >= 3 %}mega-menu__images-wrapper--tight{% endif %}">
                      <p class="mega-menu__guided-title heading heading--xsmall">Need help choosing?</p>
                      {{- mega_menu_images -}}
                    </div>
```

- [ ] **Step 3: Add guided heading above right-position mega menu images**

In the same file, replace the second matching image wrapper in the `images_position == 'right'` branch with:

```liquid
                    <div class="mega-menu__images-wrapper {% if images_count >= 3 %}mega-menu__images-wrapper--tight{% endif %}">
                      <p class="mega-menu__guided-title heading heading--xsmall">Need help choosing?</p>
                      {{- mega_menu_images -}}
                    </div>
```

- [ ] **Step 4: Append desktop guided-heading CSS**

Append this block to `assets/custom.css` after the mobile menu optimization block from Task 1:

```css
.mega-menu__guided-title {
    grid-column: 1 / -1;
    margin: 0 0 12px;
    color: rgba(var(--text-color), .65);
}
```

- [ ] **Step 5: Run static checks**

Run:

```bash
rg -n "mega-menu__guided-title|Need help choosing" snippets/desktop-menu.liquid assets/custom.css
```

Expected: two matches in `snippets/desktop-menu.liquid` and one match in `assets/custom.css`.

- [ ] **Step 6: Validate Liquid syntax**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check
```

Expected: Theme Check still reports the known existing baseline offenses, but no new syntax or parse error for `snippets/desktop-menu.liquid`.

- [ ] **Step 7: Commit**

```bash
git add snippets/desktop-menu.liquid assets/custom.css
git commit -m "feat: clarify guided links in shop mega menu"
```

### Task 3: Remove Stale Black Friday Header Highlighting

**Files:**
- Modify: `sections/header.liquid`

- [ ] **Step 1: Run the failing static check**

Run:

```bash
rg -n "bfcm-menu-highlight|bf-sale-link|Black Friday" sections/header.liquid
```

Expected: matches for the stale campaign style/script blocks.

- [ ] **Step 2: Delete the stale style block**

Remove this entire block from `sections/header.liquid`:

```liquid
{%- comment -%} // BFCM MENU HIGHLIGHT — styles (sitewide) {%- endcomment -%}
<style id="bfcm-menu-highlight">
  /* Neon green from your screenshot */
  :root { --bfcm-menu-color: #95FD0D; }

  #shopify-section-{{ section.id }} .bf-sale-link{
    color: var(--bfcm-menu-color) !important;
    font-weight: 800;
  }
  #shopify-section-{{ section.id }} .bf-sale-link:hover{
    color: #ffffff !important;
    background: color-mix(in srgb, var(--bfcm-menu-color) 20%, transparent);
    border-radius: 8px;
  }
</style>
```

- [ ] **Step 3: Delete the stale script block**

Remove this entire block from `sections/header.liquid`:

```liquid
{%- comment -%} // BFCM MENU HIGHLIGHT — script (sitewide) {%- endcomment -%}
<script>
  (function(){
    var root = document.getElementById('shopify-section-{{ section.id }}');
    if(!root) return;

    // Case-insensitive match for "Black Friday" or "Black Friday Sale"
    var rx = /black\s*friday(?:\s*sale)?/i;

    // Look through all links within the header section (desktop + mobile drawer rendered in this section)
    var links = root.querySelectorAll('a');

    links.forEach(function(a){
      var t = (a.textContent || '').trim();
      if (rx.test(t)) {
        a.classList.add('bf-sale-link');
      }
    });
  })();
</script>
```

- [ ] **Step 4: Run static checks**

Run:

```bash
rg -n "bfcm-menu-highlight|bf-sale-link|Black Friday" sections/header.liquid
```

Expected: no matches.

- [ ] **Step 5: Validate Liquid syntax**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check
```

Expected: Theme Check still reports the known existing baseline offenses, but no new syntax or parse error for `sections/header.liquid`.

- [ ] **Step 6: Commit**

```bash
git add sections/header.liquid
git commit -m "chore: remove stale header campaign highlight"
```

### Task 4: Admin Navigation Configuration Handoff

**Files:**
- Create: `docs/header-side-menu-admin-config-2026-05-19.md`
- Modify: `docs/header-side-menu-optimization-audit-2026-05-19.md`

- [ ] **Step 1: Create admin configuration doc**

Create `docs/header-side-menu-admin-config-2026-05-19.md` with this content:

```markdown
# Header And Side Menu Admin Configuration

Date: 2026-05-19  
Theme target: `[FIX] Cart 400 - variant id disabled - 2026-05-12` / `149365096541`

## Purpose

This file captures Shopify Admin navigation changes that cannot be made directly in theme code because they live in Shopify linklists.

## Recommended Mobile Sidebar Menu

Create a dedicated Shopify Navigation menu named `Mobile menu - Conversion`.

Use this first-level order:

1. `Shop Nets` -> `/collections/nets-1`
2. `Shop Packages` -> `/collections/packages`
3. `Shop Simulation` -> `/collections/simulation`
4. `Shop Accessories` -> `/collections/general-accessories`
5. `Compare Nets` -> `/pages/compare`
6. `Build Your Setup` -> `/pages/build-your-setup`
7. `Take The Quiz` -> `/pages/quiz`
8. `Support` -> `/pages/support`
9. `Learn` -> `/pages/our-story`

After creating the menu, open the theme editor for theme `149365096541`, select Header, and set `Mobile menu` to `Mobile menu - Conversion`.

## Recommended Desktop Main Menu Adjustments

Keep the top-level desktop menu compact:

1. `Shop` -> `/pages/browse-all-products`
2. `Explore` -> `/pages/compare`
3. `Learn` -> `/pages/support`

Inside `Shop`, include:

- `Nets` -> `/collections/nets-1`
  - `Pro Series` -> `/collections/pro-series-1`
  - `Home Series` -> `/collections/home-series`
- `Packages` -> `/collections/packages`
  - `Pro Series Packages` -> `/collections/pro-series-packages-1`
  - `Home Series Packages` -> `/collections/home-series-packages-1`
  - `No Fly Zone Packages` -> `/collections/no-fly-zone-packages`
- `Simulation` -> `/collections/simulation`
  - `Simulator Bays` -> `/collections/simulation#simulator-bays`
  - `Simulator Packages` -> `/collections/simulation#simulator-packages`
  - `Simulator Add-Ons` -> `/collections/simulation#sim-add-ons`
  - `Launch Monitors` -> `/collections/simulation#launch-monitors`
  - `Computers & Projectors` -> `/collections/simulation#computers-projectors`
- `Accessories` -> `/collections/general-accessories`
  - `Essentials` -> `/collections/general-accessories#essentials`
  - `Safety` -> `/collections/general-accessories#safety`
  - `Simulation` -> `/collections/general-accessories#simulation`
  - `Training Aids` -> `/collections/general-accessories#training`
  - `Other` -> `/collections/general-accessories#other`
- `Compare Nets` -> `/pages/compare`
- `Football` -> `/products/extra-point-football-net`
- `Replacement Parts` -> `/collections/replacement-parts`

## Popup QA Rule

Header QA must be run with marketing popups enabled. The menu should remain usable after page load, and no two modal popups should stack over the header at the same time.
```

- [ ] **Step 2: Append implementation handoff link to audit doc**

Append this section to `docs/header-side-menu-optimization-audit-2026-05-19.md`:

```markdown

## Implementation Handoff

Implementation plan: `docs/superpowers/plans/2026-05-19-header-side-menu-optimization.md`  
Admin configuration handoff: `docs/header-side-menu-admin-config-2026-05-19.md`
```

- [ ] **Step 3: Run documentation checks**

Run:

```bash
rg -n "Mobile menu - Conversion|Compare Nets|Implementation Handoff" docs/header-side-menu-admin-config-2026-05-19.md docs/header-side-menu-optimization-audit-2026-05-19.md
```

Expected: matches in both documentation files.

- [ ] **Step 4: Commit**

```bash
git add docs/header-side-menu-admin-config-2026-05-19.md docs/header-side-menu-optimization-audit-2026-05-19.md
git commit -m "docs: add header menu admin configuration handoff"
```

### Task 5: Preview QA And Screenshots

**Files:**
- Create: `output/playwright/menu-optimization-qa-2026-05-19/desktop-shop-menu.png`
- Create: `output/playwright/menu-optimization-qa-2026-05-19/mobile-menu-top.png`
- Create: `output/playwright/menu-optimization-qa-2026-05-19/mobile-shop-expanded.png`
- Create: `output/playwright/menu-optimization-qa-2026-05-19/mobile-nets-expanded.png`
- Modify: `docs/header-side-menu-optimization-audit-2026-05-19.md`

- [ ] **Step 1: Verify draft theme identity**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:list
```

Expected: output includes `[FIX] Cart 400 - variant id disabled - 2026-05-12` with ID `149365096541`. Do not proceed if the target draft is missing.

- [ ] **Step 2: Start development preview**

Run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:dev
```

Expected: Shopify CLI prints a local preview URL, usually `http://127.0.0.1:9292`. Keep this process running until QA is complete.

- [ ] **Step 3: Capture desktop mega menu screenshot**

Run in a second terminal:

```bash
mkdir -p output/playwright/menu-optimization-qa-2026-05-19
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
"$PWCLI" open http://127.0.0.1:9292
"$PWCLI" resize 1440 1000
"$PWCLI" snapshot
"$PWCLI" hover "Shop"
"$PWCLI" screenshot --filename output/playwright/menu-optimization-qa-2026-05-19/desktop-shop-menu.png
```

Expected: screenshot shows the `Shop` mega menu with `Need help choosing?` above the guided image cards.

- [ ] **Step 4: Capture mobile drawer screenshots**

Run:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
"$PWCLI" resize 390 844
"$PWCLI" reload
"$PWCLI" snapshot
"$PWCLI" click "Navigation"
"$PWCLI" screenshot --filename output/playwright/menu-optimization-qa-2026-05-19/mobile-menu-top.png
"$PWCLI" click "Shop menu"
"$PWCLI" screenshot --filename output/playwright/menu-optimization-qa-2026-05-19/mobile-shop-expanded.png
"$PWCLI" click "Nets submenu"
"$PWCLI" screenshot --filename output/playwright/menu-optimization-qa-2026-05-19/mobile-nets-expanded.png
```

Expected:

- Mobile top state shows the drawer open.
- `Shop` row has a navigable label and a separate expand control.
- `Nets` row has a navigable label and a separate expand control.
- Guided cards appear above nested product category rows in the expanded `Shop` panel.

- [ ] **Step 5: Close browser and stop preview**

Run:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
"$PWCLI" close
```

Then stop the `theme:dev` terminal with `Ctrl-C`.

Expected: no browser or Shopify preview process remains running for this QA session.

- [ ] **Step 6: Append QA results to audit doc**

Append this section to `docs/header-side-menu-optimization-audit-2026-05-19.md`:

```markdown

## Implementation QA Checkpoint

Date: 2026-05-19  
Preview: `http://127.0.0.1:9292`

Screenshots:

- Desktop optimized Shop menu: `output/playwright/menu-optimization-qa-2026-05-19/desktop-shop-menu.png`
- Mobile optimized drawer top: `output/playwright/menu-optimization-qa-2026-05-19/mobile-menu-top.png`
- Mobile optimized Shop expanded: `output/playwright/menu-optimization-qa-2026-05-19/mobile-shop-expanded.png`
- Mobile optimized Nets expanded: `output/playwright/menu-optimization-qa-2026-05-19/mobile-nets-expanded.png`

Result:

- Desktop Shop mega menu opened in preview.
- Mobile parent labels remained navigable while separate controls expanded nested rows.
- Guided mobile cards appeared before product category accordions.
- Source theme was not pushed or published.
```

- [ ] **Step 7: Commit QA artifacts and notes**

```bash
git add docs/header-side-menu-optimization-audit-2026-05-19.md output/playwright/menu-optimization-qa-2026-05-19/
git commit -m "docs: record header menu optimization qa"
```

## Final Verification

- [ ] Run Theme Check:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check
```

Expected: no new syntax errors in `snippets/mobile-menu.liquid`, `snippets/desktop-menu.liquid`, or `sections/header.liquid`.

- [ ] Inspect git status:

```bash
git status --short
```

Expected: only unrelated pre-existing files remain modified or untracked.

- [ ] Confirm no source-theme mutation happened:

```bash
git log --oneline -n 5
```

Expected: recent commits are local repo commits only. There is no `theme push` or `theme publish` step in shell history for this plan.

## Self-Review Notes

- Spec coverage: Covers mobile parent-link navigability, dedicated mobile-menu configuration, desktop guided hierarchy, stale campaign code, popup QA, screenshots, and documentation.
- Placeholder scan: No banned placeholder terms or unspecified code steps are present.
- Type and selector consistency: Uses `mobile-nav__link-row`, `mobile-nav__toggle`, `mobile-nav__guided`, and `mega-menu__guided-title` consistently across Liquid, CSS, static checks, and QA notes.
