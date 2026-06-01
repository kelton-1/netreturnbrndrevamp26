# Admin Update Path: Golf Net Size Guide

Date: 2026-05-28

## Status

Executed on 2026-05-28 with `isPublished: false`.

This path updates supported Shopify Article fields through Admin GraphQL:

- title
- body HTML
- summary
- tags
- publish state

It does not update SEO title/description yet. In the current Admin GraphQL schema, `Article` does not expose a normal `seo { title description }` field, and the current article has no SEO metafields. Treat SEO title/description as a manual Shopify Admin update unless a later agent verifies the exact storage route.

## Target Article

- Article ID: `gid://shopify/Article/563418038365`
- Current URL: `https://www.thenetreturn.com/blogs/news/golf-net-size-guide-how-to-choose-the-right-golf-net-for-your-space-1`
- Blog: `The Net Return News`
- Blog ID: `gid://shopify/Blog/4471877`
- Handle: `golf-net-size-guide-how-to-choose-the-right-golf-net-for-your-space-1`

## Files

- Mutation: `Blogs/workflows/update-blog-article.graphql`
- Variables template: `Blogs/workflows/golf-net-size-guide-update-variables.template.json`
- Candidate variables: `Blogs/exports/golf-net-size-guide-update-variables.candidate-2026-05-28.json`
- Candidate body HTML: `Blogs/exports/golf-net-size-guide-shopify-body-candidate-2026-05-28.html`
- Draft source: `Blogs/exports/golf-net-size-guide-refresh-draft-2026-05-28.md`
- Publishing checklist: `Blogs/exports/golf-net-size-guide-shopify-update-checklist-2026-05-28.md`

## Validated Mutation

The mutation in `Blogs/workflows/update-blog-article.graphql` validated against Shopify Admin GraphQL.

Required scopes reported by validation:

- `write_content`
- `write_online_store_pages`
- `read_content`
- `read_online_store_pages`

## Execution Result

Mutation output:

- Result file: `Blogs/exports/golf-net-size-guide-update-result-2026-05-28.json`
- Shopify `userErrors`: `[]`
- Article ID: `gid://shopify/Article/563418038365`
- Article status after update: draft/unpublished
- Public URL status after update: `404`, expected while unpublished
- Fresh readback file: `Blogs/exports/golf-net-size-guide-post-update-read-2026-05-28.json`

Fresh readback confirmed:

- `isPublished: false`
- `publishedAt: null`
- tags applied:
  - `Garage Golf`
  - `Golf Net`
  - `Golf Simulator`
  - `Home Golf`
  - `Product Comparison`
- updated summary applied
- updated body contains `Quick Fit Guide`, `Home Package`, and `Side Barriers`

## Execution Steps

These commands were used for the 2026-05-28 draft update.

1. Review the candidate variables file.

The candidate variables file already contains the generated Shopify-ready HTML from the current draft:

```bash
Blogs/exports/golf-net-size-guide-update-variables.candidate-2026-05-28.json
```

2. If edits are needed, copy the candidate to an approved execution file.

```bash
cp Blogs/exports/golf-net-size-guide-update-variables.candidate-2026-05-28.json Blogs/exports/golf-net-size-guide-update-variables.approved.json
```

3. Authenticate with write access.

```bash
PATH=/Users/kelton1/.local/bin:$PATH shopify store auth --store the-net-return.myshopify.com --scopes write_content,write_online_store_pages,read_content,read_online_store_pages
```

4. Execute the update.

```bash
PATH=/Users/kelton1/.local/bin:$PATH shopify store execute --store the-net-return.myshopify.com --query-file Blogs/workflows/update-blog-article.graphql --variable-file Blogs/exports/golf-net-size-guide-update-variables.approved.json --allow-mutations --json --output-file Blogs/exports/golf-net-size-guide-update-result-2026-05-28.json
```

5. Check for `userErrors`.

```bash
jq '.articleUpdate.userErrors' Blogs/exports/golf-net-size-guide-update-result-2026-05-28.json
```

Expected:

```json
[]
```

6. Verify the live page.

```bash
curl -L --max-time 20 -s https://www.thenetreturn.com/blogs/news/golf-net-size-guide-how-to-choose-the-right-golf-net-for-your-space-1 | rg -n "Quick Fit Guide|Home Package|Pro Package|Side Barriers|Golf Net Size Guide"
```

7. Manually update or verify SEO fields in Shopify Admin.

Recommended SEO values:

- Meta title: `Golf Net Size Guide: Choose The Right Net For Your Space`
- Meta description: `Find the right golf net size for a garage, basement, backyard, or simulator bay. Compare Home, Pro, Large Pro, and package options from The Net Return.`

## Final Safety Notes

- This is a content mutation against the real Shopify store, not a theme preview.
- There is no true dry run for `shopify store execute --allow-mutations`.
- Keep the handle unchanged to avoid URL/redirect risk.
- Keep `isPublished: false` for draft/preview workflows until the user explicitly approves publishing.
- Do not include proof claims until the user approves them.
- CLI note: global/user-local Shopify CLI is `4.1.0` as of 2026-05-28, but this repo still has a project-local `@shopify/cli@3.94.3` dependency. Prefer direct `PATH=/Users/kelton1/.local/bin:$PATH shopify store ...` commands for this blog/admin pipeline unless intentionally testing the project-local CLI.
