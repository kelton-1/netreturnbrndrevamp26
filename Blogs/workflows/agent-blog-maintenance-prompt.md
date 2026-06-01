# Agent Blog Maintenance Prompt

Use this prompt when handing blog work to Codex, Claude, or another agent.

```text
We are in /Users/kelton1/Developer/TheNetReturn/Shopify. Work inside the Blogs folder unless explicitly asked to edit Shopify theme files.

Start by reading:
- Blogs/README.md
- Blogs/strategy/seo-opportunities-2026-05-27.md
- Blogs/data/blog-post-index-2026-05-27.tsv

Goal: improve TheNetReturn's Shopify blog presence with helpful, buyer-intent SEO content.

Strategic framing:
- Treat the existing blog library as a foundation, not as a finished content program.
- A post being published does not mean it is carrying its weight.
- Classify each article as Conversion, Discovery, Proof, or Archive before recommending work.
- Prioritize the small set of recent buyer-intent posts first, then use older posts for proof, topic ideas, internal links, and trust assets.

Rules:
- Do not publish, update, delete, redirect, or mutate Shopify blog content unless the user explicitly approves that action in this session.
- Draft recommendations and article briefs in Blogs/strategy, Blogs/research, or Blogs/exports.
- Use Shopify read-only exports for existing article context.
- Use current SEO/source research before making recommendations that depend on today's search landscape.
- Preserve brand and product accuracy. Verify dimensions, compatibility, prices, warranties, celebrity/pro claims, and live URLs before including them in a publish-ready draft.

First task:
1. Review the current blog index and identify one high-impact refresh, one consolidation opportunity, and one new article opportunity.
2. For each, write a short brief with target query, intent, internal links, proof needed, and expected business value.
3. Stop for human review before preparing publish-ready copy or Shopify mutations.
```
