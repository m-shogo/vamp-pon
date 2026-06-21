# Aseprite export and preview automation

Aseprite CLI / Lua は、作画の代替ではなく **再現性・確認・量産補助** のために使う。

## Automation roles

Good:

- create source templates
- create layer / tag / palette structure
- export PNG from `.aseprite`
- export sprite sheet for preview
- export GIF preview
- create dark background preview
- create contact sheet

Not good:

- final visual judgment
- final-candidate naming
- hidden gameplay balance changes
- public PNG direct edits

## Commands

Check Aseprite CLI:

```sh
pnpm aseprite:check
```

Create a structured template:

```sh
pnpm aseprite:template:character -- --out=assets/source/aseprite/player/prototypes/yui_master_52_template.aseprite --size=52 --name=yui_master
```

Export review previews from an existing source:

```sh
pnpm aseprite:preview:character -- --source=assets/source/aseprite/player/prototypes/yui_master_52_template.aseprite --out-dir=public/assets/sprites/player/prototypes/reviews/yui_master_52
```

Existing production export remains:

```sh
pnpm aseprite:export:player
pnpm assets:verify
```

## Preview output policy

Preview output should go under prototype/review paths, not production paths.

Recommended:

```txt
public/assets/sprites/player/prototypes/reviews/<asset-id>/
  original.png
  sheet.png
  preview.gif
```

Do not write previews to:

```txt
public/assets/sprites/player/yui_idle_42.png
public/assets/sprites/player/yui_move_42.png
public/assets/sprites/player/yui_hurt_42.png
public/assets/sprites/player/yui_ultimate_42.png
```

unless the work is explicitly a production promotion and the promotion gate passes.

## Aseprite script param convention

Aseprite CLI script params should be passed before `--script` when possible.

```sh
$ASEPRITE_BIN -b source.aseprite \
  --script-param outDir=public/assets/sprites/player/prototypes/reviews/example \
  --script scripts/aseprite/export-character-previews.lua
```

## Review checklist after automation

Automation is successful only if it produces reviewable evidence:

- original PNG exists
- sheet or GIF preview exists when relevant
- dark background or gameplay background was checked
- source path is still the source of truth
- production paths were not touched accidentally

## Failure policy

If Aseprite CLI is missing, wrapper scripts should skip with exit 0 for optional tooling.
If a source path is missing, preview export should exit 1 because the requested source is invalid.
If production paths are requested by preview tooling, scripts should reject them.
