# AGENTS.md

<!-- CURRENT_STATE_BEGIN -->
```json
{
  "schemaVersion": 1,
  "currentPhase": "U49 actual-device audio/haptic",
  "nextPhase": "U50 performance/touch metrics",
  "thenPhase": "U51 RC",
  "runtimeVisualReady": true,
  "physicalDeviceReady": false,
  "devicePlayableReady": false,
  "audioMixerImplemented": true,
  "audioMixerDeviceVerified": false,
  "audioReady": false,
  "audioLatencyMeasured": false,
  "hapticReady": false,
  "hapticMeasured": false,
  "u50ThresholdsDefined": false,
  "mobileMetricsReady": false,
  "rcReady": false,
  "productionApproved": false
}
```
<!-- CURRENT_STATE_END -->

Repository scope:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

Do not modify any other repository.

## Mandatory current entry

Before large Unity, gameplay, design, asset, UI, save, audio, haptic, performance, or release work, read:

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/181-current-production-canon.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
docs/visual-production-system.md
```

Historical U0-U45.1 documents are evidence/history, not standalone current instructions. A historical readiness JSON must never override the current readiness JSON.

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

Preserve the completed U47 data/runtime boundaries and U48 production visual provider/approval chain while working on U49.

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

`runtimeVisualReady=true` is limited to the U48 production visual runtime scope. It does not prove actual-device playability, audio/haptic quality, performance, RC readiness, or store approval.

## Engineering

- Keep Stage1 playable on portrait mobile.
- Preserve gameplay constants unless the task explicitly changes gameplay.
- Prefer the smallest coherent change.
- Do not mass-rewrite transitional classes without a phase need.
- Run relevant checks, commit, and push completed work.
- Never call an image or implementation final without comparison to the current in-repo baseline.
- Never promote readiness by editing evidence alone.
- Never use an older Phase result as proof for the current Phase.
- If active source-of-truth documents disagree, stop feature work and repair the contradiction first.
- Point Filter only disables texture interpolation; it is not proof that character/enemy dot art or production visual readiness is complete.
- Run `pnpm unity:runtime-visual-readiness:check` when changing runtime visual-provider, sprite-import, animation-readiness, or related gate documentation.

## Professional visual production rule

Source of truth:

```txt
docs/visual-production-system.md
```

This applies to TOP and every other player-facing screen. Do not wait for the user to repeat it.

- navigation and pause have one owner
- UI sends commands; it does not implement battle or file I/O
- separate Definition, Runtime State, and Save DTO
- save stable IDs only in versioned JSON
- Result and Collection use read models
- proof, candidate, and production asset approval levels remain separate
- do not keep adding features directly to `U1Stage1SceneBootstrap`
- do not add Result, Collection, save, permanent progression, AudioMixer policy, or release logic into `U2BattleController`
- choose the rendering/animation technique from the screen's purpose, not from whatever older implementation already exists
- before a substantial visual pass, verify current Unity/mobile production guidance when the technique or performance tradeoff may have changed
- prefer semantic scene layers, registered alpha assets, local shaders/VFX, and event-driven motion over a flattened full-screen image when independent depth/light/motion matters
- do not force the TOP solution onto every screen: Battle prioritizes readability, Result prioritizes staged reward reveal, Collection prioritizes material/paper tactility, Loading prioritizes fast lightweight transition
- preserve an approved composite as art-direction authority while runtime uses a small meaningful layer pack when depth or local motion is required
- do not explode scenes into dozens of textures; atlas/share materials where practical and measure mobile cost
- Reduced Motion is a live runtime behavior, not a separate rebuilt screen
- a final visual may not silently fall back to a weaker flattened representation when its production contract requires semantic layers

### Visual continuation with low context

Use the formal title **ヨルノシルベ**. `Vamp Pon` / `ヴァンサバ改` are development code names.

Use **黒耀化**, never `黒曜化`.

For the current visual implementation direction, read this compact entrypoint before pulling in more historical documents:

```txt
docs/agent-work/CURRENT_VISUAL_GOAL.md
```

## Runtime visual readiness

Source of truth:

```txt
docs/unity-runtime-visual-readiness-gate-v1.md
docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json
```

Current classification is `production-animated-sprite`.

The Stage1 production path uses final/runtime-approved U48 assets through the production visual provider, explicit left/right Yui frames, and animated Onbu frames. U45.1 candidate runtime evidence remains valid historical prerequisite evidence, but it is no longer the current provider/readiness state. `runtimeVisualReady=true`; actual-device, audio, haptic, performance, RC, and whole-app production approval remain false.

Never use these alone as finished dot-runtime or production evidence:

- GameObject name containing Dot/Pixel/Runtime/Production
- Point Filter
- Mipmap OFF
- a visible static sprite
- successful movement
- successful Simulator route smoke
- renaming a provider
- editing readiness JSON without runtime/evidence/checker changes

Point Filter only disables texture interpolation. It does not convert artwork into dot art.

Do not promote these from naming, Point Filter, route smoke alone, or while proof provider, Sprite Mode Single, missing animation states, or active procedural fallback remains:

```txt
characterDotRuntimeReady
characterAnimationReady
enemyDotRuntimeReady
enemyAnimationReady
productionCharacterAssetReady
productionEnemyAssetReady
```

`runtimeVisualCandidateReady` is false after the U48 production promotion. `runtimeVisualReady=true` is limited to the verified U48 production visual scope and does not imply device or whole-app production readiness.

Character minimum:

- candidate or production provider with explicit approval level
- proof provider removed from product route
- Sprite Mode Multiple
- actual frames
- idle / walk / hurt / attack
- direction/equipment verification
- gameplay-size review
- Golden Identity Reference
- Generation Lineage

Enemy minimum:

- candidate or production provider with explicit approval level
- Multiple frames
- idle / move / hurt / death
- family-canon review
- gameplay-size review
Required check:

```sh
pnpm unity:runtime-visual-readiness:check
```

Do not weaken the checker to make a task pass.

## U49 actual-device audio/haptic boundary

U49 readiness must be based on actual-device observations. Editor or Simulator hooks may verify routing, but they must not promote:

```txt
devicePlayableReady
audioMixerReady
audioLatencyMeasured
hapticMeasured
```

Required evidence should identify device/build, tested SE/BGM/haptic sequence, foreground/background recovery, failure observations, and human-review result. Do not promote U50 or U51 from U49 automation alone.

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

`src/game/data/assetGenerationPolicy.ts` is the Contract source of truth. The local full export `data/asset-factory/generation-contracts.json` is reproducible and ignored by Git. Commit the TypeScript source, tracked summary, manifests, and checker changes required by the task.

All new generated output begins as candidate. U48 approval applies only to the explicitly recorded 46 selected groups; it is not a blanket approval for later replacements.

Required before a new asset becomes runtime final:

- Asset Generation Contract
- Golden Reference
- four-candidate comparison or documented existing-source lineage
- prompt/reference/output hashes
- Generation Lineage
- automatic QA
- human review
- `approvedAsFinal=true`
- `runtimeApproved=true`
- gameplay-size review
- production provider/registry connection
- verification evidence

Do not copy a Web PNG into Unity and call it production. Do not bake text or controls into a full-screen image.

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
- no opaque/glow/shadow pixel touches the cell edge
- keep gameplay-size readability
- keep scale consistent across related frames

`public/assets/sprites/` is retired and must not be recreated.
### Deferred image-generation batch

When image generation is intentionally deferred while runtime implementation continues, record required assets here instead of relying on conversation memory:

```txt
docs/agent-work/visual-asset-generation-queue.json
docs/agent-work/claude-to-codex-image-batch-handoff.md
```

The queue is the priority/source-of-truth for which visually weak screens should receive generated assets. Do not regenerate screens listed under `doNotGenerateYet` without a new visual review. Claude may direct the batch, while Codex is the production worker that generates/saves assets and connects already-defined runtime paths. Keep requests small by reading only the active queue item, its referenced production contract, and required visual/character references.
