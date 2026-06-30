# AGENTS.md

Repository scope:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

Do not modify any other repository.

## Engineering

- Keep Stage1 playable on a 390 x 844 mobile viewport.
- Preserve gameplay constants unless the task explicitly changes gameplay.
- Prefer the smallest coherent change.
- Run the relevant checks, then commit and push.
- Never call an image or implementation final without comparing it to the current in-repo baseline.

## Title and term lock

Before naming, UI text, design, or store-facing work, read:

- `docs/title-and-term-lock-2026-06-30.md`

## Design source of truth

Before any design-related work, read:

- `docs/design-source-of-truth-2026-06-30.md`

Design reference order:

1. Character reference: `public/assets/prototypes/sprite-sheets/core5-original-frames/`
2. Opponent reference: `public/assets/prototypes/sprite-sheets/enemies-original/`
3. Screen/UI reference: `docs/final-screen-comparison-review-2026-06-29.md`, `docs/non-battle-final-design-implementation-plan.md`, `docs/design-targets/generated/`
4. Unity verification screenshots: `docs/design-targets/generated/unity-u1-2/`, `docs/design-targets/generated/unity-u2/`, `docs/design-targets/generated/unity-u3/`

Do not treat Unity U1/U2/U3 procedural placeholders as final design. Do not use old or retired design sources as the current source of truth.

Character climax art and Kokuyou art are full-screen art / full-screen cut-ins, and must also be treated as Collection/archive art candidates.

## AI image transparency rule

For AI-generated asset candidates that need transparency, read:

- `docs/ai-image-greenback-transparency-rule-2026-06-30.md`

Current best practice:

- Do not rely on direct transparent background generation.
- Generate on a solid chroma key green background.
- Remove the green background after generation.
- Export as transparent PNG.
- Inspect alpha and edge fringe before Unity import.

## Visual work: reference first

The old pixel-generation, palette, Aseprite, procedural-finisher, and mechanical scoring rules are not active instructions.

For a character image request, first inspect and provide the image model with both:

1. `assets/reference/character-master/core5/<character>-character-master-v1.png`
2. `public/assets/prototypes/sprite-sheets/core5-original/<character>-sprite-sheet-v1.png`

Do not replace this visual input with a text-only description.

The character master explains the person. The current sprite sheet is the minimum visual-quality baseline. A new result is rejected when it is less appealing, less coherent, or less readable than either reference, even when dimensions and transparency are correct.

Keep only the character's identity anchors and explicit technical delivery format fixed. Shape language, facial construction, costume details, pose, palette balance, and pixel treatment may be redesigned freely when that improves the character.

## Image-production workflow

Follow `docs/154-sprite-image-production-playbook.md`.

- Separate visual approval from technical finishing.
- Freeze approved art instead of regenerating the full sheet.
- Correct only named weak cells.
- Use deterministic tools for exact dimensions, alpha, slicing, manifests, and runtime registration.
- A visible checkerboard is not proof of transparency; inspect alpha.

## Shared handedness and equipment continuity

This applies to all characters, enemies, weapons, items, and asymmetric assets.

- Before generating directional art, define which body side owns every persistent prop, weapon, strap, bag, sheath, pouch, armor part, horn, wing, or one-sided detail.
- Convert that body-relative map into front, back, left-facing, and right-facing screen placement.
- Do not confuse screen-left/right with body-left/right.
- Do not mirror asymmetric art without correcting handedness and attachment points.
- Keep the same hand, shoulder, hip, or attachment point across idle, walk, cast, attack, hurt, transformation, rage, and recovery unless an intentional transfer is part of the design.
- A character-specific assignment belongs only to that character. Never copy one character's right/left equipment placement to another without checking its master.

## Shared 180x180 asset-cell rule

Apply this to characters, items, weapons, pickups, effects, and enemies unless a task explicitly specifies another format.

- The canvas or sprite-sheet cell is `180 x 180 px`.
- Do not scale the subject to fill all 180 px.
- Size the subject appropriately inside the cell, preserving transparent room for silhouette, motion, equipment, weapons, glow, and effects.
- No opaque pixel, glow, shadow, accessory, or effect may touch the cell edge.
- Do not make the subject so small that its role, silhouette, face, item shape, or enemy type becomes unreadable at gameplay size.
- Keep scale consistent across related frames and related assets.

Current runtime/reference sources:

- Core5 characters: `public/assets/prototypes/sprite-sheets/core5-original/`
- Core5 sliced runtime frames: `public/assets/prototypes/sprite-sheets/core5-original-frames/`
- Character masters: `assets/reference/character-master/core5/`
- Enemy sheets: `public/assets/prototypes/sprite-sheets/enemies-original/`
- Inventory originals: `public/assets/prototypes/sprite-sheets/weapon/`, `passive/`, `rare/`
- Backgrounds: `public/assets/prototypes/backgrounds/`

`public/assets/sprites/` is retired and must not be recreated.

See `docs/153-character-visual-reference-policy.md` and `docs/154-sprite-image-production-playbook.md`.
