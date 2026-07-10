# Unity U44 to U51 App Quality Roadmap

Date: 2026-07-10

## Current status

```txt
U44: complete
U45 visual candidate: complete
U45 settings repair: complete
U45 AI-only iOS Simulator smoke: complete
simulatorPlayableCandidateReady=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
```

U46以降は `docs/unity-ui-design-system-v1.md` をUI実装の正本とする。

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

- Status: complete as candidate / not final art.
- Goal: improve the first playable loop surfaces without changing battle rules.
- Target files: `U1Stage1SceneBootstrap.cs`, LevelUp UI, StageSelect UI, HUD helpers, UI candidate assets.
- Implementation tasks: safe area, tap target, paper panel usage, lower-left stick visual, card readability.
- Checker tasks: StageSelect pause, Result pause, UI pointer guard, tap target minimums.
- Evidence: Editor screenshots, iOS generation, settings repair, AI-only Simulator smoke.
- Simulator result: route and crash gates passed; visual verdict `PASS_WITH_ISSUES`.
- Remaining visual issues: Result placeholder P1; HUD and LevelUp contrast/padding P2.
- Not allowed: final audio/haptic, device READY, candidate final approval.
- Risks: actual-device touch/audio/haptic/performance remain unverified.

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

- Goal: make non-battle loops feel like a complete app shell.
- Target files: Result overlay, Collection screen, navigation route, save/progress presentation, UI Base/Variant prefabs.
- Prerequisites: U45 Simulator route stable and UI Design System assets created/validated. Actual-device smoke may remain deferred, but READY flags stay false.
- Implementation tasks:
  - replace sparse Result preview with approved ledger hierarchy.
  - keep Retry/StageSelect routes and overlay pause.
  - add Collection book/tabs and progress binding.
  - migrate touched UI to Theme and Visual State.
  - introduce Base → Variant prefabs for buttons/cards/entries.
  - resolve U45 P2 HUD/LevelUp contrast where shared components are affected.
- Checker tasks: route availability, battle freeze behind overlays, save-safe false positives, generated asset boundary, UI design system checker.
- Evidence docs: U46 non-battle screen report and component catalog coverage.
- Screenshots: Result clear/fail, StageSelect return, Collection, Compact/Standard/Large.
- Not allowed: Cloud Save, runtime UI Toolkit migration, production approval.
- Done criteria: no dead-end routes, no battle running behind overlays, no P1 Result placeholder.
- Risks: navigation and persistence scope creep.

## U47 Weapon / Item / Passive / Rare / Evolution / Kokuyou runtime pass

- Goal: bring Web runtime item systems into Unity in staged slices.
- Target files: data definitions, battle controller adapters, inventory UI, evolution/黒耀化 presenters.
- Prerequisites: stable U45/U46 UI shell and shared Base slot/card variants.
- Implementation tasks: map Web data to Unity models, connect limited item set, evolution presentation, rare pickup/revival.
- Checker tasks: no invalid drops, no normal dawn-ticket pollution, evolution conditions, Visual State consistency.
- Evidence docs: U47 runtime parity report.
- Screenshots: weapon slots, rare pickup, evolution, 黒耀化.
- Not allowed: full Stage2, Addressables.
- Done criteria: Stage1 loop still playable and item state visible.
- Risks: balance and state explosion.

## U48 Character / Enemy / Background real asset connection

- Goal: replace prototype/procedural visuals with approved Unity-readable assets.
- Target files: asset provider, sprite atlases, character/enemy/background resources.
- Prerequisites: approved assets and alpha/fringe QA.
- Implementation tasks: connect Yui, Ombu, pickup/VFX, background, atlas packing.
- Checker tasks: Point filter, PPU/scale, alpha bounds, atlas references, UI/pixel import policy separation.
- Evidence docs: U48 asset replacement report.
- Screenshots: gameplay-size comparisons.
- Not allowed: Web PNG copy as production asset without approval.
- Done criteria: readable at 390x844 and no edge artifacts.
- Risks: style mismatch and performance.

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
- Prerequisites: U45-U50 completed and actual smoke pass.
- Implementation tasks: close P0/P1 issues, update readiness flags only with evidence, validate app icon/launch screen/versioning.
- Checker tasks: `rcReady` and `productionApproved` guarded by evidence.
- Evidence docs: U51 RC package.
- Screenshots: final device captures.
- Not allowed: approving unresolved metrics/audio/haptic gaps.
- Done criteria: RC criteria met with device proof.
- Risks: premature approval.
