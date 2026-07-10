# Unity U44 to U51 App Quality Roadmap

Date: 2026-07-10

## Current status

```txt
U44: complete
U45 visual candidate: complete
U45 settings repair: complete
U45 AI-only iOS Simulator route smoke: complete
U45.1 Runtime Visual Readiness gate: adopted
simulatorPlayableCandidateReady=true
characterDotRuntimeReady=false
characterAnimationReady=false
enemyDotRuntimeReady=false
enemyAnimationReady=false
runtimeVisualReady=false
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
```

U45.1の最小ドットruntime passをU46より先に実施する。U46以降は `docs/unity-ui-design-system-v1.md` をUI実装の正本とする。runtime visual判定は `docs/unity-runtime-visual-readiness-gate-v1.md` を正本とする。

## U44 Web to Unity parity audit / app quality plan / asset request

- Status: complete.
- Goal: freeze Web/Unity gap, design reference map, app quality rules, asset requests, and safe token foundation.
- Target files: U44 docs/json/checker, `AppQualityStyleTokens.cs`.
- Prerequisites: U43 predevice and iOS generation evidence.
- Implementation tasks: no gameplay change; add docs, checker, constants only.
- Checker tasks: U44 parity checker plus U43/U42-U22 gates.
- Evidence docs: U44 audit outputs.
- Screenshots: not required.
- Not allowed: device pass, READY flags, generated image direct paste.
- Done criteria: checker passes.
- Risks: audit drift if Web data changes.

## U45 StageSelect + Battle HUD + LevelUp app-quality pass

- Status: complete as UI candidate / not final art.
- Goal: improve the first playable loop surfaces without changing battle rules.
- Target files: `U1Stage1SceneBootstrap.cs`, LevelUp UI, StageSelect UI, HUD helpers, UI candidate assets.
- Implementation tasks: safe area, tap target, paper panel usage, lower-left stick visual, card readability.
- Checker tasks: StageSelect pause, Result pause, UI pointer guard, tap target minimums.
- Evidence: Editor screenshots, iOS generation, settings repair, AI-only Simulator smoke.
- Simulator result: route and crash gates passed; UI visual verdict `PASS_WITH_ISSUES`.
- Important correction: route smoke does not approve character/enemy dot art or animation.
- Remaining visual issues: character/enemy proof static sprite P0; Result placeholder P1; HUD and LevelUp contrast/padding P2.
- Not allowed: final audio/haptic, device READY, candidate final approval.
- Risks: actual-device touch/audio/haptic/performance remain unverified.

## U45.1 Character and Enemy Dot Runtime Pass

- Status: required before U46.
- Goal: replace the misleading proof-static visual path with the minimum real animated dot runtime for Yui and Onbu.
- Source of truth:

```txt
docs/unity-runtime-visual-readiness-gate-v1.md
docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json
```

- Current classification: `proof-static-single-sprite`.
- Current provider: `U5ProofAssetProvider`.
- Current player source: U5 candidate Single sprite.
- Current problem: Point Filter is active, but sprite sheet / slice / animation / production approval are absent.
- Prerequisites:
  - Asset Generation Contract and Golden Reference rules remain active.
  - Yui identity Golden Reference is approved and registered.
  - candidate assets remain non-final until Lineage/QA approval.
- Implementation tasks:
  - select Yui production candidate sprite sheet.
  - import as Sprite Mode Multiple.
  - connect idle / walk / hurt / attack.
  - verify walk-to-idle transition and direction flip.
  - preserve lantern/bag identity rules.
  - connect Onbu idle / move / hurt / death.
  - add production runtime asset provider.
  - remove `U5ProofAssetProvider` from the product runtime route.
  - restrict procedural character/enemy fallback to an explicit development error route.
  - rerun Simulator animation and gameplay-size visual review.
- Checker tasks:

```sh
pnpm unity:runtime-visual-readiness:check
pnpm asset-generation:check
pnpm assets:verify
```

- Evidence tasks:
  - production asset paths.
  - Sprite Mode Multiple and sliced frame counts.
  - required animation state counts.
  - provider/fallback state.
  - 360x800 / 390x844 / 430x932 screenshots or captures.
  - Golden Reference / Lineage / final/runtime approval boundary.
- Not allowed:
  - object name change as readiness evidence.
  - Point Filter as dot completion evidence.
  - Single sprite as animated sprite sheet.
  - Simulator route success as character visual approval.
  - evidence-only promotion without runtime implementation.
- Done criteria:

```txt
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
```

`productionCharacterAssetReady` and `productionEnemyAssetReady` remain independently guarded by final/runtime asset approval.

## Cross-phase UI Design System Gate

The UI Design System is adopted before U46 and remains mandatory for U46-U51.

Source of truth:

```txt
docs/unity-ui-design-system-v1.md
```

Required foundation:

- 9-slice / Sprite Border
- ScriptableObject Theme
- Visual State
- Responsive Layout Profile
- Editor Component Catalog
- Prefab Variant policy
- UI Sprite Import Policy
- existing Sprite Atlas policy

Required check:

```sh
pnpm unity:ui-design-system:check
```

Rules:

