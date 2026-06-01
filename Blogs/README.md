# TheNetReturn Blogs Workspace

Created: 2026-05-27

This folder is the working area for Codex, Claude, and future agents helping maintain TheNetReturn's Shopify blog presence.

## Current Export

- Store: `the-net-return.myshopify.com`
- Export date: 2026-05-27
- Articles exported: 183
- Shopify Admin scope used: `read_content`
- Master export: `data/shopify-blog-posts-full-2026-05-27.json`
- Lightweight index: `data/blog-post-index-2026-05-27.tsv`
- Reusable query: `workflows/export-blog-posts.graphql`

The export is read-only. It does not change posts, themes, products, or store content.

## Tooling Note

As of 2026-05-28, the global/user-local Shopify CLI at `/Users/kelton1/.local/bin/shopify` is version `4.1.0`. This is the CLI future sessions and agents should get when they run:

```bash
PATH=/Users/kelton1/.local/bin:$PATH shopify version
```

The Shopify theme repo still has a project-local dev dependency on `@shopify/cli@3.94.3`. If an agent sees different behavior between direct `shopify store ...` commands and `npm run theme:*` commands, compare the global CLI version with the project dependency before assuming a Shopify auth, media, or Admin API problem.

## Folder Map

- `data/` - raw Shopify article exports and tabular indexes.
- `exports/` - future cleaned exports, briefs, or publish-ready article packets.
- `research/` - keyword, SERP, competitor, and customer-question research.
- `strategy/` - SEO plans, content calendars, and editorial recommendations.
- `workflows/` - repeatable prompts, queries, and operating checklists for agents.

## Current Sprint

- First conversion target: `Golf Net Size Guide`
- Refresh brief: `strategy/golf-net-size-guide-refresh-brief-2026-05-28.md`
- Execution plan: `workflows/first-conversion-sprint-plan-2026-05-28.md`

## Refresh Workflow

Authenticate to the store with content-read access:

```bash
PATH=/Users/kelton1/.local/bin:$PATH shopify store auth --store the-net-return.myshopify.com --scopes read_content
```

Export the newest page of articles:

```bash
PATH=/Users/kelton1/.local/bin:$PATH shopify store execute --store the-net-return.myshopify.com --query-file Blogs/workflows/export-blog-posts.graphql --variables '{"first":50}' --json --output-file Blogs/data/shopify-blog-posts-YYYY-MM-DD.json
```

For more than 50 articles, continue paging with the `endCursor` value in the export file.

## Agent Rules

- Do not publish, update, delete, redirect, or mutate Shopify blog content unless the user explicitly asks for that action in the active session.
- Treat AI output as a draft until a human reviews brand voice, product accuracy, claims, pricing, warranty language, and legal/compliance-sensitive statements.
- Keep sources, keyword assumptions, internal-link targets, and recommended Shopify actions in this folder so the next agent can continue without rediscovery.
- Prioritize helpful buyer-intent content that connects real customer questions to relevant products, collections, and proof.

## Useful Source Links

- Shopify Admin GraphQL `articles` query: https://shopify.dev/docs/api/admin-graphql/latest/queries/articles
- Shopify Admin GraphQL `blogs` query: https://shopify.dev/docs/api/admin-graphql/latest/queries/blogs
- Google people-first content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Shopify ecommerce SEO best practices: https://www.shopify.com/blog/ecommerce-seo-best-practices
