# Unity U44 to U51 App Quality Roadmap

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

Original roadmap date: 2026-07-06
Last synchronized: 2026-07-24
Status: current

## Current status

```txt
U44: complete
U45 visual candidate / settings repair / AI-only Simulator route smoke: complete
U45.1 Runtime Visual Readiness gate and candidate animation runtime: complete historical prerequisite
U46 AppFlow / Save / Result / Retry / StageSelect / 灯録 candidate: complete
U46.1 Result / Save Hardening: complete
U47 gameplay data/runtime and production DataRegistry: complete
U48 production asset expansion: complete
U49 actual-device audio/haptic: current
U50 device performance/touch metrics: not started
U51 RC: not started
```

Current readiness:

```txt
implementationFoundationReady=true
simulatorPlayableCandidateReady=true
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
candidateAssetsApprovedAsFinal=true
productionDataRegistryImplemented=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

`runtimeVisualReady=true` is limited to the completed U48 production visual runtime scope. It does not promote device, audio, haptic, performance, RC, or product readiness.

## Cross-phase Big Implementation Foundation Gate

Source of truth:

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-current-doc-index-2026-07-10.md
```

Required before large implementation:

- source-of-truth order is current
- active documents agree on Phase and readiness
- navigation/pause ownership is explicit
- Definition / Runtime State / Save DTO are separated
- proof, candidate, and production asset approval levels are separated
- UI Design System and Asset Generation Contract remain active
- readiness flags remain evidence-based
- historical Phase evidence is not reused as current evidence

Static preflight:

```sh
pnpm implementation:preflight:check
```

Full preflight:

```sh
pnpm implementation:preflight:full
```

## U44 Web to Unity parity audit

- Status: complete.
- Goal: freeze Web/Unity gap, design references, asset requests, and quality rules.
- Historical output must not override later U47/U48 implementation evidence.

## U45 StageSelect + Battle HUD + LevelUp candidate

- Status: complete historical candidate milestone.
- Route/pause/input/crash evidence remains useful regression evidence.
- Its candidate-art status is not the current U48 production visual state.

## U45.1 Character and Enemy Dot Runtime Pass

- Status: complete historical prerequisite.
- Goal: replace proof-static visuals with the first real Multiple animation runtime.
- Historical classification: `candidate-animated-multiple-sprite`.
- Current classification after U48: `production-animated-sprite`.

Historical U45.1 evidence remains intentionally candidate-only:

```txt
docs/design-targets/generated/unity-u45-1/runtime-dot-readiness.json
docs/design-targets/generated/unity-u45-1/animation-smoke-result.json
docs/design-targets/generated/unity-u45-1/visual-review.json
```

Current state is defined by:

```txt
docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json
docs/design-targets/generated/unity-u48/approved-production-set.json
docs/design-targets/generated/unity-u48/production-verification/manifest.json
```

Required invariant:

- proof provider is excluded from product route
- player/enemy Sprite Mode remains Multiple
- required animation states remain connected
- procedural fallback remains development-only
- explicit direction/equipment continuity remains verified

## Cross-phase UI Design System Gate

Source:

```txt
docs/unity-ui-design-system-v1.md
```

Mandatory U46-U51:

- uGUI runtime
- UI Toolkit editor-only
- 9-slice / Sprite Border
- ScriptableObject Theme
- Visual State
- Responsive Layout Profile
- Component Catalog
- Base -> Variant maximum two levels
- UI import policy
- Sprite Atlas policy
- Compact / Standard / Large validation

Check:

```sh
pnpm unity:ui-design-system:check
```

## U46 AppFlow + Result + Retry + StageSelect + 灯録

- Status: complete candidate shell.
- U46.1 Result / Save Hardening: complete.

Completed boundaries:

```txt
sceneFlowCoordinatorImplemented=true
pauseCoordinatorImplemented=true
versionedSaveServiceImplemented=true
saveMigrationTestsReady=true
resultReadModelImplemented=true
collectionReadModelImplemented=true
uiShellReady=true
```

Preserve:

- Result/Collection do not own battle simulation
- UI does not own file I/O
- pause/navigation use one owner
- Save DTO remains versioned and ID-based

## U47 Weapon / Item / Passive / Rare / Evolution / 黒耀化

- Status: complete.
- Production DataRegistry and definition/runtime separation are established.
- Stage1 remains playable, item state is visible, invalid drops/evolutions are blocked, and U47 data/runtime checks pass.

Preserve:

- stable IDs and migration boundaries
- definition / runtime state / save DTO separation
- LevelUp/inventory presentation does not become rule ownership
- battle controller does not absorb save or screen construction

## U48 Production asset expansion: Completed

- Status: complete for the defined U48 visual runtime scope.
- Human approval: 46 selected visual groups.
- Production connection: complete.
- Verification: 46 groups / 138 captures across Compact / Standard / Large in a Preview-define-free iOS Simulator build.

Required current chain:

```txt
human-selection.json
-> approved-production-set.json
-> production-connection.json
-> production-verification/manifest.json
-> runtime visual readiness promotion
```

Checks:

```sh
pnpm unity:u48-production-asset-expansion:check
pnpm unity:u48-production-asset-approval-pack:check
pnpm unity:u48-human-selection:check
pnpm unity:u48-approved-production-set:check
pnpm unity:u48-production-visual-connection:check
pnpm unity:u48-production-visual-verification:check
pnpm unity:runtime-visual-readiness:check
```

U48 completion does not include actual-device audio/haptic, device performance, RC, or store approval.

## U49 Actual-device Audio / Haptic

- Status: current.
- Goal: replace request-hook confidence with actual-device SE/BGM/mixer/haptic evidence.
- Prerequisite: actual-device launch and observation.

Required evidence:

- tested device and build identity
- deterministic SE sequence coverage
- deterministic haptic sequence coverage
- mixer/BGM behavior
- foreground/background recovery
- mute/volume behavior where implemented
- no duplicate or missing feedback
- human review result
- known issues and retry conditions

Do not set `audioMixerReady`, `audioLatencyMeasured`, `hapticMeasured`, or `devicePlayableReady` from Editor/Simulator hooks alone.

## U50 Device Performance / Touch Metrics

- Status: not started.
- Goal: measure FPS, frame pacing, memory, GC, draw calls, UI rebuild, touch feel, heat, and sustained behavior.
- Use `docs/unity-mobile-performance-budget.md`.
- `mobileMetricsReady` requires measured device data.
- U49 success does not automatically promote U50.

## U51 RC

- Status: not started.
- Goal: close P0/P1, prepare release notes/known issues/store readiness, and produce a device-backed RC verdict.
- Prerequisites: U45.1-U50 completed and actual-device smoke.
- `rcReady` and `productionApproved` require explicit evidence and checker coverage.

## Final order

```txt
Foundation preflight
-> completed U45.1 runtime prerequisite
-> completed U46 shell/save
-> completed U47 gameplay data/runtime
-> completed U48 production visual runtime
-> current U49 actual-device audio/haptic
-> U50 performance/touch device metrics
-> U51 RC
```