- runtime remains uGUI.
- UI Toolkit is editor-only.
- prefab inheritance is Base → Variant only.
- new screens must validate Compact / Standard / Large.
- generated assets remain candidate until art approval.
- existing U43 pause/input/tap gates must remain intact.

## U46 Result + Retry + Collection / non-battle screen pass

- Goal: make non-battle loops feel like a complete app shell after the minimum Yui/Onbu dot runtime is connected.
- Target files: Result overlay, Collection screen, navigation route, save/progress presentation, UI Base/Variant prefabs.
- Prerequisites: U45 Simulator route stable, U45.1 dot runtime minimum complete, UI Design System assets created/validated. Actual-device smoke may remain deferred, but READY flags stay false.
- Implementation tasks:
  - replace sparse Result preview with approved ledger hierarchy.
  - keep Retry/StageSelect routes and overlay pause.
  - add Collection book/tabs and progress binding.
  - migrate touched UI to Theme and Visual State.
  - introduce Base → Variant prefabs for buttons/cards/entries.
  - resolve U45 P2 HUD/LevelUp contrast where shared components are affected.
- Checker tasks: route availability, battle freeze behind overlays, save-safe false positives, generated asset boundary, UI design system checker, runtime visual readiness regression.
- Evidence docs: U46 non-battle screen report and component catalog coverage.
- Screenshots: Result clear/fail, StageSelect return, Collection, Compact/Standard/Large.
- Not allowed: Cloud Save, runtime UI Toolkit migration, production approval.
- Done criteria: no dead-end routes, no battle running behind overlays, no P1 Result placeholder.
- Risks: navigation and persistence scope creep.

## U47 Weapon / Item / Passive / Rare / Evolution / Kokuyou runtime pass

- Goal: bring Web runtime item systems into Unity in staged slices.
- Target files: data definitions, battle controller adapters, inventory UI, evolution/黒耀化 presenters.
- Prerequisites: stable U45.1/U46 shell and shared Base slot/card variants.
- Implementation tasks: map Web data to Unity models, connect limited item set, evolution presentation, rare pickup/revival.
- Checker tasks: no invalid drops, no normal dawn-ticket pollution, evolution conditions, Visual State consistency.
- Evidence docs: U47 runtime parity report.
- Screenshots: weapon slots, rare pickup, evolution, 黒耀化.
- Not allowed: full Stage2, Addressables.
- Done criteria: Stage1 loop still playable and item state visible.
- Risks: balance and state explosion.

## U48 Character / Enemy / Background production expansion

- Goal: expand from the U45.1 Yui/Onbu minimum to approved Core5, enemy families and production background assets.
- Target files: production asset provider, sprite atlases, character/enemy/background resources.
- Prerequisites: U45.1 provider/animation path established; approved assets and alpha/fringe QA.
- Implementation tasks: connect remaining Core5, Onbu variants/Onburo, pickup/VFX, background, atlas packing.
- Checker tasks: Runtime Visual Readiness, Point filter, PPU/scale, alpha bounds, atlas references, UI/pixel import policy separation.
- Evidence docs: U48 asset replacement report.
- Screenshots: gameplay-size comparisons.
- Not allowed: Web PNG copy as production asset without approval.
- Done criteria: readable at 390x844, animated where required, and no edge artifacts.
- Risks: style mismatch, identity drift and performance.

## U49 Audio / Haptic final design pass

- Goal: separate hook tones from final SE/BGM/mixer/haptics.
- Target files: AudioMixer, audio bridge, final candidate clips, haptic event map.
- Prerequisites: actual-device audio/haptic observations.
- Implementation tasks: wire final clips, mixer groups, latency checks, haptic pattern design.
- Checker tasks: `audioMixerReady`, `audioLatencyMeasured`, `hapticMeasured` only when evidence exists.
- Evidence docs: U49 audio/haptic final report.
- Screenshots: optional; logs required.
- Not allowed: mark final based on Editor or Simulator hooks.
- Done criteria: device-measured behavior documented.
- Risks: iOS haptic variance.

## U50 Mobile metrics / FPS / memory / touch tuning

- Goal: verify performance and touch feel on device.
- Target files: metrics harness, budgets, optimization reports.
- Prerequisites: stable device build and U49 hooks.
- Implementation tasks: gather FPS/memory/touch metrics, reduce VFX if needed.
- Checker tasks: `mobileMetricsReady` only with measured data.
- Evidence docs: U50 metrics report.
- Screenshots: device screenshots or recorded metrics.
- Not allowed: production approval without RC gate.
- Done criteria: measured thresholds met.
- Risks: late performance cuts.

## U51 RC preparation

- Goal: prepare release candidate checklist after actual-device evidence.
- Target files: release notes, known issues, store readiness, final verdict.
- Prerequisites: U45.1-U50 completed and actual smoke pass.
- Implementation tasks: close P0/P1 issues, update readiness flags only with evidence, validate app icon/launch screen/versioning.
- Checker tasks: `rcReady` and `productionApproved` guarded by evidence.
- Evidence docs: U51 RC package.
- Screenshots: final device captures.
- Not allowed: approving unresolved visual/metrics/audio/haptic gaps.
- Done criteria: RC criteria met with device proof.
- Risks: premature approval.
