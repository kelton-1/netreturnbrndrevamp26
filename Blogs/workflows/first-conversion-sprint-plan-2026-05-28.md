# Blog Conversion Sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing Golf Net Size Guide into the first conversion-grade blog asset for TheNetReturn.

**Architecture:** Work from read-only Shopify exports and live URL checks, draft all changes locally in `Blogs/exports/`, and require human approval before any Shopify content mutation. The first sprint produces a publish-ready article refresh and a reusable pattern for future buying guides.

**Tech Stack:** Shopify Admin GraphQL exports, Shopify CLI read-only store execution, Markdown planning files, Shopify blog/article admin review.

---

## Files

- Existing source data: `Blogs/data/shopify-blog-posts-full-2026-05-27.json`
- Existing product data: `Blogs/data/product-link-candidates-golf-net-size-guide-2026-05-28.json`
- Existing brief: `Blogs/strategy/golf-net-size-guide-refresh-brief-2026-05-28.md`
- Create next: `Blogs/exports/golf-net-size-guide-refresh-draft-2026-05-28.md`
- Create next: `Blogs/exports/golf-net-size-guide-shopify-update-checklist-2026-05-28.md`

## Task 1: Draft The Refreshed Article

- [ ] Read `Blogs/strategy/golf-net-size-guide-refresh-brief-2026-05-28.md`.
- [ ] Extract the current article body from `Blogs/data/shopify-blog-posts-full-2026-05-27.json`.
- [ ] Create `Blogs/exports/golf-net-size-guide-refresh-draft-2026-05-28.md`.
- [ ] Include metadata at the top:
  - current URL
  - recommended meta title
  - recommended meta description
  - recommended tags
  - recommended summary
- [ ] Rewrite the article with this structure:
  - quick answer
  - buying-fit table
  - measurement flow
  - product path sections
  - room/layout examples
  - safety/sidebar guidance
  - FAQ
  - final CTA
- [ ] Preserve useful existing substance and remove repetitive phrasing.
- [ ] Do not invent product dimensions or claims that are not in source data.

## Task 2: Add Internal Link Map

- [ ] Add a section titled `Internal Links Used` to the draft.
- [ ] Include product links:
  - Home
  - Pro
  - Home Package
  - Pro Package
  - Simulator Bay 8
  - Side Barriers
- [ ] Include supporting article links:
  - Ball return guide
  - Garage/basement setup guide
  - Pro vs Home comparison
  - Golf mat guide
  - Simulator guide after canonical decision
- [ ] Confirm each link uses a canonical or intentional destination.

## Task 3: Add Proof And Media Notes

- [ ] Add one or two proof examples from the testimonial archive.
- [ ] Add featured image recommendation.
- [ ] Add alt text recommendation.
- [ ] Add optional diagram/table media recommendation.
- [ ] Mark any claim that needs human review before publishing.

## Task 4: Prepare Shopify Update Checklist

- [ ] Create `Blogs/exports/golf-net-size-guide-shopify-update-checklist-2026-05-28.md`.
- [ ] Include fields to update in Shopify:
  - title
  - body HTML
  - summary
  - tags
  - featured image
  - meta title
  - meta description
- [ ] Include product accuracy review items:
  - dimensions
  - package contents
  - availability
  - side-barrier safety language
  - proof claims
- [ ] Include final QA checks:
  - article renders on desktop/mobile
  - links work
  - table is readable on mobile
  - no duplicated simulator canonical confusion

## Task 5: Human Review Gate

- [ ] Stop before Shopify mutations.
- [ ] Ask the user to review the draft and checklist.
- [ ] If approved, prepare either manual Shopify admin instructions or a validated Shopify Admin mutation in a separate step.
