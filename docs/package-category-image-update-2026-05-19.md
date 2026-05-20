# Packages Category Image Update

Date: 2026-05-19  
Store: `the-net-return`  
Source draft theme: `[FIX] Cart 400 - variant id disabled - 2026-05-12` (`149365096541`)  
Development theme briefly used: `149375975517`

## Summary

Updated the home page "Pick Your Lane" Packages tile so the category image uses the supplied backyard patio package photo.

The final update was applied directly to source draft theme `149365096541`, which is the theme open in the Shopify editor URL:

```text
https://admin.shopify.com/store/the-net-return/themes/149365096541/editor
```

## Files Changed

- `assets/home-packages-backyard-patio.jpg`
  - Created from `/Users/kelton1/Downloads/Full Package Backyard Patio.png`.
  - Resampled to `1200 x 900`.
  - Compressed as JPEG, approximately `473 KB` locally.
- `templates/index.json`
  - Updated section `tnr_collection_list_VRWxpC`.
  - Updated block `collection_jDkEcc` ("Packages").
  - Changed `image_asset` from `home-packages.jpg` to `home-packages-backyard-patio.jpg`.

Final relevant JSON setting:

```json
"collection_jDkEcc": {
  "type": "collection",
  "settings": {
    "image_asset": "home-packages-backyard-patio.jpg",
    "title": "Packages",
    "link_text": "Shop Packages",
    "link_url": "shopify://collections/packages"
  }
}
```

## Shopify Sync Notes

The first preview pass synced to the Shopify CLI development theme `149375975517`, which is why the image did not appear in the user's open editor for theme `149365096541`.

After the mismatch was identified:

1. Pulled only `templates/index.json` and `sections/tnr-collection-list.liquid` from theme `149365096541` into a temporary working folder.
2. Confirmed the source draft already had the refined collection-list section and was only missing the new Packages `image_asset` value.
3. Patched only the source draft copy of `templates/index.json`.
4. Copied in only `assets/home-packages-backyard-patio.jpg`.
5. Pushed only these two files to theme `149365096541` with `--nodelete`.

This avoided pushing unrelated dirty local workspace changes.

## Validation

- Shopify theme validation passed for:
  - `templates/index.json`
  - `assets/home-packages-backyard-patio.jpg`
- Pulled theme `149365096541` back after the push and confirmed:
  - `templates/index.json` has `"image_asset": "home-packages-backyard-patio.jpg"` for block `collection_jDkEcc`.
  - `assets/home-packages-backyard-patio.jpg` exists on the source draft theme.
- The separate `theme dev` process for development theme `149375975517` was stopped so future work stays focused on the correct draft theme.

## Follow-Up Guidance

- Continue working against theme `149365096541` when the user's Shopify editor URL points there.
- If using `shopify theme dev`, remember it creates or updates a separate development theme, not the source draft theme in the admin editor.
- For source draft changes, prefer narrow `theme pull` / `theme push --only ... --nodelete` operations from a temporary folder when the main workspace has unrelated dirty files.
- If the editor does not reflect the image immediately, hard refresh the Shopify editor preview because Shopify theme/editor caching can lag behind a successful asset/template push.
