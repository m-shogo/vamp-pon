# CLAUDE.md

Only work in:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

## Mandatory current entry

Before large Unity, design, asset, character, enemy, UI, Result, Collection, save, gameplay, audio, haptic, performance, or release work, read:

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/181-current-production-canon.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
```

Historical phase docs are supporting evidence, not standalone current instructions. Never let a historical readiness JSON override the current readiness JSON.

Before a large phase:

```sh
pnpm implementation:preflight:check
```

Before declaring a large phase complete:

```sh
pnpm implementation:preflight:full
```

Do not claim local commands were executed when working only through GitHub connector access.

Use the formal title **ヨルノシルベ**. Use **黒耀化**, never `黒曜化`.

## Current phase order

```txt
Completed: U45.1 Character and Enemy Dot Runtime Pass
Completed: U45.1 Hardening
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Next: U50 performance/touch metrics
Then: U51 RC
```

Preserve U47 data/runtime ownership and U48 production provider/approval boundaries during U49 work.

## Current readiness boundary

```txt
runtimeVisualClassification=production-animated-sprite
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
candidateAssetsApprovedAsFinal=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

`runtimeVisualReady=true` covers the U48 production visual runtime only. It does not prove actual-device playability, audio/haptic quality, performance, RC readiness, or release approval.

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
- do not add Result, Collection, save, permanent progression, AudioMixer policy, or release logic to `U2BattleController`

## Runtime visual readiness safety

Current classification:

```txt
production-animated-sprite
```

The current Stage1 path uses final/runtime-approved U48 assets through the production visual provider. U45.1 candidate animation evidence remains historical prerequisite evidence, not the current provider state.

Never treat these as completed dot-runtime or production evidence by themselves:

- Dot/Pixel/Runtime/Production in a GameObject name
- Point Filter
- Mipmap OFF
- a visible static sprite
- successful movement
- successful Simulator route smoke
- renaming a provider
- editing readiness JSON without runtime/evidence/checker changes

Point Filter only disables interpolation. It does not create dot art.

Required:

```sh
pnpm unity:runtime-visual-readiness:check
```

Do not weaken or bypass the checker.

## U49 actual-device audio/haptic safety

Editor and Simulator can prove request routing, deterministic sequences, and crash absence. They cannot promote actual-device readiness.

Do not set the following true without actual-device evidence:

```txt
devicePlayableReady
audioMixerReady
audioLatencyMeasured
hapticMeasured
```

Record the device/build, SE/BGM/haptic sequence, background/foreground recovery, observed failures, human review, and evidence path. U49 completion must not automatically promote U50 or U51.

## Asset generation export

`src/game/data/assetGenerationPolicy.ts` is the Contract source of truth. `data/asset-factory/generation-contracts.json` is a reproducible local export and is not Git-managed. The tracked review surface is `data/asset-factory/generation-contracts.summary.json` plus task-specific manifests/evidence.

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

## Asset generation and production approval

All new generated output begins as candidate. U48 approval applies only to the explicitly recorded 46 production groups and must not be generalized to later replacements.

Require:

- Asset Generation Contract
- approved Golden Reference
- four candidates generated from the same contract, or documented existing-source lineage
- generator/version/seed when supported
- prompt/reference/output hashes
- Generation Lineage
- automatic QA
- human review
- `approvedAsFinal=true`
- `runtimeApproved=true`
- gameplay-size review
- production provider/registry connection
- verification evidence

Do not copy Web PNGs into Unity and call them production assets. Do not connect candidate art to production runtime.

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
- preserve hand/shoulder/hip attachment through every action

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

- do not change gameplay values during visual or documentation cleanup
- do not touch other repositories
- keep fallback rendering explicit and detectable
- do not approve procedural fallback screenshots as production evidence
- preserve user uncommitted and unpushed work; do not reset, clean, or force-push it
- run relevant checks, commit, and push coherent completed work

## Repository integrity

- if active source-of-truth documents disagree on Phase, provider, approval, or readiness, stop feature work and repair the contradiction first
- never promote readiness by docs-only changes
- never use older Phase evidence as current Phase evidence
- run the relevant checker after changing an adopted document or readiness contract
- commit and push coherent verified changes
