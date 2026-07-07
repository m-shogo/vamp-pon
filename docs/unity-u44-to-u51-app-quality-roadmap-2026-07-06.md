# Unity U44 to U51 App Quality Roadmap

Date: 2026-07-06

## U44 Web to Unity parity audit / app quality plan / asset request

- Goal: freeze Web/Unity gap, design reference map, app quality rules, asset requests, and safe token foundation.
- Target files: U44 docs/json/checker, `AppQualityStyleTokens.cs`.
- Prerequisites: U43 predevice and iOS generation evidence.
- Implementation tasks: no gameplay change; add docs, checker, constants only.
- Checker tasks: U44 parity checker plus U43/U42-U22 gates.
- Evidence docs: this roadmap and U44 audit outputs.
- Screenshots: not required.
- Not allowed: device pass, READY flags, generated image direct paste.
- Done criteria: checker passes, commit excludes Unity setting diffs.
- Risks: audit drift if Web data changes.

## U45 StageSelect + Battle HUD + LevelUp app-quality pass

- Goal: improve the first playable loop surfaces without changing battle rules.
- Target files: `U1Stage1SceneBootstrap.cs`, LevelUp UI, StageSelect UI, HUD helpers, UI candidate assets.
- Prerequisites: actual device smoke result or explicit approval to proceed pre-device with UI-only changes.
- Implementation tasks: apply safe area, tap target, paper panel/token usage, lower-left stick visual, card readability.
- Checker tasks: StageSelect pause still true, Result pause still true, UI pointer guard, tap target minimums.
- Evidence docs: U45 UI pass report and screenshots.
- Screenshots: 360x800, 390x844, 430x932.
- Not allowed: gameplay constants, final audio/haptic, metrics approval.
- Done criteria: U43 smoke remains pass, UI text readable.
- Risks: overlay/touch regression.

## U46 Result + Retry + Collection / non-battle screen pass

- Goal: make non-battle loops feel like a complete app shell.
- Target files: Result overlay, new/ported Collection screen, navigation route, save/progress presentation.
- Prerequisites: U45 stable and device smoke feedback.
- Implementation tasks: Result ledger, Retry/StageSelect routes, Collection book/tabs, progress binding.
- Checker tasks: route availability, save-safe false positives, generated asset boundary.
- Evidence docs: U46 non-battle screen report.
- Screenshots: Result clear/fail, StageSelect return, Collection.
- Not allowed: Cloud Save, production approval.
- Done criteria: no dead-end routes and no battle running behind overlays.
- Risks: navigation and persistence scope creep.

## U47 Weapon / Item / Passive / Rare / Evolution / Kokuyou runtime pass

- Goal: bring Web runtime item systems into Unity in staged slices.
- Target files: Data definitions, battle controller adapters, inventory UI, evolution/Kokuyou presenters.
- Prerequisites: stable U45/U46 UI shell.
- Implementation tasks: map Web data to Unity models, connect limited item set, evolution presentation, rare pickup/revival.
- Checker tasks: no invalid drops, no normal dawn_ticket pollution, evolution conditions.
- Evidence docs: U47 runtime parity report.
- Screenshots: weapon slots, rare pickup, evolution, Kokuyou.
- Not allowed: full Stage2, Addressables.
- Done criteria: Stage1 loop still playable and item state visible.
- Risks: balance and state explosion.

## U48 Character / Enemy / Background real asset connection

- Goal: replace prototype/procedural visuals with approved Unity-readable assets.
- Target files: asset provider, sprite atlases, character/enemy/background resources.
- Prerequisites: approved assets and alpha/fringe QA.
- Implementation tasks: connect Yui, Ombu, pickup/VFX, background, atlas packing.
- Checker tasks: Point filter, PPU/scale, alpha bounds, atlas references.
- Evidence docs: U48 asset replacement report.
- Screenshots: gameplay-size comparisons.
- Not allowed: Web PNG copy as production asset without approval.
- Done criteria: readable at 390x844 and no edge artifacts.
- Risks: style mismatch and performance.

## U49 Audio / Haptic final design pass

- Goal: separate hook tones from final SE/BGM/mixer/haptics.
- Target files: AudioMixer, audio bridge, final candidate clips, haptic event map.
- Prerequisites: actual device audio/haptic observations.
- Implementation tasks: wire final clips, mixer groups, latency checks, haptic pattern design.
- Checker tasks: `audioMixerReady`, `audioLatencyMeasured`, `hapticMeasured` only when evidence exists.
- Evidence docs: U49 audio/haptic final report.
- Screenshots: optional; logs required.
- Not allowed: mark final based on Editor tones.
- Done criteria: device-measured behavior documented.
- Risks: iOS haptic variance.

## U50 Mobile metrics / FPS / memory / touch tuning

- Goal: verify performance and touch feel on device.
- Target files: metrics harness, budgets, optimization reports.
- Prerequisites: stable device build and U49 hooks.
- Implementation tasks: gather FPS/memory/touch metrics, reduce VFX if needed.
- Checker tasks: mobileMetricsReady only with measured data.
- Evidence docs: U50 metrics report.
- Screenshots: device screenshots or recorded metrics.
- Not allowed: production approval without RC gate.
- Done criteria: measured thresholds met.
- Risks: late performance cuts.

## U51 RC preparation

- Goal: prepare release candidate checklist after actual device evidence.
- Target files: release notes, known issues, store readiness, final verdict.
- Prerequisites: U45-U50 completed and actual smoke pass.
- Implementation tasks: close P0/P1 issues, update readiness flags only with evidence.
- Checker tasks: rcReady and productionApproved guarded by evidence.
- Evidence docs: U51 RC package.
- Screenshots: final device captures.
- Not allowed: approving unresolved metrics/audio/haptic gaps.
- Done criteria: RC criteria met with device proof.
- Risks: premature approval.
