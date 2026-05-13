# TheNetReturn Shopify Theme Workspace

Local development workspace for TheNetReturn Shopify theme `149365096541`.

This workspace was initialized for Codex-assisted Shopify theme work. It includes Shopify CLI scripts, Shopify AI Toolkit skills, and a global Codex MCP configuration for Shopify developer documentation and schema-aware assistance.

## Current Theme

- Store: `the-net-return`
- Source theme ID: `149365096541`
- Theme name at pull time: `[FIX] Cart 400 - variant id disabled - 2026-05-12`
- Admin editor: `https://the-net-return.myshopify.com/admin/themes/149365096541/editor`
- Preview: `https://the-net-return.myshopify.com?preview_theme_id=149365096541`

## What Was Set Up

- User-level Node/npm tooling at `/Users/kelton1/.local/bin`
- Local Shopify CLI dependency: `@shopify/cli@3.94.3`
- Project scripts in `package.json`
- Shopify AI Toolkit skills in `.agents/skills`
- Shopify Dev MCP in `/Users/kelton1/.codex/config.toml`
- Local Git repository initialized
- Theme files pulled from Shopify into this folder

Restart Codex after this setup so the new Shopify MCP server is discovered.

## Common Commands

Run these from `/Users/kelton1/Desktop/TheNetReturn/Shopify`.

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:list
```

Lists themes in the `the-net-return` Shopify store.

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:pull
```

Pulls theme `149365096541` locally with `--nodelete`.

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:check
```

Runs Shopify Theme Check against the local theme.

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:dev
```

Starts a local preview server and creates/uses a Shopify development theme.

## Important Notes

- Do not run `theme push`, publish, or live-theme mutation commands unless you intentionally want to update Shopify.
- `theme:dev` is safer than pushing to the source theme, but it still syncs local files to a separate development theme.
- The first authenticated CLI run completed through Shopify browser/device login.
- Shopify CLI may require normal macOS access to `~/Library/Preferences` when run outside Codex.
- A temporary project-local CLI home workaround was tested during setup and removed from scripts because it caused odd Desktop side effects in the sandbox.

## Verification Snapshot

- Shopify auth completed successfully.
- `theme:list` showed theme `149365096541`.
- `theme:pull` completed successfully for `[FIX] Cart 400 - variant id disabled - 2026-05-12`.
- Theme files are present across standard Shopify folders, including `layout`, `sections`, `snippets`, `templates`, `assets`, `config`, `locales`, and `blocks`.
- `theme:dev` returned local preview `http://127.0.0.1:9292` and development theme preview `149375320157`; the preview server was stopped afterward.
- `theme:check` runs, but the pulled theme currently reports existing Theme Check offenses.

See `docs/setup-status.md` for the fuller setup log and known issues. See `docs/sprint-plan-2026-05-13.md` for the next agent handoff plan.
