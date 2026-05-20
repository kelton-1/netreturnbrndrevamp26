# Header/Footer Navigation Handoff

Date: 2026-05-20  
Workspace: `/Users/kelton1/Developer/TheNetReturn/Shopify`

## Keep

- Keep the dark brand header and white wordmark direction.
- Keep the existing `main-menu-2024` desktop source until the merchant approves a final Shopify Navigation IA.
- Keep the above-footer advisory CTA: `Talk to a Net Return advisor`.
- Keep the footer Shadow Green system with payment/social/legal utilities below the main link area.
- Keep all source-theme mutation approval-gated. This pass changed repo code/config only; it did not push or publish a Shopify theme.

## Fixed In Code

- Mobile drawer now starts with direct conversion-first paths before the inherited menu:
  - `Shop Nets`
  - `Shop Packages`
  - `Shop Simulation`
  - `Shop Accessories`
  - `Compare Nets`
  - `Build Your Setup`
  - `Take The Quiz`
  - `Talk To An Expert`
  - `Learn & Support`
- Mobile nested parent rows now split the parent label from the expand control. Real URLs stay tappable; `#` parents render as labels.
- Mobile guided image cards now render above the nested product category accordions.
- Desktop mega-menu image cards now get a concise decision-support label: `Not sure where to start?`
- Desktop `Explore` and `Learn` now use the same brand mega-menu hover treatment as `Shop`, with distinct setup/story/player imagery so the top-level nav feels uniform.
- Mobile keeps the image-heavy mega-menu content scoped to `Shop`; `Explore` and `Learn` stay as lighter accordion lists for responsive drawer performance.
- Stale sitewide BFCM/Black Friday header highlight CSS and JavaScript were removed from `sections/header.liquid`.
- Footer trust strip is enabled above the advisory CTA.
- Footer newsletter copy now promises setup tips and buying guides rather than generic news/deals.

## Decide In Shopify Admin

Shopify Navigation linklists are store data, so the cleanest final IA still belongs in Admin rather than hardcoded theme files.

Recommended mobile menu:

1. `Shop Nets` -> `/collections/nets-1`
2. `Shop Packages` -> `/collections/packages`
3. `Shop Simulation` -> `/collections/simulation`
4. `Shop Accessories` -> `/collections/general-accessories`
5. `Compare Nets` -> `/pages/compare`
6. `Build Your Setup` -> `/pages/build-your-setup`
7. `Take The Quiz` -> `/pages/quiz`
8. `Talk To An Expert` -> `/pages/contact`
9. `Learn & Support` -> `/pages/support`

Recommended desktop top-level IA:

- `Shop`
- `Compare`
- `Build Your Setup`
- `Learn`
- `Support`

Compact alternative:

- `Shop`
- `Compare`
- `Learn & Support`

Recommended `Shop` mega-menu order:

1. `Nets`
2. `Packages`
3. `Simulation`
4. `Accessories`
5. `Football`
6. `Replacement Parts`
7. `Compare Nets`
8. `Take The Quiz`
9. `Build Your Setup`
10. `Talk To An Expert`

Normalize same-site URLs in Admin where possible, especially Simulation anchors:

- `/collections/simulation#simulator-bays`
- `/collections/simulation#simulator-packages`
- `/collections/simulation#sim-add-ons`
- `/collections/simulation#launch-monitors`
- `/collections/simulation#computers-projectors`

## Popup QA

The 2026-05-19 audit found marketing popups could block desktop menu interaction. Retest header hover/click and mobile drawer open with marketing embeds enabled. Preferred Admin settings:

- Delay marketing popups until after first scroll or 8-12 seconds.
- Prevent multiple popups from stacking.
- Suppress popups during first interaction with header/menu when the app allows it.

## Preview QA Notes

Local preview: `http://127.0.0.1:9293`  
Development preview theme shown by Shopify CLI: `149375975517`

Artifacts:

- Desktop full-page screenshot: `output/playwright/header-footer-optimization-2026-05-20/desktop-header-footer.png`
- Mobile blocked-state screenshot: `output/playwright/header-footer-optimization-2026-05-20/mobile-verification-blocked.png`
- Mobile blocked-state screenshot after the Explore/Learn mega-menu pass: `output/playwright/header-nav-mega-2026-05-20/mobile-verification-blocked.png`

Confirmed in the rendered preview before Shopify connection verification appeared:

- Conversion-first mobile quick links exist in the drawer markup in the approved order.
- Stale BFCM selectors are absent from the rendered header.
- Desktop/menu guided label text is present.
- Static config now confirms `Shop`, `Explore`, and `Learn` all have brand mega-menu blocks, and `Explore`/`Learn` use distinct imagery from the original `Shop` block.
- Shopify Liquid validator passed for `sections/header-group.json`, `snippets/mobile-menu.liquid`, and `snippets/desktop-menu.liquid`.
- Footer trust strip is enabled.
- Footer newsletter copy uses setup tips / buying guides language.
- Static validator passed: `node scripts/validate-header-footer-navigation.mjs`.
- Theme Check remained on the known baseline shape: `372 files inspected`, `161 total offenses`, `1 error`, `160 warnings`; changed header/footer files had no errors.

Not completed visually:

- Desktop hover screenshots for `Explore` and `Learn`, plus the mobile drawer screenshot at 390px. A first preview attempt was blocked by an unrelated dirty homepage config issue in `templates/index.json` (`order: must have a maximum of 25`). Running the preview while ignoring that homepage file allowed the local route to load, but Shopify then returned "Your connection needs to be verified before you can proceed" for browser automation. The final visual check needs a human/browser session that can pass the storefront verification layer.

## Code Files Touched

- `snippets/mobile-menu.liquid`
- `snippets/desktop-menu.liquid`
- `sections/header.liquid`
- `sections/header-group.json`
- `sections/footer-group.json`
- `assets/brand-revamp.css.liquid`
- `scripts/validate-header-footer-navigation.mjs`
- `docs/header-footer-navigation-handoff.md`
- `docs/brand-revamp-2026.md`
