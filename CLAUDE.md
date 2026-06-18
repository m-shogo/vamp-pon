# CLAUDE.md

Only work in:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

## Current visual policy

Do not automatically apply the repository's old dot-generation rules, fixed palettes, 52px V2a construction rules, procedural-finisher rules, Aseprite hand-finish workflow, or mechanical quality-score templates.

For every character commission, the actual reference images are mandatory inputs:

```txt
assets/reference/character-master/core5/<character>-character-master-v1.png
public/assets/prototypes/sprite-sheets/core5-original/<character>-sprite-sheet-v1.png
```

Open both images and pass both to the image-producing model or human artist. Text descriptions alone are insufficient.

Judge in this order:

1. Is the character more appealing than the current references?
2. Is it unmistakably the same character?
3. Does the silhouette, face, prop, and movement read at game size?
4. Are poses and directions natural?
5. Does it fit Vamp Pon's night / memory / forgotten-object / small-light world?
6. Only then check canvas, grid, alpha, naming, and cell bounds.

Technical compliance cannot rescue weak art. Reject any output that is visually worse than the current `core5-original` sheet.

## Shared 180x180 asset-cell rule

Use the same base rule for characters, items, weapons, pickups, effects, and enemies unless the task explicitly specifies another format.

- Canvas or sprite-sheet cell: `180 x 180 px`.
- The subject must not fill the whole 180 px.
- Place it at an appropriate readable scale with transparent room for silhouette, animation, equipment, weapons, glow, and effects.
- No opaque pixel, accessory, shadow, glow, or effect may touch a cell edge.
- Do not shrink the subject so far that it becomes unreadable at gameplay size.
- Keep the scale consistent across related frames and related assets.

`public/assets/sprites/` is retired. Do not regenerate it. Runtime character art comes from `core5-original-frames`.

## Engineering safety

- Do not change gameplay values during visual cleanup.
- Do not touch other repositories.
- Keep fallback rendering working when an optional image is absent.
- Run `pnpm character-assets:verify`, `pnpm runtime-assets:verify`, `pnpm test`, and `pnpm build` when relevant.
- Commit and push completed work.
