# Shopify Theme Development Sprint Plan

> **Status (2026-05-21):** Workstreams 1, 2, 3, and 5 are effectively done — the active workstream is now the brand revamp on branch `brand-revamp-2026`. Start with [brand-revamp-2026.md](brand-revamp-2026.md) for current state. Workstream 4 (cart 400 / variant handling investigation) was never executed and remains open if needed.

> **For the next agent session:** Start by reading `README.md`, `docs/setup-status.md`, and this file. Use the Shopify skills in `.agents/skills` when working on Liquid, Shopify CLI, Admin/API behavior, or storefront GraphQL. Do not push, publish, or mutate a Shopify theme unless the user explicitly asks for that action in the active session.

**Sprint Goal:** Turn the freshly initialized TheNetReturn Shopify theme workspace into a safe, repeatable development lane and begin reducing risk in the pulled theme with focused quality fixes and storefront-flow verification.

**Theme:** `[FIX] Cart 400 - variant id disabled - 2026-05-12`  
**Source theme ID:** `149365096541`  
**Store:** `the-net-return`  
**Development preview from setup:** `149375320157`

---

## Operating Rules

- Work locally in `/Users/kelton1/Developer/TheNetReturn/Shopify`.
- Use `PATH=/Users/kelton1/.local/bin:$PATH` for commands unless `npm` is already available.
- Keep Shopify actions read-only or development-theme-only by default.
- Use `npm run theme:dev` for preview QA; stop it before ending the session.
- Use `npm run theme:pull` only when intentionally refreshing from theme `149365096541`.
- Do not run `shopify theme push`, `shopify theme publish`, or live-theme mutation commands without fresh user approval.
- Treat current Theme Check findings as a known baseline, not as a reason to block all development.
- Prefer small, reviewable commits or checkpoints by workstream.

## Sprint Outcomes

By the end of the sprint, the next agent should leave behind:

- A committed baseline snapshot or a clear uncommitted status report.
- A reproducible QA checklist for the product, cart, collection, home, and search flows.
- A prioritized Theme Check report with the first high-confidence errors fixed.
- A safer local development workflow documented for future agents.
- No accidental changes to the source Shopify theme unless explicitly approved.

## Workstream 1: Baseline And Safety

**Intent:** Make the workspace safe for repeated agent sessions before changing theme behavior.

- [x] Confirm Codex was restarted after MCP setup and Shopify Dev MCP is available.
- [x] Review current Git status and distinguish setup files from pulled theme files.
- [x] Decide with the user whether to commit the full pulled-theme baseline before feature work.
- [x] If committing, create a baseline commit message such as `chore: initialize TheNetReturn Shopify theme workspace`.
- [x] Confirm `.shopifyignore` excludes repo-only files: `.git/*`, `.agents/*`, `node_modules/*`, package files, `README.md`, and `docs/*`.
- [x] Confirm `npm run theme:list` still lists source theme `149365096541`.
- [x] Confirm `npm run theme:dev` starts a development preview and stop it after verification.

**Acceptance Criteria**

- A future agent can tell whether local files are baseline theme files, setup files, or intentional edits.
- The docs explain how to preview without pushing to the source theme.
- No long-running preview server is left active at handoff.

## Workstream 2: Theme Check Triage

**Intent:** Convert the current noisy Theme Check output into a useful quality backlog and fix the safest errors first.

Current baseline:

```text
341 files inspected with 180 total offenses found across 97 files.
16 errors.
164 warnings.
```

Known example errors:

- `blocks/ai_gen_block_ecefba7.liquid`: `UnknownFilter` for `limit`
- `layout/theme.liquid`: `ContentForHeaderModification`
- `sections/academy-expanding-cards.liquid`: parser-blocking `script_tag`
- `snippets/trust-badges.liquid`: missing `width` and `height` attributes on `img` tags

**Sprint Tasks**

- [x] Run `npm run theme:check` and capture the current summary in `docs/theme-check-baseline.md`.
- [x] Group findings into `must fix`, `needs product/design review`, and `defer`.
- [x] Fix low-risk correctness errors first:
  - `snippets/trust-badges.liquid`: add explicit image dimensions.
  - `sections/academy-expanding-cards.liquid`: replace parser-blocking `script_tag` with a deferred script tag.
  - `blocks/ai_gen_block_ecefba7.liquid`: replace invalid `limit` filter usage with valid Liquid iteration limiting.
- [x] Re-run `npm run theme:check` after each focused fix.
- [x] Leave `layout/theme.liquid` `ContentForHeaderModification` for a separate reviewed task unless the user explicitly wants it handled now.

