# Unity U44 to U51 App Quality Roadmap

Date: 2026-07-10
Status: current

## Current status

```txt
U44: complete
U45 visual candidate: complete
U45 settings repair: complete
U45 AI-only iOS Simulator route smoke: complete
U45.1 Runtime Visual Readiness gate: adopted
U45.1 Character and Enemy Dot Runtime Pass: complete as candidate runtime
U45.1 Hardening: complete
Big Implementation control-plane: adopted
implementationFoundationReady=true
simulatorPlayableCandidateReady=true
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
runtimeVisualCandidateReady=true
runtimeVisualReady=false
runtimeCandidateAssetProviderConnected=true
productionVisualAssetProviderConnected=false
productionCharacterAssetReady=false
productionEnemyAssetReady=false
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
productionApproved=false
```

## Cross-phase Big Implementation Foundation Gate

Source of truth:

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-current-doc-index-2026-07-10.md
```

Required before large implementation:

- source of truth order is current
- U45.1 runtime pass and Hardening remain completed prerequisites for U46
- navigation/pause ownership is explicit
- Definition / Runtime State / Save DTO are separated
- proof, candidate, and production asset approval levels are separated
- UI Design System and Asset Generation Contract remain active
- readiness flags remain evidence-based

Static preflight:

```sh
pnpm implementation:preflight:check
```

Full preflight:

```sh
pnpm implementation:preflight:full
```

This foundation does not promote runtime, device, audio, haptic, RC, or production readiness.

## U44 Web to Unity parity audit

- Status: complete.
- Goal: freeze Web/Unity gap, design references, asset requests, and quality rules.
- Not allowed: device pass, READY promotion, generated full-screen UI paste.

## U45 StageSelect + Battle HUD + LevelUp candidate

- Status: complete as UI candidate / not final art.
- Route/pause/input/crash evidence is valid.
- Character/enemy candidate animation runtime is connected; final art is not approved.
- Remaining: Result placeholder P1; HUD/LevelUp contrast P2; device-backed art approval.

## U45.1 Character and Enemy Dot Runtime Pass

- Status: complete as candidate runtime; final art remains unapproved.
- Goal: replace proof-static visuals with minimum real animated dot runtime.

Source of truth:

```txt
docs/unity-runtime-visual-readiness-gate-v1.md
docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json
```

Current:

```txt
runtimeVisualClassification=candidate-animated-multiple-sprite
runtime provider=RuntimeVisualAssetProvider / approval level Candidate
runtimeVisualCandidateReady=true
runtimeVisualReady=false
player/enemy Sprite Mode=Multiple / 48 frames
player animation=idle / walk / hurt / attack
enemy animation=idle / move / hurt / death
```

Implementation:

- approve/register Yui Golden Identity Reference
- select Yui production candidate sheet
- create Lineage and QA evidence
- import as Sprite Mode Multiple
- connect idle / walk / hurt / attack
- verify direction and lantern/bag continuity
- connect Onbu idle / move / hurt / death
- add production runtime visual provider
- remove proof provider from product route
- restrict procedural fallback to development error route
- capture Compact / Standard / Large gameplay-size evidence
- rerun Simulator route and animation regression

Required checks:

```sh
pnpm unity:runtime-visual-readiness:check
pnpm asset-generation:check
pnpm assets:verify
```

Done:

```txt
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
```

Production asset readiness remains independently guarded by final/runtime approval.

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

## U46 AppFlow + Result + Retry + StageSelect + 灯録: Completed Candidate

- Goal: create a complete non-battle shell without adding more responsibility to bootstrap/battle controller.
- Prerequisites: U45.1 minimum complete, runtime ownership contract active, UI Design System validated.

Architecture foundation:

- implement AppFlow state owner
- implement single pause owner/reason model
- keep U43 pause/input/tap behavior
- implement minimal versioned SaveService schema v1
- add save default/migration/validation tests
- implement Result read model
- implement Collection read model

UI implementation:

- replace sparse Result placeholder with ledger hierarchy
- retain Retry and StageSelect return
- add Collection/灯録 book and tabs
- use Theme / Visual State / Responsive Profile
- create Base/Variant buttons/cards/entries
- resolve shared HUD/LevelUp P2 contrast where touched

Not allowed:

- Result UI directly writing files
- Collection directly mutating battle state
- UI directly changing `Time.timeScale`
- cloud save
- runtime UI Toolkit migration
- production approval

Evidence:

- AppFlow transitions
- pause reasons
- Result clear/fail
- Retry
- StageSelect return
- Collection open/close/seen
- SaveService schema/migration tests
- Compact/Standard/Large screenshots

Done:

```txt
sceneFlowCoordinatorImplemented=true
pauseCoordinatorImplemented=true
versionedSaveServiceImplemented=true
saveMigrationTestsReady=true
resultReadModelImplemented=true
collectionReadModelImplemented=true
uiShellReady=true
```

## U47 Weapon / Item / Passive / Rare / Evolution / 黒耀化

- Goal: bring Web runtime item systems into Unity in staged slices.
- Prerequisites: stable U45.1/U46 shell and data/save boundaries.

Implementation:

- build Stage1/Core5 definition export/import slice
- production DataRegistry
- separate definitions from runtime state
- connect limited weapon/passive/rare/evolution set
- connect inventory and LevelUp presentation
- connect 黒耀化 presenter and state transition
- keep save IDs stable and migrated

Not allowed:

- full Stage2
- Addressables
- battle controller owning save/UI construction
- balance changes hidden inside architecture work

Done: Stage1 remains playable, item state is visible, invalid drops/evolutions are blocked, data registry checks pass.

## U48 Production asset expansion

- Goal: expand U45.1 provider/animation path to remaining Core5, enemy families, background, pickup and VFX.
- Prerequisites: approved assets, alpha/fringe QA, provider path proven.
- Checks: Runtime Visual Readiness, PPU/scale, alpha bounds, atlas references, import policy separation.
- Not allowed: Web PNG copied as production without approval.

## U49 Actual-device Audio / Haptic

- Goal: replace request hooks with final SE/BGM/mixer/haptic evidence.
- Prerequisite: actual-device observations.
- Do not set `audioMixerReady`, `audioLatencyMeasured`, or `hapticMeasured` from Editor/Simulator hooks.

## U50 Device Performance / Touch Metrics

- Goal: measure FPS, frame pacing, memory, GC, draw calls, UI rebuild, touch feel, heat.
- Use `docs/unity-mobile-performance-budget.md`.
- `mobileMetricsReady` requires measured device data.

## U51 RC

- Goal: close P0/P1, prepare release notes/known issues/store readiness, and produce device-backed RC verdict.
- Prerequisites: U45.1-U50 completed and actual device smoke.
- `rcReady` and `productionApproved` require explicit evidence and checker coverage.

## Final order

```txt
Foundation preflight
-> U45.1 dot runtime
-> Simulator regression
-> U46 AppFlow/Save/Result/灯録 completed candidate
-> U47 gameplay data current
-> U48 asset expansion
-> U49 audio/haptic device
-> U50 performance/touch device
-> U51 RC
```
