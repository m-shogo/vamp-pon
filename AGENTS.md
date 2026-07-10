# AGENTS.md

Repository scope:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

Do not modify any other repository.

## Mandatory current entry

Before any large Unity implementation, read:

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/181-current-production-canon.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
```

Historical U0-U43 documents are evidence/history, not standalone current instructions.

Required static preflight before a large phase:

```sh
pnpm implementation:preflight:check
```

Required full preflight before declaring a large phase complete:

```sh
pnpm implementation:preflight:full
```

Do not claim these commands ran when working only through GitHub connector access.

## Current phase order

```txt
U45.1 Character and Enemy Dot Runtime Pass
then U46 Result / Retry / StageSelect / Collection
then U47 gameplay data/runtime
```

Do not skip U45.1 for visual/runtime implementation unless the task is explicitly docs/checker-only.

## Engineering

- Keep Stage1 playable on portrait mobile.
- Preserve gameplay constants unless the task explicitly changes gameplay.
- Prefer the smallest coherent change.
- Do not mass-rewrite transitional classes without a phase need.
- Run relevant checks, commit, and push completed work.
- Never call an image or implementation final without comparison to current in-repo baseline.
- Never promote readiness by editing evidence alone.

## Runtime ownership

Source of truth:

```txt
docs/unity-runtime-ownership-contract-v1.md
```

Rules:

- navigation and pause have one owner
- UI sends commands; it does not implement battle or file I/O
- separate Definition, Runtime State, and Save DTO
- save IDs only in versioned JSON
- Result and Collection use read models
- proof and production asset providers remain separate
- do not keep adding features directly to `U1Stage1SceneBootstrap`
- do not add Result, Collection, save, or permanent progression into `U2BattleController`

## Title and term lock

Use the formal title **ヨルノシルベ**.
`Vamp Pon` / `ヴァンサバ改` are development code names.

Use **黒耀化**, never `黒曜化`.

Read:

```txt
docs/title-and-term-lock-2026-06-30.md
docs/181-current-production-canon.md
```

## Design source of truth

Read:

```txt
docs/design-source-of-truth-2026-06-30.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
```

Reference order:

1. Character masters and approved Golden Identity References
2. Current Core5/enemy sheets
3. Current screen/design references
4. Current Unity evidence screenshots

Do not treat procedural placeholders, U5 proof assets, or candidate screenshots as final design.

## Runtime visual readiness

Current classification is `proof-static-single-sprite`.

Never use these as finished dot-runtime evidence:

- GameObject name containing Dot/Pixel/Runtime/Production
- Point Filter
- Mipmap OFF
- a visible static sprite
- successful movement
- successful Simulator route smoke
- renaming a proof provider

Point Filter only disables texture interpolation. It does not convert artwork into dot art.

Do not promote these while proof provider, Sprite Mode Single, missing animation states, or active procedural fallback remains:

```txt
characterDotRuntimeReady
characterAnimationReady
enemyDotRuntimeReady
enemyAnimationReady
productionCharacterAssetReady
productionEnemyAssetReady
runtimeVisualReady
```

Character minimum:

- production provider
- proof provider removed from product route
- Sprite Mode Multiple
- actual frames
- idle / walk / hurt / attack
- direction/equipment verification
- gameplay-size review
- Golden Identity Reference
- Generation Lineage

Enemy minimum:

- production provider
- Multiple frames
- idle / move / hurt / death
- family-canon review
- gameplay-size review

Required check:

```sh
pnpm unity:runtime-visual-readiness:check
```

Do not weaken the checker to make a task pass.

## Unity UI rule

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

## Asset generation rule

All generated assets start as candidates.

Required before runtime final:

- Asset Generation Contract
- Golden Reference
- four-candidate comparison
- prompt/reference/output hashes
- Generation Lineage
- automatic QA
- human review
- `approvedAsFinal=true`
- `runtimeApproved=true`

Do not copy a Web PNG into Unity and call it production.
Do not bake text or controls into a full-screen image.

## Image-production workflow

Read:

```txt
docs/154-sprite-image-production-playbook.md
docs/image-generation-production-flow-2026-06-30.md
docs/ai-image-greenback-transparency-rule-2026-06-30.md
```

- inspect real reference images, not text-only descriptions
- separate visual approval from technical finishing
- freeze approved cells
- fix only named weak cells
- use deterministic tools for dimensions, alpha, slicing, naming, lineage, and runtime registration
- visible checkerboard is not proof of alpha
- technical compliance cannot rescue weak art

## Handedness and equipment continuity

For asymmetric assets:

- define body-relative ownership of props and equipment
- derive front/back/left/right screen placement
- do not confuse body-left/right with screen-left/right
- do not mirror asymmetric art without correction
- preserve hand/shoulder/hip attachment through all actions

## Shared 180x180 cell rule

Unless explicitly overridden:

- cell is `180 x 180 px`
- subject does not fill the entire cell
- preserve transparent motion/effect room
- no opaque/glow/shadow pixel touches cell edge
- keep gameplay-size readability
- keep scale consistent across related frames

`public/assets/sprites/` is retired and must not be recreated.