**Acceptance Criteria**

- At least three high-confidence Theme Check errors are fixed without changing page intent.
- The remaining Theme Check errors are documented with a recommendation, not buried in raw output.
- Every fix is verified by Theme Check and a local preview smoke test.

## Workstream 3: Storefront Flow QA

**Intent:** Establish a regression loop around the areas most likely to matter for revenue and the theme name’s cart issue.

**Flows To Verify**

- Home page loads and primary navigation works.
- Collection page loads and product cards link to products.
- Product page loads, variant selection works, quantity controls behave, and add-to-cart succeeds.
- Cart page/drawer updates quantities and handles disabled or unavailable variants gracefully.
- Search or predictive search opens and returns usable results.

**Sprint Tasks**

- [x] Start `npm run theme:dev`.
- [x] Capture the local preview URL and development theme ID in the sprint notes.
- [x] Identify representative storefront URLs from existing templates, theme settings, or Shopify preview navigation.
- [x] Use browser QA to walk through the flows above.
- [x] Record failures in `docs/qa-notes.md` with page URL, reproduction steps, expected result, actual result, and likely file owner.
- [x] Stop `theme:dev` before ending the session.

**Acceptance Criteria**

- `docs/qa-notes.md` exists and covers the five flows above.
- Cart and variant behavior has at least one explicit pass/fail note.
- Any defect found has a likely owning file or subsystem named.

## Workstream 4: Cart 400 / Variant Handling Investigation

**Intent:** Understand and protect the fix implied by the source theme name.

**Likely Areas To Inspect**

- `sections/main-cart.liquid`
- `sections/mini-cart.liquid`
- `snippets/product-form.liquid`
- `snippets/product-variant-selector.liquid`
- `assets/theme.js`
- `assets/custom.js`

**Sprint Tasks**

- [ ] Search for cart API calls, variant ID handling, and add-to-cart form serialization.
- [ ] Identify how disabled/unavailable variants are represented in Liquid and JavaScript.
- [ ] Test add-to-cart with a normal product variant and an unavailable/disabled variant if one is discoverable.
- [ ] Document the current behavior in `docs/cart-variant-investigation.md`.
- [ ] Add a small guard or fix only if a reproducible issue is found locally.

**Acceptance Criteria**

- The next agent can explain where variant IDs enter cart requests.
- Any proposed cart fix has a reproduction path and preview verification.
- No speculative cart rewrite is performed.

## Workstream 5: Development Workflow Hardening

**Intent:** Make future sessions faster and safer.

- [x] Add `docs/development-workflow.md` if workflow knowledge grows beyond `README.md`. — Captured instead in [Shopify/CLAUDE.md](../CLAUDE.md) Commands + Safety sections.
- [ ] Consider adding npm scripts for common safe commands if the user wants them:
  - `theme:check:strict`
  - `theme:dev:open`
  - `theme:pull:dry-note` documentation only, since Shopify CLI does not provide a true pull dry run.
- [ ] Add a short `docs/release-checklist.md` before any future push/publish work.
- [x] Keep local-only docs excluded from Shopify uploads via `.shopifyignore`.

**Acceptance Criteria**

- A future agent can start, verify, and stop the dev server without rediscovering setup details.
- Any release-oriented command remains documented and gated, not casually automated.

## Suggested Sprint Order

1. Baseline And Safety
2. Storefront Flow QA
3. Theme Check Triage
4. Cart 400 / Variant Handling Investigation
5. Development Workflow Hardening

This order favors knowing the current storefront behavior before making fixes. If Theme Check errors prevent meaningful preview work, swap steps 2 and 3.

## Next Agent Kickoff Prompt

Use this prompt to start the next implementation session:

```text
We are in /Users/kelton1/Developer/TheNetReturn/Shopify, a local Shopify theme workspace for TheNetReturn theme 149365096541. Read README.md, docs/setup-status.md, and docs/sprint-plan-2026-05-13.md first. Use the installed Shopify skills in .agents/skills and the Shopify Dev MCP after confirming Codex has been restarted. Start with Workstream 1 from the sprint plan: verify the safe baseline, check Git status, confirm theme:list, and decide whether the baseline should be committed before edits. Do not push, publish, or mutate the source Shopify theme without explicit approval. Use npm run theme:dev only for development-theme preview QA and stop it before ending.
```

## Definition Of Done For This Sprint

- The baseline is committed or explicitly documented as uncommitted.
- Preview QA has been run and written down.
- The highest-confidence Theme Check errors have been reduced.
- Cart/variant behavior has a written investigation note.
- No unapproved source-theme mutation occurred.
