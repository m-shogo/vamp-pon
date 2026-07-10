# CLAUDE.md

Only work in:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

## Current source of truth

Before design, asset, Unity runtime, character, enemy, or UI work, read:

```txt
docs/181-current-production-canon.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
```

Use the formal title **ヨルノシルベ**. `Vamp Pon` / `ヴァンサバ改` are development code names.
Use **黒耀化**, never `黒曜化`.

## Runtime visual readiness safety

The current Unity Stage1 character/enemy path is classified as:

```txt
proof-static-single-sprite
```

It uses `U5ProofAssetProvider`, Single sprites, and procedural fallbacks. Point Filter is applied, but required animation is not connected.

Never treat any of the following as proof of a completed dot character or enemy:

- a GameObject name containing `Dot`, `Pixel`, `Runtime`, or `Production`
- Point Filter
- Mipmap OFF
- successful sprite display
- successful player movement
- successful Simulator route smoke
- renaming a proof provider

Point Filter only disables interpolation. It does not create dot art.

Do not set these true while proof provider, Sprite Mode Single, missing required animation, or procedural fallback remains in the product runtime route:

```txt
characterDotRuntimeReady
characterAnimationReady
enemyDotRuntimeReady
enemyAnimationReady
productionCharacterAssetReady
productionEnemyAssetReady
runtimeVisualReady
```

`characterDotRuntimeReady=true` requires:

- production runtime provider
- proof provider removed from product runtime
- Sprite Mode Multiple
- actual sliced frames
- idle / walk / hurt / attack
- direction flip verification
- gameplay-size visual review
- Golden Identity Reference
- Generation Lineage

`productionCharacterAssetReady=true` additionally requires:

- `approvedAsFinal=true`
- `runtimeApproved=true`
- `characterAnimationReady=true`

Enemy promotion requires the equivalent boundaries and idle / move / hurt / death.

The Simulator smoke result remains valid for route/pause/input/crash evidence only. It is not character/enemy art approval.

Before U46 Result / Collection implementation, complete the minimum U45.1 Character and Enemy Dot Runtime Pass unless the task is explicitly docs/checker-only.

Required check:

```sh
pnpm unity:runtime-visual-readiness:check
```

Do not weaken or bypass the checker. Runtime implementation, evidence, and checker must change together.

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
4. Are poses, directions, handedness, and equipment placement coherent?
5. Does it fit the night / memory / forgotten-object / small-light world?
6. Does it satisfy the Golden Reference and Generation Lineage boundary?
7. Only then check canvas, grid, alpha, naming, and cell bounds.

Technical compliance cannot rescue weak art. Reject any output that is visually worse than the current `core5-original` sheet.

## Image-production workflow

Follow:

```txt
docs/154-sprite-image-production-playbook.md
docs/asset-generation-consistency-system-v1.md
```

- Separate visual approval from technical asset finishing.
- All generated output begins as candidate.
- Require the same Asset Generation Contract for all four compared candidates.
- Record generator name/version, prompt hash, reference hashes, output hash, seed when supported, and source commit.
- Once art is approved, freeze good cells and do not regenerate the whole sheet to fix size or transparency.
- Correct only explicitly named weak cells.
- Use scripts or image tools for exact dimensions, real alpha, slicing, naming, manifests, runtime registration, and QA.
- A visible checkerboard is not proof of transparency; inspect the alpha channel.
- Do not call a result perfect based only on structural checks.
- Do not connect candidate art to production runtime without final/runtime approval.

## Shared handedness and equipment continuity

Apply this to all characters, enemies, weapon poses, transformed states, and asymmetric assets.

- Before directional art, define which body side owns each persistent item or feature.
- Record right-hand items, left-hand items, shoulder straps, hip bags, sheaths, pouches, armor parts, horns, wings, and other one-sided details.
- Derive front, back, left-facing, and right-facing screen placement from that body-relative map.
- Do not confuse screen-left/right with body-left/right.
- Do not mirror asymmetric art without correcting handedness, attachment points, and occlusion.
- Preserve the same hand, shoulder, hip, and attachment point through all actions unless an intentional transfer is part of the design.
- Do not copy one character's right/left assignments to another character without checking that character's own master.

## Shared 180x180 asset-cell rule

Use the same base rule for characters, items, weapons, pickups, effects, and enemies unless the task explicitly specifies another format.

- Canvas or sprite-sheet cell: `180 x 180 px`.
- The subject must not fill the whole 180 px.
- Place it at an appropriate readable scale with transparent room for silhouette, animation, equipment, weapons, glow, and effects.
- No opaque pixel, accessory, shadow, glow, or effect may touch a cell edge.
- Do not shrink the subject so far that it becomes unreadable at gameplay size.
- Keep the scale consistent across related frames and related assets.
- Sprite Mode Single is not an animated sprite sheet.
- Point Filter is necessary for pixel presentation but is not proof that the art itself is pixel art.

`public/assets/sprites/` is retired. Do not regenerate it. Runtime character art comes from approved/sliced production sources, not from a renamed proof sprite.

## Engineering safety

- Do not change gameplay values during visual cleanup.
- Do not touch other repositories.
- Keep optional fallback rendering explicit and detectable.
- Do not approve screenshots produced by a procedural fallback as production visual evidence.
- Run relevant checks, including `pnpm unity:runtime-visual-readiness:check`, `pnpm character-assets:verify`, `pnpm runtime-assets:verify`, `pnpm asset-generation:check`, `pnpm test`, and `pnpm build`.
- Commit and push completed work.
