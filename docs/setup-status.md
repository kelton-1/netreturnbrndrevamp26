# Shopify/Codex Setup Status

Date: 2026-05-13  
Workspace: `/Users/kelton1/Desktop/TheNetReturn/Shopify`

## Summary

This folder has been initialized as the local Shopify theme workspace for TheNetReturn theme `149365096541`. The setup added local Shopify CLI support, installed Shopify AI Toolkit skills, configured Shopify Dev MCP for Codex globally, authenticated to Shopify, pulled the target theme, and verified that local preview can start.

## Installed Tooling

Node/npm tooling was installed under the user-local path:

```text
/Users/kelton1/.local/bin/node
/Users/kelton1/.local/bin/npm
/Users/kelton1/.local/bin/npx
```

Verified versions:

```text
node v24.14.0
npm 11.9.0
Shopify CLI 3.94.3
```

Update note from 2026-05-28:

```text
Global/user-local Shopify CLI was updated to 4.1.0 at /Users/kelton1/.local/bin/shopify.
The project dev dependency in package.json/node_modules remains @shopify/cli@3.94.3.
```

Future agents should be aware that direct commands such as `PATH=/Users/kelton1/.local/bin:$PATH shopify version` resolve to Shopify CLI `4.1.0`, while npm scripts may still use the project-local `@shopify/cli@3.94.3` depending on npm's PATH resolution. If a blog/admin pipeline or theme command behaves differently between direct `shopify ...` and `npm run theme:*`, check both versions before debugging Shopify auth or API behavior.

The project has a local dev dependency on `@shopify/cli` and scripts for normal theme work:

```json
{
  "theme:list": "shopify theme list --store the-net-return",
  "theme:pull": "shopify theme pull --store the-net-return --theme 149365096541 --nodelete",
  "theme:dev": "shopify theme dev --store the-net-return",
  "theme:check": "shopify theme check"
}
```

Use `PATH=/Users/kelton1/.local/bin:$PATH` before `npm` commands if your shell does not already find the user-local Node tooling.

## Codex Shopify MCP

The global Codex config at `/Users/kelton1/.codex/config.toml` now contains:

```toml
[mcp_servers.shopify-dev-mcp]
command = "/Users/kelton1/.local/bin/npx"
args = ["-y", "@shopify/dev-mcp@latest"]
```

The MCP server was smoke-tested with `@shopify/dev-mcp@latest`, which reported Shopify Dev MCP Server `v1.13.0` on stdio.

Restart Codex to load this MCP server into future sessions.

## Shopify AI Toolkit Skills

The Shopify AI Toolkit installed 19 skills into `.agents/skills`:

- `shopify-admin`
- `shopify-app-store-review`
- `shopify-custom-data`
- `shopify-customer`
- `shopify-dev`
- `shopify-functions`
- `shopify-hydrogen`
- `shopify-liquid`
- `shopify-onboarding-dev`
- `shopify-onboarding-merchant`
- `shopify-partner`
- `shopify-payments-apps`
- `shopify-polaris-admin-extensions`
- `shopify-polaris-app-home`
- `shopify-polaris-checkout-extensions`
- `shopify-polaris-customer-account-extensions`
- `shopify-pos-ui`
- `shopify-storefront-graphql`
- `shopify-use-shopify-cli`

The installer also created `skills-lock.json`.

## Theme Pull

Shopify auth completed with browser/device login. `theme:list` confirmed the target theme:

```text
[FIX] Cart 400 - variant id disabled - 2026-05-12  [unpublished]  #149365096541
```

The theme was pulled with:

```bash
PATH=/Users/kelton1/.local/bin:$PATH npm run theme:pull
```

The pull completed successfully:

```text
The theme '[FIX] Cart 400 - variant id disabled - 2026-05-12' (#149365096541) has been pulled.
```

Standard theme directories now exist locally, including:

- `assets`
- `blocks`
- `config`
- `layout`
- `locales`
- `sections`
- `snippets`
- `templates`

## Preview Verification

`theme:dev` was run and returned:

```text
Preview your theme:
http://127.0.0.1:9292
```

It also created/used development preview theme `149375320157`:

```text
https://the-net-return.myshopify.com/?preview_theme_id=149375320157
https://the-net-return.myshopify.com/admin/themes/149375320157/editor?hr=9292
```

The local preview endpoint responded over HTTP. The root URL returned a Shopify-powered `404`, which still confirmed the local preview server was routing through Shopify; it may need a specific storefront path to render an existing page.

The preview server was stopped after verification so no long-running process was left active.

## Theme Check Results

`theme:check` runs successfully as a command, but exits non-zero because the pulled theme has existing Theme Check findings:

```text
341 files inspected with 180 total offenses found across 97 files.
16 errors.
164 warnings.
```

Examples from the current findings:

- `blocks/ai_gen_block_ecefba7.liquid`: `UnknownFilter` for `limit`
- `layout/theme.liquid`: `ContentForHeaderModification`
- `sections/academy-expanding-cards.liquid`: parser-blocking `script_tag`
- `snippets/trust-badges.liquid`: missing `width` and `height` attributes on `img` tags
- `config/settings_schema.json`: deprecated `helvetica_n4` defaults
- `locales/nb.json`: invalid translated HTML strings

These appear to be pre-existing theme quality issues, not setup failures.

## Safety Notes

- `theme:pull` includes `--nodelete` so local-only files are not deleted during pulls.
- `.shopifyignore` excludes `.git`, `.agents`, `.codex`, `node_modules`, local environment files, package metadata, and the temporary `shopify-cli-home` folder from Shopify uploads.
- `.gitignore` excludes local dependencies, Shopify CLI state, environment files, logs, and the temporary `shopify-cli-home` folder.
- Do not run `shopify theme push`, `shopify theme publish`, or commands with mutation flags unless the intent is to update Shopify.

## Known Caveat From Setup

Codex initially could not let Shopify CLI write to the normal macOS preferences path, so a project-local `HOME` workaround was temporarily used. That workaround allowed auth and preview to proceed but caused odd macOS Desktop behavior in the sandbox. The project scripts were restored to normal Shopify CLI commands afterward.

The leftover `shopify-cli-home/` folder is ignored and should not be committed or uploaded. It can be deleted manually later if desired.

## Recommended Next Steps

1. Restart Codex so Shopify Dev MCP becomes available in future turns.
2. Commit the initialized workspace once you are comfortable with the pulled theme snapshot.
3. Decide whether to fix Theme Check errors now or leave them as known existing issues.
4. For active development, use `npm run theme:dev` and verify changes on the development theme before any push to a named Shopify theme.
