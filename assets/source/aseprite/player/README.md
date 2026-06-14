# Yui player Aseprite sources

Production export uses **Aseprite stable v1.3.17.1**.
Do not use **v1.3.18-beta2** for production PNG export.

## Files

```txt
yui_idle.aseprite
yui_move.aseprite
yui_hurt.aseprite
yui_ultimate.aseprite
```

This repo currently uses one source file per pose.
That matches the existing assetManifest ids and keeps `source-missing` / `exported` review simple.

## Export

```sh
pnpm aseprite:export:yui
pnpm assets:verify
```

Missing source files are reported as `source-missing` and skipped.
Do not hand-edit `public/assets/sprites/player/*.png`; edit the Aseprite source and export.

## Collision Boundary

Hand-final sprite work must not change player radius, visualSize, pickup magnet values, or hitCore/debugHitCircle behavior.
