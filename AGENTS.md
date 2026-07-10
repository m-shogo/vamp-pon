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
- Never promote proof/candidate visuals by editing readiness evidence alone.

## Title and term lock

Before naming, UI text, design, or store-facing work, read:

- `docs/title-and-term-lock-2026-06-30.md`

Use the formal title **ヨルノシルベ**. `Vamp Pon` / `ヴァンサバ改` are development code names.
Use **黒耀化**, never `黒曜化`.

## Design source of truth

Before any design-related work, read:

- `docs/design-source-of-truth-2026-06-30.md`
- `docs/181-current-production-canon.md`
- `docs/unity-ui-design-system-v1.md`
- `docs/asset-generation-consistency-system-v1.md`
- `docs/unity-runtime-visual-readiness-gate-v1.md`

Design reference order:

1. Character reference: `public/assets/prototypes/sprite-sheets/core5-original-frames/`
2. Opponent reference: `public/assets/prototypes/sprite-sheets/enemies-original/`
3. Screen/UI reference: `docs/final-screen-comparison-review-2026-06-29.md`, `docs/non-battle-final-design-implementation-plan.md`, `docs/design-targets/generated/`
4. Unity verification screenshots: current evidence under `docs/design-targets/generated/`

Do not treat Unity procedural placeholders, U5 proof assets, or candidate screenshots as final design. Do not use old or retired design sources as the current source of truth.

Character climax art and Kokuyou art are full-screen art / full-screen cut-ins, and must also be treated as Collection/archive art candidates.

## Unity runtime visual readiness rule

This rule is mandatory for character, enemy, sprite, animation, asset-provider, and gameplay visual tasks.

Current source of truth:

- `docs/unity-runtime-visual-readiness-gate-v1.md`
- `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json`
- `scripts/quality/check-unity-runtime-visual-readiness.ts`

Current classification is `proof-static-single-sprite`.

Never use any of the following as proof that a character or enemy is a finished dot runtime asset:

- GameObject names containing `Dot`, `Pixel`, `Runtime`, or `Production`
- Point Filter
- Mipmap OFF
- a visible static sprite
- successful player movement
- successful Simulator route smoke
- changing a proof provider's name

Point Filter only disables texture interpolation. It does not convert a non-dot image into dot art.

Do not set any of the following to true while `U5ProofAssetProvider`, Sprite Mode Single, missing required animation states, or procedural character/enemy fallback remains in the product runtime route:

```txt
characterDotRuntimeReady
characterAnimationReady
enemyDotRuntimeReady
enemyAnimationReady
productionCharacterAssetReady
productionEnemyAssetReady
runtimeVisualReady
```

`characterDotRuntimeReady=true` requires at minimum:

- production runtime provider
- proof provider removed from the product route
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

Enemy promotion requires the equivalent provider/import/QA boundaries and idle / move / hurt / death.

Before U46 Result / Collection work, complete the minimum U45.1 Character and Enemy Dot Runtime Pass unless the task is explicitly docs/checker-only.

Required check:

```sh
pnpm unity:runtime-visual-readiness:check
```

Do not weaken, remove, or bypass this checker to make a task pass. Update runtime implementation and evidence together.

## Unity asset creation rule

Unity asset work is not a simple migration of Web / Phaser assets.

- Web/prototype assets are reference and comparison baselines.
- Unity runtime candidates must be newly created or finished for Unity use.
- Do not copy Web PNGs into Unity and call them production assets.
- Do not approve output that only matches old Web assets but is weak at Unity gameplay size.
- Do not paste text-baked screenshots or completed screen images as Unity runtime UI.
- Consider PPU, scale, pivot, sorting layer, alpha, bounds, atlas/prefab use, and 390x844 / 360x800 / 430x932 readability.
- If an output is just a Web/prototype copy or not suitable for Unity gameplay readability, revise it before approval.
- Sprite Mode Single is not an animated sprite sheet.
- A proof provider must expose itself as proof-only and must not be used as the production approval authority.
- Procedural fallback must be explicit and detectable; a fallback screenshot cannot be approved as production visual evidence.

Read `docs/image-generation-production-flow-2026-06-30.md` for the full rule.

## AI image production flow

For AI image generation, transparency processing, QA, and Unity handoff, read:

- `docs/image-generation-production-flow-2026-06-30.md`
- `docs/asset-generation-consistency-system-v1.md`

These are the entry points for image-generation work.

All generated assets begin as candidate assets. Golden Reference, Generation Lineage, comparison, QA, final approval, and runtime approval are separate stages.

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

Keep only the character's identity anchors and explicit technical delivery format fixed. Shape language, facial construction, costume details, pose, palette balance, and pixel treatment may be redesigned when that improves the character without causing identity drift or violating the approved Golden Reference.

## Image-production workflow

Follow `docs/154-sprite-image-production-playbook.md`.

- Separate visual approval from technical finishing.
- Freeze approved art instead of regenerating the full sheet.
- Correct only named weak cells.
- Use deterministic tools for exact dimensions, alpha, slicing, manifests, and runtime registration.
- A visible checkerboard is not proof of transparency; inspect alpha.
- A valid grid, alpha channel, or Point Filter cannot rescue weak or non-dot artwork.

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
