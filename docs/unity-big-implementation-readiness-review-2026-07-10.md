# Unity Big Implementation Readiness Review

Date: 2026-07-10
Scope: `/Users/m-shogo/Developer/personal/vamp-pon` / `m-shogo/vamp-pon`

## Verdict

```txt
Design direction: strong
Asset generation governance: strong foundation
UI design system: adopted foundation
Runtime route/input smoke: proven in Simulator
Runtime character/enemy visual: not ready
Runtime architecture ownership: documented, implementation incremental
Save/navigation production foundation: not implemented
Actual device/performance/audio/haptic: not ready
Large implementation: may start only under the control center and phase order
Production readiness: false
```

## What is already strong

### Product and world canon

- 正式タイトルと用語lockがある
- 20キャラ、敵、アイテム、ステージの正本データがある
- 黒耀化、灯技、継灯、暁灯などの用語が整理されている
- Webを仕様・比較元、Unityを製品runtimeとして扱う境界がある

### UI foundation

- 9-slice
- ScriptableObject Theme
- Visual State
- Responsive Layout Profile
- Component Catalog
- Import Policy
- Base→Variant方針
- Sprite Atlas方針

### Asset governance

- Asset Generation Contract
- Golden Reference Registry
- Generation Lineage
- 4候補比較必須
- candidate/final/runtime承認分離
- prompt/reference/output hash
- 未承認runtime混入防止checker

### Runtime proof

- StageSelect pause
- Stage1開始
- virtual stick
- UI movement collision guard
- hit/pickup
- LevelUp
- Result pause
- Retry
- StageSelect復帰
- Simulator build/install/launch
- crashなし

## P0/P1 findings before large implementation

### P0: Runtime visual completion was previously misclassified

Current Stage1 uses proof-only Single sprites and procedural fallback.
Point Filter and object naming were incorrectly close to being treated as dot completion.

Mitigation already added:

- runtime visual readiness gate
- explicit false flags
- Simulator route/visual separation
- U45.1 before U46

### P1: Current Unity doc index was obsolete

`docs/unity-current-doc-index-2026-06-30.md` still described U1 as the next step and contained an old `Unity 6.5.1f1` statement.
This can send a new agent back to historical instructions.

Action:

- create `docs/unity-current-doc-index-2026-07-10.md`
- turn the old index into a historical redirect
- make the control center the first entry

### P1: Bootstrap and Battle Controller are transitional monoliths

`U1Stage1SceneBootstrap` creates camera, roots, player, HUD, battle, StageSelect, Result and LevelUp wiring.
`U2BattleController` owns spawn, projectiles, EXP, VFX, HUD updates and LevelUp notification.

Risk:

- U46 adds Result/Collection/save/navigation directly
- U47 adds weapon/evolution/黒耀化 directly
- feature work becomes inseparable and regression-prone

Action:

- adopt runtime ownership contract
- no mass rewrite now
- split touched responsibility by phase

### P1: Navigation and pause ownership are not yet production architecture

Current U43 guards work, but navigation is still tied to runtime bootstrap/overlay implementation.

Risk:

- battle resumes behind a new modal
- Retry and StageSelect return duplicate initialization
- Collection becomes another battle overlay with hidden state

Action:

- one AppFlow/Pause owner
- explicit state transitions
- UI sends commands only

### P1: Save architecture is documented but not implemented

There are design notes for versioned JSON and migrations, but no production SaveService/DataRegistry boundary is established for U46.

Risk:

- Result directly writes storage
- Collection mixes definitions with save flags
- ID rename breaks migration

Action:

- implement minimal versioned SaveService in U46 before expanding permanent progression
- save IDs only
- add migration/validation tests

### P1: Production asset provider is absent

Stage1 still instantiates `U5ProofAssetProvider`.

Action:

- U45.1 production provider
- approved registry only
- development-only fallback
- player/enemy animator and frame gates

## P2 findings

### UI system is foundation, not full migration

- existing U45 runtime UI is not fully prefab-based
- Component Catalog does not yet preview all real prefabs
- Result/Collection variants are not created
- pseudo-localization is deferred

This is acceptable if U46 uses the system instead of copying old local values.

### Data conversion pipeline is still a plan

TypeScript -> intermediate JSON -> Unity importer -> ScriptableObject/DataRegistry is documented but not productionized.

Do not manually duplicate all Web definitions into Unity.
U47 should start with a small Core5/Stage1 export and schema validation.

### Performance budgets are descriptive, not measured

The repo has budgets for objects, particles, lights, UI canvas and frame time, but device metrics remain false.

Do not tune visual systems as final before U50 measurements.

### Checker count is large and fragmented

There are many phase-specific commands.
A new agent can run only the checker for the file it changed and miss cross-phase boundaries.

Action:

- add static `implementation:preflight:check`
- add full `implementation:preflight:full`

## Recommended implementation order

```txt
Foundation control-plane
↓
U45.1 Yui + Onbu production dot/animation/provider
↓
Simulator regression
↓
U46 AppFlow/Pause + Result read model + minimal SaveService + Collection read model/UI
↓
U47 Core gameplay data registry + weapons/passives/rare/evolution/黒耀化
↓
U48 remaining production asset replacement/background/VFX
↓
U49 actual-device audio/haptic
↓
U50 device performance and touch metrics
↓
U51 RC
```

## U45.1 minimum deliverable

- production visual provider
- Yui Multiple sprites
- idle/walk/hurt/attack
- left/right equipment continuity
- Onbu Multiple sprites
- idle/move/hurt/death
- no production procedural fallback
- Golden Identity Reference and Lineage
- gameplay-size screenshots
- Simulator route regression
- runtime visual readiness checker passes with correct promoted flags

## U46 minimum foundation before visual polish

- AppFlow state contract implemented
- pause owner implemented
- Result ViewModel
- Collection ViewModel
- minimal SaveService schema v1
- save migration and validation tests
- Result/Collection presenters do not directly own battle/save
- Base/Variant UI components
- Compact/Standard/Large captures

## What not to do now

- do not introduce Addressables before asset loading units are clear
- do not migrate runtime UI to UI Toolkit
- do not rewrite all bootstrap/controller code before a phase needs it
- do not generate all characters/enemies before Core5/Stage1 flow is proven
- do not mark final based on screenshots alone
- do not add cloud save/account/ads/analytics during current foundation
- do not make large balance changes inside visual/architecture work

## Readiness semantics

Use distinct flags:

```txt
implementationFoundationReady
simulatorPlayableCandidateReady
characterDotRuntimeReady
enemyDotRuntimeReady
runtimeVisualReady
saveFoundationReady
navigationFoundationReady
uiShellReady
devicePlayableReady
mobileMetricsReady
audioMixerReady
hapticMeasured
rcReady
productionApproved
```

Do not use one broad `ready` boolean.

## Final decision

The repository has enough design and governance to begin the next large implementation safely only after consolidating the entry point and architecture boundaries.
The immediate product work remains U45.1, not U46 visual expansion.
