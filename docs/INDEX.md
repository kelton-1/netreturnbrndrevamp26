# docs/ — index

Quick map of what's here. Order within each group is alphabetical, not chronological. When you finish a substantive piece of work, append to the relevant existing doc rather than creating a new one — convention set by the prior Codex session and kept.

## Active workstream

- **[brand-revamp-2026.md](brand-revamp-2026.md)** — Live progress log for the 2026 brand redesign. Branch `brand-revamp-2026`. Read this first if you've just landed on the branch.

## Setup, baseline, sprint planning

- **[setup-status.md](setup-status.md)** — How the local theme workspace was bootstrapped (CLI, skills, MCP, theme pull). Path note: paths in older docs say `/Desktop/`; current location is `/Developer/`.
- **[sprint-plan-2026-05-13.md](sprint-plan-2026-05-13.md)** — Original five-workstream plan from the initial Codex session (Baseline / Theme Check Triage / Storefront QA / Cart Investigation / Workflow Hardening).
- **[theme-check-baseline.md](theme-check-baseline.md)** — Theme Check offense count log. Update when you reduce the count. Baseline was 161; latest count tracked here.

## Audits — static / read-only inspections

- **[audit-critical-css.md](audit-critical-css.md)** — Per-template inline critical-CSS files (`snippets/*-css.liquid`).
- **[audit-mobile-bugs.md](audit-mobile-bugs.md)** — Mobile bug catalog.
- **[audit-third-party.md](audit-third-party.md)** — Third-party scripts and apps inventory.
- **[audit-wnw-system.md](audit-wnw-system.md)** — `wnw_*` header/footer integration (third-party app injection layer).
- **[visual-audit.md](visual-audit.md)** — Visual inspection notes.
- **[ux-navigation-audit-2026-05-14.md](ux-navigation-audit-2026-05-14.md)** — Nav UX audit.
- **[ux-navigation-stakeholder-map.html](ux-navigation-stakeholder-map.html)** — Stakeholder-readable nav map (open in browser).
- **[header-side-menu-optimization-audit-2026-05-19.md](header-side-menu-optimization-audit-2026-05-19.md)** — Audit feeding the in-progress `codex/header-side-menu-optimization` branch (parked).

## QA + verification

- **[qa-notes.md](qa-notes.md)** — Preview QA log. Append when running storefront-flow checks.
- **[manual-qa-checklist.md](manual-qa-checklist.md)** — Manual checklist for verifying the preview theme.

## Performance

- **[perf-baseline.md](perf-baseline.md)** — Performance baseline (static audit complete, runtime pending).
- **[perf-reports/](perf-reports/)** — Generated performance reports.

## Data / research

- **[net-return-data-questions-shopify-findings-2026-05-14.md](net-return-data-questions-shopify-findings-2026-05-14.md)** — Answers to ad-hoc data questions sourced from Shopify.
- **[loox-shopify-cross-reference-2026-05-14.md](loox-shopify-cross-reference-2026-05-14.md)** — Loox reviews cross-referenced against Shopify catalog.
- **[compare-mobile-sprint-plan.md](compare-mobile-sprint-plan.md)** — Mobile sprint planning notes.
- **[package-category-image-update-2026-05-19.md](package-category-image-update-2026-05-19.md)** — Package category image work.
- **[competitive-research/](competitive-research/)** — Competitor analyses.

## Tooling / agent context

- **[superpowers/](superpowers/)** — Extra agent skill scaffolding from a prior session.

## File naming convention going forward

- Audits: `audit-<scope>.md` (e.g. `audit-critical-css.md`).
- Dated reports: `<topic>-YYYY-MM-DD.md` (used for one-off snapshots; ongoing logs use undated names like `brand-revamp-2026.md`).
- Workstream progress logs: `<workstream-name>.md`, lowercase-kebab, append-only.

If you write a NEW doc, also append a one-line entry under the right section here so the index stays current.
