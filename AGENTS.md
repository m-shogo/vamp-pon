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

## Visual work: reference first

The old pixel-generation, palette, Aseprite, procedural-finisher, and mechanical scoring rules are not active instructions.

For a character image request, first inspect and provide the image model with both:

1. `assets/reference/character-master/core5/<character>-character-master-v1.png`
2. `public/assets/prototypes/sprite-sheets/core5-original/<character>-sprite-sheet-v1.png`

Do not replace this visual input with a text-only description.

The character master explains the person. The current sprite sheet is the minimum visual-quality baseline. A new result is rejected when it is less appealing, less coherent, or less readable than either reference, even when dimensions and transparency are correct.

Keep only the character's identity anchors and explicit technical delivery format fixed. Shape language, facial construction, costume details, pose, palette balance, and pixel treatment may be redesigned freely when that improves the character.

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

See `docs/153-character-visual-reference-policy.md`.
