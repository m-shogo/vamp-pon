# CLAUDE.md

Only work in:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

## Mandatory current entry

Before large Unity, design, asset, character, enemy, UI, Result, Collection, save, or gameplay work, read:

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/181-current-production-canon.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
```

Historical phase docs are supporting evidence, not standalone current instructions.

Before a large phase:

```sh
pnpm implementation:preflight:check
```

Before declaring a large phase complete:

```sh
pnpm implementation:preflight:full
```

Do not claim local commands were executed when working only through GitHub connector access.

Use the formal title **ヨルノシルベ**.
Use **黒耀化**, never `黒曜化`.

## Current phase order

```txt
Completed: U45.1 Character and Enemy Dot Runtime Pass
Completed: U45.1 Hardening
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Current: U47 gameplay data/runtime
```

Preserve the completed U45.1 provider, animation, pause, and candidate/final boundaries during U46 work.

## Runtime ownership

Source of truth:

```txt
docs/unity-runtime-ownership-contract-v1.md
```

Rules:

- navigation and pause have one owner
- presentation sends commands; it does not own battle or save file I/O
- separate immutable Definition, per-run Runtime State, and versioned Save DTO
- save stable IDs only
- Result and Collection consume read models
- proof, candidate, and production visual approval levels remain separate
- do not keep adding feature logic directly to `U1Stage1SceneBootstrap`
- do not add Result, Collection, save, or permanent progression to `U2BattleController`

## Runtime visual readiness safety

Current classification:

```txt
candidate-animated-multiple-sprite
```

The current Stage1 path uses the candidate-level `RuntimeVisualAssetProvider`, 48-frame Multiple sprites, explicit Yui left/right frames, and Yui/Onbu animators. `runtimeVisualCandidateReady=true`; production visual readiness remains false.

Never treat these as completed dot-runtime evidence:

- Dot/Pixel/Runtime/Production in a GameObject name
- Point Filter
- Mipmap OFF
- a visible static sprite
- successful movement
- successful Simulator route smoke
- renaming a proof provider

Point Filter only disables interpolation. It does not create dot art.

Do not promote these from naming, Point Filter, route smoke alone, or while proof provider, Sprite Mode Single, missing required animation, or active procedural fallback remains:

```txt
characterDotRuntimeReady
characterAnimationReady
enemyDotRuntimeReady
enemyAnimationReady
productionCharacterAssetReady
productionEnemyAssetReady
```

`runtimeVisualCandidateReady` may be true for a verified candidate animation runtime. `runtimeVisualReady` is reserved for final/runtime-approved production visuals and remains false.

Character minimum:

- candidate or production provider with explicit approval level
- proof provider removed from product route
- Sprite Mode Multiple
- actual sliced frames
- idle / walk / hurt / attack
- direction/equipment verification
- gameplay-size visual review
- Golden Identity Reference
- Generation Lineage

Enemy minimum:

- candidate or production provider with explicit approval level
- Multiple frames
- idle / move / hurt / death
- family-canon review
- gameplay-size visual review

The Simulator smoke remains valid for route/pause/input/crash only. It is not character/enemy art approval.

Required:

```sh
pnpm unity:runtime-visual-readiness:check
```

Do not weaken or bypass the checker.

## Asset generation export

`src/game/data/assetGenerationPolicy.ts` is the Contract source of truth. `data/asset-factory/generation-contracts.json` is a reproducible local export and is not Git-managed. The tracked review surface is `data/asset-factory/generation-contracts.summary.json`.

## UI implementation

Runtime remains uGUI. UI Toolkit is editor-only.

New/touched screens use:

- Theme
- Visual State
- 9-slice / Sprite Border
- Responsive Layout Profile
- Base -> Variant, maximum two prefab levels
- Import Policy
- Component Catalog
- Compact / Standard / Large review

Do not paste a completed generated screen image into runtime UI.

## Asset generation

All generated output begins as candidate.

Require:

- Asset Generation Contract
- approved Golden Reference
- four candidates generated from the same contract
- generator/version/seed when supported
- prompt/reference/output hashes
- Generation Lineage
- automatic QA
- human review
- `approvedAsFinal=true`
- `runtimeApproved=true`

Do not copy Web PNGs into Unity and call them production assets.
Do not connect candidate art to production runtime.

## Character visual policy

For character work, inspect actual references:

```txt
assets/reference/character-master/core5/<character>-character-master-v1.png
public/assets/prototypes/sprite-sheets/core5-original/<character>-sprite-sheet-v1.png
```

Text-only descriptions are insufficient.

Judge in this order:

1. visual appeal
2. unmistakable identity
3. gameplay-size silhouette/face/prop/movement
4. pose/direction/handedness/equipment continuity
5. night/memory/forgotten-object/small-light world fit
6. Golden Reference and Lineage
7. dimensions/grid/alpha/naming/bounds

Technical compliance cannot rescue weak art.

## Image-production workflow

Follow:

```txt
docs/154-sprite-image-production-playbook.md
docs/image-generation-production-flow-2026-06-30.md
docs/ai-image-greenback-transparency-rule-2026-06-30.md
```

- separate visual approval from technical finishing
- freeze approved cells
- correct only named weak cells
- use deterministic tools for dimensions, alpha, slicing, manifests, lineage, and runtime registration
- checkerboard is not proof of transparency
- do not call a result perfect from structural checks alone

## Handedness and equipment continuity

- define body-relative ownership of persistent props/features
- derive front/back/left/right screen placement
- do not confuse body-left/right with screen-left/right
- do not mirror asymmetric art without correction
- preserve hand/shoulder/hip attachment through all states

## Shared 180x180 rule

Unless explicitly overridden:

- cell is `180 x 180 px`
- subject does not fill the whole cell
- preserve transparent room for animation/effects
- no opaque/glow/shadow pixel touches the edge
- keep gameplay-size readability and consistent scale
- Sprite Mode Single is not an animated sheet

`public/assets/sprites/` is retired and must not be recreated.

## Engineering safety

- do not change gameplay values during visual cleanup
- do not touch other repositories
- keep fallback rendering explicit and detectable
- do not approve procedural fallback screenshots as production evidence
- run relevant checks, commit, and push completed work
